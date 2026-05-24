import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { walletApi } from '../services/api';

const AMOUNT_PRESETS = [10, 25, 50, 100, 250];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DonationForm({ campaignId: propCampaignId, onSuccess }) {
  const { currentUser, approvedCampaigns, loadCampaigns, walletBalance, refreshWallet, showToast, openAuth } = useApp();

  const [campaignId, setCampaignId] = useState(propCampaignId || '');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState(50);
  const [activePreset, setActivePreset] = useState(50);
  const [message, setMessage] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Guest donation states
  const [donationMode, setDonationMode] = useState('login');
  const [guestStep, setGuestStep] = useState(1);
  const [guestDonationId, setGuestDonationId] = useState(null);
  const [guestInstructions, setGuestInstructions] = useState(null);
  const [guestProofFile, setGuestProofFile] = useState(null);
  const [guestProofPreview, setGuestProofPreview] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setDonorName(currentUser.name || '');
      setDonorEmail(currentUser.email || '');
      setDonationMode('login');
    }
    loadCampaigns();
    
    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [currentUser]);

  // Poll for instructions from admin (real-time)
  useEffect(() => {
    if (guestDonationId && guestStep === 2) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_URL}/guest-donations/status/${guestDonationId}`);
          const data = await response.json();
          
          if (data.donation?.admin_instructions) {
            setGuestInstructions(data.donation.admin_instructions);
            clearInterval(interval);
            setPollingInterval(null);
            // Auto-advance to step 3
            setGuestStep(3);
            showToast('Payment instructions received!');
          }
          
          if (data.donation?.payment_status === 'approved') {
            clearInterval(interval);
            setPollingInterval(null);
            setGuestStep(5);
            showToast('Your donation has been verified and approved!');
          }
          
          if (data.donation?.payment_status === 'rejected') {
            clearInterval(interval);
            setPollingInterval(null);
            setGuestError('Your donation was rejected. Please contact support.');
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000); // Check every 3 seconds
      
      setPollingInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [guestDonationId, guestStep]);

  // Reset guest donation state
  const resetGuestDonation = () => {
    if (pollingInterval) clearInterval(pollingInterval);
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
          guest_phone: donorPhone,
          amount: parseFloat(amount),
          message: message
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process donation request');

      setGuestDonationId(data.donation.id);
      setGuestStep(2);
      showToast('Request submitted! Waiting for admin to provide payment instructions...');
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
      
      // Start polling for verification status
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${API_URL}/guest-donations/status/${guestDonationId}`);
          const statusData = await statusRes.json();
          
          if (statusData.donation?.payment_status === 'approved') {
            clearInterval(interval);
            setGuestStep(5);
            showToast('Your donation has been verified and approved! Thank you!');
            if (onSuccess) setTimeout(() => onSuccess(), 2000);
          }
          
          if (statusData.donation?.payment_status === 'rejected') {
            clearInterval(interval);
            setGuestError('Your donation was rejected. Please contact support.');
          }
        } catch (err) {
          console.error('Status polling error:', err);
        }
      }, 5000);
      
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

  // If no campaign is selected
  if (!campaignId && !propCampaignId && approvedCampaigns.length > 0 && donationMode !== 'guest') {
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

  // Guest Donation - Step 2: Waiting for Instructions (Real-time)
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <h3>Waiting for Payment Instructions</h3>
          <p>Admin is preparing your payment instructions. This page will update automatically.</p>
          
          <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 12, margin: '20px 0', textAlign: 'left' }}>
            <strong>📋 What's happening?</strong>
            <ol style={{ marginLeft: 20, marginTop: 8, lineHeight: 1.8 }}>
              <li>Admin is reviewing your request</li>
              <li>Payment instructions will appear here shortly</li>
              <li>You can also check your email for a copy</li>
            </ol>
          </div>
          
          <div className="cp-spinner" style={{ margin: '0 auto 20px', width: 40, height: 40, border: '3px solid #e0e0e0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>
            Donation ID: #{guestDonationId}
          </p>
          
          <button className="btn btn-gh" onClick={() => setGuestStep(1)} style={{ marginTop: 16 }}>
            ← Cancel
          </button>
        </div>
      </div>
    );
  }

  // Guest Donation - Step 3: Display Instructions (Real-time)
  if (donationMode === 'guest' && guestStep === 3 && guestInstructions) {
    return (
      <div className="donation-form-card">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3>Payment Instructions Ready</h3>
          <p style={{ marginBottom: 16 }}>Please follow these instructions to complete your donation.</p>
        </div>
        
        <div style={{ background: 'var(--blue-l)', padding: 20, borderRadius: 12, marginBottom: 20 }}>
          <div style={{ whiteSpace: 'pre-line', fontSize: 14, lineHeight: 1.7 }}>
            {guestInstructions}
          </div>
        </div>
        
        <div style={{ background: '#fff3e0', padding: 12, borderRadius: 8, marginBottom: 20 }}>
          <strong>⚠️ Important:</strong> After making the payment, come back here and click "I've Made the Payment" to upload your proof.
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-g" onClick={() => setGuestStep(4)} style={{ flex: 1 }}>
            I've Made the Payment → Upload Proof
          </button>
          <button className="btn btn-gh" onClick={resetGuestDonation}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Guest Donation - Step 4: Upload Proof
  if (donationMode === 'guest' && guestStep === 4) {
    return (
      <div className="donation-form-card">
        <button 
          onClick={() => setGuestStep(3)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: 'var(--primary)' }}
        >
          ← Back to Instructions
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

  // Guest Donation - Step 5: Success
  if (donationMode === 'guest' && guestStep === 5) {
    return (
      <div className="donation-form-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3>Thank You for Your Donation!</h3>
        <p>Your donation has been verified and approved. Thank you for your generosity!</p>
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
        <p style={{ marginBottom: 16, color: 'var(--text-light)' }}>No account needed! Payment instructions will appear here in real-time.</p>
        
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
            <small style={{ fontSize: 11, color: 'var(--text-light)' }}>Instructions will be sent here and displayed below</small>
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