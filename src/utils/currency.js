const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function formatINR(value) {
  const n = Number(value ?? 0)
  if (!Number.isFinite(n)) return '₹0.00'
  return formatter.format(n)
}

