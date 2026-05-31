import { siteMeta } from '../content/site'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-amber-500/10 px-6 py-12 md:px-12">
      <div className="flex flex-col justify-between gap-4 text-sm text-slate-400 md:flex-row">
        <span className="max-w-prose leading-relaxed">
          © {year} {siteMeta.legalName}. Registered with the SEC &amp; BIR, Philippines. Built with care in {siteMeta.location}.
        </span>
        <span className="font-mono uppercase tracking-widest">Privacy-first apps · 🇵🇭</span>
      </div>
    </footer>
  )
}
