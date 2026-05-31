import type { Scene } from '../store/scene'

// Deterministic PRNG (mulberry32) so formations are stable across renders/tests.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SEED: Record<Scene, number> = { home: 1, studio: 2, work: 3, contact: 4 }

function sphereCloud(count: number, rand: () => number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 6 * Math.cbrt(rand())
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
    out[i * 3 + 2] = r * Math.cos(phi)
  }
  return out
}

function lattice(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const perSide = Math.ceil(Math.cbrt(count))
  const gap = 1.4
  const offset = ((perSide - 1) * gap) / 2
  for (let i = 0; i < count; i++) {
    const x = i % perSide
    const y = Math.floor(i / perSide) % perSide
    const z = Math.floor(i / (perSide * perSide))
    out[i * 3] = x * gap - offset
    out[i * 3 + 1] = y * gap - offset
    out[i * 3 + 2] = z * gap - offset
  }
  return out
}

function cluster(count: number, rand: () => number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 3 * Math.pow(rand(), 2)
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    out[i * 3 + 2] = r * Math.cos(phi)
  }
  return out
}

function drift(count: number, rand: () => number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * 18
    out[i * 3 + 1] = (rand() - 0.5) * 10
    out[i * 3 + 2] = (rand() - 0.5) * 8
  }
  return out
}

export function formationFor(scene: Scene, count: number): Float32Array {
  const rand = mulberry32(SEED[scene])
  switch (scene) {
    case 'studio':
      return lattice(count)
    case 'work':
      return cluster(count, rand)
    case 'contact':
      return drift(count, rand)
    case 'home':
    default:
      return sphereCloud(count, rand)
  }
}
