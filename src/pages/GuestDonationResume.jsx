import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle, XCircle, Send, Upload, Image, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function GuestDonationResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [polling, setPolling] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch donation status
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/guest-donations/status/${id}`);
      const data = await res.json();
      if (res.ok) {
        setDonation(data.donation);
      } else {
        showToast(data.error || 'Donation not found', true);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load donation', true);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStatus();
  }, [id]);

  // Poll for status changes (e.g., from pending_instructions to instructions_sent)
  useEffect(() => {
    if (!donation) return;
    if (donation.payment_status === 'pending_instructions') {
      const interval = setInterval(() => {
        fetchStatus();
      }, 5000);
      setPolling(interval);
      return () => clearInterval(interval);
    } else if (polling) {
      clearInterval(polling);
      setPolling(null);
    }
  }, [donation]);

  // Timer countdown (30 minutes from creation)
  useEffect(() => {
    if (!donation?.created_at) return;
    const expiry = new Date(donation.created_at).getTime() + 30 * 60 * 1000;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [donation?.created_at]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      showToast('Please select a proof image', true);
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('proof', proofFile);
    try {
      const res = await fetch(`${API_URL}/guest-donations/upload-proof/${id}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Proof uploaded! Admin will verify.');
        setProofFile(null);
        setProofPreview(null);
        fetchStatus(); // refresh
      } else {
        showToast(data.error || 'Upload failed', true);
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="guest-resume-container">
        <div className="guest-resume-card">
          <div className="spinner"></div>
          <p>Loading your donation...</p>
        </div>
      </div>
    );
  }

  if (!donation) return null;

  const { payment_status, amount, campaign_title, admin_instructions, guest_name, proof_image_url, admin_notes, created_at } = donation;
  const showTimer = payment_status !== 'approved' && payment_status !== 'rejected';

  return (
    <div className="guest-resume-container">
      <div className="guest-resume-card">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="status-icon">
          {payment_status === 'pending_instructions' && <Clock size={48} className="pending-icon" />}
          {payment_status === 'instructions_sent' && <Send size={48} className="sent-icon" />}
          {payment_status === 'pending_verification' && <Upload size={48} className="pending-icon" />}
          {payment_status === 'approved' && <CheckCircle size={48} className="approved-icon" />}
          {payment_status === 'rejected' && <XCircle size={48} className="rejected-icon" />}
        </div>

        <h2>Donation #{id}</h2>
        <p className="donation-summary">
          <strong>${amount}</strong> to <strong>{campaign_title}</strong>
          {guest_name && <span> by {guest_name}</span>}
        </p>

        <div className="status-badge" data-status={payment_status}>
          {payment_status.replace(/_/g, ' ').toUpperCase()}
        </div>

        {/* Timer (only if not finished) */}
        {showTimer && timeLeft !== null && (
          <div className="escrow-timer">
            <Clock size={14} />
            Session expires in: <strong>{formatTime(timeLeft)}</strong>
            <span className="helper-text">This page updates automatically when admin provides instructions.</span>
          </div>
        )}

        {/* Step 1: Waiting for instructions */}
        {payment_status === 'pending_instructions' && (
          <div className="info-box">
            <Clock size={20} />
            <p>Admin is preparing your payment instructions. This page will update automatically.</p>
          </div>
        )}

        {/* Step 2: Instructions ready */}
        {payment_status === 'instructions_sent' && admin_instructions && (
          <div className="instructions-box">
            <h3>📋 Payment Instructions</h3>
            <div className="instructions-content">{admin_instructions}</div>
            {!proof_image_url && (
              <form onSubmit={handleUpload} className="proof-form">
                <label className="upload-label">
                  <Upload size={16} /> Upload Payment Proof
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
                {proofPreview && (
                  <div className="proof-preview">
                    <img src={proofPreview} alt="Preview" />
                    <button type="button" onClick={() => { setProofFile(null); setProofPreview(null); }}>Remove</button>
                  </div>
                )}
                <button type="submit" disabled={!proofFile || uploading} className="btn-primary">
                  {uploading ? 'Uploading...' : 'Submit Proof'}
                </button>
              </form>
            )}
            {proof_image_url && (
              <div className="proof-uploaded">
                <CheckCircle size={16} /> Proof uploaded – admin will review.
              </div>
            )}
          </div>
        )}

        {/* Step 3: Awaiting verification */}
        {payment_status === 'pending_verification' && (
          <div className="info-box">
            <Clock size={20} />
            <p>Your proof has been received. Admin will verify it shortly.</p>
          </div>
        )}

        {/* Step 4: Approved */}
        {payment_status === 'approved' && (
          <div className="success-box">
            <CheckCircle size={20} />
            <p>Your donation has been approved! Thank you for your generosity.</p>
          </div>
        )}

        {/* Step 5: Rejected */}
        {payment_status === 'rejected' && (
          <div className="error-box">
            <XCircle size={20} />
            <p><strong>Donation not verified</strong></p>
            <p>{admin_notes || 'Please contact support for more information.'}</p>
          </div>
        )}

        <div className="donation-id">
          Donation ID: #{id}
        </div>
      </div>

      <style>{`
        .guest-resume-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .guest-resume-card {
          max-width: 550px;
          width: 100%;
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          text-align: center;
        }
        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
          font-size: 14px;
        }
        .status-icon {
          margin-bottom: 20px;
        }
        .pending-icon { color: #f59e0b; }
        .sent-icon { color: #3b82f6; }
        .approved-icon { color: #10b981; }
        .rejected-icon { color: #ef4444; }
        h2 { margin: 0 0 8px; font-size: 1.5rem; }
        .donation-summary { font-size: 1rem; color: #555; margin-bottom: 16px; }
        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .status-badge[data-status="pending_instructions"] { background: #fef3c7; color: #92400e; }
        .status-badge[data-status="instructions_sent"] { background: #dbeafe; color: #1e40af; }
        .status-badge[data-status="pending_verification"] { background: #fef3c7; color: #92400e; }
        .status-badge[data-status="approved"] { background: #d1fae5; color: #065f46; }
        .status-badge[data-status="rejected"] { background: #fee2e2; color: #991b1b; }
        .info-box, .instructions-box, .success-box, .error-box {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 20px;
          margin: 20px 0;
          text-align: left;
        }
        .info-box { background: #eff6ff; display: flex; gap: 12px; align-items: center; }
        .instructions-box { background: #fefce8; }
        .instructions-box h3 { margin-top: 0; margin-bottom: 12px; font-size: 1rem; }
        .instructions-content { white-space: pre-line; font-size: 14px; line-height: 1.6; background: white; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
        .proof-form { margin-top: 16px; }
        .upload-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e2e8f0;
          padding: 8px 16px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .proof-preview { margin: 12px 0; }
        .proof-preview img { max-width: 100%; max-height: 150px; border-radius: 8px; }
        .btn-primary {
          background: #e8531e;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .proof-uploaded { display: flex; align-items: center; gap: 8px; color: #10b981; margin-top: 12px; }
        .success-box { background: #d1fae5; color: #065f46; display: flex; gap: 12px; align-items: center; }
        .error-box { background: #fee2e2; color: #991b1b; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .donation-id { font-size: 11px; color: #999; margin-top: 20px; }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #e8531e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* Timer styling */
        .escrow-timer {
          background: #f1f5f9;
          border-radius: 12px;
          padding: 12px 16px;
          margin: 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #334155;
          flex-wrap: wrap;
          justify-content: center;
        }
        .helper-text {
          font-size: 11px;
          color: #6c757d;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
}