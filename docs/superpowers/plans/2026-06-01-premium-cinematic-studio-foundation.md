# Premium Cinematic Studio — Plan 1: Foundation & Deploy

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the React + Vite + TypeScript + Tailwind v4 foundation for midybeestudio.com — design tokens, self-hosted fonts, four pre-rendered routes, shared nav/footer, a passing test harness, and an automated GitHub Pages deploy — replacing the legacy single-file `index.html`.

**Architecture:** A statically pre-rendered React app. `vite-react-ssg` renders each of the four routes to its own HTML file (real first paint, working deep links, SEO), then React hydrates. Tailwind v4 holds the design system as CSS-first tokens. GitHub Actions builds `dist/` and publishes it to GitHub Pages on push to `main`. This plan deliberately ships **no WebGL yet** — it proves the skeleton deploys and looks on-brand. The persistent canvas and The Swarm arrive in Plan 2.

**Tech Stack:** Vite 6, React 19, TypeScript 5, react-router-dom 7, vite-react-ssg, Tailwind CSS v4 (`@tailwindcss/vite`), @fontsource-variable (Fraunces / Outfit / JetBrains Mono), Zustand (installed now, used in Plan 2), Vitest + Testing Library.

**Reference spec:** `docs/superpowers/specs/2026-06-01-premium-cinematic-studio-redesign-design.md`

---

## File structure (created by this plan)

```
package.json               # scripts + deps
index.html                 # Vite entry (replaces legacy site)
vite.config.ts             # React + Tailwind plugins + Vitest config
tsconfig.json              # app TS config
tsconfig.node.json         # tooling TS config
.github/workflows/deploy.yml   # build + deploy to Pages
public/CNAME               # midybeestudio.com (Pages custom domain)
public/404.html            # SPA fallback safety net
src/main.tsx               # vite-react-ssg entry
src/routes.tsx             # route table (Layout + 4 pages)
src/styles/index.css       # Tailwind import + @theme tokens + fonts
src/content/site.ts        # nav links + site metadata (single source of truth)
src/components/Layout.tsx  # Nav + <Outlet/> + Footer
src/components/Nav.tsx      # sticky cinematic nav
src/components/Footer.tsx  # legal/registration footer
src/pages/Home.tsx         # hero shell
src/pages/Studio.tsx       # stub heading
src/pages/Work.tsx         # stub heading
src/pages/Contact.tsx      # stub heading
src/test/setup.ts          # Testing Library matchers
src/content/site.test.ts   # unit test (TDD harness)
```

Legacy `index.html` content remains recoverable via git history (commit `2c0cd40` and earlier).

---

## Task 1: Create package.json and install dependencies

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "midybeestudio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite-react-ssg build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 2: Install runtime dependencies**

Run:
```bash
npm install react@^19 react-dom@^19 react-router-dom@^6 zustand@^5 \
  @fontsource-variable/fraunces @fontsource-variable/outfit @fontsource-variable/jetbrains-mono
```
Expected: installs without peer-dependency errors; `node_modules/` and `package-lock.json` created.

> **Note:** `react-router-dom@^6` (not 7) — `vite-react-ssg` declares react-router-dom 6 as its peer. The components in this plan use only `Link`, `NavLink`, `Outlet`, and route objects, which are identical across v6/v7, so the version choice is invisible to the code. The dev-dependency install below should resolve `vite-react-ssg` to a version whose react-router peer is satisfied **without** `--legacy-peer-deps`.

- [ ] **Step 3: Install dev dependencies**

Run:
```bash
npm install -D vite@^6 @vitejs/plugin-react@^4 typescript@^5 \
  @types/react@^19 @types/react-dom@^19 \
  tailwindcss@^4 @tailwindcss/vite@^4 \
  vite-react-ssg@^0.9.0 \
  vitest@^3 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```
