# Premium Cinematic Studio — Plan 2: Persistent Canvas & The Swarm

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the persistent full-screen WebGL canvas and "The Swarm" — a field of golden light particles that morphs into a different formation per route — running behind all page content, with a scene store, performance tiers, and a reduced-motion / no-WebGL fallback.

**Architecture:** One React Three Fiber `<Canvas>` is fixed full-screen behind the routed DOM content (`pointer-events: none`, negative z-index). A Zustand store holds the current scene, a reduced-motion flag, and a performance tier. Each page mounts a `<SceneMarker>` that sets the store's scene; the Swarm lerps its particle positions toward that scene's target formation every frame. The canvas is **client-only** (guarded by a mounted check) so the `vite-react-ssg` Node pre-render never touches WebGL — page text still pre-renders in the DOM for SEO/accessibility.

**Tech Stack:** three, @react-three/fiber 9 (React 19 compatible), @react-three/drei 10, @react-three/postprocessing 3, plus the existing Vite/React/Zustand/Vitest setup.

**Reference spec:** `docs/superpowers/specs/2026-06-01-premium-cinematic-studio-redesign-design.md` (§4 The Swarm, §6–8).

**Builds on:** Plan 1 (foundation). The Zustand dep is already installed. `Layout.tsx` already wraps every route.

---

## File structure (created by this plan)

```
src/store/scene.ts            # Zustand scene store (scene, reducedMotion, perfTier)
src/store/scene.test.ts       # store unit tests
src/canvas/formations.ts      # deterministic target-position generators per scene
src/canvas/formations.test.ts # formation unit tests
src/canvas/Swarm.tsx          # THREE.Points particle system + shader, morphs to target
src/canvas/SceneCanvas.tsx    # <Canvas> + Bloom + PerformanceMonitor + reduced-motion wiring
src/canvas/useHasMounted.ts   # client-only mount guard (SSG safety)
src/canvas/webgl.ts           # WebGL support detection
src/components/SceneMarker.tsx# per-page component that sets the store scene
```
Modified: `src/components/Layout.tsx` (mount the canvas + base gradient), the four `src/pages/*.tsx` (add `<SceneMarker>`).

---

## Task 1: Install 3D dependencies

**Files:** `package.json`

- [ ] **Step 1: Record base SHA** — `git rev-parse HEAD`.

- [ ] **Step 2: Install.** Run:
```bash
npm install three@^0.171 @react-three/fiber@^9 @react-three/drei@^10 @react-three/postprocessing@^3
npm install -D @types/three@^0.171
```
Expected: clean install (peer warnings about React are fine if install exits 0). If `@react-three/drei@^10` or `@react-three/postprocessing@^3` reports a hard ERESOLVE against React 19 or @react-three/fiber 9, report the exact versions; do NOT use `--legacy-peer-deps` without reporting first.

- [ ] **Step 3: Verify** `npx tsc --noEmit` still passes (no source changes yet, should be clean).

- [ ] **Step 4: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: add react-three-fiber, drei, postprocessing for the Swarm"
```

---

## Task 2: Scene store (TDD)

**Files:** Test `src/store/scene.test.ts`; Create `src/store/scene.ts`.

- [ ] **Step 1: Write the failing test** `src/store/scene.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useSceneStore, type Scene } from './scene'

const reset = () =>
  useSceneStore.setState({ scene: 'home', reducedMotion: false, perfTier: 'high' })

describe('scene store', () => {
  beforeEach(reset)

  it('defaults to the home scene at high performance', () => {
    const s = useSceneStore.getState()
    expect(s.scene).toBe('home')
    expect(s.perfTier).toBe('high')
    expect(s.reducedMotion).toBe(false)
  })

  it('setScene updates the active scene', () => {
    useSceneStore.getState().setScene('work')
    expect(useSceneStore.getState().scene).toBe('work')
  })

  it('setReducedMotion and setPerfTier update flags', () => {
    useSceneStore.getState().setReducedMotion(true)
    useSceneStore.getState().setPerfTier('low')
    const s = useSceneStore.getState()
    expect(s.reducedMotion).toBe(true)
    expect(s.perfTier).toBe('low')
  })

  it('accepts all four scene names', () => {
    const scenes: Scene[] = ['home', 'studio', 'work', 'contact']
    for (const sc of scenes) {
      useSceneStore.getState().setScene(sc)
      expect(useSceneStore.getState().scene).toBe(sc)
    }
  })
})
```

- [ ] **Step 2: Run, verify it FAILS** — `npm test -- src/store/scene.test.ts` → cannot resolve `./scene`.

- [ ] **Step 3: Implement** `src/store/scene.ts`:
```ts
import { create } from 'zustand'

export type Scene = 'home' | 'studio' | 'work' | 'contact'
export type PerfTier = 'high' | 'low'

