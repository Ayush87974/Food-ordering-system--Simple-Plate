import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/currency'

export default function CartPage() {
  const { lines, setQuantity, removeLine, subtotal, lineCount } = useCart()
  const rows = Array.from(lines.values())

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Your cart</h1>
          <p className="muted">Review items before checkout.</p>
        </div>
        <Link className="btn secondary" to="/">
          Back to menu
        </Link>
      </header>

      {lineCount === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <>
          <ul className="list">
            {rows.map(({ item, quantity }) => (
              <li key={item.id} className="list-row">
                <div>
                  <strong>{item.name}</strong>
                  <div className="muted small">{formatINR(item.price)} each</div>
                </div>
                <div className="qty">
                  <label>
                    Qty
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(item.id, Number(e.target.value))}
                    />
                  </label>
                  <button type="button" className="btn ghost" onClick={() => removeLine(item.id)}>
                    Remove
                  </button>
                </div>
                <div className="line-total">{formatINR(Number(item.price) * quantity)}</div>
              </li>
            ))}
          </ul>
          <div className="summary">
            <div>
              <span className="muted">Subtotal</span>
              <strong className="total">{formatINR(subtotal)}</strong>
            </div>
            <Link className="btn" to="/checkout">
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
