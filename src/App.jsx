import { useEffect, Component, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { publicApi } from './services/api'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import DonorDashboard from './pages/DonorDashboard'
import CreatorDashboard from './pages/CreatorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import CampaignProfile from './pages/CampaignProfile'
import GuestDonationResume from './pages/GuestDonationResume';


import VerifyEmail from './pages/VerifyEmail'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PushNotificationSetup from './components/PushNotificationSetup'
import MaintenancePage from './components/MaintenancePage'
import { initFirebase } from './services/firebase' // Add this import

// Initialize Firebase on app start
initFirebase();

/* ── Error Boundary ─────────────────────────────── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) { 
    return { hasError: true, error: error.message } 
  }
  
  componentDidCatch(error, info) { 
    console.error('ErrorBoundary caught:', error, info)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', padding: 20, textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>😞</div>
          <h2 style={{ marginBottom: 12, color: '#1a1a2e' }}>Something went wrong</h2>
          <p style={{ color: '#6b7280', marginBottom: 20, maxWidth: 400 }}>
            {this.state.error || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', background: '#1D9E75', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Refresh Page
          </button>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: 12,
              padding: '10px 24px', background: 'transparent', color: '#6b7280',
              border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', fontWeight: 500,
            }}
          >
            Go to Homepage
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
        const response = await fetch(HEALTH_URL, { method: 'GET' })
        if (response.ok) {
          console.log('🏓 Backend warmed up successfully')
        } else {
          console.log('🏓 Backend warming up (status:', response.status, ')')
        }
      } catch {
        console.log('🏓 Backend warming up...')
      }
    }
    ping()
    
    const interval = setInterval(ping, 5 * 60 * 1000)
    return () => clearInterval(interval)
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
  
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', flexDirection: 'column', gap: 16 
      }}>
        <div style={{ 
          width: 40, height: 40, border: '3px solid #e5e7eb', 
          borderTopColor: '#1D9E75', borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
        <p style={{ color: '#6b7280' }}>Loading...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }
  
  if (!currentUser) return <Navigate to="/" replace />
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />
  return children
}

/* ── Component to check if route should be blocked by maintenance ── */
function MaintenanceWrapper({ children }) {
  const { currentUser } = useApp()
  const location = useLocation()
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [checkingMaintenance, setCheckingMaintenance] = useState(true)

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const data = await publicApi.getMaintenanceStatus()
        setMaintenanceMode(data.maintenance_mode === true || data.enabled === true)
        setMaintenanceMessage(data.message || 'We are currently performing scheduled maintenance. Please check back soon!')
      } catch (err) {
        console.error('Failed to check maintenance status:', err)
      } finally {
        setCheckingMaintenance(false)
      }
    }
    checkMaintenance()
  }, [])

  // Routes that should NEVER be blocked (even during maintenance)
  const allowedRoutes = ['/admin-login', '/verify-email', '/admin-dashboard']
  const isAllowedRoute = allowedRoutes.includes(location.pathname)
  
  // Admin users can access everything
  const isAdmin = currentUser?.role === 'admin'

  // If admin is logged in, don't show maintenance page
  if (isAdmin) {
    return children
  }

  if (checkingMaintenance) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e'
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#e8531e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Show maintenance page for non-admin users when maintenance mode is enabled
  // EXCEPT on allowed routes
  if (maintenanceMode && !isAdmin && !isAllowedRoute) {
    return <MaintenancePage message={maintenanceMessage} />
  }

  return children
}

/* ── App content ────────────────────────────────── */
function AppContent() {
  const { toast, currentUser } = useApp()

  useBackendWarmup()

  return (
    <MaintenanceWrapper>
      <PWAInstallPrompt />
      <PushNotificationSetup />

      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/campaign/:id" element={<><Navbar /><CampaignProfile /></>} />
        <Route path="/donor-dashboard" element={<RoleRoute allowedRoles={['donor']}><DonorDashboard /></RoleRoute>} />
        <Route path="/creator-dashboard" element={<RoleRoute allowedRoles={['creator']}><CreatorDashboard /></RoleRoute>} />
        <Route path="/admin-dashboard" element={<RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/guest-donation/resume/:id" element={<GuestDonationResume />} />
      </Routes>

      <AuthModal />
      {toast && <Toast msg={toast.msg} error={toast.error} />}
    </MaintenanceWrapper>
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