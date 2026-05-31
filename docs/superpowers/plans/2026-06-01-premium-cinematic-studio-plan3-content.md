# Premium Cinematic Studio — Plan 3: Motion & Full Page Content

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Turn the four route stubs into the real studio site — smooth inertia scrolling, scroll-triggered reveals, a content fade on route change, per-route SEO meta, and full written content for Home, Studio, Work, and Contact (including a privacy-preserving mailto contact composer).

**Architecture:** A client-only Lenis instance drives smooth scrolling (disabled under reduced-motion). A lightweight `Reveal` component (IntersectionObserver + CSS transition) fades/raises sections as they enter the viewport, with stagger — robust, SSR-safe, and reduced-motion-aware (content is always present in the DOM; only the animation is conditional). Shared copy lives in `src/content/*` data modules so pages stay declarative and DRY. Per-route `<title>`/meta uses `vite-react-ssg`'s `Head`.

**Tech Stack:** adds `lenis` (smooth scroll). Reuses React 19, the existing Swarm/scene system from Plan 2, Tailwind v4 tokens, and `vite-react-ssg`.

> **Note on motion library:** This plan uses IntersectionObserver + CSS for reveals rather than GSAP ScrollTrigger. It delivers the cinematic reveal feel reliably and SSR-safely; richer GSAP-sequenced motion and scroll-linked swarm morphs are deferred to the final visual-polish pass (they benefit from human visual iteration). The per-route swarm morph from Plan 2 already provides the page-to-page "reassembly" transition.

**Reference spec:** `docs/superpowers/specs/2026-06-01-premium-cinematic-studio-redesign-design.md` (§3 pages, §5 motion, §9 SEO).

---

## File structure

```
src/content/studio.ts        # principles + studio story copy
src/content/work.ts          # HiveCard case-study data (features, links)
src/lib/SmoothScroll.tsx     # client-only Lenis provider (reduced-motion aware)
src/components/Reveal.tsx     # IntersectionObserver reveal wrapper
src/components/Meta.tsx       # per-route <title>/<meta> via vite-react-ssg Head
src/components/ContactForm.tsx# mailto composer (no backend, collects nothing)
src/components/Section.tsx    # shared section heading (tag + title + subtitle)
```
Modified: `src/components/Layout.tsx` (wrap children in SmoothScroll + per-route fade), all four `src/pages/*.tsx` (full content), `src/styles/index.css` (reveal + fade keyframes, reduced-motion guards).

---

## Task 1: Install Lenis

- [ ] **Step 1:** `git rev-parse HEAD` (BASE_SHA).
- [ ] **Step 2:** `npm install lenis`
- [ ] **Step 3:** `npm run typecheck` clean.
- [ ] **Step 4:** Commit `git add package.json package-lock.json && git commit -m "chore: add lenis for smooth scrolling"`.

---

## Task 2: Reveal styles + component

**Files:** modify `src/styles/index.css`; create `src/components/Reveal.tsx`.

- [ ] **Step 1:** Append to `src/styles/index.css`:
```css
/* ---- scroll reveal ---- */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  will-change: opacity, transform;
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}
/* ---- route fade ---- */
@keyframes page-fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
.page-fade { animation: page-fade-in 0.6s ease both; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  .page-fade { animation: none; }
}
```

- [ ] **Step 2:** Create `src/components/Reveal.tsx`:
```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Fades/raises its children in when scrolled into view. SSR-safe (content is
 *  always rendered; only the animated class toggles). `delay` staggers siblings. */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 3:** `npm run typecheck` clean. Commit:
```
git add src/styles/index.css src/components/Reveal.tsx
git commit -m "feat: add scroll-reveal component and motion styles"
```

---

## Task 3: SmoothScroll provider + Meta + Section helpers

**Files:** create `src/lib/SmoothScroll.tsx`, `src/components/Meta.tsx`, `src/components/Section.tsx`.

- [ ] **Step 1:** `src/lib/SmoothScroll.tsx`:
```tsx
import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useSceneStore } from '../store/scene'

