import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMenu } from '../api/client'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/currency'

function hashHue(str) {
  let h = 0
  for (let i = 0; i < str.length; i += 1) h = str.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h) % 360
}

/** Fallback when API omits imageUrl (e.g. legacy rows). Keys match seeded menu names. */
const MENU_IMAGE_FALLBACK = {
  'Margherita Pizza':
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&w=640&h=420&fit=crop&q=80',
  'Pepperoni Pizza':
    'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&w=640&h=420&fit=crop&q=80',
  'Garlic Bread':
    'https://images.unsplash.com/photo-1576100882584-561a6a8b112f?auto=format&w=640&h=420&fit=crop&q=80',
  'Caesar Salad':
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&w=640&h=420&fit=crop&q=80',
  'Grilled Chicken Bowl':
    'https://images.unsplash.com/photo-1598515214224-623eaee00efb?auto=format&w=640&h=420&fit=crop&q=80',
  'Veggie Burger':
    'https://images.unsplash.com/photo-1520072959219-c595feb870b0?auto=format&w=640&h=420&fit=crop&q=80',
  'Chocolate Brownie':
    'https://images.unsplash.com/photo-1607920591413-4ec007e7007b?auto=format&w=640&h=420&fit=crop&q=80',
  'Fresh Lime Soda':
    'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&w=640&h=420&fit=crop&q=80',
}

function getMenuImageUrl(item) {
  const fromApi = item?.imageUrl?.trim()
  if (fromApi) return fromApi
  const name = item?.name?.trim()
  if (name && MENU_IMAGE_FALLBACK[name]) return MENU_IMAGE_FALLBACK[name]
  return null
}

export default function MenuPage() {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('')
  const { addItem, lineCount } = useCart()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchMenu()
      .then((data) => {
        if (!cancelled) {
          setAllItems(data)
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message ?? 'Failed to load menu')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const set = new Set(allItems.map((i) => i.category))
    return Array.from(set).sort()
  }, [allItems])

  const visibleItems = useMemo(() => {
    if (!category) return allItems
    return allItems.filter((i) => i.category === category)
  }, [allItems, category])

  const itemCount = allItems.length
  const catCount = categories.length

  return (
    <div className="menu-page">
      <section className="menu-hero" aria-labelledby="menu-title">
        <div className="menu-hero__glow" aria-hidden />
        <div className="menu-hero__content">
          <p className="menu-hero__kicker">Today’s kitchen</p>
          <h1 id="menu-title" className="menu-hero__title">
            Crafted plates,
            <span className="menu-hero__title-accent"> delivered fresh</span>
          </h1>
          <p className="menu-hero__lead">
            Explore seasonal picks by category. Every dish is prepared to order — add what you love and we’ll handle
            the rest.
          </p>
          {!loading && !error && (
            <div className="menu-hero__stats">
              <div className="menu-stat">
                <span className="menu-stat__value">{itemCount}</span>
                <span className="menu-stat__label">dishes</span>
              </div>
              <div className="menu-stat">
                <span className="menu-stat__value">{catCount}</span>
                <span className="menu-stat__label">categories</span>
              </div>
            </div>
          )}
        </div>
        <div className="menu-hero__actions">
          <Link className="menu-cart-btn" to="/cart">
            <span className="menu-cart-btn__icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="20" r="1.75" fill="currentColor" />
                <circle cx="17" cy="20" r="1.75" fill="currentColor" />
              </svg>
            </span>
            <span>
              View cart
              {lineCount > 0 && <span className="menu-cart-btn__badge">{lineCount}</span>}
            </span>
          </Link>
        </div>
      </section>

      <div className="menu-toolbar">
        <div className="menu-toolbar__label">
          <span className="menu-toolbar__eyebrow">Browse</span>
          <h2 className="menu-toolbar__heading">Categories</h2>
        </div>
        <div className="menu-chips" role="tablist" aria-label="Filter by category">
          <button
            type="button"
            role="tab"
            aria-selected={category === ''}
            className={`menu-chip ${category === '' ? 'menu-chip--active' : ''}`}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              className={`menu-chip ${category === c ? 'menu-chip--active' : ''}`}
              style={{ '--chip-hue': `${hashHue(c)}` }}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <ul className="menu-skeleton-grid" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="menu-skeleton-card">
              <div className="menu-skeleton-card__visual" />
              <div className="menu-skeleton-card__line menu-skeleton-card__line--short" />
              <div className="menu-skeleton-card__line" />
              <div className="menu-skeleton-card__line menu-skeleton-card__line--medium" />
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="menu-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <div className="menu-empty">
          <p className="menu-empty__title">No dishes in this category</p>
          <p className="menu-empty__hint muted">Try another category or view all items.</p>
          <button type="button" className="btn secondary" onClick={() => setCategory('')}>
            Show all dishes
          </button>
        </div>
      )}

      {!loading && !error && visibleItems.length > 0 && (
        <ul className="menu-grid">
          {visibleItems.map((item, index) => {
            const hue = hashHue(item.category)
            const initial = item.name.trim().charAt(0).toUpperCase()
            const img = getMenuImageUrl(item)
            return (
              <li
                key={item.id}
                className="menu-card"
                style={{ '--card-hue': `${hue}`, '--stagger': `${Math.min(index, 12)}` }}
              >
                <div className="menu-card__visual" aria-hidden>
                  {img ? (
                    <img
                      className="menu-card__img"
                      src={img}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  <span className="menu-card__initial">{initial}</span>
                  <span className="menu-card__shine" />
                </div>
                <div className="menu-card__body">
                  <p className="menu-card__category">{item.category}</p>
                  <h3 className="menu-card__name">{item.name}</h3>
                  <p className="menu-card__desc">{item.description}</p>
                </div>
                <div className="menu-card__footer">
                  <div className="menu-card__price">
                    {formatINR(item.price)}
                  </div>
                  <button type="button" className="menu-card__cta" onClick={() => addItem(item)}>
                    <span className="menu-card__cta-plus" aria-hidden>
                      +
                    </span>
                    Add
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
