import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { walletApi, authApi } from '../services/api';

const AMOUNT_PRESETS = [10, 25, 50, 100, 250];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DonationForm({ campaignId: propCampaignId, onSuccess }) {
  const { currentUser, approvedCampaigns, loadCampaigns, walletBalance, refreshWallet, showToast, openAuth } = useApp();

  const [campaignId, setCampaignId] = useState(propCampaignId || '');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState(50);
  const [activePreset, setActivePreset] = useState(50);
  const [message, setMessage] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Guest donation states
  const [donationMode, setDonationMode] = useState('login'); // 'login' or 'guest'
  const [guestStep, setGuestStep] = useState(1);
  const [guestDonationId, setGuestDonationId] = useState(null);
  const [guestInstructions, setGuestInstructions] = useState(null);
  const [guestProofFile, setGuestProofFile] = useState(null);
  const [guestProofPreview, setGuestProofPreview] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setDonorName(currentUser.name || '');
      setDonorEmail(currentUser.email || '');
      setDonationMode('login');
    }
    loadCampaigns();
  }, [currentUser]);

  // Reset guest donation state
  const resetGuestDonation = () => {
    setGuestStep(1);
    setGuestDonationId(null);
    setGuestInstructions(null);
    setGuestProofFile(null);
    setGuestProofPreview(null);
    setGuestError(null);
    setGuestLoading(false);
  };

  // Guest: Request donation
  const handleGuestRequestDonation = async (e) => {
    e.preventDefault();
    if (!campaignId) {
      showToast('Please select a campaign', true);
      return;
    }
    if (!donorEmail || !amount || amount <= 0) {
      showToast('Please enter a valid email and amount', true);
      return;
    }

    setGuestLoading(true);
    setGuestError(null);

    try {
      const response = await fetch(`${API_URL}/guest-donations/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: parseInt(campaignId),
          guest_name: donorName,
          guest_email: donorEmail,
          amount: parseFloat(amount),
          message: message
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process donation request');

      setGuestDonationId(data.donation.id);
      setGuestStep(2);
      showToast('Request submitted! Check your email for payment instructions.');
    } catch (err) {
      setGuestError(err.message);
    } finally {
      setGuestLoading(false);
    }
  };

  // Guest: Upload proof
  const handleGuestUploadProof = async (e) => {
    e.preventDefault();
    if (!guestProofFile) {
      setGuestError('Please select a proof image');
      return;
    }

    setGuestLoading(true);
    setGuestError(null);

    try {
      const formData = new FormData();
      formData.append('proof', guestProofFile);

      const response = await fetch(`${API_URL}/guest-donations/upload-proof/${guestDonationId}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload proof');

      setGuestStep(4);
      showToast('Proof uploaded! Admin will verify your donation.');
      
      setTimeout(() => {
        resetGuestDonation();
        setDonationMode('login');
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (err) {
      setGuestError(err.message);
    } finally {
      setGuestLoading(false);
    }
  };

  const handleGuestFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGuestProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setGuestProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Logged-in user: Wallet donation
  const handleWalletDonation = async (e) => {
    e.preventDefault();
    
    if (!campaignId) {
      showToast('Please select a campaign', true);
      return;
    }
    if (!amount || amount <= 0) {
      showToast('Please enter a valid donation amount', true);
      return;
    }
    
    if (amount > walletBalance) {
      showToast(`Insufficient wallet balance. Available: $${walletBalance.toFixed(2)}`, true);
      return;
    }

    setLoading(true);
    try {
      await walletApi.donateFromWallet({
        campaign_id: parseInt(campaignId),
        amount: parseFloat(amount),
        donor_name: donorName || currentUser?.name,
        donor_email: donorEmail || currentUser?.email,
        message,
        is_monthly: isMonthly,
      });
      showToast('Donation successful! Thank you for your support.');
      
      if (refreshWallet) refreshWallet();
      loadCampaigns();
      
      setCampaignId(propCampaignId || '');
      setMessage('');
      setIsMonthly(false);
      setAmount(50);
      setActivePreset(50);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast(err.response?.data?.error || 'Wallet donation failed', true);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (value) => {
    setActivePreset(value);
    setAmount(value);
  };

  const handleCustomAmount = (e) => {
    const val = parseFloat(e.target.value);
    setAmount(isNaN(val) ? '' : val);
    setActivePreset(null);
  };

  // If no campaign is selected and we're not in guest mode, show campaign selector
  if (!campaignId && !propCampaignId && approvedCampaigns.length > 0) {
    return (
      <div className="donation-form-card">
        <h3>Make a Donation</h3>
        <p style={{ marginBottom: 16, color: 'var(--text-light)' }}>Please select a campaign to donate to:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {approvedCampaigns.slice(0, 5).map(camp => (
            <button
              key={camp.id}
              className="btn-outline-custom"
              onClick={() => setCampaignId(camp.id)}
              style={{ textAlign: 'left', justifyContent: 'flex-start' }}
            >
              {camp.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Guest Donation - Step 2: Waiting for Instructions
  if (donationMode === 'guest' && guestStep === 2) {
    return (
      <div className="donation-form-card">
        <button 
          onClick={() => { resetGuestDonation(); setDonationMode('login'); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: 'var(--primary)' }}
        >
          ← Back
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <h3>Check Your Email</h3>
          <p>Admin will send payment instructions to <strong>{donorEmail}</strong> shortly.</p>
          <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 12, margin: '20px 0', textAlign: 'left' }}>
            <strong>📋 What happens next?</strong>
            <ol style={{ marginLeft: 20, marginTop: 8, lineHeight: 1.8 }}>
              <li>Check your email for payment details</li>
              <li>Make the payment using the provided instructions</li>
              <li>Come back here to upload your payment proof</li>
            </ol>
          </div>
          <button className="btn-primary-custom" onClick={() => setGuestStep(3)} style={{ width: '100%' }}>
            I've Made the Payment → Upload Proof
          </button>
        </div>
      </div>
    );
  }

  // Guest Donation - Step 3: Upload Proof
  if (donationMode === 'guest' && guestStep === 3) {
    return (
      <div className="donation-form-card">
        <button 
          onClick={() => setGuestStep(2)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: 'var(--primary)' }}
        >
          ← Back
        </button>
        <h3>Upload Payment Proof</h3>
        <p style={{ marginBottom: 16, color: 'var(--text-light)' }}>Upload a screenshot or photo of your payment confirmation.</p>
        
        <form onSubmit={handleGuestUploadProof}>
          <div className="form-group">
            <label className="form-label-custom">Payment Proof Image *</label>
            <input
              type="file"
              className="form-ctrl"
              accept="image/*"
              onChange={handleGuestFileChange}
              style={{ padding: '8px' }}
              required
            />
            {guestProofPreview && (
              <div style={{ marginTop: 12 }}>
                <img src={guestProofPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} />
              </div>
            )}
          </div>
          
          {guestError && (
            <div style={{ color: '#c0392b', fontSize: 13, marginBottom: 16, padding: 8, background: '#fee2e2', borderRadius: 6 }}>
              {guestError}
            </div>
          )}
          
          <button type="submit" className="btn-donate-submit" disabled={guestLoading}>
            {guestLoading ? 'Uploading...' : 'Submit Proof →'}
          </button>
        </form>
      </div>
    );
  }

  // Guest Donation - Step 4: Success
  if (donationMode === 'guest' && guestStep === 4) {
    return (
      <div className="donation-form-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3>Thank You!</h3>
        <p>Your payment proof has been submitted. Admin will verify your donation shortly.</p>
        <button className="btn-primary-custom" onClick={() => { resetGuestDonation(); setDonationMode('login'); if (onSuccess) onSuccess(); }} style={{ marginTop: 16 }}>
          Close
        </button>
      </div>
    );
  }

  // Mode Selection (Login vs Guest) - for non-logged-in users
  if (!currentUser && donationMode === 'login') {
    return (
      <div className="donation-form-card">
        <h3>Make a Donation</h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button 
            className="btn-primary-custom" 
            onClick={() => openAuth('login')}
            style={{ flex: 1 }}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
          <button 
            className="btn-outline-custom" 
            onClick={() => {
              resetGuestDonation();
              setDonationMode('guest');
              setGuestStep(1);
            }}
            style={{ flex: 1 }}
          >
            <i className="fas fa-user-friends"></i> Donate as Guest
          </button>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: 13 }}>
          Don't have an account? <button onClick={() => openAuth('register', 'donor')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>Sign up</button>
        </p>
      </div>
    );
  }

  // Guest Donation - Step 1: Form
  if (donationMode === 'guest' && guestStep === 1) {
    return (
      <div className="donation-form-card">
        <button 
          onClick={() => setDonationMode('login')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: 'var(--primary)' }}
        >
          ← Back to Login
        </button>
        <h3>Donate as Guest</h3>
        <p style={{ marginBottom: 16, color: 'var(--text-light)' }}>No account needed! Admin will send payment instructions to your email.</p>
        
        <form onSubmit={handleGuestRequestDonation}>
          <div className="form-group">
            <label className="form-label-custom">Select Campaign *</label>
            <select
              className="form-ctrl"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              required
              disabled={!!propCampaignId}
            >
              <option value="">-- Choose a campaign --</option>
              {approvedCampaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label-custom">Your Name (Optional)</label>
            <input
              type="text"
              className="form-ctrl"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label-custom">Email Address *</label>
            <input
              type="email"
              className="form-ctrl"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label-custom">Donation Amount (USD) *</label>
            <div className="amount-buttons">
              {AMOUNT_PRESETS.map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`amount-preset ${activePreset === val ? 'active' : ''}`}
                  onClick={() => handlePreset(val)}
                >
                  ${val}
                </button>
              ))}
            </div>
            <input
              type="number"
              className="form-ctrl"
              placeholder="Custom amount"
              min="1"
              step="1"
              value={amount}
              onChange={handleCustomAmount}
            />
          </div>

          <div className="form-group">
            <label className="form-label-custom">Message (Optional)</label>
            <textarea
              className="form-ctrl"
              rows="2"
              placeholder="Leave a supportive message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {guestError && (
            <div style={{ color: '#c0392b', fontSize: 13, marginBottom: 16, padding: 8, background: '#fee2e2', borderRadius: 6 }}>
              {guestError}
            </div>
          )}

          <button type="submit" className="btn-donate-submit" disabled={guestLoading || !campaignId || !amount}>
            {guestLoading ? 'Processing...' : 'Request Donation →'}
          </button>
        </form>
      </div>
    );
  }

  // Logged-in user: Regular wallet donation form
  return (
    <div className="donation-form-card">
      <h3>Donate from Wallet</h3>
      <div style={{ background: '#e1f5ee', padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <strong>💰 Wallet balance: ${walletBalance.toFixed(2)}</strong>
      </div>

      <form onSubmit={handleWalletDonation}>
        <div className="form-group">
          <label className="form-label-custom">Campaign *</label>
          <select
            className="form-ctrl"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            required
            disabled={!!propCampaignId}
          >
            <option value="">-- Choose a campaign --</option>
            {approvedCampaigns.map((camp) => (
              <option key={camp.id} value={camp.id}>
                {camp.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label-custom">Donation Amount (USD)</label>
          <div className="amount-buttons">
            {AMOUNT_PRESETS.map((val) => (
              <button
                key={val}
                type="button"
                className={`amount-preset ${activePreset === val ? 'active' : ''}`}
                onClick={() => handlePreset(val)}
              >
                ${val}
              </button>
            ))}
          </div>
          <input
            type="number"
            className="form-ctrl"
            placeholder="Custom amount"
            min="1"
            step="1"
            value={amount}
            onChange={handleCustomAmount}
          />
        </div>

        <div className="form-group">
          <label className="form-label-custom">Message (Optional)</label>
          <textarea
            className="form-ctrl"
            rows="2"
            placeholder="Leave a supportive message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isMonthly}
              onChange={(e) => setIsMonthly(e.target.checked)}
            />
            Make this a monthly recurring donation
          </label>
        </div>

        <button
          type="submit"
          className="btn-donate-submit"
          disabled={loading || !campaignId || !amount || amount > walletBalance}
        >
          {loading ? 'Processing...' : `Donate $${amount} from Wallet`}
        </button>
      </form>
    </div>
  );
}