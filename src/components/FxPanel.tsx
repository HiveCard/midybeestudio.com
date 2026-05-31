import { useFxStore, FX, type Fx } from '../dev/fx'

/** Local-only animation switcher. Renders only on localhost so it never ships
 *  to production. Lets us audition background-animation variants live. */
export default function FxPanel() {
  const fx = useFxStore((s) => s.fx)
  const setFx = useFxStore((s) => s.setFx)

  const isLocal =
    typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
  if (!isLocal) return null

  return (
    <div
      className="fixed bottom-4 left-4 z-[100] w-60 rounded-xl border border-amber-500/25 bg-ink/85 p-3 backdrop-blur-md"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400">
        Animation preview · localhost
      </div>
      <div className="flex flex-col gap-1.5">
        {(Object.keys(FX) as Fx[]).map((k) => (
          <button
            key={k}
            onClick={() => setFx(k)}
            className={`rounded-lg border px-2.5 py-1.5 text-left transition ${
              fx === k
                ? 'border-amber-500 bg-amber-500 text-ink'
                : 'border-amber-500/15 bg-ink/60 text-slate-300 hover:border-amber-500/50 hover:text-amber-300'
            }`}
          >
            <span className="block text-xs font-medium">{FX[k].label}</span>
            <span className={`block text-[10px] ${fx === k ? 'text-ink/70' : 'text-slate-500'}`}>
              {FX[k].desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
