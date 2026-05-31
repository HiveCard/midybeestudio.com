import SceneMarker from '../components/SceneMarker'

export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center px-6 pt-32 pb-16 md:px-12">
      <SceneMarker scene="home" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 78% 30%, rgba(245,158,11,.18), transparent 45%), radial-gradient(circle at 12% 80%, rgba(251,191,36,.08), transparent 40%)',
        }}
      />
      <div className="max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-400">
          Independent software studio · Olongapo, PH
        </span>
        <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">
          We build <span className="italic text-amber-400">privacy-first</span> apps people can trust.
        </h1>
        <p className="mt-6 max-w-prose text-lg text-slate-300">
          A solo-led studio crafting thoughtful, privacy-respecting software for the Philippine market
          and the Filipino diaspora.
        </p>
      </div>
    </section>
  )
}
