import { useEffect, useState } from 'react';
import { publicApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Direct API call without going through the regular authApi (which might be blocked)
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
      // Use the emergency login endpoint that bypasses maintenance mode
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

      if (response.ok && data.success && data.user && data.user.role === 'admin') {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setCurrentUser(data.user);
        setToast({ msg: 'Welcome back, Admin!', error: false });
        setShowAdminLogin(false);
        
        // Force navigate to admin dashboard
        window.location.href = '/admin-dashboard';
      } else {
        setAdminError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setAdminError('Network error. Please try again.');
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
        <div style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#e8531e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
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
          <i className="fas fa-key"></i>
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
            <i className="fas fa-tools" style={{ fontSize: '40px', color: '#e8531e' }}></i>
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
            color: 'rgba(255,255,255,0.5)'
          }}>
            <i className="fas fa-clock"></i> Estimated completion: within 2 hours
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
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <i className="fas fa-sync-alt"></i> Check Again
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
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#333'}
              onMouseLeave={(e) => e.target.style.color = '#999'}
            >
              ×
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
                <i className="fas fa-shield-alt" style={{ fontSize: '32px', color: '#fff' }}></i>
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
                textAlign: 'center'
              }}>
                <i className="fas fa-exclamation-triangle"></i> {adminError}
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
                  <i className="fas fa-envelope"></i> Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
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

              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  <i className="fas fa-lock"></i> Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
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
                  transition: 'transform 0.2s'
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
                    <i className="fas fa-spinner fa-spin"></i> Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i> Emergency Login
                  </>
                )}
              </button>
            </form>
            
            <p style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '12px',
              color: '#999'
            }}>
              <i className="fas fa-shield-alt"></i> Secure emergency access
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
        .fa-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}