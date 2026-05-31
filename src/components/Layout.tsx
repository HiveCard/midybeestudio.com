import { Suspense, lazy } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import SmoothScroll from '../lib/SmoothScroll'

const SceneCanvas = lazy(() => import('../canvas/SceneCanvas'))

export default function Layout() {
  const location = useLocation()
  return (
    <SmoothScroll>
      <div className="relative isolate flex min-h-screen flex-col bg-ink">
        <div
          className="pointer-events-none fixed inset-0 -z-20"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 75% 25%, rgba(245,158,11,.10), transparent 50%), radial-gradient(circle at 15% 85%, rgba(180,83,9,.08), transparent 45%)',
          }}
        />
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
        <Nav />
        <main key={location.pathname} className="flex-1 page-fade">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
