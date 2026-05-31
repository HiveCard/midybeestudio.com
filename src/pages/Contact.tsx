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
