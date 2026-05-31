import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useSceneStore } from '../store/scene'

/** Client-only smooth scrolling. Disabled when the user prefers reduced motion. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useSceneStore((s) => s.reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reducedMotion])

  return <>{children}</>
}