Expected: installs cleanly.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: initialize package.json and dependencies"
```

---

## Task 2: TypeScript and Vite configuration

**Files:**
- Create: `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`

- [ ] **Step 1: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 2: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 3: Create `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  // vite-react-ssg: emit nested dir-per-route (studio/index.html) for robust
  // clean-URL deep links on GitHub Pages. Default is 'flat' (studio.html).
  ssgOptions: {
    dirStyle: 'nested',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

> **Note:** `ssgOptions` is contributed to Vite's `UserConfig` by a module augmentation in `vite-react-ssg`. The `npm run typecheck` gate compiles only `src` (per `tsconfig.json`), so it does not type-check `vite.config.ts`; the option is consumed at build time by `vite-react-ssg build`.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json tsconfig.node.json vite.config.ts
git commit -m "chore: add TypeScript and Vite configuration"
```

---

## Task 3: Design tokens, fonts, and the HTML entry

**Files:**
- Create: `src/styles/index.css`, `index.html`

- [ ] **Step 1: Create `src/styles/index.css`**

Tailwind v4 is CSS-first: the `@theme` block defines tokens that become utilities (`bg-ink`, `text-cream`, `font-display`, `text-amber-500`, etc.). Fonts are self-hosted via fontsource — no Google CDN, which keeps the privacy promise on the studio's own site.

```css
@import "tailwindcss";
@import "@fontsource-variable/fraunces";
@import "@fontsource-variable/outfit";
@import "@fontsource-variable/jetbrains-mono";

@theme {
  --color-ink: #0a0807;
  --color-surface: #1a1410;
  --color-amber-700: #b45309;
  --color-amber-500: #f59e0b;
  --color-amber-400: #fbbf24;
  --color-amber-300: #fcd34d;
  --color-cream: #fffbeb;
  --color-slate-300: #cbd5e1;
  --color-slate-400: #94a3b8;

  --font-display: "Fraunces Variable", Georgia, serif;
  --font-body: "Outfit Variable", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;
}

:root { color-scheme: dark; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--color-ink);
  color: var(--color-cream);
  font-family: var(--font-body);
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
}

