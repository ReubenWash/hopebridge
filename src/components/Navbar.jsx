import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { openAuth } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  // Open login modal (no role needed)
  const handleLogin = () => {
    openAuth('login')
    setMenuOpen(false)
  }

  // Open registration modal (for creators)
  const handleRegister = () => {
    openAuth('register')
    setMenuOpen(false)
  }

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        {/* Logo */}
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
          <button className="nav-btn nav-btn-outline" onClick={handleRegister}>
            <i className="fas fa-plus-circle"></i> Start Campaign
          </button>
          <button className="nav-btn nav-btn-solid" onClick={handleLogin}>
            <i className="fas fa-user"></i> Login
          </button>
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

      {/* Mobile overlay (optional, can be removed if CSS changes handle it) */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      
      {/* Mobile slide menu (will slide from top after CSS update) */}
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
        <div className="mobile-menu-buttons">
          <button className="nav-btn nav-btn-outline" onClick={handleRegister}>
            <i className="fas fa-plus-circle"></i> Start Campaign
          </button>
          <button className="nav-btn nav-btn-solid" onClick={handleLogin}>
            <i className="fas fa-user"></i> Login
          </button>
        </div>
      </div>
    </nav>
  )
}