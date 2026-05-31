import { NavLink as RouterLink, Link } from 'react-router-dom'
import { navLinks, siteMeta } from '../content/site'

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-amber-500/10 bg-ink/60 px-6 py-4 backdrop-blur-md md:px-12">
      <Link to="/" className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-amber-500 font-display text-xl text-amber-400">
          m
        </span>
        <span className="flex flex-col leading-tight">
          <b className="font-medium">midybee</b>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-amber-500">studio</span>
        </span>
      </Link>
      <div className="flex items-center gap-8 text-sm">
        {navLinks.map((link) => (
          <RouterLink
            key={link.path}
            to={link.path}
            className="hidden text-slate-300 transition-colors hover:text-amber-400 md:inline"
          >
            {link.label}
          </RouterLink>
        ))}
        <a
          href={siteMeta.facebook}
          target="_blank"
          rel="noopener"
          className="rounded-full border border-amber-500 px-4 py-1.5 text-amber-400 transition-colors hover:bg-amber-500 hover:text-ink"
        >
          Follow
        </a>
      </div>
    </nav>
  )
}