::selection { background: var(--color-amber-400); color: var(--color-ink); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 2: Create `index.html`** (overwrites the legacy single-file site)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>midybee studio — privacy-first apps, built in the Philippines</title>
    <meta name="description" content="midybee studio is an independent software studio in Olongapo, Philippines, building privacy-first apps. Maker of HiveCard." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/index.css index.html
git commit -m "feat: add design tokens, self-hosted fonts, and HTML entry"
```

---

## Task 4: Site config module (TDD)

The one piece of real logic in Foundation: a single source of truth for nav links and site metadata. We write it test-first to establish the Vitest harness everything later relies on.

**Files:**
- Create: `src/test/setup.ts`
- Test: `src/content/site.test.ts`
- Create: `src/content/site.ts`

- [ ] **Step 1: Create the test setup file**

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 2: Write the failing test**

`src/content/site.test.ts`:
```ts
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
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/content/site.test.ts`
Expected: FAIL — `Failed to resolve import "./site"` (module does not exist yet).

- [ ] **Step 4: Write the minimal implementation**

`src/content/site.ts`:
```ts
export interface NavLink {
  label: string
  path: string
}

export const navLinks: NavLink[] = [
  { label: 'Studio', path: '/studio' },
  { label: 'Work', path: '/work' },
  { label: 'Contact', path: '/contact' },
]

export const siteMeta = {
  name: 'midybee studio',
  legalName: 'MIDYBEE SOLUTIONS OPC',
  domain: 'midybeestudio.com',
  location: 'Olongapo, Philippines',
  email: 'hello@midybee.com',
  facebook: 'https://www.facebook.com/HiveCardApp',
} as const
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/content/site.test.ts`
Expected: PASS (3 passing).

- [ ] **Step 6: Commit**

```bash
git add src/test/setup.ts src/content/site.ts src/content/site.test.ts
git commit -m "feat: add site config module with tests"
```

---

## Task 5: Shared Nav and Footer components

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Footer.tsx`

- [ ] **Step 1: Create `src/components/Nav.tsx`**

```tsx
import { NavLink as RouterLink, Link } from 'react-router-dom'
import { navLinks, siteMeta } from '../content/site'

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-amber-500/10 bg-ink/60 px-6 py-4 backdrop-blur-md md:px-12">
      <Link to="/" className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-amber-500 font-display text-xl text-amber-400">
          m
        </span>
        <span className="flex flex-col leading-tight">
          <b className="font-medium">midybee</b>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-amber-500">studio</span>
        </span>
      </Link>
      <div className="flex items-center gap-8 text-sm">
        {navLinks.map((link) => (
          <RouterLink
            key={link.path}
            to={link.path}
            className="hidden text-slate-300 transition-colors hover:text-amber-400 md:inline"
          >
            {link.label}
          </RouterLink>
        ))}
        <a
          href={siteMeta.facebook}
          target="_blank"
          rel="noopener"
          className="rounded-full border border-amber-500 px-4 py-1.5 text-amber-400 transition-colors hover:bg-amber-500 hover:text-ink"
        >
          Follow
        </a>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create `src/components/Footer.tsx`**

```tsx
import { siteMeta } from '../content/site'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-amber-500/10 px-6 py-12 md:px-12">
      <div className="flex flex-col justify-between gap-4 text-sm text-slate-400 md:flex-row">
        <span className="max-w-prose leading-relaxed">
          © {year} {siteMeta.legalName}. Registered with the SEC &amp; BIR, Philippines. Built with care in {siteMeta.location}.
        </span>
        <span className="font-mono uppercase tracking-widest">Privacy-first apps · 🇵🇭</span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Verify it typechecks**

Run: `npm run typecheck`
Expected: no errors. (Imports resolve; components are valid TSX.)

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.tsx src/components/Footer.tsx
git commit -m "feat: add shared Nav and Footer components"
```

---

## Task 6: Layout, pages, and routes

**Files:**
- Create: `src/components/Layout.tsx`, `src/pages/Home.tsx`, `src/pages/Studio.tsx`, `src/pages/Work.tsx`, `src/pages/Contact.tsx`, `src/routes.tsx`, `src/main.tsx`

- [ ] **Step 1: Create `src/components/Layout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Create `src/pages/Home.tsx`** (hero shell — proves the design system on screen)

```tsx
export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center px-6 pt-32 pb-16 md:px-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 78% 30%, rgba(245,158,11,.18), transparent 45%), radial-gradient(circle at 12% 80%, rgba(251,191,36,.08), transparent 40%)',
        }}
      />
      <div className="max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">
          Independent software studio · Olongapo, PH
        </span>
        <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">
          We build <span className="italic text-amber-400">privacy-first</span> apps people can trust.
        </h1>
        <p className="mt-6 max-w-prose text-lg text-slate-300">
          A solo-led studio crafting thoughtful, privacy-respecting software for the Philippine market
          and the Filipino diaspora.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create the three stub pages**

`src/pages/Studio.tsx`:
```tsx
export default function Studio() {
  return (
    <section className="px-6 pt-32 pb-16 md:px-12">
      <h1 className="font-display text-5xl font-medium tracking-tight">Studio</h1>
      <p className="mt-4 max-w-prose text-slate-300">Small studio, deliberate craft. (Full content in Plan 3.)</p>
    </section>
  )
}
```

`src/pages/Work.tsx`:
```tsx
export default function Work() {
  return (
    <section className="px-6 pt-32 pb-16 md:px-12">
      <h1 className="font-display text-5xl font-medium tracking-tight">Work</h1>
      <p className="mt-4 max-w-prose text-slate-300">Meet HiveCard. (Full case study in Plan 3.)</p>
    </section>
  )
}
```

`src/pages/Contact.tsx`:
```tsx
export default function Contact() {
  return (
    <section className="px-6 pt-32 pb-16 md:px-12">
      <h1 className="font-display text-5xl font-medium tracking-tight">Contact</h1>
      <p className="mt-4 max-w-prose text-slate-300">Let's talk. (Full contact experience in Plan 3.)</p>
    </section>
  )
}
```

- [ ] **Step 4: Create `src/routes.tsx`**

```tsx
import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Work from './pages/Work'
import Contact from './pages/Contact'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'studio', element: <Studio /> },
      { path: 'work', element: <Work /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
]
```

- [ ] **Step 5: Create `src/main.tsx`** (vite-react-ssg entry)

```tsx
import './styles/index.css'
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'

