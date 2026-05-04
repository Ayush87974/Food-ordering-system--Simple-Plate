import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyOrders } from '../api/client'
import OrderStatusFlow from '../components/OrderStatusFlow'
import { formatINR } from '../utils/currency'

function formatStatus(status) {
  return status.replace(/_/g, ' ').toLowerCase()
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchMyOrders()
        if (!cancelled) {
          setOrders(data)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e.message ?? 'Could not load orders')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const id = setInterval(load, 5000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>My orders</h1>
          <p className="muted">Status updates when the restaurant changes your order.</p>
        </div>
      </header>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && orders.length === 0 && <p className="muted">You have not placed any orders yet.</p>}

      {!loading && orders.length > 0 && (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id} className="order-row">
              <div className="order-row__meta">
                <div className="order-row__metaTop">
                  <strong>Order #{o.id}</strong>
                  <span className="pill">{formatStatus(o.status)}</span>
                </div>
                <div className="muted small">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="muted small">{formatINR(o.total)}</div>
                <div className="order-row__metaBottom">
                  {o.paid && <div className="order-paid-tag muted small">Paid</div>}
                </div>
              </div>

              <div className="order-row__flowWrap">
                <OrderStatusFlow status={o.status} />
              </div>

              <div className="order-row__actions">
                {o.status === 'CONFIRMED' && !o.paid && (
                  <Link className="btn tiny" to={`/orders/${o.id}/payment`}>
                    Pay now
                  </Link>
                )}
                <Link className="btn secondary tiny" to={`/orders/${o.id}`}>
                  Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
