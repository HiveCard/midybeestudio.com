import { Link } from 'react-router-dom'
import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import ProductCards from '../components/ProductCards'
import { siteMeta } from '../content/site'

export default function Home() {
  return (
    <>
      <SceneMarker scene="home" />
      <Meta title="Independent software products" description={siteMeta.description} />

      <section className="company-hero home-intro">
        <h1>From bank statements to group rides.</h1>
        <p className="hero-description">
          Midybee Studio is an independent software company. We make and sell our own apps, starting
          with a credit card manager for the Philippines and a live map for motorcycle groups worldwide.
        </p>
      </section>

      <section className="company-section">
        <h2 className="company-heading">Our products</h2>
        <ProductCards />
      </section>

      <section className="home-contact">
        <div>
          <h2>About the company</h2>
          <p className="mt-3 max-w-prose text-slate-300">
            Meet the company behind HiveCard and HiveLink.
          </p>
        </div>
        <Link className="site-button" to="/studio">About Midybee Studio</Link>
      </section>
    </>
  )
}
