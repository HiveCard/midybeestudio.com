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