export interface SceneState {
  scene: Scene
  reducedMotion: boolean
  perfTier: PerfTier
  setScene: (scene: Scene) => void
  setReducedMotion: (reducedMotion: boolean) => void
  setPerfTier: (perfTier: PerfTier) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: 'home',
  reducedMotion: false,
  perfTier: 'high',
  setScene: (scene) => set({ scene }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setPerfTier: (perfTier) => set({ perfTier }),
}))
```

- [ ] **Step 4: Run, verify it PASSES** — `npm test -- src/store/scene.test.ts` (4 passing).

- [ ] **Step 5: Commit**
```bash
git add src/store/scene.ts src/store/scene.test.ts
git commit -m "feat: add zustand scene store"
```

---

## Task 3: Formations module (TDD)

Deterministic target-position generators (seeded PRNG so SSR/hydration and tests are stable). Each returns a `Float32Array` of `count * 3` floats.

**Files:** Test `src/canvas/formations.test.ts`; Create `src/canvas/formations.ts`.

- [ ] **Step 1: Write the failing test** `src/canvas/formations.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { formationFor } from './formations'
import type { Scene } from '../store/scene'

const scenes: Scene[] = ['home', 'studio', 'work', 'contact']

describe('formationFor', () => {
  it('returns count*3 floats for every scene', () => {
    for (const scene of scenes) {
      const arr = formationFor(scene, 500)
      expect(arr).toBeInstanceOf(Float32Array)
      expect(arr.length).toBe(500 * 3)
    }
  })

  it('is deterministic for the same scene + count', () => {
    const a = formationFor('home', 300)
    const b = formationFor('home', 300)
    expect(Array.from(a)).toEqual(Array.from(b))
  })

  it('produces different geometry for different scenes', () => {
    const home = formationFor('home', 300)
    const studio = formationFor('studio', 300)
    expect(Array.from(home)).not.toEqual(Array.from(studio))
  })

  it('keeps all coordinates finite and within a sane bound', () => {
    const arr = formationFor('contact', 400)
    for (const v of arr) {
      expect(Number.isFinite(v)).toBe(true)
      expect(Math.abs(v)).toBeLessThan(100)
    }
  })
})
```

- [ ] **Step 2: Run, verify it FAILS** — `npm test -- src/canvas/formations.test.ts`.

- [ ] **Step 3: Implement** `src/canvas/formations.ts`:
```ts
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

// Home: a soft spherical cloud (the swarm at rest, vast).
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

// Studio: an ordered lattice (craft / structure).
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

// Work: a dense, focused cluster (the field converging on one product).
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

// Contact: a calm, sparse, wide drift.
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
```

- [ ] **Step 4: Run, verify it PASSES** — `npm test -- src/canvas/formations.test.ts` (4 passing).

- [ ] **Step 5: Commit**
```bash
git add src/canvas/formations.ts src/canvas/formations.test.ts
git commit -m "feat: add deterministic per-scene swarm formations"
```

---

## Task 4: Client-mount guard + WebGL detection

Tiny utilities the canvas needs. No tests (trivial environment probes); verified by typecheck + later build.

**Files:** Create `src/canvas/useHasMounted.ts`, `src/canvas/webgl.ts`.

- [ ] **Step 1:** `src/canvas/useHasMounted.ts`:
```ts
import { useEffect, useState } from 'react'

/** True only after the component has mounted in the browser. Lets us skip
 *  rendering the WebGL canvas during the vite-react-ssg Node pre-render. */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
```

- [ ] **Step 2:** `src/canvas/webgl.ts`:
```ts
/** Detect WebGL support so we can gracefully skip the canvas on unsupported
 *  devices (content still renders in the DOM). */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}
```

- [ ] **Step 3:** `npm run typecheck` → clean.

- [ ] **Step 4: Commit**
```bash
git add src/canvas/useHasMounted.ts src/canvas/webgl.ts
git commit -m "feat: add client-mount guard and WebGL detection"
```

---

## Task 5: The Swarm particle system

THREE.Points with a custom additive shader (soft golden points), lerping current positions toward the active scene's formation each frame.

**Files:** Create `src/canvas/Swarm.tsx`. (No unit test — visual/animation component; verified by build + the dev smoke in Task 7.)

- [ ] **Step 1:** Create `src/canvas/Swarm.tsx`:
```tsx
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
  // current (animated) positions, mutated in place each frame
  const positions = useMemo(() => formationFor('home', count).slice(), [count])
  const target = useRef<Float32Array>(formationFor(scene, count))

  // Recompute target whenever the scene or particle count changes.
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
    // Critically damped-ish lerp toward target; instant when reduced motion.
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
```

- [ ] **Step 2:** `npm run typecheck` → clean. (If TS flags the `bufferAttribute args` tuple type, ensure `positions` is typed `Float32Array`; it is, via `.slice()` on a Float32Array.)

- [ ] **Step 3: Commit**
```bash
git add src/canvas/Swarm.tsx
git commit -m "feat: add the Swarm particle system with additive golden shader"
```

---

## Task 6: SceneCanvas (canvas + bloom + perf + reduced-motion)

**Files:** Create `src/canvas/SceneCanvas.tsx`.

- [ ] **Step 1:** Create `src/canvas/SceneCanvas.tsx`:
```tsx
import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Swarm from './Swarm'
import { useSceneStore } from '../store/scene'
import { useHasMounted } from './useHasMounted'
import { isWebGLAvailable } from './webgl'