export const createRoot = ViteReactSSG({ routes })
```

- [ ] **Step 6: Run the dev server and verify**

Run: `npm run dev`
Then visit `http://localhost:5173/`, `/studio`, `/work`, `/contact`.
Expected: dark amber-glow hero on Home; nav + footer on every page; nav links route without full reload; fonts render (serif headline, mono eyebrow). Stop the server (Ctrl-C) when confirmed.

- [ ] **Step 7: Commit**

```bash
git add src/components/Layout.tsx src/pages src/routes.tsx src/main.tsx
git commit -m "feat: add layout, pages, and client routing"
```

---

## Task 7: Static pre-render build + Pages assets

**Files:**
- Create: `public/CNAME`, `public/404.html`
- Delete: root `CNAME` (moves into `public/` so it ships in `dist/`)

- [ ] **Step 1: Move the custom-domain file into `public/`**

Run:
```bash
git rm CNAME
```
Create `public/CNAME` (single line, no trailing content):
```
midybeestudio.com
```

- [ ] **Step 2: Create `public/404.html`** (safety net; SSG already emits real route files)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=/" />
    <title>Redirecting…</title>
  </head>
  <body>
    <p>Redirecting to <a href="/">midybeestudio.com</a>…</p>
  </body>
</html>
```

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build succeeds and `dist/` contains nested pre-rendered route files (because of `ssgOptions.dirStyle: 'nested'`):
```
dist/index.html
dist/studio/index.html
dist/work/index.html
dist/contact/index.html
dist/CNAME
dist/404.html
dist/assets/...
```

- [ ] **Step 4: Verify pre-rendered HTML contains real content (not an empty shell)**

Run: `npx serve dist` (or `npm run preview`) and load `/studio` directly.
Expected: View-source of `dist/studio/index.html` shows the literal text "Studio" in the markup — confirming SSG produced real first-paint HTML, so deep links and SEO work.

- [ ] **Step 5: Commit**

```bash
git add public/CNAME public/404.html
git commit -m "feat: add Pages custom-domain and 404 assets; pre-render build verified"
```

---

## Task 8: GitHub Actions deploy + repo hygiene

**Files:**
- Create: `.github/workflows/deploy.yml`, `.gitignore` (extend)
- Modify: `CLAUDE.md`

- [ ] **Step 1: Extend `.gitignore`** (it currently only ignores `.superpowers/`)

Replace the contents of `.gitignore` with:
```
.superpowers/
node_modules/
dist/
*.local
.DS_Store
```

- [ ] **Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Update `CLAUDE.md`** to reflect the new architecture

Replace the body of `CLAUDE.md` (keep the required `# CLAUDE.md` header block) with guidance describing the new stack. Use this content after the standard header:

