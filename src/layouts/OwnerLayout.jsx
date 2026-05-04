import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OwnerLayout() {
  const { logout, user } = useAuth()

  return (
    <div className="shell owner">
      <nav className="nav">
        <Link className="brand" to="/owner/dashboard">
          FreshPlate · Kitchen
        </Link>
        <div className="nav-links">
          <Link to="/owner/dashboard">Orders</Link>
          <span className="nav-user muted small">{user?.username}</span>
          <button type="button" className="btn ghost tiny" onClick={logout}>
            Log out
          </button>
        </div>
      </nav>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <span>Restaurant owner console · live order board</span>
      </footer>
    </div>
  )
}
