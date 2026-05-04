import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreatorDashboard from './pages/CreatorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import VerifyEmail from './pages/VerifyEmail'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import ScrollButtons from './components/ScrollButtons'
import FirebaseMessaging from './components/FirebaseMessaging'

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
      <AppContent />
    </AppProvider>
  )
}