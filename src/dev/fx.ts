import { create } from 'zustand'

/** Animation variants for the hero/background. Used by the local preview
 *  switcher (FxPanel) so we can audition calmer options before committing. */
export type Fx = 'swarm' | 'calm' | 'constellation' | 'embers' | 'aurora' | 'off'

export interface FxConfig {
  label: string
  desc: string
  kind: 'particles' | 'aurora' | 'off'
  count?: number
  size?: number
  rotation?: number // y-rotation speed (radians/sec)
  pointer?: number // cursor reactivity (0 = none)
  drift?: 'orbit' | 'gentle' | 'none' | 'float-up'
  breathe?: boolean // slow scale pulse
  bloom?: boolean
  morph?: boolean // re-form per route
}

export const FX: Record<Fx, FxConfig> = {
  swarm: {
    label: 'Swarm (current)',
    desc: 'Dense, rotating, cursor-reactive.',
    kind: 'particles',
    count: 4000,
    size: 14,
    rotation: 0.04,
    pointer: 0.15,
    drift: 'orbit',
    bloom: true,
    morph: true,
  },
  calm: {
    label: 'Calm drift',
    desc: 'Fewer, dimmer, barely moving. Subtle.',
    kind: 'particles',
    count: 1300,
    size: 10,
    rotation: 0.006,
    pointer: 0.03,
    drift: 'gentle',
    breathe: true,
    bloom: true,
    morph: true,
  },
  constellation: {
    label: 'Constellation',
    desc: 'Sparse, larger stars, almost still.',
    kind: 'particles',
    count: 420,
    size: 22,
    rotation: 0,
    pointer: 0,
    drift: 'none',
    breathe: true,
    bloom: true,
    morph: false,
  },
  embers: {
    label: 'Embers',
    desc: 'Sparse motes drifting slowly upward.',
    kind: 'particles',
    count: 600,
    size: 12,
    rotation: 0,
    pointer: 0,
    drift: 'float-up',
    bloom: true,
    morph: false,
  },
  aurora: {
    label: 'Aurora (no dots)',
    desc: 'Soft warm light flow. Very minimal.',
    kind: 'aurora',
  },
  off: {
    label: 'Off (gradient only)',
    desc: 'Just the static ambient glow.',
    kind: 'off',
  },
}

function initialFx(): Fx {
  // Production always uses the chosen default ('calm'). Only on localhost may the
  // switcher / ?fx= query param / localStorage override it, so prod stays deterministic.
  if (typeof window !== 'undefined') {
    const isLocal = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
    if (isLocal) {
      const fromUrl = new URLSearchParams(window.location.search).get('fx') as Fx | null
      if (fromUrl && fromUrl in FX) return fromUrl
      const stored = window.localStorage.getItem('fx') as Fx | null
      if (stored && stored in FX) return stored
    }
  }
  return 'calm'
}

interface FxState {
  fx: Fx
  setFx: (fx: Fx) => void
}

export const useFxStore = create<FxState>((set) => ({
  fx: initialFx(),
  setFx: (fx) => {
    if (typeof window !== 'undefined') window.localStorage.setItem('fx', fx)
    set({ fx })
  },
}))
