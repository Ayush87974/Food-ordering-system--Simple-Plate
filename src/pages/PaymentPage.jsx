import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchOrder, initiateOrderPayment } from '../api/client'
import { formatINR } from '../utils/currency'

const GATEWAYS = [
  {
    id: 'STRIPE',
    name: 'Card (Stripe Checkout)',
    blurb: 'Visa, Mastercard, Amex — secure hosted page by Stripe',
    accent: 'linear-gradient(135deg, #635bff 0%, #00d4aa 100%)',
  },
  {
    id: 'PAYPAL',
    name: 'PayPal',
    blurb: 'Sign in to PayPal and approve payment on PayPal’s site',
    accent: 'linear-gradient(135deg, #0070ba 0%, #003087 100%)',
  },
  {
    id: 'RAZORPAY_UPI',
    name: 'UPI & cards (Razorpay)',
    blurb: 'Hosted Razorpay page — UPI QR / apps, cards, netbanking (INR)',
    accent: 'linear-gradient(135deg, #3395ff 0%, #0c4a8c 100%)',
  },
  {
    id: 'APPLE_PAY',
    name: 'Apple Pay (via Stripe)',
    blurb: 'Stripe Checkout — Apple Pay when available on your device',
    accent: 'linear-gradient(135deg, #1c1c1e 0%, #3a3a3c 100%)',
  },
]

export default function PaymentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState('STRIPE')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchOrder(id)
      .then((data) => {
        if (!cancelled) {
          setOrder(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this order.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const canPay = order && order.status === 'CONFIRMED' && !order.paid

  async function onPay(e) {
    e.preventDefault()
    if (!canPay || !selected) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await initiateOrderPayment(id, selected)
      if (res.redirectUrl) {
        window.location.assign(res.redirectUrl)
        return
      }
      setError('No redirect URL returned. Check payment provider configuration on the server.')
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.detail ??
        err.message ??
        'Could not start payment'
      setError(typeof msg === 'string' ? msg : 'Could not start payment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page payment-page">
        <p className="muted">Loading order…</p>
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="page payment-page">
        <p className="error">{error}</p>
        <Link className="btn secondary" to="/my-orders">
          Back to my orders
        </Link>
      </div>
    )
  }

  if (order?.paid) {
    return (
      <div className="page payment-page narrow">
        <div className="payment-success">
          <div className="payment-success__icon" aria-hidden>
            ✓
          </div>
          <h1>Payment received</h1>
          <p className="muted">
            Order <strong>#{order.id}</strong> was paid via{' '}
            <strong>{GATEWAYS.find((g) => g.id === order.paymentGateway)?.name ?? order.paymentGateway}</strong>.
          </p>
          <div className="payment-success__actions">
            <Link className="btn" to={`/orders/${order.id}`}>
              View order
            </Link>
            <Link className="btn secondary" to="/my-orders">
              My orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page payment-page">
      <header className="payment-page__header">
        <div>
          <p className="payment-page__kicker">Secure checkout</p>
          <h1>Pay for order #{order.id}</h1>
          <p className="muted">
            You will be redirected to your provider’s secure page (Stripe, PayPal, or Razorpay) to complete payment.
          </p>
        </div>
        <Link className="btn secondary" to={`/orders/${order.id}`}>
          Order details
        </Link>
      </header>

      {order.status !== 'CONFIRMED' && (
        <div className="payment-banner payment-banner--warn">
          <strong>Not ready for payment.</strong> This page is available only after the restaurant confirms your order
          (status: {order.status}).
        </div>
      )}

      {order.status === 'CONFIRMED' && (
        <>
          <div className="payment-total-card">
            <span className="muted">Amount due</span>
            <div className="payment-total-card__amount">
              {formatINR(order.total)}
            </div>
            <span className="payment-total-card__hint">
              Hosted payments may charge in USD or INR depending on provider configuration.
            </span>
          </div>

          <form className="payment-form" onSubmit={onPay}>
            <h2 className="payment-form__title">Payment method</h2>
            <div className="payment-gateways" role="radiogroup" aria-label="Payment gateway">
              {GATEWAYS.map((g) => (
                <label
                  key={g.id}
                  className={`payment-gateway ${selected === g.id ? 'payment-gateway--active' : ''}`}
                  style={{ '--gw-accent': g.accent }}
                >
                  <input
                    type="radio"
                    name="gateway"
                    value={g.id}
                    checked={selected === g.id}
                    onChange={() => setSelected(g.id)}
                  />
                  <span className="payment-gateway__stripe" aria-hidden />
                  <span className="payment-gateway__body">
                    <span className="payment-gateway__name">{g.name}</span>
                    <span className="payment-gateway__blurb">{g.blurb}</span>
                  </span>
                </label>
              ))}
            </div>

            {error && <p className="error">{error}</p>}

            <div className="payment-form__actions">
              <button type="submit" className="btn payment-pay-btn" disabled={submitting || !canPay}>
                {submitting ? 'Redirecting…' : 'Continue to pay'}
              </button>
              <button type="button" className="btn secondary" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </button>
            </div>
            <p className="payment-disclaimer muted small">
              Configure API keys on the server (<code>STRIPE_SECRET_KEY</code>, <code>RAZORPAY_KEY_ID</code> /{' '}
              <code>RAZORPAY_KEY_SECRET</code>, <code>PAYPAL_CLIENT_ID</code> / <code>PAYPAL_CLIENT_SECRET</code>) and
              set <code>PAYMENT_FRONTEND_URL</code> to this app’s origin for return URLs.
            </p>
          </form>
        </>
      )}
    </div>
  )
}
