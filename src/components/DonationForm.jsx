import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { walletApi } from '../services/api';
import { CreditCard, Smartphone, Building2, Wallet as WalletIcon, Bitcoin, Send, Clock, CheckCircle, AlertCircle, X, ArrowLeft, Upload } from 'lucide-react';

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  
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
    
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [currentUser]);

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
      }, 3000);
      
      setPollingInterval(interval);
      return () => clearInterval(interval);
    }
  }, [guestDonationId, guestStep]);

  const resetGuestDonation = () => {
    if (pollingInterval) clearInterval(pollingInterval);
    setGuestStep(1);
    setGuestDonationId(null);
    setGuestInstructions(null);
    setGuestProofFile(null);
    setGuestProofPreview(null);
    setGuestError(null);
    setGuestLoading(false);
    setSelectedPaymentMethod('');
  };

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
    if (!selectedPaymentMethod) {
      showToast('Please select a payment method', true);
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
          message: message,
          preferred_payment_method: selectedPaymentMethod
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

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <Building2 size={16} /> },
    { value: 'mobile_money', label: 'Mobile Money', icon: <Smartphone size={16} /> },
    { value: 'cash', label: 'Cash Deposit', icon: <WalletIcon size={16} /> },
    { value: 'paypal', label: 'PayPal', icon: <CreditCard size={16} /> },
    { value: 'crypto', label: 'Cryptocurrency', icon: <Bitcoin size={16} /> },
    { value: 'western_union', label: 'Western Union', icon: <Send size={16} /> }
  ];

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

  if (donationMode === 'guest' && guestStep === 2) {
    return (
      <div className="donation-form-card">
        <button 
          onClick={() => { resetGuestDonation(); setDonationMode('login'); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <Clock size={48} stroke="var(--primary)" />
          </div>
          <h3>Waiting for Payment Instructions</h3>
          <p>Admin is preparing your payment instructions. This page will update automatically.</p>
          
          <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 12, margin: '20px 0', textAlign: 'left' }}>
            <strong>What's happening?</strong>
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
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (donationMode === 'guest' && guestStep === 3 && guestInstructions) {
    return (
      <div className="donation-form-card">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <CheckCircle size={48} stroke="var(--primary)" />
          </div>
          <h3>Payment Instructions Ready</h3>
          <p style={{ marginBottom: 16 }}>Please follow these instructions to complete your donation.</p>
        </div>
        
        <div style={{ background: 'var(--blue-l)', padding: 20, borderRadius: 12, marginBottom: 20 }}>
          <div style={{ whiteSpace: 'pre-line', fontSize: 14, lineHeight: 1.7 }}>
            {guestInstructions}
          </div>
        </div>
        
        <div style={{ background: '#fff3e0', padding: 12, borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} color="#EF9F27" />
          <strong>Important:</strong> After making the payment, come back here and click "I've Made the Payment" to upload your proof.
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-g" onClick={() => setGuestStep(4)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <Send size={14} /> I've Made the Payment
          </button>
          <button className="btn btn-gh" onClick={resetGuestDonation}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (donationMode === 'guest' && guestStep === 4) {
    return (
      <div className="donation-form-card">
        <button 
          onClick={() => setGuestStep(3)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={14} /> Back to Instructions
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
            <div style={{ color: '#c0392b', fontSize: 13, marginBottom: 16, padding: 8, background: '#fee2e2', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <X size={14} /> {guestError}
            </div>
          )}
          
          <button type="submit" className="btn-donate-submit" disabled={guestLoading} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            {guestLoading ? 'Uploading...' : <><Upload size={14} /> Submit Proof</>}
          </button>
        </form>
      </div>
    );
  }

  if (donationMode === 'guest' && guestStep === 5) {
    return (
      <div className="donation-form-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <CheckCircle size={48} stroke="var(--primary)" fill="var(--primary)" strokeWidth={1} />
        </div>
        <h3>Thank You for Your Donation!</h3>
        <p>Your donation has been verified and approved. Thank you for your generosity!</p>
        <button className="btn-primary-custom" onClick={() => { resetGuestDonation(); setDonationMode('login'); if (onSuccess) onSuccess(); }} style={{ marginTop: 16 }}>
          Close
        </button>
      </div>
    );
  }

  if (!currentUser && donationMode === 'login') {
    return (
      <div className="donation-form-card">
        <h3>Make a Donation</h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button 
            className="btn-primary-custom" 
            onClick={() => openAuth('login')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            Login
          </button>
          <button 
            className="btn-outline-custom" 
            onClick={() => {
              resetGuestDonation();
              setDonationMode('guest');
              setGuestStep(1);
            }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Donate as Guest
          </button>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: 13 }}>
          Don't have an account? <button onClick={() => openAuth('register', 'donor')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>Sign up</button>
        </p>
      </div>
    );
  }

  if (donationMode === 'guest' && guestStep === 1) {
    return (
      <div className="donation-form-card">
        <button 
          onClick={() => setDonationMode('login')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={14} /> Back to Login
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
            <label className="form-label-custom">Payment Method *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 8 }}>
              {paymentMethods.map(method => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(method.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1.5px solid ${selectedPaymentMethod === method.value ? 'var(--primary)' : 'var(--border-2)'}`,
                    background: selectedPaymentMethod === method.value ? 'rgba(232,83,30,0.08)' : 'var(--surface-2)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    color: selectedPaymentMethod === method.value ? 'var(--primary)' : 'var(--txt-2)'
                  }}
                >
                  {method.icon}
                  {method.label}
                </button>
              ))}
            </div>
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
            <div style={{ color: '#c0392b', fontSize: 13, marginBottom: 16, padding: 8, background: '#fee2e2', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={14} /> {guestError}
            </div>
          )}

          <button type="submit" className="btn-donate-submit" disabled={guestLoading || !campaignId || !amount || !selectedPaymentMethod} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            {guestLoading ? 'Processing...' : 'Request Donation'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="donation-form-card">
      <h3>Donate from Wallet</h3>
      <div style={{ background: '#e1f5ee', padding: 12, borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <WalletIcon size={18} color="var(--green)" />
        <strong>Wallet balance: ${walletBalance.toFixed(2)}</strong>
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
          style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
        >
          {loading ? 'Processing...' : `Donate $${amount} from Wallet`}
        </button>
      </form>
    </div>
  );
}