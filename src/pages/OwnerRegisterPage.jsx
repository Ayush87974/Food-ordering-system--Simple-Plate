import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OwnerRegisterPage() {
  const { registerOwner, isAuthenticated, role } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
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
      await registerOwner({ username, email, password })
      navigate('/owner/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Registration failed'
      setError(typeof msg === 'string' ? msg : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell public">
      <div className="auth-card">
        <h1>Register as restaurant owner</h1>
        <p className="muted">You’ll manage live orders and status updates for your venue.</p>
        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="label">Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
          </label>
          <label className="field">
            <span className="label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span className="label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating owner account…' : 'Register & open kitchen'}
          </button>
        </form>
        <p className="muted small">
          Already registered? <Link to="/owner/login">Owner log in</Link>
        </p>
      </div>
    </div>
  )
}
