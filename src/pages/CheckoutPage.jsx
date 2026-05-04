import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { placeOrder } from '../api/client'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/currency'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, subtotal, clear, lineCount } = useCart()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    const items = Array.from(lines.values()).map(({ item, quantity }) => ({
      menuItemId: item.id,
      quantity,
    }))
    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }
    setSubmitting(true)
    try {
      const order = await placeOrder({
        customerName: name.trim(),
        deliveryAddress: address.trim(),
        phone: phone.trim(),
        items,
      })
      clear()
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        'Could not place order'
      setError(typeof msg === 'string' ? msg : 'Could not place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page narrow">
      <header className="page-header">
        <div>
          <h1>Checkout</h1>
          <p className="muted">Delivery details and confirmation.</p>
        </div>
        <Link className="btn secondary" to="/cart">
          Back to cart
        </Link>
      </header>

      {lineCount === 0 ? (
        <p className="muted">Add items to your cart first.</p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <div className="summary inline">
            <span className="muted">Order total</span>
            <strong className="total">{formatINR(subtotal)}</strong>
          </div>

          <label className="field">
            <span className="label">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
          </label>
          <label className="field">
            <span className="label">Delivery address</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              maxLength={500}
              rows={3}
            />
          </label>
          <label className="field">
            <span className="label">Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={40} />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      )}
    </div>
  )
}
