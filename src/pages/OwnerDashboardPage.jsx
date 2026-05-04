import { useCallback, useEffect, useState } from 'react'
import { fetchOwnerOrders, updateOrderStatus } from '../api/client'
import { formatINR } from '../utils/currency'

const STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]

function formatStatus(status) {
  return status.replace(/_/g, ' ')
}

export default function OwnerDashboardPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchOwnerOrders()
      setOrders(data)
      setError(null)
    } catch (e) {
      setError(e.message ?? 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [load])

  async function onStatusChange(orderId, status) {
    setUpdatingId(orderId)
    try {
      const updated = await updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
    } catch (e) {
      setError(e.message ?? 'Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="page wide">
      <header className="page-header">
        <div>
          <h1>Live orders</h1>
          <p className="muted">Update status — customers see changes on their order screen.</p>
        </div>
        <button type="button" className="btn secondary" onClick={load} disabled={loading}>
          Refresh
        </button>
      </header>

      {loading && orders.length === 0 && <p className="muted">Loading orders…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && orders.length === 0 && <p className="muted">No orders yet.</p>}

      {orders.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>
                    <div>{o.customerName}</div>
                    <div className="muted small">{o.deliveryAddress}</div>
                  </td>
                  <td>{o.phone}</td>
                  <td>{formatINR(o.total)}</td>
                  <td>
                    <select
                      className="status-select"
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={(e) => onStatusChange(o.id, e.target.value)}
                      aria-label={`Status for order ${o.id}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {formatStatus(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="muted small">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
