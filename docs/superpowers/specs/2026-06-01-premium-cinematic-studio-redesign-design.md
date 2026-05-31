# midybee studio — Premium Cinematic Studio Site (Design Spec)

**Date:** 2026-06-01
**Status:** Approved (design); pending implementation plan
**Repo:** `HiveCard/midybeestudio.com` → deploys to `midybeestudio.com` (GitHub Pages)

---

## 1. Goal

Rebuild `midybeestudio.com` into a **world-class, premium studio site** whose primary job is **studio brand prestige** — making midybee studio (MIDYBEE SOLUTIONS OPC) look like an elite, intentional maker of software. The design itself is the product: it must impress on craft, motion, and polish.

This replaces the current single self-contained `index.html` landing page.

## 2. Brief (decisions locked during brainstorming)

| Decision | Choice |
| --- | --- |
| Primary goal | Studio brand prestige (portfolio-grade, makes the studio look elite) |
| Aesthetic vibe | **Dark & cinematic** — deep ink, glowing amber light, thin elegant type, rich motion |
| Brand palette | Keep the warm **amber / honey** DNA (ownable, nods to "bee" without being literal) |
| Scope | **Full studio site, 4 pages:** Home · Studio · Work · Contact |
| Motion ambition | **Rich WebGL throughout**, with reduced-motion + low-power fallbacks |
| Build tooling | A build step is allowed (no longer a single static file) |
| Architecture | **React + React Three Fiber, persistent full-screen canvas** behind client-routed pages |
| Signature motif | **The Swarm** (see §4) — chosen specifically to stay category-agnostic |

### Key brand insight driving the motif

The studio will ship apps in **multiple categories**, not just HiveCard. A honeycomb/hive motif would brand the whole studio as "the hive company" and pigeonhole future products. Therefore the studio's signature visual must be **category-agnostic**. We keep amber as the palette but drop honeycomb as the geometry. Honeycomb may survive only as a small detail *inside* the HiveCard section on `/work`.

## 3. Information architecture

A persistent WebGL canvas lives behind all routes; the scene morphs as the user navigates, so the site feels like one continuous cinematic space. **All textual content lives in the DOM** (over the canvas), never inside WebGL — for accessibility, SEO, and resilience.

### `/` — Home (the immersive showcase)
- Full-bleed cinematic hero: The Swarm + headline "We build privacy-first apps people can trust."
- Scroll-revealed ethos strip: Privacy by default · Built for the PH · Craft over scale
- Featured work: cinematic HiveCard spotlight
- "More on the way" teaser → CTA into Contact

### `/studio` — Studio (credibility & soul)
- Story: solo-led, deliberate craft, Olongapo · MIDYBEE SOLUTIONS OPC
- The three principles, told with depth (not just cards)
- How we work / philosophy
- Trust line: registered with SEC & BIR, Philippines

### `/work` — Work (the portfolio)
- HiveCard presented as a case study: the problem, the approach, features (PDF statement import from 10+ PH banks, smart payment plans, debt-free date, on-device privacy), links to hivecard.ph + Google Play
- Future projects placeholder, framed as "in the workshop"
- Optional small honeycomb detail here only

