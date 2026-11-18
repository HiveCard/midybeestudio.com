import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import Reveal from '../components/Reveal'
import SectionHead from '../components/Section'
import { hivelink } from '../content/work'

export default function HivelinkProduct() {
  return (
    <>
      <SceneMarker scene="work" />
      <Meta
        title={hivelink.name}
        description={hivelink.summary}
      />

      {/* Hero */}
      <section className="px-6 pt-36 pb-16 md:px-12">
        <div className="max-w-3xl page-fade">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">
            Product
          </span>
          <h1 className="mt-6 flex flex-wrap items-center gap-4 font-display text-5xl font-medium tracking-tight md:text-6xl">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-amber-500 text-4xl text-amber-400">
              H
            </span>
            {hivelink.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
              {hivelink.status}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-amber-400">{hivelink.tagline}</span>
          </div>
          <p className="mt-6 text-lg text-slate-300">{hivelink.summary}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            {hivelink.playStoreUrl ? (
              <a
                href={hivelink.playStoreUrl}
                target="_blank"
                rel="noopener"
                className="rounded-full bg-amber-500 px-6 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:bg-amber-400"
              >
                Install on Google Play →
              </a>
            ) : (
              <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/5 px-6 py-3 font-mono text-xs uppercase tracking-widest text-amber-300">
                Private beta · invite only
              </span>
            )}
            <a
              href="/hivelink/privacy/"
              className="rounded-full border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:-translate-y-0.5 hover:border-amber-500 hover:text-amber-400"
            >
              Privacy policy
            </a>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section className="border-t border-amber-500/10 px-6 py-24 md:px-12">
        <SectionHead tag="What it does" title="Ride together. Arrive together." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {hivelink.features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 70}
              className="rounded-2xl border border-slate-800 bg-surface/40 p-7 transition hover:border-amber-500"
            >
              <h3 className="font-display text-lg font-medium text-cream">{f.title}</h3>
              <p className="mt-2 text-slate-400">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Private by design */}
      <section className="border-t border-amber-500/10 px-6 py-24 md:px-12">
        <SectionHead tag="Private by design" title="Rules we don't break.">
          HiveLink shares your location with your group because the product
          needs it to work — and nothing else. Every design choice follows
          these constraints.
        </SectionHead>
        <div className="mt-12 max-w-3xl space-y-4">
          {hivelink.privacyPromises.map((p, i) => (
            <Reveal
              key={p}
              delay={i * 60}
              className="flex gap-4 rounded-2xl border border-slate-800 bg-surface/40 p-6"
            >
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-amber-500"
              />
              <p className="text-slate-300">{p}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-slate-400">
          Full details in the{' '}
          <a href="/hivelink/privacy/" className="text-amber-400 hover:text-amber-300">
            privacy policy
          </a>
          . Want your data deleted?{' '}
          <a
            href="/hivelink/data-deletion/"
            className="text-amber-400 hover:text-amber-300"
          >
            Here's how
          </a>
          .
        </p>
      </section>

      {/* Join the test */}
      <section className="px-6 pb-28 pt-24 md:px-12">
        <Reveal className="mx-auto max-w-3xl rounded-3xl border border-dashed border-slate-600 p-10">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber-500">
            Field test
          </span>
          <h3 className="mt-3 font-display text-3xl font-medium tracking-tight">
            Want on the next Saturday ride?
          </h3>
          <p className="mt-4 max-w-prose text-slate-300">
            We're field-testing HiveLink with motorcycle convoys in the
            Philippines before opening public install. Tell us your bike, your
            usual riding group size, and roughly where you ride, and we'll send
            you an invite.
          </p>
          <a
            href="mailto:walbarda@midybeestudio.com?subject=HiveLink%20field%20test"
            className="mt-8 inline-block rounded-full bg-amber-500 px-6 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:bg-amber-400"
          >
            Request an invite →
          </a>
        </Reveal>
      </section>
    </>
  )
}
