import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OwnerLoginPage() {
  const { login, logout, isAuthenticated, role } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && role === 'CUSTOMER') {
    return <Navigate to="/menu" replace />
  }

  if (isAuthenticated && role === 'OWNER') {
    return <Navigate to="/owner/dashboard" replace />
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login(username, password)
      if (res.role !== 'OWNER') {
        logout()
        setError('This account is not a restaurant owner.')
        return
      }
      navigate('/owner/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Login failed'
      setError(typeof msg === 'string' ? msg : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell public">
      <div className="auth-card">
        <h1>Restaurant owner log in</h1>
        <p className="muted">View incoming orders and update their status for customers.</p>
        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="label">Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
          </label>
          <label className="field">
            <span className="label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Log in as owner'}
          </button>
        </form>
        <p className="muted small">
          Need an owner account? <Link to="/owner/register">Register restaurant</Link>
        </p>
        <p className="muted small center">
          <Link to="/login">Customer log in</Link> · <Link to="/">Welcome</Link>
        </p>
      </div>
    </div>
  )
}
