import { useState } from 'react'
import { siteMeta } from '../content/site'
import { buildMailto } from '../lib/mailto'

/** Composes a mailto: link from the fields — deliberately collects no data and
 *  hits no backend, so the studio's own site honors the privacy promise. */
export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState('Opens your email app — no data is collected by this site.')

  const send = () => {
    const url = buildMailto({ to: siteMeta.email, name, email, message })
    if (!url) {
      setNote('Please add a short message first.')
      return
    }
    window.location.href = url
  }

  const field = 'w-full rounded-xl border border-slate-800 bg-ink px-4 py-3 text-cream transition focus:border-amber-500 focus:outline-none'

  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300" htmlFor="cf-name">Name</label>
      <input id="cf-name" className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <label className="mb-2 mt-5 block text-sm text-slate-300" htmlFor="cf-email">Email</label>
      <input id="cf-email" type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <label className="mb-2 mt-5 block text-sm text-slate-300" htmlFor="cf-msg">Message</label>
      <textarea id="cf-msg" className={`${field} min-h-32 resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us a bit about what you have in mind…" />
      <button onClick={send} className="mt-5 w-full rounded-full bg-amber-500 py-3 font-medium text-ink transition hover:bg-amber-400">
        Send message
      </button>
      <p className="mt-3 text-sm text-slate-400">{note}</p>
    </div>
  )
}
