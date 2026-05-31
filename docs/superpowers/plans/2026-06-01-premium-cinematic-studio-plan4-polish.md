# Premium Cinematic Studio — Plan 4: Polish, SEO & Tests

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Final hardening — favicon + Open Graph/Twitter cards + an OG image, robots.txt + sitemap.xml, and real automated test coverage for the contact logic and navigation.

**Architecture:** Static brand assets live in `public/` (copied verbatim into `dist/`). The `Meta` component gains social-card tags. Contact's mailto-building logic is extracted into a pure, unit-tested helper. The Vitest setup gains jsdom shims (IntersectionObserver, matchMedia) so component render tests run.

**Reference spec:** `docs/superpowers/specs/2026-06-01-premium-cinematic-studio-redesign-design.md` (§9 SEO, §11 quality).

> **Deviation note (honest):** the spec mentions Playwright e2e. This plan delivers the *substance* of smoke testing via fast, reliable Vitest render/logic tests (no browser-binary download, which is fragile to provision autonomously on Windows/CI). Full Playwright e2e is left as a documented future addition; the CI already runs `npm test` on every deploy.

---

## File structure
```
public/favicon.svg     # "m" monogram favicon
public/og.svg          # 1200x630 social share image
public/robots.txt
public/sitemap.xml
src/lib/mailto.ts       # pure mailto-builder (tested)
src/lib/mailto.test.ts
src/components/Nav.test.tsx
```
Modified: `index.html` (favicon + theme-color), `src/content/site.ts` (add `url`), `src/components/Meta.tsx` (social tags), `src/components/ContactForm.tsx` (use the helper), `src/test/setup.ts` (jsdom shims).

---

## Task 1: Brand assets + favicon

**Files:** create `public/favicon.svg`, `public/og.svg`, `public/robots.txt`, `public/sitemap.xml`; modify `index.html`.

- [ ] **Step 1:** `git rev-parse HEAD` (BASE_SHA).

- [ ] **Step 2:** `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0a0807"/>
  <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#f59e0b" stroke-width="5"/>
  <text x="50" y="71" text-anchor="middle" font-family="Georgia, serif" font-size="62" font-weight="600" fill="#fbbf24">m</text>
</svg>
```

- [ ] **Step 3:** `public/og.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0807"/>
  <defs>
    <radialGradient id="g" cx="78%" cy="28%" r="60%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="96" y="288" font-family="Georgia, serif" font-size="86" font-weight="600" fill="#fffbeb">We build <tspan fill="#fbbf24" font-style="italic">privacy-first</tspan></text>
  <text x="96" y="392" font-family="Georgia, serif" font-size="86" font-weight="600" fill="#fffbeb">apps people can trust.</text>
  <text x="98" y="520" font-family="monospace" font-size="27" letter-spacing="7" fill="#f59e0b">MIDYBEE STUDIO · OLONGAPO, PHILIPPINES</text>
</svg>
```

- [ ] **Step 4:** `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://midybeestudio.com/sitemap.xml
```

- [ ] **Step 5:** `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://midybeestudio.com/</loc></url>
  <url><loc>https://midybeestudio.com/studio</loc></url>
  <url><loc>https://midybeestudio.com/work</loc></url>
  <url><loc>https://midybeestudio.com/contact</loc></url>
</urlset>
```

- [ ] **Step 6:** In `index.html`, add inside `<head>` (after the viewport meta) these two lines:
```html
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="theme-color" content="#0a0807" />
```

- [ ] **Step 7:** `npm run typecheck` clean. Commit:
```
git add public/favicon.svg public/og.svg public/robots.txt public/sitemap.xml index.html
git commit -m "feat: add favicon, OG image, robots, and sitemap"
```

---

## Task 2: Social cards in Meta

**Files:** modify `src/content/site.ts`, `src/components/Meta.tsx`.

- [ ] **Step 1:** In `src/content/site.ts`, add a `url` field to `siteMeta` (keep all existing fields):
```ts
  url: 'https://midybeestudio.com',
```
(Add it as a property of the `siteMeta` object, e.g. right after `domain`.)

- [ ] **Step 2:** Replace `src/components/Meta.tsx` with:
```tsx
import { Head } from 'vite-react-ssg'
import { siteMeta } from '../content/site'

/** Per-route document title, description, and social-share cards. */
export default function Meta({ title, description }: { title: string; description: string }) {
  const fullTitle = `${title} — ${siteMeta.name}`
  const image = `${siteMeta.url}/og.svg`
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteMeta.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}
```

