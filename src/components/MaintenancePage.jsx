import { useEffect, useState } from 'react';
import { publicApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, Key, Mail, Shield, AlertTriangle, Loader, RefreshCw, Clock, Tool, X, LogIn } from 'lucide-react';

// Direct API call without going through the regular authApi
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function MaintenancePage() {
  const [message, setMessage] = useState('We are currently performing scheduled maintenance. Please check back soon!');
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  
  const { setCurrentUser, setToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const data = await publicApi.getMaintenanceStatus();
        if (data.message) setMessage(data.message);
      } catch (err) {
        console.error('Failed to fetch maintenance message:', err);
      } finally {
        setLoading(false);
      }
    };
    checkMaintenance();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError('');

    try {
      console.log('Attempting emergency login for:', adminEmail);
      
      const response = await fetch(`${API_URL}/admin/emergency-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: adminEmail, 
          password: adminPassword 
        }),
      });

      const data = await response.json();
      console.log('Emergency login response:', response.status, data);

      if (response.ok && data.success && data.user && data.user.role === 'admin') {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update context
        if (setCurrentUser && typeof setCurrentUser === 'function') {
          setCurrentUser(data.user);
        }
        
        if (setToast && typeof setToast === 'function') {
          setToast({ msg: 'Welcome back, Admin!', error: false });
        }
        
        setShowAdminLogin(false);
        
        // Force redirect to admin dashboard
        window.location.href = '/admin-dashboard';
      } else {
        setAdminError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error details:', err);
      setAdminError('Network error. Please check your connection and try again.');
    } finally {
      setAdminLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff'
      }}>
        <Loader size={48} style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        fontFamily: "'DM Sans', sans-serif",
        padding: '20px',
        position: 'relative'
      }}>
        {/* Admin Login Button */}
        <button
          onClick={() => setShowAdminLogin(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '40px',
            padding: '12px 24px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
          }}
        >
          <Key size={18} />
          Admin Login
        </button>

        {/* Maintenance Content */}
        <div style={{
          textAlign: 'center',
          maxWidth: '500px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '48px 32px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(232,83,30,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Tool size={40} color="#e8531e" />
          </div>
          <h1 style={{
            fontSize: '28px',
            marginBottom: '16px',
            color: '#fff'
          }}>Under Maintenance</h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            {message}
          </p>
          <div style={{
            width: '60px',
            height: '4px',
            background: 'linear-gradient(135deg, #e8531e, #f47c50)',
            borderRadius: '2px',
            margin: '0 auto 24px'
          }}></div>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Clock size={14} />
            Estimated completion: within 2 hours
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '32px',
              background: 'linear-gradient(135deg, #e8531e, #f47c50)',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '40px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '32px auto 0'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <RefreshCw size={16} />
            Check Again
          </button>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setShowAdminLogin(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '40px',
              width: '90%',
              maxWidth: '420px',
              position: 'relative',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAdminLogin(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                transition: 'color 0.2s',
                padding: '4px'
              }}
              onMouseEnter={(e) => e.target.style.color = '#333'}
              onMouseLeave={(e) => e.target.style.color = '#999'}
            >
              <X size={24} />
            </button>

            {/* Icon */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #e8531e, #f47c50)',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Shield size={32} color="#fff" />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0,
                color: '#1a1a2e'
              }}>
                Emergency Admin Access
              </h2>
              <p style={{
                color: '#666',
                marginTop: '8px',
                fontSize: '14px'
              }}>
                Enter your admin credentials to access the dashboard
              </p>
            </div>

            {/* Error Message */}
            {adminError && (
              <div style={{
                background: '#fee',
                color: '#c33',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontSize: '14px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} />
                {adminError}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@hopebridge.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 40px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#e8531e'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 40px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#e8531e'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={adminLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #e8531e, #f47c50)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: adminLoading ? 'not-allowed' : 'pointer',
                  opacity: adminLoading ? 0.7 : 1,
                  transition: 'transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!adminLoading) e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (!adminLoading) e.target.style.transform = 'translateY(0)';
                }}
              >
                {adminLoading ? (
                  <>
                    <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Emergency Login
                  </>
                )}
              </button>
            </form>
            
            <p style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '12px',
              color: '#999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <Shield size={12} />
              Secure emergency access
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}