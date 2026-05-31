import { Head } from 'vite-react-ssg'
import { siteMeta } from '../content/site'

/** Per-route document title + description. */
export default function Meta({ title, description }: { title: string; description: string }) {
  const fullTitle = `${title} — ${siteMeta.name}`
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
    </Head>
  )
}