/** Client-only smooth scrolling. Disabled when the user prefers reduced motion. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useSceneStore((s) => s.reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reducedMotion])

  return <>{children}</>
}
```

- [ ] **Step 2:** Verify `vite-react-ssg` exports `Head`. Run a quick check (e.g. grep the package types for `Head`). Then `src/components/Meta.tsx`:
```tsx
import { Head } from 'vite-react-ssg'
import { siteMeta } from '../content/site'

/** Per-route document title + description. */
export default function Meta({ title, description }: { title: string; description: string }) {
  const fullTitle = `${title} — ${siteMeta.name}`
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
    </Head>
  )
}
```
> If `Head` is NOT exported by `vite-react-ssg` in this version, STOP and report — fallback is a small client-only effect that sets `document.title`, but confirm first.

- [ ] **Step 3:** `src/components/Section.tsx`:
```tsx
import type { ReactNode } from 'react'
import Reveal from './Reveal'

/** Shared section header: eyebrow tag, display title, optional subtitle. */
export default function SectionHead({
  tag,
  title,
  children,
}: {
  tag: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <Reveal className="max-w-2xl">
      <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber-500">{tag}</span>
      <h2 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-lg text-slate-300">{children}</p>}
    </Reveal>
  )
}
```

- [ ] **Step 4:** `npm run typecheck` clean. Commit:
```
git add src/lib/SmoothScroll.tsx src/components/Meta.tsx src/components/Section.tsx
git commit -m "feat: add smooth scroll, per-route meta, and section header"
```

---

## Task 4: Content data modules

**Files:** create `src/content/studio.ts`, `src/content/work.ts`.

- [ ] **Step 1:** `src/content/studio.ts`:
```ts
export interface Principle {
  icon: string
  title: string
  body: string
}

export const principles: Principle[] = [
  {
    icon: '🔒',
    title: 'Privacy by default',
    body: "Your financial life shouldn't be a product. Our apps keep your data on your device wherever possible and ask for nothing they don't need.",
  },
  {
    icon: '🇵🇭',
    title: 'Built for the PH',
    body: 'Designed around how Filipinos actually bank, spend, and save — including the millions of OFWs managing money across borders.',
  },
  {
    icon: '✺',
    title: 'Craft over scale',
    body: 'One maker, focused work. Every screen is considered, every feature earns its keep. Quality you can feel in the details.',
  },
]
```

- [ ] **Step 2:** `src/content/work.ts`:
```ts
export interface Feature {
  title: string
  body: string
}

export const hivecard = {
  name: 'HiveCard',
  tagline: 'Privacy-first credit card manager',
  status: 'Live on Google Play',
  summary:
    'Track balances, plan payments, and reach your debt-free date — all without handing your financial data to anyone. Built for Philippine cardholders and OFWs.',
  site: 'https://hivecard.ph',
  features: [
    {
      title: 'Import in seconds',
      body: 'Drop in your statement PDF from 10+ Philippine banks. HiveCard reads it and organizes everything automatically.',
    },
    {
      title: 'See what to pay',
      body: "Smart payment plans show exactly how to clear your balance and the date you'll finally be debt-free.",
    },
    {
      title: 'Stay private',
      body: 'Everything is encrypted and stored on your device. No bank login, no cloud, no one selling your data.',
    },
    {
      title: 'Never miss a due date',
      body: 'Track dues across every card and plan payments around your income, so late fees stop catching you off guard.',
    },
  ] as Feature[],
}
```

- [ ] **Step 3:** `npm run typecheck` clean. Commit:
```
git add src/content/studio.ts src/content/work.ts
git commit -m "feat: add studio and work content data"
```

---

## Task 5: Home page (full)

**Files:** replace `src/pages/Home.tsx`.

- [ ] **Step 1:** Replace `src/pages/Home.tsx` with:
```tsx
import { Link } from 'react-router-dom'
import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import Reveal from '../components/Reveal'
import SectionHead from '../components/Section'
import { principles } from '../content/studio'
import { hivecard } from '../content/work'

