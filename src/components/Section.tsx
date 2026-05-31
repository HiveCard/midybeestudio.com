import type { ReactNode } from 'react'
import Reveal from './Reveal'

/** Shared section header: eyebrow tag, display title, optional subtitle. */
export default function SectionHead({
  tag,
  title,
  children,
}: {
  tag: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <Reveal className="max-w-2xl">
      <span className="font-mono text-xs uppercase tracking-[0.24em] text-amber-500">{tag}</span>
      <h2 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-lg text-slate-300">{children}</p>}
    </Reveal>
  )
}
