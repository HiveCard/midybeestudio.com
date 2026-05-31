import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '../store/scene'
import { formationFor } from './formations'

const COUNT = { high: 4000, low: 1200 } as const

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

export default function Swarm() {
  const perfTier = useSceneStore((s) => s.perfTier)
  const scene = useSceneStore((s) => s.scene)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const count = COUNT[perfTier]

  const pointsRef = useRef<THREE.Points>(null)
  const positions = useMemo(() => formationFor('home', count).slice(), [count])
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
          uSize: { value: 14 },
          uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
          uColorA: { value: new THREE.Color('#fde68a') },
          uColorB: { value: new THREE.Color('#b45309') },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame((state, delta) => {
    const pts = pointsRef.current
    if (!pts) return
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const tgt = target.current
    const k = reducedMotion ? 1 : 1 - Math.pow(0.0015, delta)
    for (let i = 0; i < arr.length; i++) {
      arr[i] += (tgt[i] - arr[i]) * k
    }
    attr.needsUpdate = true
    if (!reducedMotion) {
      pts.rotation.y += delta * 0.04
      const p = state.pointer
      pts.rotation.x += (p.y * 0.15 - pts.rotation.x) * 0.04
      pts.rotation.z += (p.x * 0.05 - pts.rotation.z) * 0.04
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
