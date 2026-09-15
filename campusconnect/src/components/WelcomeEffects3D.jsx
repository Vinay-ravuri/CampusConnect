import { Suspense, memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

function EffectScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFF8E8" />
      
      {/* Minimal premium golden sparkles */}
      <Sparkles
        count={50}
        scale={8}
        size={1.6}
        speed={0.25}
        color="#FFF8E8"
        opacity={0.5}
      />
      <Sparkles
        count={20}
        scale={6}
        size={2.8}
        speed={0.4}
        color="#FFD700"
        opacity={0.3}
      />

      {/* Soft Glow Postprocessing */}
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

const WelcomeEffects3D = memo(function WelcomeEffects3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <EffectScene />
        </Suspense>
      </Canvas>
    </div>
  )
})

export default WelcomeEffects3D
