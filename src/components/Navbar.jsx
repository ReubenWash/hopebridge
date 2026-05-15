import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { currentUser, logout, openAuth, walletBalance } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    setProfileOpen(false)
    navigate('/')
  }

  const goToDashboard = () => {
    if (!currentUser) return
    if (currentUser.role === 'admin')   navigate('/admin-dashboard')
    if (currentUser.role === 'creator') navigate('/creator-dashboard')
    if (currentUser.role === 'donor')   navigate('/donor-dashboard')
    setProfileOpen(false)
    setMenuOpen(false)
  }

  const initials = currentUser
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : ''

  const roleColor = {
    donor:   '#e8531e',
    creator: '#27a96c',
    admin:   '#6366f1',
  }[currentUser?.role] || '#e8531e'

  return (
    <nav className="site-nav">
      <div className="nav-inner" style={{ position: 'relative' }}>

        {/* ── LEFT: Profile (if logged in) or Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {currentUser && (
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  border: `2px solid ${roleColor}20`,
                  borderRadius: 40, padding: '6px 14px 6px 6px',
                  cursor: 'pointer', transition: '0.15s', fontFamily: 'inherit',
                  background: profileOpen ? `${roleColor}10` : '#fff',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: `linear-gradient(135deg,${roleColor},${roleColor}bb)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: '#fff', fontSize: '0.85rem', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap' }}>
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: roleColor, fontWeight: 600, textTransform: 'capitalize' }}>
                    {currentUser.role}
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"
                  style={{ marginLeft: 2, transform: profileOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                  background: '#fff', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                  border: '1px solid #f3f4f6', minWidth: 220, zIndex: 300,
                  overflow: 'hidden', fontFamily: "'DM Sans',sans-serif",
                }}>
                  {/* Header */}
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
                    <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 2 }}>
                      {currentUser.email}
                    </div>
                    {currentUser.role === 'donor' && (
                      <div style={{
                        marginTop: 8, background: '#e1f5ee', borderRadius: 8,
                        padding: '6px 10px', fontSize: '0.82rem',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span style={{ color: '#0F6E56' }}>💰 Wallet</span>
                        <strong style={{ color: '#0F6E56' }}>${walletBalance.toFixed(2)}</strong>
                      </div>
                    )}
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '8px 0' }}>
                    <button onClick={goToDashboard} style={dropdownItemStyle}>
                      <span>📊</span> My Dashboard
                    </button>
                    {currentUser.role !== 'admin' && (
                      <button onClick={() => { navigate('/'); setProfileOpen(false) }} style={dropdownItemStyle}>
                        <span>🏠</span> Home
                      </button>
                    )}
                    <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #f3f4f6' }} />
                    <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }}>
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logo */}
          <a
            className="logo"
            onClick={() => { navigate('/'); setMenuOpen(false) }}
            style={{ marginLeft: currentUser ? 0 : 0 }}
          >
            <i className="fas fa-heart" style={{ fontSize: '1.1rem' }}></i>
            Hope<span>Bridge</span>
          </a>
        </div>

        {/* ── CENTER/RIGHT: Nav links ── */}
        <div className="nav-links">
          <a onClick={() => scrollTo('causes')}>Causes</a>
          <a onClick={() => scrollTo('how-it-works')}>How It Works</a>
          <a onClick={() => scrollTo('donate')}>Donate</a>
          <a onClick={() => scrollTo('impact')}>Impact</a>

          {!currentUser ? (
            <>
              <button className="nav-btn nav-btn-outline" onClick={() => openAuth('register', 'creator')}>
                <i className="fas fa-plus-circle"></i> Start Campaign
              </button>
              <button className="nav-btn nav-btn-solid" onClick={() => openAuth('login')}>
                <i className="fas fa-user"></i> Login
              </button>
            </>
          ) : (
            <>
              {currentUser.role !== 'donor' && (
                <button className="nav-btn nav-btn-outline" onClick={goToDashboard}>
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </button>
              )}
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="mobile-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile slide menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="logo">
            <i className="fas fa-heart"></i> HopeBridge
          </span>
        </div>

        {/* Profile info on mobile */}
        {currentUser && (
          <div style={{
            background: '#f9fafb', borderRadius: 12, padding: '12px 14px',
            marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: `linear-gradient(135deg,${roleColor},${roleColor}bb)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: '#fff', fontSize: '0.85rem',
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: roleColor, fontWeight: 600 }}>
                {currentUser.role}
              </div>
            </div>
          </div>
        )}

        <a onClick={() => scrollTo('causes')}>Causes</a>
        <a onClick={() => scrollTo('how-it-works')}>How It Works</a>
        <a onClick={() => scrollTo('donate')}>Donate</a>
        <a onClick={() => scrollTo('impact')}>Impact</a>

        {!currentUser ? (
          <div className="mobile-menu-buttons">
            <button className="nav-btn nav-btn-outline" onClick={() => { openAuth('register', 'creator'); setMenuOpen(false) }}>
              <i className="fas fa-plus-circle"></i> Start Campaign
            </button>
            <button className="nav-btn nav-btn-solid" onClick={() => { openAuth('login'); setMenuOpen(false) }}>
              <i className="fas fa-user"></i> Login / Register
            </button>
          </div>
        ) : (
          <div className="mobile-menu-buttons">
            <button className="nav-btn nav-btn-outline" onClick={goToDashboard}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </button>
            <button className="nav-btn nav-btn-solid" onClick={handleLogout} style={{ background: '#ef4444' }}>
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

const dropdownItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  width: '100%', padding: '10px 18px',
  background: 'none', border: 'none',
  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
  fontSize: '0.9rem', color: '#374151', fontWeight: 500,
  textAlign: 'left', transition: '0.12s',
}