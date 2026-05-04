import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { verifyOrderPayment } from '../api/client'

export default function PaymentReturnPage() {
  const { id } = useParams()
  const [search] = useSearchParams()
  const [status, setStatus] = useState('working') // working | ok | error
  const [message, setMessage] = useState('Confirming payment with your bank…')

  const verifyBody = useMemo(() => {
    const gateway = (search.get('gateway') ?? '').toLowerCase()
    if (search.get('cancelled') === '1') {
      return { cancelled: true }
    }
    if (gateway === 'stripe') {
      return {
        stripeSessionId: search.get('stripe_session_id') ?? undefined,
        cancelled: false,
      }
    }
    if (gateway === 'razorpay') {
      return {
        razorpayPaymentId: search.get('razorpay_payment_id') ?? undefined,
        razorpayPaymentLinkId: search.get('razorpay_payment_link_id') ?? undefined,
        razorpaySignature: search.get('razorpay_signature') ?? undefined,
        cancelled: false,
      }
    }
    if (gateway === 'paypal') {
      return {
        paypalOrderId: search.get('token') ?? undefined,
        cancelled: false,
      }
    }
    return { cancelled: false }
  }, [search.toString()])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (verifyBody.cancelled) {
        setStatus('error')
        setMessage('Payment was cancelled. You can try again from your order.')
        return
      }
      const gw = (search.get('gateway') ?? '').toLowerCase()
      if (!gw) {
        setStatus('error')
        setMessage('Missing payment provider information in this return URL.')
        return
      }
      try {
        await verifyOrderPayment(id, verifyBody)
        if (!cancelled) {
          setStatus('ok')
          setMessage('Payment successful. Your order is marked as paid.')
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ??
          err.response?.data?.detail ??
          err.message ??
          'Could not verify payment'
        if (!cancelled) {
          setStatus('error')
          setMessage(typeof msg === 'string' ? msg : 'Could not verify payment')
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id, verifyBody, search])

  return (
    <div className="page payment-page narrow">
      <h1>Payment return</h1>
      {status === 'working' && <p className="muted">{message}</p>}
      {status === 'ok' && (
        <div className="payment-success">
          <div className="payment-success__icon" aria-hidden>
            ✓
          </div>
          <p>{message}</p>
          <div className="payment-success__actions">
            <Link className="btn" to={`/orders/${id}`}>
              View order
            </Link>
            <Link className="btn secondary" to="/my-orders">
              My orders
            </Link>
          </div>
        </div>
      )}
      {status === 'error' && (
        <>
          <p className="error">{message}</p>
          <div className="payment-success__actions">
            <Link className="btn" to={`/orders/${id}/payment`}>
              Try again
            </Link>
            <Link className="btn secondary" to="/my-orders">
              My orders
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
