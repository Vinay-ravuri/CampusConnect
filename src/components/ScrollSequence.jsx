import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 71;
const FOLDER = '/laptop-sequence';
const LERP_FACTOR = 0.12;   // More responsive — eliminates perceived lag
const EAGER_COUNT = 18;      // Pre-load first 18 frames before showing anything
const AHEAD_WINDOW = 14;     // Frames to preload ahead of current position
const BEHIND_WINDOW = 4;     // Frames to keep behind current position

function padNum(n) {
  return String(n).padStart(3, '0');
}

function frameUrl(i) {
  return `${FOLDER}/ezgif-frame-${padNum(i + 1)}.webp`;
}

export default function ScrollSequence({ triggerRef, progressCallback }) {
  const canvasRef   = useRef(null);
  // Store ImageBitmap objects — pre-decoded, GPU-ready, zero-lag drawing
  const bitmapsRef  = useRef(new Array(TOTAL_FRAMES).fill(null));
  const loadingRef  = useRef(new Array(TOTAL_FRAMES).fill(false)); // prevent double-fetches
  const currentRef  = useRef(0);
  const targetRef   = useRef(0);
  const rafRef      = useRef(null);
  const lastDrawn   = useRef(-1);

  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  /* ── Draw a pre-decoded bitmap onto the canvas (cover fit) ─────── */
  const drawBitmap = useCallback((bmp) => {
    const canvas = canvasRef.current;
    if (!canvas || !bmp) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha:false = faster composite
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = bmp.width;
    const ih = bmp.height;
    const imgRatio = iw / ih;
    const canRatio = cw / ch;

    let dw, dh, dx, dy;
    if (imgRatio > canRatio) {
      dh = ch; dw = ch * imgRatio;
      dx = (cw - dw) / 2; dy = 0;
    } else {
      dw = cw; dh = cw / imgRatio;
      dx = 0; dy = (ch - dh) / 2;
    }
    ctx.drawImage(bmp, dx, dy, dw, dh);
  }, []);

  /* ── Get nearest available bitmap searching outward ────────────── */
  const getNearestBitmap = useCallback((idx) => {
    const bitmaps = bitmapsRef.current;
    for (let d = 0; d < TOTAL_FRAMES; d++) {
      if (idx - d >= 0 && bitmaps[idx - d]) return bitmaps[idx - d];
      if (idx + d < TOTAL_FRAMES && bitmaps[idx + d]) return bitmaps[idx + d];
    }
    return null;
  }, []);

  /* ── Lazy-load a single frame as ImageBitmap ────────────────────── */
  const loadFrameBitmap = useCallback((i) => {
    if (i < 0 || i >= TOTAL_FRAMES) return;
    if (bitmapsRef.current[i] || loadingRef.current[i]) return;
    loadingRef.current[i] = true;

    fetch(frameUrl(i))
      .then(r => r.blob())
      .then(blob => createImageBitmap(blob, { imageOrientation: 'none', premultiplyAlpha: 'none', colorSpaceConversion: 'none' }))
      .then(bmp => {
        bitmapsRef.current[i] = bmp;
        // If this frame is currently needed, draw it immediately
        const needed = Math.round(currentRef.current);
        if (Math.abs(needed - i) <= 1) drawBitmap(bmp);
      })
      .catch(() => { loadingRef.current[i] = false; }); // allow retry on error
  }, [drawBitmap]);

  /* ── Preload a sliding window of frames around center ───────────── */
  const preloadWindow = useCallback((center) => {
    const start = Math.max(0, center - BEHIND_WINDOW);
    const end   = Math.min(TOTAL_FRAMES - 1, center + AHEAD_WINDOW);
    for (let i = start; i <= end; i++) loadFrameBitmap(i);
  }, [loadFrameBitmap]);

  /* ── Initial eager preload — first EAGER_COUNT frames ──────────── */
  useEffect(() => {
    let loaded = 0;
    const promises = Array.from({ length: EAGER_COUNT }, (_, i) =>
      fetch(frameUrl(i))
        .then(r => r.blob())
        .then(blob => createImageBitmap(blob, { colorSpaceConversion: 'none' }))
        .then(bmp => {
          bitmapsRef.current[i] = bmp;
          loadingRef.current[i] = true;
          loaded++;
          setLoadPct(Math.round((loaded / EAGER_COUNT) * 100));
          if (i === 0) drawBitmap(bmp); // show first frame as soon as it's ready
        })
        .catch(() => { loaded++; })
    );

    Promise.all(promises).then(() => {
      setReady(true);
      // Kick off background preload of remaining frames
      for (let i = EAGER_COUNT; i < TOTAL_FRAMES; i++) {
        // Stagger with a tiny timeout so we don't flood on load
        setTimeout(() => loadFrameBitmap(i), (i - EAGER_COUNT) * 40);
      }
    });
  }, [drawBitmap, loadFrameBitmap]);

  /* ── Resize observer — keep canvas pixel-perfect ───────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      const idx = Math.round(currentRef.current);
      const bmp = bitmapsRef.current[idx] || getNearestBitmap(idx);
      if (bmp) drawBitmap(bmp);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [drawBitmap, getNearestBitmap]);

  /* ── Scroll listener — maps scroll position to target frame ─────── */
  useEffect(() => {
    if (!ready || !triggerRef?.current) return;

    const onScroll = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const scrolled  = -trigger.getBoundingClientRect().top;
      const sectionH  = trigger.offsetHeight - window.innerHeight;
      const progress  = Math.max(0, Math.min(1, scrolled / sectionH));

      progressCallback?.(progress);

      // Pin on last frame once 85% scrolled — holds "laptop open" state
      targetRef.current = progress >= 0.85
        ? TOTAL_FRAMES - 1
        : (progress / 0.85) * (TOTAL_FRAMES - 1);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once to sync initial state
    return () => window.removeEventListener('scroll', onScroll);
  }, [ready, triggerRef, progressCallback]);

  /* ── RAF lerp loop — smooth frame interpolation at 60fps ──────── */
  useEffect(() => {
    if (!ready) return;
    let active = true;

    const loop = () => {
      if (!active) return;

      const diff = targetRef.current - currentRef.current;
      // Snap to exact value when close enough to avoid infinite micro-loop
      currentRef.current = Math.abs(diff) < 0.008
        ? targetRef.current
        : currentRef.current + diff * LERP_FACTOR;

      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentRef.current)));

      if (idx !== lastDrawn.current) {
        lastDrawn.current = idx;
        preloadWindow(idx);
        const bmp = bitmapsRef.current[idx] || getNearestBitmap(idx);
        if (bmp) drawBitmap(bmp);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, drawBitmap, preloadWindow, getNearestBitmap]);

  /* ── Cleanup bitmaps on unmount to free GPU memory ─────────────── */
  useEffect(() => {
    return () => {
      bitmapsRef.current.forEach(bmp => bmp?.close?.());
    };
  }, []);

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>

      {/* Loading screen */}
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          background: '#f7ebd9',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20,
        }}>
          {/* CC spinner */}
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid transparent', borderTopColor: '#F59E0B',
              animation: 'spin 1.4s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 8, borderRadius: '50%',
              border: '1.5px solid transparent', borderBottomColor: '#D97706',
              animation: 'spinRev 1s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 18, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>CC</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase', color: '#92400E', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
              Preparing Experience
            </div>
            <div style={{ fontSize: 11, color: '#B45309', fontFamily: 'Inter, sans-serif' }}>
              {loadPct}%
            </div>
          </div>

          <div style={{ width: 240, height: 2, background: 'rgba(245,158,11,0.15)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${loadPct}%`,
              background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
              borderRadius: 100, transition: 'width 0.2s ease',
            }} />
          </div>
        </div>
      )}

      {/* Main canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          display: 'block',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
    </div>
  );
}
