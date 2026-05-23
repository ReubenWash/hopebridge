// Your existing MaintenancePage.jsx with added button
import { useState } from 'react';
import AdminLoginModal from './AdminLoginModal';

export default function MaintenancePage({ message }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e',
        position: 'relative'
      }}>
        {/* Admin Login Button - Bottom Right Corner */}
        <button
          onClick={() => setShowAdminLogin(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '10px 20px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            zIndex: 1000
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
          }}
        >
          <span>🔒</span>
          Admin Login
        </button>

        {/* Rest of your maintenance page content */}
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <h1>Under Maintenance</h1>
          <p>{message || 'We are currently performing scheduled maintenance. Please check back soon!'}</p>
        </div>
      </div>

      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}
    </>
  );
}