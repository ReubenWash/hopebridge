import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  X,
  Heart,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Send,
  UserPlus,
  LogIn,
  ArrowRight,
  ArrowLeft,
  Users,
  Target,
  RefreshCw,
  Zap,
  Star
} from 'lucide-react';

export default function AuthModal() {
  const { authOpen, authMode, authRole, closeAuth, login, register, showToast, openAuth, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState(authMode);
  const [role, setRole] = useState(authRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [verificationEnabled, setVerificationEnabled] = useState(true);
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // reCAPTCHA state
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  useEffect(() => {
    if (authOpen) {
      authApi.getVerificationStatus().then(data => {
        setVerificationEnabled(data.enabled);
      }).catch(() => {});
      // Reset recaptcha when modal opens
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setRecaptchaToken(null);
    }
  }, [authOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!authOpen) return null;

  const switchMode = (m, r) => {
    setMode(m);
    if (r) setRole(r);
    setName(''); setEmail(''); setPassword(''); setCode('');
    setNeedsVerify(false);
    setVerifyEmail('');
    setResendCooldown(0);
    setRecaptchaToken(null);
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'register') {
        // If reCAPTCHA is enabled (site key provided) and no token, block registration
        if (recaptchaSiteKey && !recaptchaToken) {
          showToast('Please complete the reCAPTCHA verification', true);
          setBusy(false);
          return;
        }

        const response = await authApi.register({ 
          name, email, password, role, 
          recaptchaToken: recaptchaToken || null 
        });
        
        if (response.needsVerification) {
          setVerifyEmail(email);
          setPendingEmail(email);
          setNeedsVerify(true);
          setMode('verify');
          showToast('Verification code sent! Please check your email to complete registration.');
        } else {
          closeAuth();
          showToast(`Welcome to HopeBridge, ${name}!`);
          
          const pendingDonation = sessionStorage.getItem('pendingDonation');
          if (pendingDonation) {
            sessionStorage.removeItem('pendingDonation');
            showToast('You can now complete your donation!');
          }
          
          // Reset captcha after successful registration
          if (recaptchaRef.current) recaptchaRef.current.reset();
          setRecaptchaToken(null);
          
          // Redirect to appropriate dashboard
          if (response.user?.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (response.user?.role === 'creator') {
            navigate('/creator-dashboard');
          } else if (response.user?.role === 'donor') {
            navigate('/donor-dashboard');
          }
        }
      } else if (mode === 'login') {
        await login(email, password);
        closeAuth();
        
        const pendingDonation = sessionStorage.getItem('pendingDonation');
        const redirectPath = sessionStorage.getItem('redirectAfterAuth');
        
        if (pendingDonation && redirectPath) {
          sessionStorage.removeItem('pendingDonation');
          sessionStorage.removeItem('redirectAfterAuth');
          navigate(redirectPath);
          showToast('You can now complete your donation!');
        }
      }
    } catch (err) {
      if (err.data?.needsVerification) {
        setVerifyEmail(email);
        setPendingEmail(email);
        setNeedsVerify(true);
        setMode('verify');
        showToast('Please verify your email first.', true);
      } else {
        showToast(err.message, true);
      }
      // Reset recaptcha on registration error
      if (mode === 'register' && recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const response = await authApi.verifyCode({ email: verifyEmail, code });
      
      if (response.token && response.user) {
        const { saveToken } = await import('../services/api');
        saveToken(response.token);
        
        // Set current user in context
        if (setCurrentUser) {
          setCurrentUser(response.user);
        }
        
        showToast('Email verified! Account created successfully.');
        closeAuth();
        
        // Redirect to appropriate dashboard
        if (response.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (response.user.role === 'creator') {
          navigate('/creator-dashboard');
        } else if (response.user.role === 'donor') {
          navigate('/donor-dashboard');
        } else {
          navigate('/');
        }
      } else {
        showToast('Email verified! You can now log in.');
        setMode('login');
        setNeedsVerify(false);
        setCode('');
        setEmail(verifyEmail);
        setPassword('');
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setBusy(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      showToast(`Please wait ${resendCooldown} seconds before resending`, true);
      return;
    }
    
    try {
      await authApi.resendCode(verifyEmail);
      showToast('Verification code resent! Please check your email.');
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      // Check if the error is "email already verified"
      if (err.message && err.message.includes('already verified')) {
        showToast('Your email is already verified! Please login.', true);
        setMode('login');
        setNeedsVerify(false);
        setEmail(verifyEmail);
        setPassword('');
        setCode('');
      } else {
        showToast(err.message, true);
      }
    }
  };

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
  };

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
  };

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
        <button 
          onClick={closeAuth} 
          style={{
            position: 'absolute', top: 16, right: 18,
            background: '#f3f4f6', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6b7280',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <Heart size={36} color="#e8531e" style={{ margin: '0 auto' }} />
          <div style={{ fontFamily: 'Raleway,sans-serif', fontSize: '1.5rem', fontWeight: 900, color: '#1a1a2e', marginTop: 8 }}>
            HopeBridge
          </div>
        </div>

        {/* Verify Mode */}
        {mode === 'verify' && (
          <>
            <h2 style={{ fontSize: '1.3rem', color: '#1a1a2e', marginBottom: 6, textAlign: 'center' }}>
              Verify Your Email
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>
              We sent a 6-digit code to <strong>{verifyEmail}</strong>
            </p>
            <div style={{ fontSize: '0.8rem', color: '#e8531e', textAlign: 'center', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Shield size={14} />
              <span>Your account will be created only after successful verification</span>
            </div>
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
                {busy ? 'Verifying...' : (
                  <>
                    <CheckCircle size={16} style={{ marginRight: 8 }} />
                    Verify & Create Account
                  </>
                )}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.88rem', color: '#6b7280' }}>
              Didn't receive it?{' '}
              <span
                onClick={handleResendCode}
                style={{ 
                  color: resendCooldown > 0 ? '#9ca3af' : '#e8531e', 
                  fontWeight: 700, 
                  cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 4 
                }}
              >
                <RefreshCw size={12} />
                {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend code'}
              </span>
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.85rem' }}>
              <span
                onClick={() => switchMode('login', 'donor')}
                style={{ color: '#6b7280', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <ArrowLeft size={14} />
                Back to login
              </span>
            </div>
          </>
        )}

        {/* Login Mode */}
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
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingLeft: 40 }}
                />
              </div>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingLeft: 40, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" style={btnStyle} disabled={busy}>
                {busy ? 'Signing in...' : (
                  <>
                    <LogIn size={16} style={{ marginRight: 8 }} />
                    Sign In
                  </>
                )}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.88rem', color: '#6b7280' }}>
              No account?{' '}
              <span
                onClick={() => switchMode('register', 'donor')}
                style={{ color: '#e8531e', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <UserPlus size={14} />
                Create one free
              </span>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.85rem' }}>
              <span
                onClick={() => switchMode('register', 'creator')}
                style={{ color: '#27a96c', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <Zap size={14} />
                Start a campaign
                <ArrowRight size={14} />
              </span>
            </div>
          </>
        )}

        {/* Register Mode */}
        {mode === 'register' && (
          <>
            <h2 style={{ fontSize: '1.3rem', color: '#1a1a2e', marginBottom: 6, textAlign: 'center' }}>
              Create Account
            </h2>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20, marginTop: 6 }}>
              {[
                { r: 'donor', label: 'Donor', sub: 'Give to causes', icon: <Heart size={14} /> },
                { r: 'creator', label: 'Creator', sub: 'Run campaigns', icon: <Target size={14} /> },
              ].map(({ r, label, sub, icon }) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {icon}
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: role === r ? (r === 'donor' ? '#e8531e' : '#27a96c') : '#374151' }}>
                      {label}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 2 }}>{sub}</div>
                </button>
              ))}
            </div>

            {verificationEnabled && (
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
                padding: '10px 14px', fontSize: '0.82rem', color: '#1e40af', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Mail size={14} />
                <div>
                  We'll send a verification code to your email.<br />
                  <strong>Your account will be created only after verification.</strong>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Full Name
              </label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <User size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingLeft: 40 }}
                />
              </div>

              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingLeft: 40 }}
                />
              </div>

              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }}>
                Password (min 6 characters)
              </label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ ...inputStyle, paddingLeft: 40, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* reCAPTCHA Widget - only if site key is provided */}
              {recaptchaSiteKey && (
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={(token) => setRecaptchaToken(token)}
                    onExpired={() => setRecaptchaToken(null)}
                  />
                </div>
              )}

              <button type="submit" style={{
                ...btnStyle,
                background: role === 'creator'
                  ? 'linear-gradient(135deg,#27a96c,#059669)'
                  : 'linear-gradient(135deg,#e8531e,#f47c50)',
              }} disabled={busy}>
                {busy ? 'Sending code...' : (
                  <>
                    {role === 'donor' ? <Heart size={16} style={{ marginRight: 8 }} /> : <Zap size={16} style={{ marginRight: 8 }} />}
                    {role === 'donor' ? 'Join as Donor' : 'Start Campaigning'}
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.88rem', color: '#6b7280' }}>
              Already have an account?{' '}
              <span
                onClick={() => switchMode('login', 'donor')}
                style={{ color: '#e8531e', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <LogIn size={14} />
                Sign in
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}