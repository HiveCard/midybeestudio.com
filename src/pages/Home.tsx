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