export default function Home() {
  return (
    <>
      <SceneMarker scene="home" />
      <Meta
        title="Privacy-first apps, built in the Philippines"
        description="midybee studio is an independent software studio in Olongapo, Philippines, building privacy-first apps. Maker of HiveCard."
      />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center px-6 pt-32 pb-16 md:px-12">
        <div className="max-w-4xl page-fade">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">
            Independent software studio · Olongapo, PH
          </span>
          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">
            We build <span className="italic text-amber-400">privacy-first</span> apps people can trust.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-slate-300">
            A solo-led studio crafting thoughtful, privacy-respecting software for the Philippine market
            and the Filipino diaspora — starting with the way people manage money.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/work"
              className="rounded-full bg-amber-500 px-6 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:bg-amber-400"
            >
              See our work →
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-slate-600 px-6 py-3 font-medium text-cream transition hover:border-amber-500 hover:text-amber-400"
            >
              Work with us
            </Link>
          </div>
        </div>
      </section>

      {/* Ethos */}
      <section className="border-y border-amber-500/10 bg-surface/40 px-6 py-24 md:px-12">
        <SectionHead tag="What we believe" title="Small studio, deliberate craft.">
          Consumer apps that treat your data as yours — no surveillance, no dark patterns.
        </SectionHead>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="rounded-2xl border border-slate-800 bg-ink/60 p-8 transition hover:border-amber-500">
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-4 font-display text-xl font-medium">{p.title}</h3>
              <p className="mt-2 text-slate-400">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured work */}
      <section className="px-6 py-24 md:px-12">
        <SectionHead tag="Our product" title="Meet HiveCard.">
          {hivecard.summary}
        </SectionHead>
        <Reveal className="mt-10">
          <Link
            to="/work"
            className="group flex flex-col gap-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-surface to-ink p-10 transition hover:border-amber-500 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-amber-500 font-display text-3xl text-amber-400">H</span>
                <div>
                  <h3 className="font-display text-2xl font-medium">{hivecard.name}</h3>
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">{hivecard.status}</span>
                </div>
              </div>
              <p className="mt-4 max-w-prose text-slate-300">{hivecard.tagline}</p>
            </div>
            <span className="font-medium text-amber-400 transition group-hover:translate-x-1">Explore the case study →</span>
          </Link>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28 md:px-12">
        <Reveal className="rounded-3xl border border-amber-500/20 bg-surface/40 p-12 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium md:text-4xl">
            More privacy-first apps are on the way.
          </h2>
          <p className="mx-auto mt-4 max-w-prose text-slate-300">Follow along, or tell us what you're building.</p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-amber-500 px-7 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:bg-amber-400"
          >
            Get in touch
          </Link>
        </Reveal>
      </section>
    </>
  )
}
```

- [ ] **Step 2:** `npm run typecheck` clean. Commit:
```
git add src/pages/Home.tsx
git commit -m "feat: build out the full Home page"
```

---

## Task 6: Studio page (full)

**Files:** replace `src/pages/Studio.tsx`.

- [ ] **Step 1:** Replace `src/pages/Studio.tsx` with:
```tsx
import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import Reveal from '../components/Reveal'
import SectionHead from '../components/Section'
import { principles } from '../content/studio'
import { siteMeta } from '../content/site'

export default function Studio() {
  return (
    <>
      <SceneMarker scene="studio" />
      <Meta
        title="Studio"
        description="midybee studio is the home of MIDYBEE SOLUTIONS OPC — a registered Philippine software company building consumer apps that treat your data as yours."
      />

      <section className="px-6 pt-36 pb-20 md:px-12">
        <div className="max-w-3xl page-fade">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">The studio</span>
          <h1 className="mt-6 font-display text-5xl font-medium leading-tight tracking-tight md:text-6xl">
            Small studio,<br /><span className="italic text-amber-400">deliberate</span> craft.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            midybee studio is the home of {siteMeta.legalName} — a registered Philippine software company
            building consumer apps that treat your data as yours. No surveillance, no dark patterns, just
            tools that earn their place on your phone.
          </p>
        </div>
      </section>

      <section className="border-t border-amber-500/10 px-6 py-24 md:px-12">
        <SectionHead tag="Principles" title="How we work." />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-4 font-display text-xl font-medium">{p.title}</h3>
              <p className="mt-2 text-slate-400">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pb-28 md:px-12">
        <Reveal className="flex flex-col items-start gap-4 rounded-2xl border border-slate-800 bg-surface/40 p-8 md:flex-row md:items-center md:gap-8">
          <div className="text-amber-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <p className="text-slate-300">
            {siteMeta.legalName} is registered with the SEC &amp; BIR, Philippines, and based in {siteMeta.location}.
          </p>
        </Reveal>
      </section>
    </>
  )
}
```

- [ ] **Step 2:** `npm run typecheck` clean. Commit:
```
git add src/pages/Studio.tsx
git commit -m "feat: build out the full Studio page"
```

---

## Task 7: Work page (full)

**Files:** replace `src/pages/Work.tsx`.

- [ ] **Step 1:** Replace `src/pages/Work.tsx` with:
```tsx
import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import Reveal from '../components/Reveal'
import SectionHead from '../components/Section'
import { hivecard } from '../content/work'

