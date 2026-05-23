import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      
      if (data.token && data.user) {
        // Save token
        localStorage.setItem('hb_token', data.token);
        
        // Check if user is admin
        if (data.user.role === 'admin') {
          showToast('Welcome back, Admin!');
          navigate('/admin-dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
          // Clear token if not admin
          localStorage.removeItem('hb_token');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      fontFamily: "'DM Sans', sans-serif",
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #e8531e, #f47c50)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <i className="fas fa-shield-alt" style={{ fontSize: '28px', color: '#fff' }}></i>
          </div>
          <h2 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Admin Access</h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Enter your credentials to access the admin panel
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#e8531e' }}></i>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hopebridge.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#e8531e'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              <i className="fas fa-lock" style={{ marginRight: '8px', color: '#e8531e' }}></i>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#e8531e'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #e8531e, #f47c50)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.2s, opacity 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                Authenticating...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>
                Login as Admin
              </>
            )}
          </button>
        </form>

        {/* Back to Home Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a
            href="/"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#e8531e'}
            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '6px' }}></i>
            Back to Homepage
          </a>
        </div>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '10px',
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <i className="fas fa-info-circle"></i> Demo Admin Credentials:<br />
          Email: <strong>admin@hopebridge.com</strong><br />
          Password: <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}