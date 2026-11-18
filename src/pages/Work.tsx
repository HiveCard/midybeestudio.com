import { Link } from 'react-router-dom'
import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import { HiveCardStoreLinks, ProductArt } from '../components/ProductCards'
import { hivecard, hivelink } from '../content/work'

export default function Work() {
  return (
    <>
      <SceneMarker scene="work" />
      <Meta title="Products" description="Explore HiveCard for Philippine credit cards and HiveLink for motorcycle groups worldwide. HiveLink is in internal testing." />

      <section className="company-hero">
        <h1>Our products</h1>
      </section>

      <section className="company-section product-detail">
        <div>
          <p className="product-status">{hivecard.status}</p>
          <h2 className="company-heading">{hivecard.name}</h2>
          <p className="product-audience">{hivecard.audience}</p>
          <p className="mt-4 text-slate-300">{hivecard.summary}</p>
          <div className="mt-6"><HiveCardStoreLinks /></div>
          <a href={hivecard.site} className="product-site-link">Visit the HiveCard website</a>
        </div>
        <ProductArt product="hivecard" />
        <dl className="feature-grid">
          {hivecard.features.map((feature) => (
            <div key={feature.title}>
              <dt>{feature.title}</dt>
              <dd>{feature.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="company-section product-detail">
        <div>
          <p className="product-status product-status-testing">{hivelink.status}</p>
          <h2 className="company-heading">{hivelink.name}</h2>
          <p className="product-audience">{hivelink.audience}</p>
          <p className="mt-4 text-slate-300">{hivelink.summary}</p>
          <Link to="/hivelink" className="site-button mt-6">Explore HiveLink</Link>
        </div>
        <ProductArt product="hivelink" />
      </section>
    </>
  )
}
