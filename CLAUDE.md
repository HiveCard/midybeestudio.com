# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

- **Pre-rendering:** `vite-react-ssg` renders each route in `src/routes.tsx` to its own nested HTML file (`dist/studio/index.html`), so deep links and SEO work; React hydrates on load. Keep all real text content in the DOM (never only inside WebGL) for accessibility and indexing.
- **Design system:** Tailwind v4, CSS-first. Tokens live in the `@theme` block of `src/styles/index.css` (`--color-ink`, the `--color-amber-*` ramp, `--font-display/body/mono`). Use the generated utilities (`bg-ink`, `text-amber-500`, `font-display`) — don't hardcode hex or font names in components.
- **Fonts** are self-hosted via `@fontsource-variable/*` (no Google CDN) — a deliberate privacy choice that matches the brand.
- **Single source of truth** for nav + studio facts is `src/content/site.ts`. Add a nav item there, not in `Nav.tsx`.
- **Routing/layout:** `src/components/Layout.tsx` wraps every page with `Nav` + `Footer` via `<Outlet/>`.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs tests, builds `dist/`, and publishes to GitHub Pages. **Repo Settings → Pages → Source must be set to "GitHub Actions"** (one-time manual step). The custom domain comes from `public/CNAME` (`midybeestudio.com`), which ships inside `dist/`.

## Roadmap

This site is being built in phases (see `docs/superpowers/specs/` and `docs/superpowers/plans/`): Plan 1 foundation (done), Plan 2 persistent WebGL canvas + "The Swarm" motif, Plan 3 full page content + transitions, Plan 4 polish/SEO/test hardening.
