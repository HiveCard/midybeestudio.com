import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import SceneCanvas from '../canvas/SceneCanvas'

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      {/* Always-present ambient gradient (also the no-WebGL fallback) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 75% 25%, rgba(245,158,11,.10), transparent 50%), radial-gradient(circle at 15% 85%, rgba(180,83,9,.08), transparent 45%)',
        }}
      />
      <SceneCanvas />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
