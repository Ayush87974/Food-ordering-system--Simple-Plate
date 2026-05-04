import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => new Map())

  const addItem = useCallback((item, qty = 1) => {
    setLines((prev) => {
      const next = new Map(prev)
      const id = item.id
      const existing = next.get(id)
      const quantity = (existing?.quantity ?? 0) + qty
      next.set(id, { item, quantity })
      return next
    })
  }, [])

  const setQuantity = useCallback((menuItemId, quantity) => {
    setLines((prev) => {
      const next = new Map(prev)
      if (quantity <= 0) {
        next.delete(menuItemId)
      } else {
        const row = next.get(menuItemId)
        if (row) {
          next.set(menuItemId, { ...row, quantity })
        }
      }
      return next
    })
  }, [])

  const removeLine = useCallback((menuItemId) => {
    setLines((prev) => {
      const next = new Map(prev)
      next.delete(menuItemId)
      return next
    })
  }, [])

  const clear = useCallback(() => setLines(new Map()), [])

  const lineCount = useMemo(() => {
    let n = 0
    for (const { quantity } of lines.values()) {
      n += quantity
    }
    return n
  }, [lines])

  const subtotal = useMemo(() => {
    let sum = 0
    for (const { item, quantity } of lines.values()) {
      sum += Number(item.price) * quantity
    }
    return Math.round(sum * 100) / 100
  }, [lines])

  const value = useMemo(
    () => ({
      lines,
      addItem,
      setQuantity,
      removeLine,
      clear,
      lineCount,
      subtotal,
    }),
    [lines, addItem, setQuantity, removeLine, clear, lineCount, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
