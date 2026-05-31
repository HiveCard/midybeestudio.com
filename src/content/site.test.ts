import { describe, it, expect } from 'vitest'
import { navLinks, siteMeta } from './site'

describe('site config', () => {
  it('exposes exactly the three top-level nav links', () => {
    expect(navLinks.map((l) => l.label)).toEqual(['Studio', 'Work', 'Contact'])
  })

  it('every nav path is an absolute in-app route', () => {
    for (const link of navLinks) {
      expect(link.path.startsWith('/')).toBe(true)
    }
  })

  it('carries the core studio metadata', () => {
    expect(siteMeta.name).toBe('midybee studio')
    expect(siteMeta.domain).toBe('midybeestudio.com')
    expect(siteMeta.email).toBe('hello@midybee.com')
    expect(siteMeta.facebook).toContain('facebook.com')
  })
})
