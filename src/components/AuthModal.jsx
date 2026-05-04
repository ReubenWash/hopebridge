import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { authApi } from '../services/api'

const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Google test key

export default function AuthModal() {
  const { authOpen, closeAuth, login, register, showToast } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')        // 'login' or 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const recapRef = useRef(null)
  const recapToken = useRef('')

  // Verification state
  const [verifyStep, setVerifyStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [verifyBusy, setVerifyBusy] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  // Demo credentials for creator (and admin can use their own)
  const demoCreator = () => {
    setEmail('emily@hope.org')
    setPassword('pass123')
  }

  // Render reCAPTCHA when switching to register mode
  useEffect(() => {
    if (mode === 'register' && recapRef.current && window.grecaptcha) {
      if (recapRef.current.children.length > 0) {
        window.grecaptcha.reset()
      } else {
        window.grecaptcha.render(recapRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token) => { recapToken.current = token },
        })
      }
    }
  }, [mode])

  const resetRecaptcha = () => {
    if (window.grecaptcha) window.grecaptcha.reset()
    recapToken.current = ''
  }

  // Handle login / registration
  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'login') {
        const user = await login(email, password)
        closeAuth()
        if (user.role === 'creator') navigate('/creator')
        else if (user.role === 'admin') navigate('/admin')
      } else {
        // Registration validation
        if (!agreed) throw new Error('You must agree to the Terms & Privacy Policy.')
        if (password !== confirm) throw new Error('Passwords do not match.')
        if (!recapToken.current) throw new Error('Please complete the reCAPTCHA.')

        // Always register as 'creator'
        await register(name, email, password, 'creator', recapToken.current)
        setRegisteredEmail(email)
        setVerifyStep(true)
        resetRecaptcha()
      }
    } catch (err) {
      showToast(err.message, true)
      if (mode === 'register') resetRecaptcha()
    } finally {
      setBusy(false)
    }
  }

  // Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setVerifyError('')
    if (!verificationCode || verificationCode.length !== 6) {
      setVerifyError('Please enter the 6-digit code.')
      return
    }
    setVerifyBusy(true)
    try {
      await authApi.verifyCode({ email: registeredEmail, code: verificationCode })
      showToast('Email verified! Welcome aboard.')
      closeAuth()
    } catch (err) {
      setVerifyError(err.message)
    } finally {
      setVerifyBusy(false)
    }
  }

  // Reset verification step when modal is closed
  useEffect(() => {
    if (!authOpen) {
      setVerifyStep(false)
      setVerificationCode('')
      setVerifyError('')
    }
  }, [authOpen])

  if (!authOpen) return null

  return (
    <div className="auth-overlay" onClick={e => e.target === e.currentTarget && closeAuth()}>
      <div className="auth-box">
        <button className="auth-close" onClick={closeAuth}><i className="fas fa-times"></i></button>

        {!verifyStep ? (
          <>
            <div className="auth-icon-big"><i className="fas fa-hand-holding-heart"></i></div>
            <h2>{mode === 'login' ? 'Welcome Back' : 'Become a Creator'}</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginBottom: '20px' }}>
              {mode === 'login' ? 'Sign in to manage campaigns' : 'Start raising funds for your cause'}
            </p>

            {/* Demo hint for creators */}
            <div className="auth-hint" style={{ cursor: 'pointer' }} onClick={demoCreator}>
              <strong>Demo Creator:</strong> emily@hope.org / pass123
            </div>
            <div className="auth-hint" style={{ marginTop: 8, opacity: 0.7 }}>
              <strong>Admin:</strong> use your credentials
            </div>

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              )}
              <div className="auth-field">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              {mode === 'register' && (
                <>
                  <div className="auth-field">
                    <label>Confirm Password</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                  </div>

                  <label className="terms-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0', fontSize: '.85rem' }}>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                    />
                    I agree to the <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Terms</span> & <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
                  </label>

                  <div className="recaptcha-wrapper" style={{ margin: '14px 0' }}>
                    <div ref={recapRef} id="recaptcha-container"></div>
                    <p style={{ fontSize: '.72rem', color: 'var(--text-light)', marginTop: '6px' }}>
                      This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
                    </p>
                  </div>
                </>
              )}

              <button type="submit" className="auth-submit-btn" disabled={busy}>
                {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create My Account'}
              </button>
            </form>

            <div className="auth-toggle">
              {mode === 'login'
                ? <span onClick={() => setMode('register')}>Don't have an account? Register as Creator</span>
                : <span onClick={() => setMode('login')}>Already have an account? Sign In</span>
              }
            </div>
          </>
        ) : (
          <div className="verify-code-step">
            <div className="auth-icon-big"><i className="fas fa-envelope-open-text"></i></div>
            <h3>Check Your Email</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginBottom: '20px' }}>
              A 6‑digit code has been sent to <strong>{registeredEmail}</strong>.
            </p>

            <form onSubmit={handleVerifyCode}>
              <div className="auth-field">
                <label>Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '.5rem', fontWeight: 700 }}
                  required
                  autoFocus
                />
              </div>

              {verifyError && (
                <div className="auth-hint" style={{ color: '#c0392b', marginBottom: 12 }}>
                  {verifyError}
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={verifyBusy}>
                {verifyBusy ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <button
              className="btn-outline-custom"
              style={{ marginTop: 12, width: '100%' }}
              onClick={() => {
                setVerifyStep(false)
                setVerificationCode('')
                setVerifyError('')
              }}
            >
              ← Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}