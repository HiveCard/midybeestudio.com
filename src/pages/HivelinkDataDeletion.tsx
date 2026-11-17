import Meta from '../components/Meta'
import Reveal from '../components/Reveal'
import SectionHead from '../components/Section'
import {
  hivelinkPrivacyMeta,
  inAppDeletion,
  autoDeletion,
  requestDeletion,
} from '../content/hivelink'

export default function HivelinkDataDeletion() {
  return (
    <>
      <Meta
        title="HiveLink data deletion"
        description="How to delete your HiveLink data — in-app controls, automatic session purges, and email requests for any residual state."
      />

      <section className="px-6 pt-36 pb-12 md:px-12">
        <div className="max-w-3xl page-fade">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">
            HiveLink · Data deletion
          </span>
          <h1 className="mt-6 font-display text-5xl font-medium leading-tight tracking-tight md:text-6xl">
            Delete your HiveLink data
          </h1>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-slate-400">
            App · {hivelinkPrivacyMeta.appName} <span className="mx-2">·</span>
            Developer · {hivelinkPrivacyMeta.developerName}
          </p>

          <div className="mt-10 rounded-2xl border border-amber-500/30 bg-surface/40 p-7">
            <p className="text-lg leading-relaxed text-cream">
              Most HiveLink data never leaves your phone, and the rest is deleted
              automatically within 60 seconds of a ride ending. For anything that
              might linger, the controls below let you clear it yourself or ask
              us to do it for you.
            </p>
          </div>
        </div>
      </section>

      {/* In-app deletion */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="In the app" title="What you can delete yourself.">
          Every control is in Settings. No account needed, no email needed, no
          waiting on us.
        </SectionHead>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {inAppDeletion.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 70}
              className="rounded-2xl border border-slate-800 bg-surface/40 p-7 transition hover:border-amber-500"
            >
              <h3 className="font-display text-lg font-medium text-cream">{step.title}</h3>
              <p className="mt-3 text-slate-300">{step.body}</p>
              <div className="mt-5 border-t border-slate-800 pt-4">
                <span className="font-mono text-xs uppercase tracking-widest text-amber-500">
                  What it removes
                </span>
                <p className="mt-2 text-sm text-slate-400">{step.whatItRemoves}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Automatic deletion */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="Automatic" title="What we delete without you asking.">
          Our engineering choices do most of the work. There&rsquo;s no append-only
          log anywhere server-side — positions overwrite in place and rooms
          vanish when the ride ends.
        </SectionHead>

        <div className="mt-12 max-w-3xl divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-surface/40">
          {autoDeletion.map((row) => (
            <div key={row.data} className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
              <dt className="font-display text-lg font-medium text-cream">{row.data}</dt>
              <dd className="text-slate-300">{row.when}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* Request deletion by email */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead tag="By request" title="Email us for the rest.">
          The in-app controls cover almost everything. The one case email helps
          with: if you uninstalled the app before tapping &ldquo;Reset
          identity&rdquo;, your anonymous Firebase user ID may still exist
          server-side. Tell us and we&rsquo;ll delete it.
        </SectionHead>

        <div className="mt-12 max-w-3xl space-y-6">
          {requestDeletion.map((row, i) => (
            <Reveal
              key={row.data}
              delay={i * 70}
              className="rounded-2xl border border-slate-800 bg-surface/40 p-7"
            >
              <h3 className="font-display text-lg font-medium text-cream">{row.data}</h3>
              <p className="mt-3 text-slate-300">{row.how}</p>
              <p className="mt-3 text-sm text-slate-400">
                <span className="font-mono uppercase tracking-widest text-amber-500">
                  Timeline ·{' '}
                </span>
                {row.retention}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-12 max-w-3xl rounded-3xl border border-amber-500/30 bg-surface/40 p-10">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber-500">
            Email template
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">
            How to ask us for a deletion.
          </h2>
          <p className="mt-6 text-slate-300">
            Copy the template below into an email to{' '}
            <a
              href={`mailto:${hivelinkPrivacyMeta.contactEmail}`}
              className="text-amber-400 hover:text-amber-300"
            >
              {hivelinkPrivacyMeta.contactEmail}
            </a>
            . We respond within 7 business days and complete the deletion within
            30 days of your request.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-xl border border-slate-800 bg-ink/60 p-5 font-mono text-sm leading-relaxed text-slate-300">
{`Subject: HiveLink data deletion request

Hi midybee,

I'd like my HiveLink data deleted.

Approximate first use: (month/year)
Device: (Android phone model, e.g. Pixel 7)
Still have the app installed? (yes / no)

Thanks,
(your name — optional)`}
          </pre>
          <p className="mt-6 text-sm text-slate-500">
            You don&rsquo;t need to send us an anonymous user ID — HiveLink
            never showed it to you, and we can find residual state by device
            fingerprint + approximate first-use date.
          </p>
        </Reveal>
      </section>

      {/* What data gets deleted — Play Data Safety requirement */}
      <section className="border-t border-amber-500/10 px-6 py-20 md:px-12">
        <SectionHead
          tag="Data types"
          title="What gets deleted, what stays."
        >
          Required by the Google Play Data Safety policy. The short version:
          everything that was ever sent to Firebase for a ride is gone within
          minutes; everything local to your phone goes when you uninstall or
          use the in-app controls above.
        </SectionHead>

        <div className="mt-12 max-w-3xl divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-surface/40">
          <div className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
            <dt className="font-display text-lg font-medium text-cream">Precise location</dt>
            <dd className="text-slate-300">
              Overwritten continuously while you ride. Deleted within 60 seconds
              of the session ending. No historical track is retained anywhere.
            </dd>
          </div>
          <div className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
            <dt className="font-display text-lg font-medium text-cream">Display name &amp; color</dt>
            <dd className="text-slate-300">
              Server-side copy deleted with the session room. Device-side copy
              removed with &ldquo;Reset identity&rdquo; or uninstall.
            </dd>
          </div>
          <div className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
            <dt className="font-display text-lg font-medium text-cream">
              Anonymous Firebase user ID
            </dt>
            <dd className="text-slate-300">
              Removed from the device with &ldquo;Reset identity&rdquo; or
              uninstall. Residual server-side record (never tied to your name,
              email, or phone) removed within 30 days of an email request.
            </dd>
          </div>
          <div className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
            <dt className="font-display text-lg font-medium text-cream">
              Push-to-talk voice
            </dt>
            <dd className="text-slate-300">
              Never recorded. Real-time only. There is no stored audio to delete.
            </dd>
          </div>
          <div className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
            <dt className="font-display text-lg font-medium text-cream">
              Chat text &amp; signal taps
            </dt>
            <dd className="text-slate-300">
              Deleted with the session room. Local message buffer is cleared
              when you leave the session.
            </dd>
          </div>
          <div className="grid gap-2 p-6 md:grid-cols-[1fr_2fr] md:gap-8">
            <dt className="font-display text-lg font-medium text-cream">
              Ride summaries (local)
            </dt>
            <dd className="text-slate-300">
              Deleted via Settings → Ride history → Clear, or by uninstall.
              Never uploaded, so there is no server-side copy to delete.
            </dd>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-slate-400">
          For the full list of what we collect and why, see the{' '}
          <a
            href="/hivelink/privacy/"
            className="text-amber-400 hover:text-amber-300"
          >
            HiveLink privacy policy
          </a>
          .
        </p>
      </section>

      {/* Contact */}
      <section className="border-t border-amber-500/10 px-6 pb-28 pt-20 md:px-12">
        <Reveal className="mx-auto max-w-3xl rounded-3xl border border-amber-500/30 bg-surface/40 p-10">
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber-500">
            Contact
          </span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">
            Data controller + mailbox.
          </h2>
          <p className="mt-6 text-slate-300">
            <strong className="text-cream">{hivelinkPrivacyMeta.dataController}</strong> ·{' '}
            {hivelinkPrivacyMeta.dataControllerLocation}
          </p>
          <p className="mt-2 text-slate-300">
            App package: <code className="font-mono text-sm text-amber-400">{hivelinkPrivacyMeta.packageName}</code>
          </p>
          <a
            href={`mailto:${hivelinkPrivacyMeta.contactEmail}`}
            className="mt-8 inline-block rounded-full bg-amber-500 px-6 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:bg-amber-400"
          >
            {hivelinkPrivacyMeta.contactEmail} →
          </a>
        </Reveal>
      </section>
    </>
  )
}
