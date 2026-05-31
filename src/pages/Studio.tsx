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
