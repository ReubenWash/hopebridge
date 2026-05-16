import { Routes, Route, Navigate } from 'react-router-dom'
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

// Home page – shows Navbar + HomePage for guests, redirects logged-in users
function HomeRoute() {
  const { currentUser } = useApp()
  
  // Not logged in – show landing page with Navbar
  if (!currentUser) return <><Navbar /><HomePage /></>
  
  // Logged in – redirect to role-specific dashboard (no Navbar on dashboards)
  if (currentUser.role === 'admin')   return <Navigate to="/admin-dashboard" replace />
  if (currentUser.role === 'creator') return <Navigate to="/creator-dashboard" replace />
  if (currentUser.role === 'donor')   return <Navigate to="/donor-dashboard" replace />
  
  return <><Navbar /><HomePage /></>
}

// Protected route wrapper
function RoleRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useApp()
  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>Loading…</div>
  if (!currentUser) return <Navigate to="/" replace />
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />
  return children
}

function AppContent() {
  const { toast } = useApp()

  return (
    <>
      <PWAInstallPrompt />

      <Routes>
        {/* Home / Landing Page - with Navbar */}
        <Route path="/" element={<HomeRoute />} />

        {/* Campaign Profile - public page, shows Navbar */}
        <Route 
          path="/campaign/:id" 
          element={
            <>
              <Navbar />
              <CampaignProfile />
            </>
          } 
        />

        {/* Donor Dashboard - no Navbar (it has its own sidebar) */}
        <Route
          path="/donor-dashboard"
          element={
            <RoleRoute allowedRoles={['donor']}>
              <DonorDashboard />
            </RoleRoute>
          }
        />

        {/* Creator Dashboard - no Navbar (it has its own sidebar) */}
        <Route
          path="/creator-dashboard"
          element={
            <RoleRoute allowedRoles={['creator']}>
              <CreatorDashboard />
            </RoleRoute>
          }
        />

        {/* Admin Dashboard - no Navbar (it has its own sidebar) */}
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

        {/* Catch-all redirect to home */}
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