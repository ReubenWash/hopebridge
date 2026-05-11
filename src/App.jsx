import { Routes, Route, Navigate } from 'react-router-dom'
import { Component } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreatorDashboard from './pages/CreatorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import DonorDashboard from './pages/DonorDashboard'
import VerifyEmail from './pages/VerifyEmail'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import ScrollButtons from './components/ScrollButtons'
import FirebaseMessaging from './components/FirebaseMessaging'

// Error Boundary component (unchanged)
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support if the issue persists.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
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

// Component to redirect authenticated users away from the home page
function HomeRedirect() {
  const { currentUser } = useApp()
  // No user → show normal home page
  if (!currentUser) return <><Navbar /><HomePage /></>
  // Logged in – redirect to role‑based dashboard (replace = no back to home)
  if (currentUser.role === 'admin') return <Navigate to="/admin-dashboard" replace />
  if (currentUser.role === 'creator') return <Navigate to="/creator-dashboard" replace />
  if (currentUser.role === 'donor') return <Navigate to="/donor-dashboard" replace />
  // fallback (should not happen)
  return <Navigate to="/" replace />
}

// Protected route: only allow specific roles
function RoleRoute({ children, allowedRoles }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/" replace />
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />
  return children
}

function AppContent() {
  const { toast } = useApp()
  return (
    <>
      <PWAInstallPrompt />
      <ScrollButtons />
      <FirebaseMessaging />

      <Routes>
        {/* Home page – redirects logged‑in users to their dashboard */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Protected dashboard routes */}
        <Route 
          path="/creator-dashboard" 
          element={
            <RoleRoute allowedRoles={['creator']}>
              <CreatorDashboard />
            </RoleRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleRoute>
          } 
        />
        <Route 
          path="/donor-dashboard" 
          element={
            <RoleRoute allowedRoles={['donor']}>
              <DonorDashboard />
            </RoleRoute>
          } 
        />

        {/* Other public routes */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Catch‑all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AuthModal />
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