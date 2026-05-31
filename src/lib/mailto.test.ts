import { describe, it, expect } from 'vitest'
import { buildMailto } from './mailto'

describe('buildMailto', () => {
  it('returns null when the message is blank', () => {
    expect(buildMailto({ to: 'hello@x.com', name: 'A', email: 'a@x.com', message: '   ' })).toBeNull()
  })

  it('builds a mailto with encoded subject and body', () => {
    const url = buildMailto({ to: 'hello@x.com', name: 'Ada', email: 'ada@x.com', message: 'Hi there' })
    expect(url).not.toBeNull()
    expect(url!.startsWith('mailto:hello@x.com?')).toBe(true)
    expect(url!).toContain('subject=' + encodeURIComponent('midybee inquiry from Ada'))
    expect(url!).toContain(encodeURIComponent('Hi there'))
    expect(url!).toContain(encodeURIComponent('Reply to: ada@x.com'))
  })

  it('omits the "from" name in the subject when name is empty', () => {
    const url = buildMailto({ to: 'hello@x.com', name: '', email: '', message: 'Yo' })
    expect(url!).toContain('subject=' + encodeURIComponent('midybee inquiry'))
  })
})
