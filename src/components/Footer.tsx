import { Link } from 'react-router-dom'
import { siteMeta } from '../content/site'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <Link to="/" className="site-footer-brand">{siteMeta.name}</Link>
          <p>Software built in {siteMeta.location}.</p>
        </div>
        <div>
          <a href={`mailto:${siteMeta.email}`}>{siteMeta.email}</a>
          <p>© {year} {siteMeta.legalName}. Registered with the SEC &amp; BIR, Philippines.</p>
        </div>
      </div>
    </footer>
  )
}
