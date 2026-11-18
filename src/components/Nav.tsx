import { NavLink as RouterLink, Link } from 'react-router-dom'
import { navLinks } from '../content/site'

export default function Nav() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/" className="site-brand">
          <span className="site-brand-mark" aria-hidden="true">m</span>
          <span>midybee <span className="site-brand-studio">studio</span></span>
        </Link>
        <div className="site-nav-links">
          {navLinks.map((link) => (
            <RouterLink key={link.path} to={link.path}>{link.label}</RouterLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
