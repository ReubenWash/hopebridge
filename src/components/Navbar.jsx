import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { currentUser, logout, openAuth } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleLogin = () => {
    openAuth('login')
    setMenuOpen(false)
  }

  const handleRegister = () => {
    openAuth('register')
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!currentUser) return null
    if (currentUser.role === 'creator') return '/creator-dashboard'
    if (currentUser.role === 'admin') return '/admin-dashboard'
    if (currentUser.role === 'donor') return '/donor-dashboard'
    return null
  }

  const dashboardUrl = getDashboardLink()
  const isAdmin = currentUser?.role === 'admin'

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <a className="logo" onClick={() => { navigate('/'); setMenuOpen(false); }}>
          <i className="fas fa-heart" style={{ fontSize: '1.2rem' }}></i>
          Hope<span>Bridge</span>
        </a>

        {/* Desktop links */}
        <div className="nav-links">
          <a onClick={() => scrollTo('causes')}>Causes</a>
          <a onClick={() => scrollTo('how-it-works')}>How It Works</a>
          <a onClick={() => scrollTo('donate')}>Donate</a>
          <a onClick={() => scrollTo('impact')}>Impact</a>

          {!currentUser ? (
            <>
              <button className="nav-btn nav-btn-outline" onClick={handleRegister}>
                <i className="fas fa-plus-circle"></i> Start Campaign
              </button>
              <button className="nav-btn nav-btn-solid" onClick={handleLogin}>
                <i className="fas fa-user"></i> Login
              </button>
            </>
          ) : (
            <>
              {/* 🚫 Hide Wallet and Dashboard for admin users */}
              {!isAdmin && (
                <a onClick={() => navigate('/wallet')} style={{ cursor: 'pointer' }}>
                  <i className="fas fa-wallet"></i> Wallet
                </a>
              )}
              {!isAdmin && dashboardUrl && (
                <a onClick={() => navigate(dashboardUrl)} style={{ cursor: 'pointer' }}>
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </a>
              )}
              {/* Optional: Show Admin Panel link only for admins */}
              {isAdmin && (
                <a onClick={() => navigate('/admin-dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fas fa-crown"></i> Admin Panel
                </a>
              )}
              <button className="nav-btn nav-btn-outline" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger button */}
        <button
          className="mobile-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      
      {/* Mobile slide menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="logo" onClick={() => { navigate('/'); setMenuOpen(false); }}>
            <i className="fas fa-heart"></i> HopeBridge
          </span>
        </div>
        <a onClick={() => scrollTo('causes')}>Causes</a>
        <a onClick={() => scrollTo('how-it-works')}>How It Works</a>
        <a onClick={() => scrollTo('donate')}>Donate</a>
        <a onClick={() => scrollTo('impact')}>Impact</a>

        {!currentUser ? (
          <div className="mobile-menu-buttons">
            <button className="nav-btn nav-btn-outline" onClick={handleRegister}>
              <i className="fas fa-plus-circle"></i> Start Campaign
            </button>
            <button className="nav-btn nav-btn-solid" onClick={handleLogin}>
              <i className="fas fa-user"></i> Login
            </button>
          </div>
        ) : (
          <div className="mobile-menu-buttons">
            {!isAdmin && (
              <a onClick={() => { navigate('/wallet'); setMenuOpen(false); }} style={{ cursor: 'pointer', padding: '10px 0' }}>
                <i className="fas fa-wallet"></i> Wallet
              </a>
            )}
            {!isAdmin && dashboardUrl && (
              <a onClick={() => { navigate(dashboardUrl); setMenuOpen(false); }} style={{ cursor: 'pointer', padding: '10px 0' }}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            )}
            {isAdmin && (
              <a onClick={() => { navigate('/admin-dashboard'); setMenuOpen(false); }} style={{ cursor: 'pointer', padding: '10px 0' }}>
                <i className="fas fa-crown"></i> Admin Panel
              </a>
            )}
            <button className="nav-btn nav-btn-outline" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}