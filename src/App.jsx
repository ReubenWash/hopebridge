
// ✅ Correct
import { Routes, Route, Navigate } from 'react-router-dom'
import { Component, useEffect } from 'react'
import { Component } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DonorDashboard from './pages/DonorDashboard'
import CreatorDashboard from './pages/CreatorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CampaignProfile from './pages/CampaignProfile'
import VerifyEmail from './pages/VerifyEmail'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import PWAInstallPrompt from './components/PWAInstallPrompt'

/* ── Error Boundary ─────────────────────────────── */
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
              padding: '10px 24px', background: '#1D9E75', color: '#fff',
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

/* ── Backend warm-up (prevents Koyeb cold-start failures) ── */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const HEALTH_URL = API_URL.replace(/\/api\/?$/, '/health')

function useBackendWarmup() {
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch(HEALTH_URL, { method: 'GET' })
        console.log('🏓 Backend warmed up')
      } catch {
        // Silently ignore — server may still be starting
      }
    }
    ping()
  }, [])
}

/* ── Home route ─────────────────────────────────── */
function HomeRoute() {
  const { currentUser } = useApp()
  if (!currentUser) return <><Navbar /><HomePage /></>
  if (currentUser.role === 'admin')   return <Navigate to="/admin-dashboard" replace />
  if (currentUser.role === 'creator') return <Navigate to="/creator-dashboard" replace />
  if (currentUser.role === 'donor')   return <Navigate to="/donor-dashboard" replace />
  return <><Navbar /><HomePage /></>
}

/* ── Protected route wrapper ────────────────────── */
function RoleRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useApp()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading…
    </div>
  )
  if (!currentUser) return <Navigate to="/" replace />
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />
  return children
}

/* ── App content ────────────────────────────────── */
function AppContent() {
  const { toast } = useApp()

  // Warm up the backend on first load so it's ready when the user interacts
  useBackendWarmup()

  return (
    <>
      <PWAInstallPrompt />

      <Routes>
        {/* Landing page */}
        <Route path="/" element={<HomeRoute />} />

        {/* Campaign profile — public */}
        <Route
          path="/campaign/:id"
          element={<><Navbar /><CampaignProfile /></>}
        />

        {/* Donor dashboard */}
        <Route
          path="/donor-dashboard"
          element={
            <RoleRoute allowedRoles={['donor']}>
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

      <AuthModal />
      {toast && <Toast msg={toast.msg} error={toast.error} />}
    </>
  )
}

/* ── Root ───────────────────────────────────────── */
export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  )
}