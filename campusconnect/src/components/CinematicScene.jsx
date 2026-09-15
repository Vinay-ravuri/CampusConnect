import { useRef, useMemo, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Environment, MeshDistortMaterial, Torus } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

/* ─── Orbiting Ring ─────────────────────────────── */
function OrbitalRing({ radius, tube, rotationAxis, speed, color, opacity = 0.7 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    if (rotationAxis === 'z') ref.current.rotation.z = t * speed
    if (rotationAxis === 'x') ref.current.rotation.x = t * speed
    if (rotationAxis === 'y') ref.current.rotation.y = t * speed
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 8, 180]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

/* ─── Floating Data Node ─────────────────────────── */
function DataNode({ position, color, size = 0.06, speed = 1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + position[0] * 10
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3
    ref.current.position.x = position[0] + Math.cos(t * 0.5) * 0.15
  })
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}

/* ─── Central Knowledge Orb ──────────────────────── */
function KnowledgeOrb({ mouse }) {
  const groupRef = useRef()
  const orbRef   = useRef()
  const innerRef = useRef()
  const scrollY  = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Smooth mouse parallax + scroll parallax
    if (groupRef.current) {
      const targetY = -scrollY.current * 0.006
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05
      
      const scrollRotation = scrollY.current * 0.0015
      groupRef.current.rotation.y += (mouse.current.x * 0.4 + scrollRotation - groupRef.current.rotation.y) * 0.025
      groupRef.current.rotation.x += (-mouse.current.y * 0.2 - groupRef.current.rotation.x) * 0.025
    }

    // Gentle self-rotation
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.08
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.12
      innerRef.current.rotation.z = t * 0.05
    }
  })

  /* Scatter of floating data nodes */
  const nodes = useMemo(() => {
    const arr = []
    for (let i = 0; i < 22; i++) {
      const angle  = (i / 22) * Math.PI * 2
      const radius = 3.2 + Math.random() * 1.8
      arr.push({
        pos: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 4,
          Math.sin(angle) * radius,
        ],
        color: ['#FF7A00', '#FFB800', '#F97316', '#FF9500'][i % 4],
        size:  0.04 + Math.random() * 0.06,
        speed: 0.5 + Math.random() * 1.5,
      })
    }
    return arr
  }, [])

  return (
    <group ref={groupRef}>

      {/* ── Central Distorted Sphere ── */}
      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh ref={orbRef}>
          <sphereGeometry args={[1.85, 128, 128]} />
          <MeshDistortMaterial
            color="#FF7A00"
            distort={0.3}
            speed={1.6}
            roughness={0.05}
            metalness={0.6}
            transparent
            opacity={0.88}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[1.55, 64, 64]} />
          <meshStandardMaterial
            color="#F97316"
            emissive="#F97316"
            emissiveIntensity={0.6}
            transparent
            opacity={0.35}
            roughness={0}
            metalness={1}
          />
        </mesh>

        {/* Core bright point */}
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#FFB800"
            emissive="#FFB800"
            emissiveIntensity={2}
            transparent
            opacity={0.15}
            roughness={0}
          />
        </mesh>
      </Float>

      {/* ── Orbital Rings ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.9, 0.014, 8, 200]} />
        <meshBasicMaterial color="#FF7A00" transparent opacity={0.55} />
      </mesh>

      <mesh rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[3.7, 0.009, 8, 200]} />
        <meshBasicMaterial color="#FFB800" transparent opacity={0.45} />
      </mesh>

      <mesh rotation={[-Math.PI / 4, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[4.5, 0.007, 8, 200]} />
        <meshBasicMaterial color="#F97316" transparent opacity={0.35} />
      </mesh>

      <OrbitalRing radius={3.15} tube={0.008} rotationAxis="z" speed={0.18} color="#FF7A00" opacity={0.5} />
      <OrbitalRing radius={4.0}  tube={0.006} rotationAxis="x" speed={-0.12} color="#FFB800" opacity={0.35} />
      <OrbitalRing radius={4.9}  tube={0.005} rotationAxis="y" speed={0.09} color="#F97316" opacity={0.28} />

      {/* ── Dynamic Lights ── */}
      <pointLight position={[0, 0, 0]}  intensity={5}   color="#FF7A00" distance={8} />
      <pointLight position={[0, 0, 0]}  intensity={2.5} color="#F97316" distance={10} />
      <pointLight position={[4, 3, 2]}  intensity={1.5} color="#FFB800" distance={12} />
      <pointLight position={[-4, -2, 3]} intensity={1}  color="#FF7A00" distance={10} />

      {/* ── Floating Data Nodes ── */}
      {nodes.map((n, i) => (
        <DataNode key={i} position={n.pos} color={n.color} size={n.size} speed={n.speed} />
      ))}

      {/* ── Sparkle Particles ── */}
      <Sparkles count={200} scale={12} size={0.5} speed={0.15} color="#FF7A00" opacity={0.5} />
      <Sparkles count={80}  scale={8}  size={0.3} speed={0.25} color="#FFB800" opacity={0.4} />
    </group>
  )
}

/* ─── Background Particle Field ─────────────────── */
function ParticleField() {
  const ref = useRef()
  const count = 300

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#FF7A00" transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

/* ─── Main Scene ─────────────────────────────────── */
function Scene({ mouse }) {
  return (
    <>
      <ambientLight intensity={0.4} color="#f0f4ff" />
      <directionalLight position={[5, 8, 5]}  intensity={0.8}  color="#ffffff" />
      <directionalLight position={[-5, -4, -3]} intensity={0.3} color="#c7d2fe" />

      <KnowledgeOrb mouse={mouse} />
      <ParticleField />

      <Environment preset="city" />

      {/* Bloom post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>
    </>
  )
}

/* ─── Export ────────────────────────────────────── */
export default function CinematicScene() {
  const mouse = useRef({ x: 0, y: 0 })

  return (
    <div
      onMouseMove={e => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
      }}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}
