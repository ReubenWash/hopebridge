import { Routes, Route, Navigate } from 'react-router-dom'
import { Component } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreatorDashboard from './pages/CreatorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import DonorDashboard from './pages/DonorDashboard'      // ← new import
import VerifyEmail from './pages/VerifyEmail'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import ScrollButtons from './components/ScrollButtons'
import FirebaseMessaging from './components/FirebaseMessaging'

// Error Boundary component to catch errors in child components
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

function AppContent() {
  const { toast } = useApp()
  return (
    <>
      <PWAInstallPrompt />
      <ScrollButtons />
      <FirebaseMessaging />

      <Routes>
        <Route path="/" element={<><Navbar /><HomePage /></>} />
        <Route path="/creator" element={<CreatorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />   {/* ← new route */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/" />} />
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