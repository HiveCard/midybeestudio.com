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
