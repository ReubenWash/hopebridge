import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { walletApi, campaignApi } from '../services/api';
import { CreditCard, Smartphone, Building2, Wallet as WalletIcon, Bitcoin, Send, Clock, CheckCircle, AlertCircle, X, ArrowLeft, Upload, ChevronDown, Search, Loader2 } from 'lucide-react';


const AMOUNT_PRESETS = [10, 25, 50, 100, 250];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DonationForm({ campaignId: propCampaignId, onSuccess }) {
  const { currentUser, walletBalance, refreshWallet, showToast, openAuth } = useApp();
  
  // Local campaign loading state
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState(null);

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
  
  // Campaign dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [campaignSearch, setCampaignSearch] = useState('');
  const dropdownRef = useRef(null);

  // Load campaigns directly on mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      setCampaignsLoading(true);
      setCampaignsError(null);
      try {
        const res = await campaignApi.getAll({ status: 'approved' });
        const campaignsList = res.campaigns || [];
        setCampaigns(campaignsList);
        if (propCampaignId && campaignsList.length > 0) {
          const found = campaignsList.find(c => c.id === propCampaignId);
          if (found) setCampaignId(propCampaignId);
        }
      } catch (err) {
        console.error('Failed to load campaigns:', err);
        setCampaignsError(err.message || 'Could not load campaigns');
        showToast('Could not load campaigns', true);
      } finally {
        setCampaignsLoading(false);
      }
    };
    fetchCampaigns();
  }, [propCampaignId]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setDonorName(currentUser.name || '');
      setDonorEmail(currentUser.email || '');
      setDonationMode('login');
    }
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
      // Refresh campaigns list to update raised amounts
      const res = await campaignApi.getAll({ status: 'approved' });
      setCampaigns(res.campaigns || []);
      
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

  const selectedCampaign = campaigns.find(c => c.id === campaignId);
  const filteredCampaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(campaignSearch.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(campaignSearch.toLowerCase()))
  );

  const getProgress = (campaign) => {
    if (!campaign.goal || campaign.goal === 0) return 0;
    return Math.min(((campaign.raised || 0) / campaign.goal) * 100, 100);
  };

  const getRaisedText = (campaign) => {
    const raised = (campaign.raised || 0).toLocaleString();
    const goal = (campaign.goal || 0).toLocaleString();
    return `$${raised} raised of $${goal}`;
  };

  // Campaign Dropdown Component
  const CampaignDropdown = () => (
    <div className="campaign-dropdown-modern" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {selectedCampaign ? (
          <div className="selected-campaign-info">
            <div className="selected-campaign-title">{selectedCampaign.title}</div>
            <div className="selected-campaign-stats">
              {selectedCampaign.category && <span className="selected-category">{selectedCampaign.category}</span>}
              <span>{getRaisedText(selectedCampaign)}</span>
            </div>
            <div className="progress-bar-mini">
              <div className="progress-fill-mini" style={{ width: `${getProgress(selectedCampaign)}%` }} />
            </div>
          </div>
        ) : (
          <span className="placeholder-text">Select a campaign to support</span>
        )}
        <ChevronDown size={18} className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`} />
      </div>
      
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={campaignSearch}
              onChange={(e) => setCampaignSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="dropdown-options">
            {filteredCampaigns.length === 0 ? (
              <div className="no-options">No campaigns found</div>
            ) : (
              filteredCampaigns.map(camp => {
                const progress = getProgress(camp);
                const isSelected = campaignId === camp.id;
                return (
                  <div
                    key={camp.id}
                    className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setCampaignId(camp.id);
                      setIsDropdownOpen(false);
                      setCampaignSearch('');
                    }}
                  >
                    <div className="option-info">
                      <div className="option-title-row">
                        <span className="option-title">{camp.title}</span>
                        {camp.category && <span className="option-category">{camp.category}</span>}
                      </div>
                      <div className="option-stats">{getRaisedText(camp)}</div>
                      <div className="progress-bar-option">
                        <div className="progress-fill-option" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    {isSelected && <div className="check-icon">✓</div>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Loading state while campaigns are being fetched
  if (campaignsLoading) {
    return (
      <div className="donation-card-modern text-center">
        <Loader2 size={40} className="spinner-icon" />
        <p>Loading campaigns...</p>
      </div>
    );
  }

  // Error state
  if (campaignsError) {
    return (
      <div className="donation-card-modern text-center">
        <AlertCircle size={40} className="error-icon" />
        <p>Failed to load campaigns. Please try again.</p>
        <button className="btn-secondary" onClick={() => window.location.reload()}>
          Refresh
        </button>
      </div>
    );
  }

  // No campaigns available
  if (campaigns.length === 0) {
    return (
      <div className="donation-card-modern text-center">
        <Heart size={40} className="info-icon" />
        <p>No active campaigns available at the moment.</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--txt-2)' }}>Check back soon for new causes to support!</p>
      </div>
    );
  }

  // Render campaign selection when no campaign preselected (for logged in user)
  if (!campaignId && !propCampaignId && donationMode !== 'guest') {
    return (
      <div className="donation-card-modern">
        <div className="campaign-selection-header">
          <h3>Start Your Donation</h3>
          <p>Choose a campaign you'd like to support</p>
        </div>
        <CampaignDropdown />
        {campaignId && (
          <div className="continue-button-wrapper">
            <button className="btn-primary btn-full" onClick={() => {}}>
              Continue to Donation
            </button>
          </div>
        )}
      </div>
    );
  }

  // Guest donation flows (same as before, but now uses CampaignDropdown)
  if (donationMode === 'guest' && guestStep === 2) {
    return (
      <div className="donation-card-modern">
        <button onClick={() => { resetGuestDonation(); setDonationMode('login'); }} className="back-button">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="status-icon-wrapper">
          <Clock size={48} className="status-icon pending" />
        </div>
        <h3>Waiting for Payment Instructions</h3>
        <p className="status-description">Admin is preparing your payment instructions. This page will update automatically.</p>
        <div className="info-box info-box-waiting">
          <strong>What's happening?</strong>
          <ul>
            <li>Admin is reviewing your request</li>
            <li>Payment instructions will appear here shortly</li>
            <li>You can also check your email for a copy</li>
          </ul>
        </div>
        <div className="spinner"></div>
        <p className="donation-id">Donation ID: #{guestDonationId}</p>
        <button className="btn-secondary" onClick={() => setGuestStep(1)}>Cancel</button>
      </div>
    );
  }

  if (donationMode === 'guest' && guestStep === 3 && guestInstructions) {
    return (
      <div className="donation-card-modern">
        <div className="status-icon-wrapper">
          <CheckCircle size={48} className="status-icon success" />
        </div>
        <h3>Payment Instructions Ready</h3>
        <p className="status-description">Please follow these instructions to complete your donation.</p>
        <div className="instructions-box">
          <div className="instructions-content">{guestInstructions}</div>
        </div>
        <div className="alert-box alert-warning">
          <AlertCircle size={16} />
          <strong>Important:</strong> After making the payment, come back here and click "I've Made the Payment" to upload your proof.
        </div>
        <div className="button-group">
          <button className="btn-primary" onClick={() => setGuestStep(4)}>
            <Send size={14} /> I've Made the Payment
          </button>
          <button className="btn-secondary" onClick={resetGuestDonation}>Cancel</button>
        </div>
      </div>
    );
  }

  if (donationMode === 'guest' && guestStep === 4) {
    return (
      <div className="donation-card-modern">
        <button onClick={() => setGuestStep(3)} className="back-button">
          <ArrowLeft size={14} /> Back to Instructions
        </button>
        <h3>Upload Payment Proof</h3>
        <p className="status-description">Upload a screenshot or photo of your payment confirmation.</p>
        <form onSubmit={handleGuestUploadProof}>
          <div className="form-group-modern">
            <label className="form-label-modern">Payment Proof Image *</label>
            <input
              type="file"
              className="file-input-modern"
              accept="image/*"
              onChange={handleGuestFileChange}
              required
            />
            {guestProofPreview && (
              <div className="proof-preview">
                <img src={guestProofPreview} alt="Preview" />
              </div>
            )}
          </div>
          {guestError && (
            <div className="error-message">
              <X size={14} /> {guestError}
            </div>
          )}
          <button type="submit" className="btn-primary btn-full" disabled={guestLoading}>
            {guestLoading ? 'Uploading...' : <><Upload size={14} /> Submit Proof</>}
          </button>
        </form>
      </div>
    );
  }

  if (donationMode === 'guest' && guestStep === 5) {
    return (
      <div className="donation-card-modern text-center">
        <div className="status-icon-wrapper">
          <CheckCircle size={48} className="status-icon success filled" />
        </div>
        <h3>Thank You for Your Donation!</h3>
        <p className="status-description">Your donation has been verified and approved. Thank you for your generosity!</p>
        <button className="btn-primary" onClick={() => { resetGuestDonation(); setDonationMode('login'); if (onSuccess) onSuccess(); }}>
          Close
        </button>
      </div>
    );
  }

  if (!currentUser && donationMode === 'login') {
    return (
      <div className="donation-card-modern text-center">
        <div className="auth-buttons">
          <button className="btn-primary" onClick={() => openAuth('login')}>Login</button>
          <button className="btn-outline" onClick={() => { resetGuestDonation(); setDonationMode('guest'); setGuestStep(1); }}>Donate as Guest</button>
        </div>
        <p className="signup-prompt">
          Don't have an account?{' '}
          <button onClick={() => openAuth('register', 'donor')} className="link-button">Sign up</button>
        </p>
      </div>
    );
  }

  if (donationMode === 'guest' && guestStep === 1) {
    return (
      <div className="donation-card-modern">
        <button onClick={() => setDonationMode('login')} className="back-button">
          <ArrowLeft size={14} /> Back to Login
        </button>
        <h3>Donate as Guest</h3>
        <p className="status-description">No account needed! Payment instructions will appear here in real-time.</p>
        <form onSubmit={handleGuestRequestDonation}>
          <div className="form-group-modern">
            <label className="form-label-modern">Select Campaign *</label>
            <CampaignDropdown />
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">Your Name (Optional)</label>
            <input
              type="text"
              className="input-modern"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">Email Address *</label>
            <input
              type="email"
              className="input-modern"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <small className="helper-text">Instructions will be sent here and displayed below</small>
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">Payment Method *</label>
            <div className="payment-methods-grid">
              {paymentMethods.map(method => (
                <button
                  key={method.value}
                  type="button"
                  className={`payment-method-btn ${selectedPaymentMethod === method.value ? 'active' : ''}`}
                  onClick={() => setSelectedPaymentMethod(method.value)}
                >
                  {method.icon}
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">Donation Amount (USD) *</label>
            <div className="amount-buttons-modern">
              {AMOUNT_PRESETS.map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`amount-preset-modern ${activePreset === val ? 'active' : ''}`}
                  onClick={() => handlePreset(val)}
                >
                  ${val}
                </button>
              ))}
            </div>
            <input
              type="number"
              className="input-modern"
              placeholder="Custom amount"
              min="1"
              step="1"
              value={amount}
              onChange={handleCustomAmount}
            />
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">Message (Optional)</label>
            <textarea
              className="textarea-modern"
              rows="2"
              placeholder="Leave a supportive message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {guestError && <div className="error-message"><AlertCircle size={14} /> {guestError}</div>}

          <button type="submit" className="btn-primary btn-full" disabled={guestLoading || !campaignId || !amount || !selectedPaymentMethod}>
            {guestLoading ? 'Processing...' : 'Request Donation'}
          </button>
        </form>
      </div>
    );
  }

  // Logged in user – wallet donation form with campaign dropdown
  return (
    <div className="donation-card-modern">
      <div className="wallet-balance-badge">
        <WalletIcon size={18} />
        <span>Wallet balance: <strong>${walletBalance.toFixed(2)}</strong></span>
      </div>

      <form onSubmit={handleWalletDonation}>
        <div className="form-group-modern">
          <label className="form-label-modern">Select Campaign *</label>
          <CampaignDropdown />
        </div>

        <div className="form-group-modern">
          <label className="form-label-modern">Donation Amount (USD)</label>
          <div className="amount-buttons-modern">
            {AMOUNT_PRESETS.map((val) => (
              <button
                key={val}
                type="button"
                className={`amount-preset-modern ${activePreset === val ? 'active' : ''}`}
                onClick={() => handlePreset(val)}
              >
                ${val}
              </button>
            ))}
          </div>
          <input
            type="number"
            className="input-modern"
            placeholder="Custom amount"
            min="1"
            step="1"
            value={amount}
            onChange={handleCustomAmount}
          />
        </div>

        <div className="form-group-modern">
          <label className="form-label-modern">Message (Optional)</label>
          <textarea
            className="textarea-modern"
            rows="2"
            placeholder="Leave a supportive message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="checkbox-wrapper-modern">
          <label className="checkbox-label-modern">
            <input
              type="checkbox"
              checked={isMonthly}
              onChange={(e) => setIsMonthly(e.target.checked)}
            />
            <span>Make this a monthly recurring donation</span>
          </label>
        </div>

        <button
          type="submit"
          className="btn-primary btn-full"
          disabled={loading || !campaignId || !amount || amount > walletBalance}
        >
          {loading ? 'Processing...' : `Donate $${amount} from Wallet`}
        </button>
      </form>
    </div>
  );
}