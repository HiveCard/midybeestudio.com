import { Link } from 'react-router-dom'
import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import { siteMeta } from '../content/site'

export default function Studio() {
  return (
    <>
      <SceneMarker scene="studio" />
      <Meta title="Company" description={siteMeta.description} />

      <section className="company-hero">
        <h1>Midybee Studio</h1>
        <p className="hero-description">
          We’re an independent software company based in {siteMeta.location}. Our first
          two products cover personal finance and group riding. We plan to build in other categories,
          for customers here and abroad.
        </p>
      </section>

      <section className="company-section company-details">
        <div>
          <h2 className="company-heading">What we make</h2>
          <div className="company-project">
            <h3>HiveCard</h3>
            <p>
              Three cards can mean three statements, three due dates, and three banking apps.
              HiveCard brings those statements and due dates into one place for Philippine cardholders.
              It’s available on the App Store and Google Play.
            </p>
            <Link className="product-site-link" to="/work">Explore HiveCard</Link>
          </div>
          <div className="company-project">
            <h3>HiveLink</h3>
            <p>
              When a motorcycle group gets split up, riders can use HiveLink to see each other
              on a shared map. We’re building it for riding groups worldwide and testing it internally.
            </p>
            <Link className="product-site-link" to="/hivelink">Explore HiveLink</Link>
          </div>
        </div>
        <div className="contact-panel company-registration">
          <h2 className="font-display text-2xl">Company details</h2>
          <dl className="company-facts">
            <dt>Registered name</dt>
            <dd>{siteMeta.legalName}</dd>
            <dt>Location</dt>
            <dd>{siteMeta.location}</dd>
            <dt>Registration</dt>
            <dd>SEC and BIR, Philippines</dd>
          </dl>
        </div>
      </section>
    </>
  )
}
