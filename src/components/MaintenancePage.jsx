import { useEffect, useState } from 'react';
import { publicApi } from '../services/api';

export default function MaintenancePage() {
  const [message, setMessage] = useState('We are currently performing scheduled maintenance. Please check back soon!');
  const [loading, setLoading] = useState(true);

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
  );
}