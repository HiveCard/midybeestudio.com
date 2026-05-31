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
