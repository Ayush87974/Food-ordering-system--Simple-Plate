import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated, role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && role === 'OWNER') {
    return <Navigate to="/owner/dashboard" replace />
  }

  if (isAuthenticated && role === 'CUSTOMER') {
    return <Navigate to={from && from !== '/login' ? from : '/menu'} replace />
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login(username, password)
      navigate(res.role === 'OWNER' ? '/owner/dashboard' : '/menu', { replace: true })
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
        <h1>Customer log in</h1>
        <p className="muted">Use your account to browse the menu and place orders.</p>
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
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </form>
        <p className="muted small">
          No account? <Link to="/register">Register</Link>
        </p>
        <div className="auth-divider" />
        <p className="muted small">Running a restaurant?</p>
        <Link className="btn secondary full" to="/owner/login">
          Restaurant owner login
        </Link>
        <p className="muted small center">
          <Link to="/">← Back to welcome</Link>
        </p>
      </div>
    </div>
  )
}
