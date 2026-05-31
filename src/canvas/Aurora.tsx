import { useFxStore } from '../dev/fx'

/** A DOM-based, very subtle "aurora" — slow-drifting soft warm light blobs,
 *  no particles. Renders only when the 'aurora' variant is selected. */
export default function Aurora() {
  const fx = useFxStore((s) => s.fx)
  if (fx !== 'aurora') return null
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="aurora-blob"
        style={{
          left: '52%',
          top: '12%',
          background: 'radial-gradient(circle, rgba(245,158,11,.22), transparent 60%)',
          animation: 'aurora-a 20s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-blob"
        style={{
          left: '8%',
          top: '55%',
          background: 'radial-gradient(circle, rgba(180,83,9,.20), transparent 60%)',
          animation: 'aurora-b 26s ease-in-out infinite',
        }}
      />
    </div>
  )
}
