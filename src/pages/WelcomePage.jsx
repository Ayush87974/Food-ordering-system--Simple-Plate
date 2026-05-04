import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function WelcomePage() {
  const { isAuthenticated, role } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={role === 'OWNER' ? '/owner/dashboard' : '/menu'} replace />
  }

  return (
    <div className="shell public">
      <div className="welcome">
        <p className="eyebrow">FoodTech</p>
        <h1>FreshPlate</h1>
        <p className="lead muted">
          Order food online, track your delivery, and let your kitchen update status in real time.
        </p>
        <div className="welcome-actions">
          <Link className="btn" to="/login">
            Log in
          </Link>
          <Link className="btn secondary" to="/register">
            Create account
          </Link>
        </div>
        <p className="muted small">
          Restaurant partner?{' '}
          <Link className="inline-link" to="/owner/login">
            Owner sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
