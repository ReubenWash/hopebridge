import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { authApi } from '../services/api'

export default function AuthModal() {
  const { authOpen, authMode, authRole, closeAuth, login, register, showToast, openAuth } = useApp()

  const [mode, setMode]         = useState(authMode)   // 'login' | 'register' | 'verify'
  const [role, setRole]         = useState(authRole)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode]         = useState('')
  const [busy, setBusy]         = useState(false)
  const [needsVerify, setNeedsVerify] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState('')
  const [showPass, setShowPass] = useState(false)

  if (!authOpen) return null

  const switchMode = (m, r) => {
    setMode(m)
    if (r) setRole(r)
    setName(''); setEmail(''); setPassword(''); setCode('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'register') {
        const user = await register(name, email, password, role, null)
        if (role === 'creator') {
          setVerifyEmail(email)
          setNeedsVerify(true)
          setMode('verify')
        } else {
          // Donor – auto-verified, just close
          closeAuth()
          showToast(`Welcome to HopeBridge, ${user.name}! 🎉`)
        }
      } else if (mode === 'login') {
        await login(email, password)
        closeAuth()
      }
    } catch (err) {
      if (err.data?.needsVerification) {
        setVerifyEmail(email)
        setNeedsVerify(true)
        setMode('verify')
        showToast('Please verify your email first.', true)
      } else {
        showToast(err.message, true)
      }
    } finally {
      setBusy(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await authApi.verifyCode({ email: verifyEmail, code })
      showToast('Email verified! You can now log in.')
      setMode('login')
      setNeedsVerify(false)
      setCode('')
      setEmail(verifyEmail)
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setBusy(false)
    }
  }

  const handleResendCode = async () => {
    try {
      await authApi.resendCode(verifyEmail)
      showToast('Verification code resent!')
    } catch (err) {
      showToast(err.message, true)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '2px solid #e9ecef',
    borderRadius: 8,
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    transition: '0.2s',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 14,
    color: '#1a1a2e',
    background: '#fff',
  }

  const btnStyle = {
    width: '100%',
    background: 'linear-gradient(135deg,#e8531e,#f47c50)',
    color: '#fff',
    border: 'none',
    padding: '13px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: '1rem',
    cursor: busy ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    opacity: busy ? 0.7 : 1,
    transition: '0.2s',
    marginTop: 4,
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        zIndex: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => e.target === e.currentTarget && closeAuth()}
    >
      <div style={{
        background: '#fff',
        borderRadius: 18,
        padding: '36px 32px',
        width: '100%',
        maxWidth: 440,
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
        fontFamily: "'DM Sans',sans-serif",
      }}>
        {/* Close */}
        <button onClick={closeAuth} style={{
          position: 'absolute', top: 16, right: 18,
          background: '#f3f4f6', border: 'none', borderRadius: '50%',
          width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#6b7280',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: '2.2rem', color: '#e8531e' }}>❤</div>
          <div style={{ fontFamily: 'Raleway,sans-serif', fontSize: '1.5rem', fontWeight: 900, color: '#1a1a2e' }}>
            HopeBridge
          </div>
        </div>

        {/* ── VERIFY EMAIL ── */}
        {mode === 'verify' && (
          <>
            <h2 style={{ fontSize: '1.3rem', color: '#1a1a2e', marginBottom: 6, textAlign: 'center' }}>
              Verify Your Email
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>
              We sent a 6-digit code to <strong>{verifyEmail}</strong>
            </p>
            <form onSubmit={handleVerify}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g,''))}
                placeholder="000000"
                required
                style={{
                  ...inputStyle,
                  textAlign: 'center',
                  letterSpacing: 10,
                  fontSize: '1.6rem',
                  fontWeight: 700,
                }}
              />
              <button type="submit" style={btnStyle} disabled={busy}>
                {busy ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.88rem', color: '#6b7280' }}>
              Didn't receive it?{' '}
              <span
                onClick={handleResendCode}
                style={{ color: '#e8531e', fontWeight: 700, cursor: 'pointer' }}
              >
                Resend code
              </span>
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.85rem' }}>
              <span
                onClick={() => setMode('login')}
                style={{ color: '#6b7280', cursor: 'pointer' }}
              >
                ← Back to login
              </span>
            </div>
          </>
        )}

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <>
            <h2 style={{ fontSize: '1.4rem', color: '#1a1a2e', marginBottom: 6, textAlign: 'center' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', textAlign: 'center', marginBottom: 22 }}>
              Sign in to your account
            </p>
            <form onSubmit={handleSubmit}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=""
                required
                style={inputStyle}
              />
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder=""
                  required
                  style={{ ...inputStyle, marginBottom: 0, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16,
                  }}
                >
                  
                </button>
              </div>
              <button type="submit" style={btnStyle} disabled={busy}>
                {busy ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.88rem', color: '#6b7280' }}>
              No account?{' '}
              <span
                onClick={() => switchMode('register', 'donor')}
                style={{ color: '#e8531e', fontWeight: 700, cursor: 'pointer' }}
              >
                Create one free
              </span>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem' }}>
              <span
                onClick={() => switchMode('register', 'creator')}
                style={{ color: '#27a96c', fontWeight: 700, cursor: 'pointer' }}
              >
                Start a campaign →
              </span>
            </div>
          </>
        )}

        {/* ── REGISTER ── */}
        {mode === 'register' && (
          <>
            <h2 style={{ fontSize: '1.3rem', color: '#1a1a2e', marginBottom: 6, textAlign: 'center' }}>
              Create Account
            </h2>

            {/* Role selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, marginTop: 6 }}>
              {[
                { r: 'donor',   label: ' Donor',   sub: 'Give to causes' },
                { r: 'creator', label: 'Creator', sub: 'Run campaigns' },
              ].map(({ r, label, sub }) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1,
                    border: `2px solid ${role === r ? (r === 'donor' ? '#e8531e' : '#27a96c') : '#e5e7eb'}`,
                    borderRadius: 12,
                    padding: '12px 8px',
                    cursor: 'pointer',
                    background: role === r ? (r === 'donor' ? '#fff5f0' : '#f0fdf4') : '#fff',
                    transition: '0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: role === r ? (r === 'donor' ? '#e8531e' : '#27a96c') : '#374151' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 2 }}>{sub}</div>
                </button>
              ))}
            </div>

            {role === 'donor' && (
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
                padding: '10px 14px', fontSize: '0.82rem', color: '#1e40af', marginBottom: 16,
              }}>
              
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder=""
                required
                style={inputStyle}
              />
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=""
                required
                style={inputStyle}
              />
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder=""
                  required
                  minLength={6}
                  style={{ ...inputStyle, marginBottom: 0, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16,
                  }}
                >
                  
                </button>
              </div>

              <button type="submit" style={{
                ...btnStyle,
                background: role === 'creator'
                  ? 'linear-gradient(135deg,#27a96c,#059669)'
                  : 'linear-gradient(135deg,#e8531e,#f47c50)',
              }} disabled={busy}>
                {busy ? 'Creating...' : role === 'donor' ? '❤ Join as Donor' : '🚀 Start Campaigning'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.88rem', color: '#6b7280' }}>
              Already have an account?{' '}
              <span
                onClick={() => switchMode('login')}
                style={{ color: '#e8531e', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign in
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}