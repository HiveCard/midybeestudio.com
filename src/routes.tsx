import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Work from './pages/Work'
import Contact from './pages/Contact'
import HivelinkPrivacy from './pages/HivelinkPrivacy'
import HivelinkDataDeletion from './pages/HivelinkDataDeletion'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'studio', element: <Studio /> },
      { path: 'work', element: <Work /> },
      { path: 'contact', element: <Contact /> },
      // Product-scoped legal pages. Not in the main nav — linked from
      // the Play Store listing + from inside the HiveLink app.
      { path: 'hivelink/privacy', element: <HivelinkPrivacy /> },
      { path: 'hivelink/data-deletion', element: <HivelinkDataDeletion /> },
    ],
  },
]
