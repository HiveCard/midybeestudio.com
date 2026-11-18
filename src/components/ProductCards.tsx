import { Link } from 'react-router-dom'
import { hivecard, hivelink } from '../content/work'

export function ProductArt({ product }: { product: 'hivecard' | 'hivelink' }) {
  return product === 'hivecard' ? (
    <div className="product-art card-art">
      <img
        src="/hivecard-dashboard.jpg"
        alt="HiveCard’s budget dashboard showing available spending and upcoming bills"
        width={359}
        height={733}
      />
    </div>
  ) : (
    <div className="product-art map-art" aria-hidden="true">
      <div className="map-route" />
      <span className="map-marker map-marker-first" />
      <span className="map-marker map-marker-second" />
      <span className="map-marker map-marker-third" />
    </div>
  )
}

export function HiveCardStoreLinks() {
  return (
    <div className="store-links" role="group" aria-label="Download HiveCard">
      {hivecard.stores.map((store) => (
        <a key={store.name} className="site-button" href={store.url}>{store.name}</a>
      ))}
    </div>
  )
}

export default function ProductCards() {
  return (
    <div className="product-grid">
      <article className="product-card">
        <ProductArt product="hivecard" />
        <div className="product-card-body">
          <p className="product-status">{hivecard.status}</p>
          <h3>{hivecard.name}</h3>
          <p className="product-audience">{hivecard.audience}</p>
          <p>{hivecard.summary}</p>
          <HiveCardStoreLinks />
        </div>
      </article>
      <article className="product-card">
        <ProductArt product="hivelink" />
        <div className="product-card-body">
          <p className="product-status product-status-testing">{hivelink.status}</p>
          <h3>{hivelink.name}</h3>
          <p className="product-audience">{hivelink.audience}</p>
          <p>{hivelink.summary}</p>
          <Link className="site-button" to="/hivelink">Explore HiveLink</Link>
        </div>
      </article>
    </div>
  )
}
