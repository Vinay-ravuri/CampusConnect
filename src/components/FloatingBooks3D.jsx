import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, RoundedBox, Sparkles } from '@react-three/drei'

/* ─── Individual 3D Objects ─────────────────────────────── */

function Book({ position, rotation, color, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    ref.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.18
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.22
  })
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[1.3, 1.75, 0.16]} radius={0.035} smoothness={4} position={[0, 0, 0.05]}>
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0.45, 0.14]}>
        <boxGeometry args={[0.85, 0.18, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} opacity={0.9} transparent />
      </mesh>
      <mesh position={[0.62, 0, 0]}>
        <boxGeometry args={[0.1, 1.6, 0.14]} />
        <meshStandardMaterial color="#f8faff" roughness={0.9} />
      </mesh>
      <mesh position={[-0.62, 0, 0]}>
        <boxGeometry args={[0.1, 1.75, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.25} />
      </mesh>
      <mesh position={[0.2, 0.85, 0.1]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[0.07, 0.4, 0.01]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.4} />
      </mesh>
    </group>
  )
}

function Laptop({ position, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    ref.current.rotation.y = t * 0.2
    ref.current.position.y = position[1] + Math.sin(t * 0.45) * 0.25
  })
  return (
    <group ref={ref} position={position} scale={scale} rotation={[0.15, 0.5, 0]}>
      <RoundedBox args={[1.7, 0.08, 1.15]} radius={0.04} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.35} metalness={0.35} />
      </RoundedBox>
      <group position={[0, 0.05, -0.52]} rotation={[-0.25, 0, 0]}>
        <RoundedBox args={[1.7, 1.1, 0.06]} radius={0.04}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.35} metalness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[1.52, 0.94]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
        {[0.28, 0.08, -0.1, -0.28].map((y, i) => (
          <mesh key={i} position={[-0.22, y, 0.05]}>
            <planeGeometry args={[0.9, 0.055]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function PdfCard({ position, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.1
    ref.current.position.y = position[1] + Math.sin(t * 0.55) * 0.28
  })
  return (
    <group ref={ref} position={position} scale={scale} rotation={[0.1, -0.3, 0]}>
      <RoundedBox args={[1.0, 1.3, 0.06]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#ffffff" roughness={0.45} />
      </RoundedBox>
      <mesh position={[-0.32, 0.5, 0.04]}>
        <boxGeometry args={[0.36, 0.28, 0.01]} />
        <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.2} />
      </mesh>
      {[0.1, -0.1, -0.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0.04]}>
          <planeGeometry args={[0.7, 0.05]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      ))}
    </group>
  )
}

function GradCap({ position, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    ref.current.rotation.y = t * 0.3
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.3
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.3, 0.07, 1.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.3, 0.38, 0.32, 16]} />
        <meshStandardMaterial color="#6366f1" roughness={0.4} />
      </mesh>
      <mesh position={[0.6, 0.05, 0.6]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.55} />
      </mesh>
      <mesh position={[0.35, -0.1, 0.35]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.012, 0.012, 0.55, 6]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  )
}

function Folder({ position, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.3
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.22
  })
  return (
    <group ref={ref} position={position} scale={scale} rotation={[0.2, 0.3, 0]}>
      <RoundedBox args={[1.2, 0.9, 0.05]} radius={0.04}>
        <meshStandardMaterial color="#8b5cf6" roughness={0.35} />
      </RoundedBox>
      <mesh position={[-0.25, 0.5, 0.01]}>
        <boxGeometry args={[0.5, 0.18, 0.04]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.35} />
      </mesh>
    </group>
  )
}

/* ─── Mouse Parallax Rig ─────────────────────────────── */
function ParallaxRig({ mouse, children }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y += (mouse.current.x * 0.28 - ref.current.rotation.y) * 0.04
    ref.current.rotation.x += (mouse.current.y * 0.14 - ref.current.rotation.x) * 0.04
    ref.current.position.x += (mouse.current.x * 0.35 - ref.current.position.x) * 0.03
  })
  return <group ref={ref}>{children}</group>
}

function Scene({ mouse }) {
  return (
    <ParallaxRig mouse={mouse}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <Book position={[-3.0, 0.6, -0.6]} rotation={[0.1, 0.4, 0.05]} color="#6366f1" speed={0.8} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.5}>
        <Book position={[2.9, -0.6, 0.2]} rotation={[-0.1, -0.5, -0.08]} color="#8b5cf6" scale={0.9} speed={1.1} />
      </Float>
      <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.4}>
        <Book position={[-1.8, 1.4, -0.8]} rotation={[0.05, 0.3, -0.04]} color="#0ea5e9" scale={0.75} speed={0.9} />
      </Float>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
        <Laptop position={[0.1, 0.2, -1.4]} scale={0.85} speed={0.6} />
      </Float>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.55}>
        <PdfCard position={[-1.8, -1.2, 0.5]} scale={0.85} speed={0.9} />
      </Float>
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.5}>
        <GradCap position={[2.0, 1.5, -0.3]} scale={0.7} speed={0.9} />
      </Float>
      <Float speed={0.9} rotationIntensity={0.25} floatIntensity={0.45}>
        <Folder position={[-2.6, 1.7, -1]} scale={0.75} speed={0.7} />
      </Float>
      <Sparkles count={70} scale={10} size={1.8} speed={0.25} color="#6366f1" opacity={0.45} />
    </ParallaxRig>
  )
}

/* ─── Main Export ────────────────────────────────────── */
export default function FloatingBooks3D() {
  const mouse = useRef({ x: 0, y: 0 })
  const handleMouseMove = e => {
    mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1
    mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  return (
    <div onMouseMove={handleMouseMove} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={2.2} color="#f0f4ff" />
        <directionalLight position={[4, 6, 4]}  intensity={1.8} color="#ffffff" castShadow />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#c7d2fe" />
        <pointLight position={[0, 3, 4]} intensity={0.9} color="#6366f1" />
        <pointLight position={[3, -2, 2]} intensity={0.5} color="#8b5cf6" />
        <Scene mouse={mouse} />
        <Environment preset="dawn" />
      </Canvas>
    </div>
  )
}