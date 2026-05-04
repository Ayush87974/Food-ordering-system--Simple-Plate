import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchOrder } from '../api/client'
import { formatINR } from '../utils/currency'

function formatStatus(status) {
  return status.replace(/_/g, ' ').toLowerCase()
}

export default function OrderPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchOrder(id)
        if (!cancelled) {
          setOrder(data)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('Order not found.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const timer = setInterval(load, 5000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [id])

  return (
    <div className="page narrow">
      <header className="page-header">
        <div>
          <h1>Order details</h1>
          <p className="muted">This page refreshes every few seconds for status updates.</p>
        </div>
        <div className="order-page__header-actions">
          {order && order.status === 'CONFIRMED' && !order.paid && (
            <Link className="btn" to={`/orders/${order.id}/payment`}>
              Pay now
            </Link>
          )}
          <Link className="btn secondary" to="/my-orders">
            All my orders
          </Link>
        </div>
      </header>

      {loading && <p className="muted">Loading order…</p>}
      {error && <p className="error">{error}</p>}

      {order && (
        <div className="receipt">
          <div className="receipt-row">
            <span className="muted">Order #</span>
            <strong>{order.id}</strong>
          </div>
          <div className="receipt-row">
            <span className="muted">Status</span>
            <span className="pill">{formatStatus(order.status)}</span>
          </div>
          <div className="receipt-row">
            <span className="muted">Payment</span>
            <span>{order.paid ? `Paid${order.paymentGateway ? ` (${order.paymentGateway.replace(/_/g, ' ')})` : ''}` : 'Not paid'}</span>
          </div>
          <div className="receipt-row">
            <span className="muted">Name</span>
            <span>{order.customerName}</span>
          </div>
          <div className="receipt-row">
            <span className="muted">Address</span>
            <span>{order.deliveryAddress}</span>
          </div>
          <div className="receipt-row">
            <span className="muted">Phone</span>
            <span>{order.phone}</span>
          </div>

          <h2 className="section-title">Items</h2>
          <ul className="list compact">
            {order.lines.map((line, idx) => (
              <li key={idx} className="list-row">
                <div>
                  <strong>{line.menuItemName}</strong>
                  <div className="muted small">× {line.quantity}</div>
                </div>
                <div>{formatINR(line.lineTotal)}</div>
              </li>
            ))}
          </ul>
          <div className="summary inline">
            <span className="muted">Total</span>
            <strong className="total">{formatINR(order.total)}</strong>
          </div>
        </div>
      )}
    </div>
  )
}
