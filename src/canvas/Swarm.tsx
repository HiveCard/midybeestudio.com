import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '../store/scene'
import { formationFor } from './formations'
import { useFxStore, FX } from '../dev/fx'

const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * (8.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorB, uColorA, glow);
    gl_FragColor = vec4(color, glow);
  }
`

function spread(count: number): Float32Array {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 22
    arr[i * 3 + 1] = (Math.random() - 0.5) * 16
    arr[i * 3 + 2] = (Math.random() - 0.5) * 8
  }
  return arr
}

export default function Swarm() {
  const perfTier = useSceneStore((s) => s.perfTier)
  const scene = useSceneStore((s) => s.scene)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const fx = useFxStore((s) => s.fx)
  const cfg = FX[fx]

  const base = cfg.count ?? 2000
  const count = perfTier === 'low' ? Math.round(base * 0.4) : base

  const pointsRef = useRef<THREE.Points>(null)
  const positions = useMemo(
    () => (cfg.drift === 'float-up' ? spread(count) : formationFor('home', count).slice()),
    [count, cfg.drift],
  )
  const target = useRef<Float32Array>(formationFor(scene, count))
  useMemo(() => {
    target.current = formationFor(scene, count)
  }, [scene, count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uSize: { value: cfg.size ?? 14 },
          uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
          uColorA: { value: new THREE.Color('#fde68a') },
          uColorB: { value: new THREE.Color('#b45309') },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [cfg.size],
  )

  useFrame((state, delta) => {
    const pts = pointsRef.current
    if (!pts) return
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array

    if (cfg.drift === 'float-up') {
      const speed = reducedMotion ? 0 : 0.55
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += delta * speed
        if (arr[i * 3 + 1] > 9) {
          arr[i * 3 + 1] = -9
          arr[i * 3] = (Math.random() - 0.5) * 22
          arr[i * 3 + 2] = (Math.random() - 0.5) * 8
        }
      }
      attr.needsUpdate = true
    } else if (cfg.morph) {
      const tgt = target.current
      const k = reducedMotion ? 1 : 1 - Math.pow(0.0015, delta)
      for (let i = 0; i < arr.length; i++) arr[i] += (tgt[i] - arr[i]) * k
      attr.needsUpdate = true
    }

    if (reducedMotion) return

    pts.rotation.y += delta * (cfg.rotation ?? 0)
    const p = cfg.pointer ?? 0
    if (p > 0) {
      pts.rotation.x += (state.pointer.y * p - pts.rotation.x) * 0.04
      pts.rotation.z += (state.pointer.x * p * 0.4 - pts.rotation.z) * 0.04
    }
    if (cfg.breathe) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.03
      pts.scale.setScalar(s)
    }
  })

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  )
}
