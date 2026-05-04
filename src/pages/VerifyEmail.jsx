import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi } from '../services/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    authApi.verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Your email has been verified! You can now sign in.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may be invalid or expired.');
      });
  }, [token]);

  return (
    <div className="verify-page" style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', background: 'var(--bg-light)', padding: '1rem' 
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '40px',
        maxWidth: '480px', width: '100%', textAlign: 'center',
        boxShadow: 'var(--shadow-card)'
      }}>
        {status === 'loading' && (
          <>
            <i className="fas fa-spinner fa-pulse" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
            <h2 style={{ margin: '20px 0 10px' }}>Verifying your email...</h2>
            <p style={{ color: 'var(--text-light)' }}>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: 'var(--secondary)' }}></i>
            <h2 style={{ margin: '20px 0 10px', color: 'var(--secondary)' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text)' }}>{message}</p>
            <a href="/" className="btn-primary-custom" style={{ marginTop: '20px', textDecoration: 'none' }}>
              Go to Home
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <i className="fas fa-times-circle" style={{ fontSize: '3rem', color: '#c0392b' }}></i>
            <h2 style={{ margin: '20px 0 10px', color: '#c0392b' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text)' }}>{message}</p>
            <a href="/" className="btn-primary-custom" style={{ marginTop: '20px', textDecoration: 'none' }}>
              Return to Home
            </a>
          </>
        )}
      </div>
    </div>
  );
}