```markdown
## What this is

The marketing/studio site for **midybee studio** (MIDYBEE SOLUTIONS OPC, Olongapo, Philippines), maker of **HiveCard**. A statically pre-rendered React app — **not** a hand-edited HTML file anymore (that was the pre-2026-06 version, in git history).

## Commands

- `npm run dev` — local dev server (Vite) at http://localhost:5173
- `npm test` — run the Vitest suite once; `npm run test:watch` to watch
- `npm run typecheck` — TypeScript, no emit
- `npm run build` — pre-render all routes to `dist/` via `vite-react-ssg`
- `npm run preview` — serve the built `dist/` locally

Run a single test: `npm test -- src/path/to/file.test.ts`

## Architecture

- **Pre-rendering:** `vite-react-ssg` renders each route in `src/routes.tsx` to its own HTML file, so deep links and SEO work; React hydrates on load. Keep all real text content in the DOM (never only inside WebGL) for accessibility and indexing.
- **Design system:** Tailwind v4, CSS-first. Tokens live in the `@theme` block of `src/styles/index.css` (`--color-ink`, the `--color-amber-*` ramp, `--font-display/body/mono`). Use the generated utilities (`bg-ink`, `text-amber-500`, `font-display`) — don't hardcode hex or font names in components.
- **Fonts** are self-hosted via `@fontsource-variable/*` (no Google CDN) — a deliberate privacy choice that matches the brand.
- **Single source of truth** for nav + studio facts is `src/content/site.ts`. Add a nav item there, not in `Nav.tsx`.
- **Routing/layout:** `src/components/Layout.tsx` wraps every page with `Nav` + `Footer` via `<Outlet/>`.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs tests, builds `dist/`, and publishes to GitHub Pages. **Repo Settings → Pages → Source must be set to "GitHub Actions"** (one-time manual step). The custom domain comes from `public/CNAME` (`midybeestudio.com`), which ships inside `dist/`.

## Roadmap

This site is being built in phases (see `docs/superpowers/specs/` and `docs/superpowers/plans/`): Plan 1 foundation (done), Plan 2 persistent WebGL canvas + "The Swarm" motif, Plan 3 full page content + transitions, Plan 4 polish/SEO/test hardening.
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore .github/workflows/deploy.yml CLAUDE.md
git commit -m "ci: add GitHub Pages deploy workflow; update CLAUDE.md and gitignore"
```

- [ ] **Step 5: One-time manual step (human, not scriptable)**

In the GitHub repo: **Settings → Pages → Build and deployment → Source → "GitHub Actions"**. (Until this is set, the workflow runs but Pages keeps serving the old branch-based build.) Note this in the PR description so it isn't forgotten.

---

## Final verification (run before declaring Plan 1 done)

- [ ] `npm test` → all green
- [ ] `npm run typecheck` → no errors
- [ ] `npm run build` → `dist/` has `index.html`, `studio/index.html`, `work/index.html`, `contact/index.html`, `CNAME`, `404.html`
- [ ] `npm run preview` → all four routes load, nav/footer present, deep-linking to `/work` works, hero looks on-brand (dark + amber glow + serif headline)
- [ ] Legacy `index.html` is gone from the working tree (replaced by the Vite entry), recoverable from git history

---

## Roadmap: subsequent plans (written in detail when their turn comes)

**Plan 2 — Persistent canvas & "The Swarm".** Add a fixed full-screen `<Canvas>` (React Three Fiber + drei + postprocessing) behind the routed content; a Zustand scene store (`src/store/scene.ts`) holding the current target formation + performance tier + reduced-motion flag; the particle Swarm with bloom, depth fog, and cursor reactivity; per-route scene targets; `PerformanceMonitor`-driven tiering (particle count, DPR cap, bloom toggle) and a static fallback frame for reduced-motion / no-WebGL. *Open question to resolve here: what form the Home swarm resolves into — default assumption is the "m" midybee monogram unless decided otherwise.*

**Plan 3 — Full page content & transitions.** Real content for all four pages (Studio story + principles + trust line; Work HiveCard case study; Contact mailto composer); Lenis smooth scroll + GSAP ScrollTrigger reveals and scroll-driven swarm morphs; swarm-reassembly page transitions; per-route `<title>`/meta. *Open questions to resolve here: HiveCard imagery source, and whether to rewrite copy for the cinematic tone or keep current messaging.*

**Plan 4 — Polish, SEO & test hardening.** Open Graph/Twitter cards, favicon/app icons, sitemap/robots; full reduced-motion + low-power QA; Playwright smoke tests (each route renders, nav works, fallbacks hold); optional Lighthouse budget in CI; cross-device/mobile performance pass.
```

