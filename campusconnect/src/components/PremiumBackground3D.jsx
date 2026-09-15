export default function PremiumBackground3D() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(160deg, #FFFDF8 0%, #FFF8ED 60%, #FFF4E3 100%)',
      overflow: 'hidden',
    }}>
      {/* Dynamic CSS Animated glow orbs using hardware-accelerated keyframes in index.css */}
      <div className="orb-1" style={{ top: '15%', left: '10%', width: '500px', height: '500px', opacity: 0.7 }} />
      <div className="orb-2" style={{ bottom: '10%', right: '5%', width: '450px', height: '450px', opacity: 0.6 }} />
      <div className="orb-3" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '350px', height: '350px', opacity: 0.5 }} />

      {/* Premium grid decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,154,61,0.06) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.8,
      }} />
    </div>
  )
}