export default function Work() {
  return (
    <>
      <SceneMarker scene="work" />
      <Meta
        title="Work"
        description="HiveCard — a private, on-device way for Filipinos to take control of their credit cards. No bank logins, no data harvesting."
      />

      <section className="px-6 pt-36 pb-16 md:px-12">
        <div className="max-w-3xl page-fade">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">Case study</span>
          <h1 className="mt-6 flex flex-wrap items-center gap-4 font-display text-5xl font-medium tracking-tight md:text-6xl">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-amber-500 text-4xl text-amber-400">H</span>
            {hivecard.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">{hivecard.status}</span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400">{hivecard.tagline}</span>
          </div>
          <p className="mt-6 text-lg text-slate-300">{hivecard.summary}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={hivecard.site}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-amber-500 px-6 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:bg-amber-400"
            >
              Visit hivecard.ph →
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-amber-500/10 px-6 py-24 md:px-12">
        <SectionHead tag="What it does" title="Take control, privately." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {hivecard.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} className="rounded-2xl border border-slate-800 bg-surface/40 p-7 transition hover:border-amber-500">
              <h3 className="font-display text-lg font-medium text-cream">{f.title}</h3>
              <p className="mt-2 text-slate-400">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pb-28 md:px-12">
        <Reveal className="rounded-3xl border border-dashed border-slate-600 p-10">
          <h3 className="font-display text-2xl font-medium text-slate-300">In the workshop</h3>
          <p className="mt-2 max-w-prose text-slate-500">
            We're building our next privacy-first app. Follow along to be the first to know.
          </p>
        </Reveal>
      </section>
    </>
  )
}
```

- [ ] **Step 2:** `npm run typecheck` clean. Commit:
```
git add src/pages/Work.tsx
git commit -m "feat: build out the full Work / HiveCard case study page"
```

---

## Task 8: Contact page + mailto composer (full)

**Files:** create `src/components/ContactForm.tsx`; replace `src/pages/Contact.tsx`.

- [ ] **Step 1:** `src/components/ContactForm.tsx`:
```tsx
import { useState } from 'react'
import { siteMeta } from '../content/site'

/** Composes a mailto: link from the fields — deliberately collects no data and
 *  hits no backend, so the studio's own site honors the privacy promise. */
export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState('Opens your email app — no data is collected by this site.')

  const send = () => {
    if (!message.trim()) {
      setNote('Please add a short message first.')
      return
    }
    const subject = encodeURIComponent(`midybee inquiry${name ? ' from ' + name : ''}`)
    const body = encodeURIComponent(
      `${message}${email ? '\n\nReply to: ' + email : ''}${name ? '\n— ' + name : ''}`,
    )
    window.location.href = `mailto:${siteMeta.email}?subject=${subject}&body=${body}`
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
      <button
        onClick={send}
        className="mt-5 w-full rounded-full bg-amber-500 py-3 font-medium text-ink transition hover:bg-amber-400"
      >
        Send message
      </button>
      <p className="mt-3 text-sm text-slate-400">{note}</p>
    </div>
  )
}
```

- [ ] **Step 2:** Replace `src/pages/Contact.tsx` with:
```tsx
import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import Reveal from '../components/Reveal'
import ContactForm from '../components/ContactForm'
import { siteMeta } from '../content/site'

