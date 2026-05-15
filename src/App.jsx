import { Routes, Route, Navigate } from 'react-router-dom'
import { Component } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DonorDashboard from './pages/DonorDashboard'
import CreatorDashboard from './pages/CreatorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import VerifyEmail from './pages/VerifyEmail'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import PWAInstallPrompt from './components/PWAInstallPrompt'


// Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('ErrorBoundary:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', padding: 20, textAlign: 'center',
        }}>
          <h2 style={{ marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>
            Please refresh the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', background: '#e8531e', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700,
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Home page – redirects logged-in users based on role
// Donors stay on the landing/home page (DonorDashboard IS the home page for them)
function HomeRoute() {
  const { currentUser } = useApp()
  if (!currentUser) return <><Navbar /><HomePage /></>
  if (currentUser.role === 'admin')   return <Navigate to="/admin-dashboard"   replace />
  if (currentUser.role === 'creator') return <Navigate to="/creator-dashboard" replace />
  // Donors see the DonorDashboard which IS the landing page with Navbar
  return <><Navbar /><DonorDashboard /></>
}

// Protected route
function RoleRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useApp()
  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>Loading…</div>
  if (!currentUser) return <Navigate to="/" replace />
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />
  return children
}

function AppContent() {
  const { toast, currentUser } = useApp()

  return (
    <>
      <PWAInstallPrompt />
      

      <Routes>
        {/* Home / Donor landing */}
        <Route path="/" element={<HomeRoute />} />

        {/* Donor explicit dashboard (same component) */}
        <Route
          path="/donor-dashboard"
          element={
            <RoleRoute allowedRoles={['donor']}>
              <Navbar />
              <DonorDashboard />
            </RoleRoute>
          }
        />

        {/* Creator dashboard */}
        <Route
          path="/creator-dashboard"
          element={
            <RoleRoute allowedRoles={['creator']}>
              <CreatorDashboard />
            </RoleRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* Email verification */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Auth Modal – global */}
      <AuthModal />

      {/* Toast notifications */}
      {toast && <Toast msg={toast.msg} error={toast.error} />}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  )
}