- [ ] **Step 3:** Confirm the existing `src/content/site.test.ts` still passes (it asserts name/domain/email/facebook; adding `url` doesn't break it). Run `npm test -- src/content/site.test.ts`.

- [ ] **Step 4:** `npm run typecheck` clean. Commit:
```
git add src/content/site.ts src/components/Meta.tsx
git commit -m "feat: add Open Graph and Twitter card meta"
```

---

## Task 3: Mailto helper (TDD) + refactor ContactForm

**Files:** test `src/lib/mailto.test.ts`; create `src/lib/mailto.ts`; modify `src/components/ContactForm.tsx`.

- [ ] **Step 1:** Write failing test `src/lib/mailto.test.ts`:
```ts
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
```

- [ ] **Step 2:** Run, verify FAIL — `npm test -- src/lib/mailto.test.ts`.

- [ ] **Step 3:** Create `src/lib/mailto.ts`:
```ts
export interface MailtoInput {
  to: string
  name: string
  email: string
  message: string
}

/** Build a mailto: URL from contact fields, or null if the message is blank. */
export function buildMailto({ to, name, email, message }: MailtoInput): string | null {
  if (!message.trim()) return null
  const subject = encodeURIComponent(`midybee inquiry${name ? ' from ' + name : ''}`)
  const body = encodeURIComponent(
    `${message}${email ? '\n\nReply to: ' + email : ''}${name ? '\n— ' + name : ''}`,
  )
  return `mailto:${to}?subject=${subject}&body=${body}`
}
```

- [ ] **Step 4:** Run, verify PASS — `npm test -- src/lib/mailto.test.ts` (3 passing).

- [ ] **Step 5:** Refactor `src/components/ContactForm.tsx` to use the helper. Replace its `send` function and imports so it reads:
```tsx
import { useState } from 'react'
import { siteMeta } from '../content/site'
import { buildMailto } from '../lib/mailto'

/** Composes a mailto: link from the fields — deliberately collects no data and
 *  hits no backend, so the studio's own site honors the privacy promise. */
export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState('Opens your email app — no data is collected by this site.')

  const send = () => {
    const url = buildMailto({ to: siteMeta.email, name, email, message })
    if (!url) {
      setNote('Please add a short message first.')
      return
    }
    window.location.href = url
  }

  const field = 'w-full rounded-xl border border-slate-800 bg-ink px-4 py-3 text-cream transition focus:border-amber-500 focus:outline-none'

  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300" htmlFor="cf-name">Name</label>
      <input id="cf-name" className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <label className="mb-2 mt-5 block text-sm text-slate-300" htmlFor="cf-email">Email</label>
      <input id="cf-email" type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <label className="mb-2 mt-5 block text-sm text-slate-300" htmlFor="cf-msg">Message</label>
      <textarea id="cf-msg" className={`${field} min-h-32 resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us a bit about what you have in mind…" />
      <button onClick={send} className="mt-5 w-full rounded-full bg-amber-500 py-3 font-medium text-ink transition hover:bg-amber-400">
        Send message
      </button>
      <p className="mt-3 text-sm text-slate-400">{note}</p>
    </div>
  )
}
```

- [ ] **Step 6:** `npm run typecheck` clean. Commit:
```
git add src/lib/mailto.ts src/lib/mailto.test.ts src/components/ContactForm.tsx
git commit -m "feat: extract tested mailto builder; use it in ContactForm"
```

---

## Task 4: jsdom shims + Nav render test

**Files:** modify `src/test/setup.ts`; create `src/components/Nav.test.tsx`.

- [ ] **Step 1:** Replace `src/test/setup.ts` with:
```ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom lacks IntersectionObserver (used by Reveal) — provide a no-op shim.
if (!('IntersectionObserver' in globalThis)) {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  ;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO
}

// jsdom lacks matchMedia (used by reduced-motion detection) — default to no match.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}
```

- [ ] **Step 2:** Create `src/components/Nav.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Nav from './Nav'

describe('Nav', () => {
  it('renders every nav link and the Follow CTA', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('Studio')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Follow')).toBeInTheDocument()
  })

  it('links Follow to the studio Facebook page', () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    )
    expect(screen.getByText('Follow').closest('a')).toHaveAttribute('href', 'https://www.facebook.com/HiveCardApp')
  })
})
```

- [ ] **Step 3:** Run `npm test` — all suites pass (site config 3 + scene store 4 + formations 4 + mailto 3 + Nav 2 = 17).

- [ ] **Step 4:** `npm run typecheck` clean. Commit:
```
git add src/test/setup.ts src/components/Nav.test.tsx
git commit -m "test: add jsdom shims and Nav render tests"
```

---

## Task 5: Final verification

- [ ] **Step 1:** `npm test` → 17 passing.
- [ ] **Step 2:** `npm run typecheck` → clean.
- [ ] **Step 3:** `npm run build` → exit 0. Verify:
  - `dist/favicon.svg`, `dist/og.svg`, `dist/robots.txt`, `dist/sitemap.xml` all exist.
  - `dist/studio/index.html` contains `og:image` and `twitter:card`.
  - `dist/index.html` references `/favicon.svg`.
- [ ] **Step 4:** Report BASE_SHA (Task 1 start) and final HEAD for controller review.

---

## Self-review checklist (controller)
1. Assets ship into `dist/` (favicon, og, robots, sitemap).
2. Social cards present + per-route in pre-rendered HTML (og:image, twitter:card).
3. mailto logic is pure + tested; ContactForm uses it (no behavior change for users).
4. Test count rose to 17; jsdom shims don't leak between tests.
5. Privacy unchanged: still mailto-only, no analytics, no backend.
