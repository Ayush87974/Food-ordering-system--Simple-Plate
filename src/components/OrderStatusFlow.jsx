const STEPS = [
  { id: 'PENDING', label: 'Pending' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'PREPARING', label: 'Preparing' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for delivery' },
  { id: 'DELIVERED', label: 'Delivered' },
]

function stepIndex(status) {
  return STEPS.findIndex((s) => s.id === status)
}

export default function OrderStatusFlow({ status }) {
  if (!status) return null

  if (status === 'CANCELLED') {
    return (
      <div className="order-flow order-flow--cancelled" aria-label="Order status: cancelled">
        <div className="order-flow__cancelled">
          <span className="order-flow__dot order-flow__dot--cancelled" aria-hidden>
            ×
          </span>
          <span className="order-flow__label">Cancelled</span>
        </div>
      </div>
    )
  }

  const current = stepIndex(status)

  return (
    <ol className="order-flow" aria-label={`Order status: ${status.replace(/_/g, ' ').toLowerCase()}`}>
      {STEPS.map((s, i) => {
        const isDone = current > -1 && i < current
        const isCurrent = i === current
        const isUpcoming = current > -1 && i > current
        const dotClass = isDone
          ? 'order-flow__dot order-flow__dot--done'
          : isCurrent
            ? 'order-flow__dot order-flow__dot--current'
            : 'order-flow__dot order-flow__dot--upcoming'

        const itemClass = isDone
          ? 'order-flow__step order-flow__step--done'
          : isCurrent
            ? 'order-flow__step order-flow__step--current'
            : isUpcoming
              ? 'order-flow__step order-flow__step--upcoming'
              : 'order-flow__step'

        return (
          <li key={s.id} className={itemClass}>
            <span className={dotClass} aria-hidden />
            <span className="order-flow__label">{s.label}</span>
            {i < STEPS.length - 1 && <span className="order-flow__line" aria-hidden />}
          </li>
        )
      })}
    </ol>
  )
}
