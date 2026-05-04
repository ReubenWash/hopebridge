import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function AdminLogin() {
  const [email, setEmail]       = useState('admin@hopebridge.com')
  const [password, setPassword] = useState('admin123')
  const [busy, setBusy]         = useState(false)
  const { login, showToast }    = useApp()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const user = await login(email, password)
      if (user.role !== 'admin') {
        showToast('Access denied. Admin only.', true)
        return
      }
      navigate('/admin')
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div style={{ fontSize: '2.8rem', color: 'var(--primary)' }}><i className="fas fa-user-shield"></i></div>
        <h2>Admin Login</h2>
        <div className="auth-hint" style={{ marginTop: 14 }}>admin@hopebridge.com / admin123</div>
        <form onSubmit={handleSubmit} style={{ marginTop: 16, textAlign: 'left' }}>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-submit-btn" style={{ marginTop: 8 }} disabled={busy}>
            {busy ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
        <p style={{ marginTop: 20, textAlign: 'center' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/')}>← Back to Home</span>
        </p>
      </div>
    </div>
  )
}
