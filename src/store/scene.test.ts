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
