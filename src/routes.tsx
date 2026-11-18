import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import Home from './pages/Home'
import Studio from './pages/Studio'
import Work from './pages/Work'
import Contact from './pages/Contact'
import HivelinkPrivacy from './pages/HivelinkPrivacy'
import HivelinkDataDeletion from './pages/HivelinkDataDeletion'
import HivelinkProduct from './pages/HivelinkProduct'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'studio', element: <Studio /> },
      { path: 'work', element: <Work /> },
      { path: 'contact', element: <Contact /> },
      // HiveLink product + its legal pages. Product page is the Play
      // Store listing's Website target. Legal pages (privacy, data
      // deletion) are linked from the Play Console declarations and
      // from inside the HiveLink app.
      { path: 'hivelink', element: <HivelinkProduct /> },
      { path: 'hivelink/privacy', element: <HivelinkPrivacy /> },
      { path: 'hivelink/data-deletion', element: <HivelinkDataDeletion /> },
    ],
  },
]
