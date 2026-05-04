import { api } from './client'

export async function login(body) {
  const { data } = await api.post('/auth/login', body)
  return data
}

export async function registerCustomer(body) {
  const { data } = await api.post('/auth/register', body)
  return data
}

export async function registerOwner(body) {
  const { data } = await api.post('/auth/register/owner', body)
  return data
}
