import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import CustomerLayout from './layouts/CustomerLayout'
import OwnerLayout from './layouts/OwnerLayout'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OwnerLoginPage from './pages/OwnerLoginPage'
import OwnerRegisterPage from './pages/OwnerRegisterPage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderPage from './pages/OrderPage'
import MyOrdersPage from './pages/MyOrdersPage'
import PaymentPage from './pages/PaymentPage'
import PaymentReturnPage from './pages/PaymentReturnPage'
import OwnerDashboardPage from './pages/OwnerDashboardPage'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/owner/login" element={<OwnerLoginPage />} />
            <Route path="/owner/register" element={<OwnerRegisterPage />} />

            <Route element={<ProtectedRoute role="CUSTOMER" />}>
              <Route element={<CustomerLayout />}>
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders/:id" element={<OrderPage />} />
                <Route path="/orders/:id/payment" element={<PaymentPage />} />
                <Route path="/orders/:id/payment/return" element={<PaymentReturnPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute role="OWNER" />}>
              <Route element={<OwnerLayout />}>
                <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
