import SceneMarker from '../components/SceneMarker'
import Meta from '../components/Meta'
import { ProductArt } from '../components/ProductCards'
import { hivelink } from '../content/work'

export default function HivelinkProduct() {
  return (
    <>
      <SceneMarker scene="work" />
      <Meta title={hivelink.name} description={`${hivelink.tagline}. ${hivelink.audience}. ${hivelink.status}.`} />

      <section className="company-hero product-detail">
        <div>
          <p className="product-status product-status-testing">{hivelink.status}</p>
          <h1>{hivelink.name}</h1>
          <p className="product-audience">{hivelink.audience}</p>
          <p className="hero-description">{hivelink.summary}</p>
          {hivelink.playStoreUrl ? (
            <a href={hivelink.playStoreUrl} className="site-button site-button-primary mt-6">
              Install on Google Play
            </a>
          ) : (
            <p className="mt-5 text-slate-400">Public downloads are currently unavailable.</p>
          )}
        </div>
        <ProductArt product="hivelink" />
      </section>

      <section className="company-section">
        <h2 className="company-heading">How HiveLink works</h2>
        <dl className="feature-grid mt-8">
          {hivelink.features.map((feature) => (
            <div key={feature.title}>
              <dt>{feature.title}</dt>
              <dd>{feature.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="company-section">
        <h2 className="company-heading">Location and ride data</h2>
        <p className="mt-4 max-w-prose text-slate-300">
          HiveLink shares your live location with riders in your session. Leaving the session stops
          sharing. Ride summaries are stored on your phone.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="site-button" href="/hivelink/privacy/">Privacy policy</a>
          <a className="site-button" href="/hivelink/data-deletion/">Data deletion</a>
        </div>
      </section>
    </>
  )
}
