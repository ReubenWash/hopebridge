import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CheckCircle, Menu, X, Heart, Home, Target, DollarSign, LayoutDashboard, LogOut, User, Wallet, Settings, Bell, Gift } from 'lucide-react'

export default function Navbar() {
  const { currentUser, logout, openAuth, walletBalance } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const profileRef = useRef()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
    setMobileMenuOpen(false)
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

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    setProfileOpen(false)
    setMobileMenuOpen(false)
    navigate('/')
  }

  const goToDashboard = () => {
    if (!currentUser) return
    if (currentUser.role === 'admin')   navigate('/admin-dashboard')
    if (currentUser.role === 'creator') navigate('/creator-dashboard')
    if (currentUser.role === 'donor')   navigate('/donor-dashboard')
    setProfileOpen(false)
    setMenuOpen(false)
    setMobileMenuOpen(false)
  }

  const goToCampaigns = () => {
    scrollTo('causes')
  }

  const goToDonate = () => {
    scrollTo('donate')
  }

  const initials = currentUser
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : ''

  const roleColor = {
    donor:   '#e8531e',
    creator: '#27a96c',
    admin:   '#6366f1',
  }[currentUser?.role] || '#e8531e'

  const isVerified = currentUser?.is_verified === true

  // Mobile menu items
  const mobileNavItems = [
    { label: 'Home', action: () => { navigate('/'); setMobileMenuOpen(false) }, icon: <Home size={18} /> },
    { label: 'Causes', action: goToCampaigns, icon: <Target size={18} /> },
    { label: 'Donate', action: goToDonate, icon: <Heart size={18} /> },
    { label: 'Dashboard', action: goToDashboard, icon: <LayoutDashboard size={18} />, show: !!currentUser },
    { label: 'Login', action: () => { openAuth('login'); setMobileMenuOpen(false) }, icon: <User size={18} />, show: !currentUser },
    { label: 'Sign Up', action: () => { openAuth('register', 'donor'); setMobileMenuOpen(false) }, icon: <User size={18} />, show: !currentUser },
    { label: 'Start Campaign', action: () => { openAuth('register', 'creator'); setMobileMenuOpen(false) }, icon: <Gift size={18} />, show: !currentUser },
  ]

  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner" style={{ position: 'relative' }}>

          {/* ── LEFT: Profile (if logged in) or Logo ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

            {/* Mobile Menu Button */}
            <button
              className="mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: '#1a1a2e'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

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
                    position: 'relative'
                  }}>
                    {initials}
                    {isVerified && (
                      <CheckCircle 
                        size={12} 
                        style={{ 
                          position: 'absolute', 
                          bottom: -2, 
                          right: -2, 
                          background: '#fff',
                          borderRadius: '50%',
                          color: '#378ADD'
                        }} 
                      />
                    )}
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
                      <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {currentUser.name}
                        {isVerified && <CheckCircle size={14} color="#378ADD" />}
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
                        <LayoutDashboard size={16} />
                        My Dashboard
                      </button>
                      <button onClick={() => { navigate('/'); setProfileOpen(false) }} style={dropdownItemStyle}>
                        <Home size={16} />
                        Home
                      </button>
                      <button onClick={goToCampaigns} style={dropdownItemStyle}>
                        <Target size={16} />
                        Browse Campaigns
                      </button>
                      <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #f3f4f6' }} />
                      <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }}>
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logo */}
            <a
              className="logo"
              onClick={() => { navigate('/'); setMenuOpen(false); setMobileMenuOpen(false) }}
              style={{ marginLeft: currentUser ? 0 : 0, cursor: 'pointer' }}
            >
              <Heart size={18} color="#e8531e" />
              Hope<span>Bridge</span>
            </a>
          </div>

          {/* ── CENTER/RIGHT: Nav links ── */}
          <div className="nav-links">
            <a onClick={goToCampaigns}>Causes</a>
            <a onClick={() => scrollTo('how-it-works')}>How It Works</a>
            <a onClick={goToDonate}>Donate</a>
            <a onClick={() => scrollTo('impact')}>Impact</a>

            {!currentUser ? (
              <>
                <button className="nav-btn nav-btn-outline" onClick={() => openAuth('register', 'creator')}>
                  <Gift size={14} /> Start Campaign
                </button>
                <button className="nav-btn nav-btn-solid" onClick={() => openAuth('login')}>
                  <User size={14} /> Login
                </button>
              </>
            ) : (
              <>
                {currentUser.role !== 'donor' && (
                  <button className="nav-btn nav-btn-outline" onClick={goToDashboard}>
                    <LayoutDashboard size={14} /> Dashboard
                  </button>
                )}
                <button className="nav-btn nav-btn-outline" onClick={handleLogout} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                  <LogOut size={14} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`mobile-sidebar-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <div className="logo" style={{ fontSize: '1.3rem' }}>
            <Heart size={20} color="#e8531e" />
            Hope<span>Bridge</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {currentUser && (
          <div className="mobile-sidebar-user">
            <div className="mobile-user-avatar" style={{
              width: 50, height: 50, borderRadius: '50%',
              background: `linear-gradient(135deg,${roleColor},${roleColor}bb)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1.2rem', color: '#fff'
            }}>
              {initials}
            </div>
            <div className="mobile-user-info">
              <div className="mobile-user-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {currentUser.name}
                {isVerified && <CheckCircle size={14} color="#378ADD" />}
              </div>
              <div className="mobile-user-role" style={{ color: roleColor, fontSize: '0.8rem' }}>{currentUser.role}</div>
            </div>
          </div>
        )}

        <div className="mobile-sidebar-nav">
          <button onClick={() => { navigate('/'); setMobileMenuOpen(false) }} className="mobile-nav-item">
            <Home size={18} /> Home
          </button>
          <button onClick={goToCampaigns} className="mobile-nav-item">
            <Target size={18} /> Causes
          </button>
          <button onClick={() => scrollTo('how-it-works')} className="mobile-nav-item">
            <Info size={18} /> How It Works
          </button>
          <button onClick={goToDonate} className="mobile-nav-item">
            <Heart size={18} /> Donate
          </button>
          <button onClick={() => scrollTo('impact')} className="mobile-nav-item">
            <TrendingUp size={18} /> Impact
          </button>
          
          <div className="mobile-sidebar-divider" />
          
          {currentUser ? (
            <>
              <button onClick={goToDashboard} className="mobile-nav-item">
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button onClick={handleLogout} className="mobile-nav-item" style={{ color: '#ef4444' }}>
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { openAuth('login'); setMobileMenuOpen(false) }} className="mobile-nav-item">
                <User size={18} /> Login
              </button>
              <button onClick={() => { openAuth('register', 'donor'); setMobileMenuOpen(false) }} className="mobile-nav-item">
                <UserPlus size={18} /> Sign Up
              </button>
              <button onClick={() => { openAuth('register', 'creator'); setMobileMenuOpen(false) }} className="mobile-nav-item" style={{ color: '#27a96c' }}>
                <Gift size={18} /> Start Campaign
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .site-nav {
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 20px rgba(0,0,0,.08);
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 72px;
        }
        .logo {
          font-family: 'Raleway', sans-serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: #e8531e;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.5px;
          text-decoration: none;
        }
        .logo span { color: #1a1a2e; }
        .nav-links { display: flex; gap: 26px; align-items: center; }
        .nav-links a {
          text-decoration: none;
          font-weight: 600;
          color: #555;
          font-size: .9rem;
          transition: .2s;
          cursor: pointer;
          letter-spacing: .3px;
          text-transform: uppercase;
        }
        .nav-links a:hover { color: #e8531e; }
        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 4px;
          font-weight: 700;
          font-size: .85rem;
          cursor: pointer;
          border: none;
          transition: all .2s;
          font-family: 'Raleway', sans-serif;
          text-transform: uppercase;
          letter-spacing: .5px;
        }
        .nav-btn-outline {
          background: transparent;
          border: 2px solid #e8531e;
          color: #e8531e;
        }
        .nav-btn-outline:hover { background: #e8531e; color: #fff; }
        .nav-btn-solid {
          background: linear-gradient(135deg, #e8531e, #f47c50);
          color: #fff;
          box-shadow: 0 8px 30px rgba(232,83,30,0.18);
        }
        .nav-btn-solid:hover { transform: translateY(-1px); }
        
        .mobile-hamburger {
          display: none !important;
        }
        
        /* Mobile Sidebar Styles */
        .mobile-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 998;
          display: none;
        }
        .mobile-sidebar-overlay.open {
          display: block;
        }
        .mobile-sidebar-menu {
          position: fixed;
          top: 0;
          left: -300px;
          width: 280px;
          height: 100vh;
          background: #fff;
          z-index: 999;
          transition: left 0.3s ease;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .mobile-sidebar-menu.open {
          left: 0;
        }
        .mobile-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        .mobile-sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: #fafafa;
          border-bottom: 1px solid #f3f4f6;
        }
        .mobile-user-name {
          font-weight: 700;
          font-size: 1rem;
          color: #1a1a2e;
        }
        .mobile-sidebar-nav {
          flex: 1;
          padding: 12px 0;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
          transition: background 0.2s;
          font-family: inherit;
          text-align: left;
        }
        .mobile-nav-item:hover {
          background: #f3f4f6;
        }
        .mobile-sidebar-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 12px 20px;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </>
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

// Add missing icon components
function Info(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
}

function TrendingUp(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>;
}

function UserPlus(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;
}