### `/contact` — Contact
- Press / partnership / hello framing
- Email `hello@midybee.com`, Facebook (`facebook.com/HiveCardApp`), Olongapo location
- Contact form kept as a **mailto composer** — deliberately collects no data (extends the privacy promise to the studio's own site)

### Global
- Cinematic sticky nav: brand + 4 links + "Follow" CTA
- Footer: legal/registration (© MIDYBEE SOLUTIONS OPC, SEC & BIR registered)
- Reduced-motion / no-WebGL users get a static-but-gorgeous version of every page

## 4. Signature motif — "The Swarm"

A swarm of golden light points (an abstract nod to *midybee* → bees) drifts in a dark volumetric space and **assembles into a different form per page and per app**:

- **Home:** vast drifting field that resolves into a wordmark / signature form
- **Studio:** the swarm tightens into ordered structure (a visual metaphor for craft)
- **Work:** the field converges into a single glowing form cradling HiveCard; for each future app it forms that product instead
- **Contact:** everything slows to a calm, sparse drift

**Why this motif:** it is category-agnostic (solves the multi-app problem), on-story ("a studio that builds many things"), motion-rich (ideal for WebGL), and retains brand DNA (bee + amber) without locking into HiveCard.

Render treatment: additive-blended glowing particles, bloom post-processing, depth-of-field/fog, cursor reactivity.

## 5. Visual system

**Palette**
- Ink base `#0a0807`; raised surface `#1a1410`
- Amber ramp: `#b45309` (700) · `#f59e0b` (500) · `#fbbf24` (400) · `#fcd34d` (300)
- Cream `#fffbeb` for text
- Muted slate greys for secondary text

**Typography**
- **Fraunces** — display (high-contrast, soulful serif; italic for accent words like *trust*)
- **Outfit** — body, light weights, for an airy cinematic feel
- **JetBrains Mono** — small uppercase labels/eyebrows, for a "studio engineering precision" signal

**Motion language**
- Smooth inertia scrolling (Lenis)
- Scroll drives the swarm — it morphs scene to scene (GSAP ScrollTrigger)
- Masked line-rise text reveals
- Cursor-reactive particles; magnetic buttons
- Page transitions = the swarm reassembles, no hard cuts
- `prefers-reduced-motion` → elegant static frames

## 6. Technical architecture

**Stack:** Vite + React + TypeScript · React Three Fiber + drei + postprocessing · Lenis + GSAP ScrollTrigger · Tailwind (with a token layer mapping the palette/fonts) · Zustand (shared scene store).

**Persistent-canvas pattern (core idea):** one `<Canvas>` is fixed full-screen behind everything. React Router swaps the four routes *over* it. Each route updates the Zustand store with a target scene; the swarm animates toward that formation. The 3D never unmounts → seamless transitions, no reload flash.

**Project shape (indicative):**
- `src/canvas/` — `<SceneCanvas>`, `<Swarm>`, shaders, post-processing
- `src/store/` — Zustand scene store (current target, perf tier, reduced-motion)
- `src/pages/` — Home, Studio, Work, Contact (DOM content + scene directives)
- `src/components/` — Nav, Footer, reveal/text primitives, magnetic button
- `src/styles/` — Tailwind config + design tokens
- `src/content/` — copy + work data (so future apps are data entries, not new code)

## 7. Performance budget

- Auto-detect device power (drei `PerformanceMonitor`) → scale particle count, cap pixel ratio (DPR), drop bloom on weak/mobile GPUs
- Pause rendering when tab hidden or canvas off-screen
- Targets: 60fps desktop, smoothly degraded on mid-range Android, healthy Lighthouse scores

## 8. Accessibility & resilience (progressive enhancement)

- All real content in the DOM, not the canvas → readable, selectable, indexable, works if WebGL fails
- `prefers-reduced-motion` → static frame, no autoplay motion
- Semantic HTML, keyboard navigation, visible focus states, alt text throughout
- Color contrast meets WCAG AA for text

## 9. Deploy & SEO

- **Pre-render each of the 4 routes to its own static HTML** (e.g. `vite-react-ssg`) → real first paint, working deep links, full SEO; React hydrates and WebGL lazy-loads on top
- **GitHub Actions** builds and publishes to GitHub Pages
- **`CNAME` (midybeestudio.com) preserved**
- Per-route `<title>`/meta description; Open Graph/Twitter cards; favicon/app icons
- The contact form is a mailto composer — no backend, no data collected

## 10. Content & migration

- Replace the current single `index.html` with the new build output
- Preserve existing copy intent and these facts: company MIDYBEE SOLUTIONS OPC, Olongapo PH; SEC & BIR registered; flagship HiveCard (live on Google Play, hivecard.ph); contact `hello@midybee.com`; Facebook `facebook.com/HiveCardApp`
- Source HiveCard imagery (screenshots/marks) for the Work case study
- Keep `.gitignore` (`.superpowers/`)

## 11. Quality / testing

- TypeScript + ESLint + Prettier
- **Vitest** for logic (store transitions, perf-tier selection, content helpers)
- **Playwright** smoke tests: each route renders, nav works, reduced-motion path holds, no-WebGL fallback renders content
- Optional Lighthouse budget in CI
- Manual visual verification of the running app before merge

## 12. Risks & tensions

- **Heavy WebGL vs SEO/first-paint** — mitigated by pre-render + DOM content + lazy 3D; this is the highest-care part of the build.
- **Mobile GPU performance** — mitigated by the performance budget / tiered effects.
- **Solo maintenance load** — R3F's declarative model and data-driven content (apps as data entries) keep ongoing cost down.

## 13. Out of scope (YAGNI)

- No CMS / backend / database
- No real contact-form submission (mailto only, by design)
- No blog, auth, analytics, or e-commerce
- No separate per-future-app pages yet — future apps are data entries surfaced on `/work` until one warrants its own page

## 14. Open questions for planning

1. HiveCard case-study assets — which screenshots/marks, and from where?
2. Any additional copy rewrites for the cinematic tone, or keep current messaging largely intact?
3. Exact wordmark/logo form the Home swarm resolves into.