export default function SceneCanvas() {
  const mounted = useHasMounted()
  const setReducedMotion = useSceneStore((s) => s.setReducedMotion)
  const setPerfTier = useSceneStore((s) => s.setPerfTier)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const perfTier = useSceneStore((s) => s.perfTier)

  // Sync prefers-reduced-motion into the store.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [setReducedMotion])

  // Skip entirely during SSG pre-render and on devices without WebGL.
  if (!mounted || !isWebGLAvailable()) return null

  const showBloom = perfTier === 'high' && !reducedMotion

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
```

- [ ] **Step 2:** `npm run typecheck` → clean.

- [ ] **Step 3: Commit**
```bash
git add src/canvas/SceneCanvas.tsx
git commit -m "feat: add SceneCanvas with bloom, perf monitor, reduced-motion"
```

---

## Task 7: SceneMarker + wire into Layout and pages

**Files:** Create `src/components/SceneMarker.tsx`; modify `src/components/Layout.tsx` and the four `src/pages/*.tsx`.

- [ ] **Step 1:** Create `src/components/SceneMarker.tsx`:
```tsx
import { useEffect } from 'react'
import { useSceneStore, type Scene } from '../store/scene'

/** Sets the active Swarm scene while this page is mounted. */
export default function SceneMarker({ scene }: { scene: Scene }) {
  const setScene = useSceneStore((s) => s.setScene)
  useEffect(() => {
    setScene(scene)
  }, [scene, setScene])
  return null
}
```

- [ ] **Step 2:** Modify `src/components/Layout.tsx` to mount the canvas + a persistent base gradient behind content. New content:
```tsx
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import SceneCanvas from '../canvas/SceneCanvas'

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      {/* Always-present ambient gradient (also the no-WebGL fallback) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 75% 25%, rgba(245,158,11,.10), transparent 50%), radial-gradient(circle at 15% 85%, rgba(180,83,9,.08), transparent 45%)',
        }}
      />
      <SceneCanvas />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3:** Add `<SceneMarker>` to each page. In `src/pages/Home.tsx`, import and render it as the first child of the returned section:
```tsx
import SceneMarker from '../components/SceneMarker'
```
and immediately inside the top-level `<section ...>`:
```tsx
      <SceneMarker scene="home" />
```
Repeat for `Studio.tsx` (`scene="studio"`), `Work.tsx` (`scene="work"`), `Contact.tsx` (`scene="contact"`), each importing `SceneMarker` and rendering `<SceneMarker scene="..." />` as the first child of the page's root element.

- [ ] **Step 4:** `npm run typecheck` → clean.

- [ ] **Step 5: Build must still succeed (SSG safety).** Run `npm run build`. It MUST exit 0 and still pre-render real text. Verify `dist/studio/index.html` contains `Studio` and `dist/index.html` contains `We build`. (If the build crashes with a `window`/`document`/WebGL error, the client-mount guard in `SceneCanvas`/`useHasMounted` is not protecting the Node render — fix before committing.)

- [ ] **Step 6: Dev smoke.** Start `npm run dev` in the background, wait ~4s, `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/` → expect `200`, then stop the server. (Visual correctness of the Swarm is confirmed separately by a human; here we only confirm it boots without runtime errors — check the vite terminal output for uncaught errors.)

- [ ] **Step 7: Commit**
```bash
git add src/components/SceneMarker.tsx src/components/Layout.tsx src/pages
git commit -m "feat: mount persistent Swarm canvas and per-page scene markers"
```

---

## Task 8: Full test + build verification, then final review

- [ ] **Step 1:** `npm test` → all suites pass (site config + scene store + formations).
- [ ] **Step 2:** `npm run typecheck` → clean.
- [ ] **Step 3:** `npm run build` → succeeds, nested route HTML present with real text.
- [ ] **Step 4:** Report the BASE_SHA (Task 1 start) and final HEAD SHA for the controller's code review.

---

## Self-review checklist (controller, after execution)

1. **SSG safety:** `npm run build` succeeds — the canvas is genuinely client-only (no `window` access during Node pre-render). This is the #1 risk.
2. **Content still in DOM:** pre-rendered HTML still contains page text (canvas is `aria-hidden`, decorative).
3. **Reduced motion:** with `prefers-reduced-motion`, the store flag flips and the Swarm snaps to target without idle rotation.
4. **Perf fallback:** `PerformanceMonitor` lowers the tier (fewer particles, bloom off) under load; low-tier DPR capped at 1.
5. **No-WebGL:** `isWebGLAvailable()` false → canvas returns null, ambient gradient remains.

---

## Open question carried forward
The Home swarm's resolved "wordmark" form is **not** built here (Home uses the soft sphere-cloud formation). Shaping the swarm into a literal "midybee" wordmark/monogram is deferred — revisit in Plan 3 or a polish pass once the base system is verified visually.
