import { Head } from 'vite-react-ssg'
import { siteMeta } from '../content/site'

/** Per-route document title, description, and social-share cards. */
export default function Meta({ title, description }: { title: string; description: string }) {
  const fullTitle = `${title} — ${siteMeta.name}`
  const image = `${siteMeta.url}/og.svg`
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteMeta.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}
