import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { useSceneStore } from '../store/scene'

/** Client-only smooth scrolling. Disabled when the user prefers reduced motion.
 *  Also resets scroll to the top on route change — SPA navigation otherwise
 *  keeps the previous page's scroll position. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const lenisRef = useRef<Lenis | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenisRef.current = lenis
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return <>{children}</>
}