export default function Contact() {
  return (
    <>
      <SceneMarker scene="contact" />
      <Meta
        title="Contact"
        description="Press, partnerships, or just curious about what midybee studio is building? Get in touch."
      />

      <section className="px-6 pt-36 pb-28 md:px-12">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="page-fade">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">Get in touch</span>
            <h1 className="mt-6 font-display text-5xl font-medium tracking-tight md:text-6xl">Let's talk.</h1>
            <p className="mt-6 max-w-prose text-lg text-slate-300">
              Press, partnerships, or just curious about what we're building? We'd love to hear from you.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <a href={siteMeta.facebook} target="_blank" rel="noopener" className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-surface/40 p-5 transition hover:border-amber-500 hover:translate-x-1">
                <span className="text-2xl">👍</span>
                <span><b className="block font-medium">Follow on Facebook</b><small className="text-slate-400">News, updates, and behind-the-scenes</small></span>
              </a>
              <a href={`mailto:${siteMeta.email}`} className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-surface/40 p-5 transition hover:border-amber-500 hover:translate-x-1">
                <span className="text-2xl">✉️</span>
                <span><b className="block font-medium">{siteMeta.email}</b><small className="text-slate-400">Business &amp; partnership inquiries</small></span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-surface/40 p-5">
                <span className="text-2xl">📍</span>
                <span><b className="block font-medium">{siteMeta.location}</b><small className="text-slate-400">{siteMeta.legalName}</small></span>
              </div>
            </div>
          </div>

          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3:** `npm run typecheck` clean. Commit:
```
git add src/components/ContactForm.tsx src/pages/Contact.tsx
git commit -m "feat: build out Contact page with mailto composer"
```

---

## Task 9: Wire SmoothScroll + route fade into Layout

**Files:** modify `src/components/Layout.tsx`.

- [ ] **Step 1:** Update `Layout.tsx` to wrap the routed content in `SmoothScroll` and apply a per-route fade keyed on the pathname. New content:
```tsx
import { Suspense, lazy } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import SmoothScroll from '../lib/SmoothScroll'

const SceneCanvas = lazy(() => import('../canvas/SceneCanvas'))

export default function Layout() {
  const location = useLocation()
  return (
    <SmoothScroll>
      <div className="relative flex min-h-screen flex-col bg-ink">
        <div
          className="pointer-events-none fixed inset-0 -z-20"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 75% 25%, rgba(245,158,11,.10), transparent 50%), radial-gradient(circle at 15% 85%, rgba(180,83,9,.08), transparent 45%)',
          }}
        />
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
        <Nav />
        <main key={location.pathname} className="flex-1 page-fade">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
```
> Note: applying `page-fade` on `<main>` keyed by pathname gives a clean content fade on every route change. The page-level `page-fade` on hero divs in the pages still works (double-fade is acceptable / subtle); if it looks off in review, remove the per-page `page-fade` later.

- [ ] **Step 2:** `npm run typecheck` clean. Commit:
```
git add src/components/Layout.tsx
git commit -m "feat: smooth scrolling and per-route content fade"
```

---

## Task 10: Verification

- [ ] **Step 1:** `npm test` → still 11 passing (no tests removed).
- [ ] **Step 2:** `npm run typecheck` → clean.
- [ ] **Step 3:** `npm run build` → exit 0. Verify pre-rendered content for real copy:
  - `dist/index.html` contains `Meet HiveCard` and `Small studio`
  - `dist/studio/index.html` contains `deliberate` and `SEC`
  - `dist/work/index.html` contains `Import in seconds`
  - `dist/contact/index.html` contains `Let's talk`
  - Each page's `<title>` is distinct (grep the `<title>` tag in each `dist/*/index.html`) — confirms per-route Meta works through SSG.
- [ ] **Step 4:** Dev smoke: `npm run dev`, curl `/`, `/studio`, `/work`, `/contact` → all 200; no console errors; stop server.
- [ ] **Step 5:** Report BASE_SHA (Task 1 start) and final HEAD for controller review.

---

## Self-review checklist (controller)
1. **SSG meta:** each `dist/*/index.html` has a distinct `<title>` (proves `vite-react-ssg` `Head` works through pre-render).
2. **Content in DOM:** all real copy is pre-rendered (SEO/accessibility), not injected only client-side.
3. **Reduced motion:** reveals show content immediately; Lenis disabled; no animation.
4. **Reuse/DRY:** principles + HiveCard data come from `src/content/*`, not duplicated across pages.
5. **Privacy:** the contact form composes `mailto:` only — no fetch, no backend, no analytics.

## Deferred to Plan 4 / visual polish
- GSAP-sequenced/staggered hero animations and scroll-linked swarm morphs.
- Shaping the Home swarm into a literal wordmark.
- OG image, favicon/app icons, sitemap/robots (Plan 4).
