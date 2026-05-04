import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

const STORAGE_TOKEN = 'foodorder_token'
const STORAGE_USER = 'foodorder_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN))
  const [user, setUser] = useState(() => readStoredUser())

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_TOKEN)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_USER)
    }
  }, [user])

  const login = useCallback(async (username, password) => {
    const res = await authApi.login({ username, password })
    setToken(res.token)
    setUser({ username: res.username, role: res.role })
    return res
  }, [])

  const registerCustomer = useCallback(async (payload) => {
    const res = await authApi.registerCustomer(payload)
    setToken(res.token)
    setUser({ username: res.username, role: res.role })
    return res
  }, [])

  const registerOwner = useCallback(async (payload) => {
    const res = await authApi.registerOwner(payload)
    setToken(res.token)
    setUser({ username: res.username, role: res.role })
    return res
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      role: user?.role ?? null,
      login,
      registerCustomer,
      registerOwner,
      logout,
    }),
    [token, user, login, registerCustomer, registerOwner, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
