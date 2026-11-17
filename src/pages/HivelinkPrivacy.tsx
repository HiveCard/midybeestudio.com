import Meta from '../components/Meta'
import Reveal from '../components/Reveal'
import SectionHead from '../components/Section'
import { siteMeta } from '../content/site'
import {
  hivelinkPrivacyMeta,
  dataCollected,
  neverCollected,
  retention,
  rights,
  thirdParties,
  permissions,
} from '../content/hivelink'

export default function HivelinkPrivacy() {
  return (
    <>
      <Meta
        title="HiveLink privacy policy"
        description="HiveLink shares your location only with your group, only while the ride is on, and keeps no record. Privacy policy by midybee studio."
      />

      <section className="px-6 pt-36 pb-12 md:px-12">
        <div className="max-w-3xl page-fade">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">
            HiveLink · Privacy
          </span>
          <h1 className="mt-6 font-display text-5xl font-medium leading-tight tracking-tight md:text-6xl">
            Privacy policy
          </h1>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-slate-400">
            Last updated · {hivelinkPrivacyMeta.lastUpdated}
          </p>

          <div className="mt-10 rounded-2xl border border-amber-500/30 bg-surface/40 p-7">
            <p className="text-lg leading-relaxed text-cream">
              <strong className="text-amber-400">
                HiveLink shares your location only with your group, only while the ride is on,
                and keeps no record.
              </strong>{' '}
              Nothing is stored after the session ends — not on our servers, and not on your
              phone.
            </p>
          </div>
        </div>
      </section>

      {/* What we collect */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="What we collect" title="And why we need it.">
          HiveLink is a live group minimap for motorcycle and convoy rides. The app can't work
          without sharing your position with your group in real time — so we do that, and
          nothing else.
        </SectionHead>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {dataCollected.map((row, i) => (
            <Reveal
              key={row.what}
              delay={i * 60}
              className="rounded-2xl border border-slate-800 bg-surface/40 p-6 transition hover:border-amber-500"
            >
              <h3 className="font-display text-lg font-medium text-cream">{row.what}</h3>
              {row.whatSub && (
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate-500">
                  {row.whatSub}
                </p>
              )}
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-amber-500">When</dt>
                  <dd className="mt-1 text-slate-300">{row.when}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-amber-500">Why</dt>
                  <dd className="mt-1 text-slate-300">{row.why}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-amber-500">
                    Who sees it
                  </dt>
                  <dd className="mt-1 text-slate-300">{row.whoSees}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 max-w-3xl rounded-2xl border border-dashed border-amber-500/40 p-7">
          <h3 className="font-display text-xl font-medium text-amber-400">What we never collect</h3>
          <ul className="mt-4 space-y-2 text-slate-300">
            {neverCollected.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Retention */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="How long we keep it" title="Short, by design.">
          HiveLink runs no append-only logs server-side. Positions overwrite in place and rooms
          are deleted within a minute of the ride ending.
        </SectionHead>

        <div className="mt-12 max-w-3xl divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-surface/40">
          {retention.map((row) => (
            <div key={row.data} className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
              <dt className="font-display text-lg font-medium text-cream">{row.data}</dt>
              <dd className="text-slate-300">{row.kept}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* Your rights */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="Your rights" title="You stay in control." />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {rights.map((right, i) => (
            <Reveal
              key={right.title}
              delay={i * 70}
              className="rounded-2xl border border-slate-800 bg-surface/40 p-7 transition hover:border-amber-500"
            >
              <h3 className="font-display text-lg font-medium text-cream">{right.title}</h3>
              <p className="mt-2 text-slate-400">{right.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Third parties */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="Third-party services" title="Only when the feature needs them.">
          HiveLink talks to three external services, and only when needed for the feature you’re
          using.
        </SectionHead>

        <div className="mt-12 max-w-3xl space-y-6">
          {thirdParties.map((tp, i) => (
            <Reveal
              key={tp.name}
              delay={i * 70}
              className="rounded-2xl border border-slate-800 bg-surface/40 p-7"
            >
              <h3 className="font-display text-lg font-medium text-cream">{tp.name}</h3>
              <p className="mt-3 text-slate-300">{tp.purpose}</p>
              <p className="mt-2 text-sm text-slate-400">{tp.dataSent}</p>
              {tp.policyUrl && (
                <a
                  href={tp.policyUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
                >
                  Their privacy policy →
                </a>
              )}
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-slate-400">
          Neither Google Maps nor Overpass is an analytics beacon — they’re data pulls, not
          pushes. But both see region-level location by the nature of what they do.
        </p>
      </section>

      {/* Security */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="Security" title="What keeps the promise true.">
          Our “no history” promise rests on specific engineering choices, not good intentions.
        </SectionHead>

        <ul className="mt-12 max-w-3xl space-y-4 text-slate-300">
          <li className="flex gap-3">
            <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-amber-500" />
            <span>All data moves over TLS (HTTPS). Firebase SDK enforces this.</span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-amber-500" />
            <span>
              Positions in Firebase overwrite in place. There is no append-only log anywhere
              server-side — ever.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-amber-500" />
            <span>
              Rooms are deleted by two independent purge paths: a trigger that fires when the
              session ends, and a scheduled sweep that cleans orphans every 10 minutes.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-amber-500" />
            <span>
              Writes are schema-validated server-side: GPS coordinates must be in range,
              timestamps within ±60 s of server time, one write per second per user.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-amber-500" />
            <span>
              No analytics or crash SDK ever receives coordinates, session codes, or display
              names.
            </span>
          </li>
        </ul>
      </section>

      {/* Permissions */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="Permissions" title="In plain English." />

        <div className="mt-12 max-w-3xl divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-surface/40">
          {permissions.map((perm) => (
            <div key={perm.title} className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
              <dt className="font-display text-lg font-medium text-cream">{perm.title}</dt>
              <dd className="text-slate-300">{perm.body}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* Children + changes + contact */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber-500">
              Children
            </span>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">
              Not for kids.
            </h2>
            <p className="mt-4 text-slate-300">
              HiveLink isn’t directed at children. We don’t knowingly collect data from anyone
              under 13 (or the local age of digital consent). If you believe a child has used
              HiveLink, contact us and we’ll help purge their anonymous session data.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber-500">
              Changes
            </span>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">
              Updates to this policy.
            </h2>
            <p className="mt-4 text-slate-300">
              We’ll post updates here with a new “Last updated” date. Material changes (new data
              types, new third parties, retention changes) get a visible in-app heads-up before
              taking effect.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact / controller */}
      <section className="border-t border-amber-500/10 px-6 pb-28 pt-20 md:px-12">
        <Reveal className="mx-auto max-w-3xl rounded-3xl border border-amber-500/30 bg-surface/40 p-10">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber-500">
            Contact
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">
            Questions, deletion requests, or anything privacy-related.
          </h2>
          <p className="mt-6 text-slate-300">
            Data controller: <strong className="text-cream">{hivelinkPrivacyMeta.dataController}</strong> ·{' '}
            {hivelinkPrivacyMeta.dataControllerLocation}
          </p>
          <p className="mt-2 text-slate-300">App package: <code className="font-mono text-sm text-amber-400">{hivelinkPrivacyMeta.packageName}</code></p>
          <a
            href={`mailto:${hivelinkPrivacyMeta.contactEmail}`}
            className="mt-8 inline-block rounded-full bg-amber-500 px-6 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:bg-amber-400"
          >
            {hivelinkPrivacyMeta.contactEmail} →
          </a>
          <p className="mt-6 text-sm text-slate-500">
            See also: <a className="text-amber-400 hover:text-amber-300" href={siteMeta.url}>midybeestudio.com</a>
          </p>
        </Reveal>
      </section>
    </>
  )
}
