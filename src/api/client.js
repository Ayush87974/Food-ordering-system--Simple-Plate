import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

const STORAGE_TOKEN = 'foodorder_token'

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function fetchMenu(category) {
  const params = category ? { category } : {}
  const { data } = await api.get('/menu', { params })
  return data
}

export async function placeOrder(payload) {
  const { data } = await api.post('/orders', payload)
  return data
}

export async function fetchOrder(id) {
  const { data } = await api.get(`/orders/${id}`)
  return data
}

export async function fetchMyOrders() {
  const { data } = await api.get('/orders/me')
  return data
}

export async function fetchOwnerOrders() {
  const { data } = await api.get('/owner/orders')
  return data
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/owner/orders/${id}/status`, { status })
  return data
}

export async function initiateOrderPayment(orderId, gateway) {
  const { data } = await api.post(`/orders/${orderId}/payment/initiate`, { gateway })
  return data
}

export async function verifyOrderPayment(orderId, body) {
  const { data } = await api.post(`/orders/${orderId}/payment/verify`, body)
  return data
}
