import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CustomerLayout() {
  const { logout, user } = useAuth()

  return (
    <div className="shell">
      <nav className="nav">
        <Link className="brand" to="/menu">
          FreshPlate
        </Link>
        <div className="nav-links">
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/my-orders">My orders</Link>
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
        <span>Online Food Ordering · Signed in as customer</span>
      </footer>
    </div>
  )
}
