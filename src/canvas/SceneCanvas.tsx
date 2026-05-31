import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Swarm from './Swarm'
import { useSceneStore } from '../store/scene'
import { useHasMounted } from './useHasMounted'
import { isWebGLAvailable } from './webgl'
import { useFxStore, FX } from '../dev/fx'

export default function SceneCanvas() {
  const mounted = useHasMounted()
  const setReducedMotion = useSceneStore((s) => s.setReducedMotion)
  const setPerfTier = useSceneStore((s) => s.setPerfTier)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const perfTier = useSceneStore((s) => s.perfTier)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [setReducedMotion])

  const fx = useFxStore((s) => s.fx)
  const cfg = FX[fx]

  // Only the particle variants use the WebGL canvas; aurora/off render elsewhere.
  if (!mounted || !isWebGLAvailable() || cfg.kind !== 'particles') return null

  const showBloom = !!cfg.bloom && perfTier === 'high' && !reducedMotion

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 60 }}
        dpr={perfTier === 'high' ? [1, 2] : 1}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <PerformanceMonitor onDecline={() => setPerfTier('low')} />
        <Swarm />
        {showBloom && (
          <EffectComposer>
            <Bloom mipmapBlur intensity={1.2} luminanceThreshold={0.1} radius={0.8} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
