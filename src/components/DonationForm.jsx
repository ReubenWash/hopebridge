import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { campaignApi, donationApi, walletApi } from '../services/api';

const DonationForm = ({ campaignId: preselectedCampaignId, onSuccess }) => {
  const { currentUser, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [searchTerm, setSearchTerm] = useState('');

  // Load approved campaigns
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await campaignApi.getAll({ status: 'approved' });
        setCampaigns(res.campaigns || []);
        if (preselectedCampaignId) {
          const preselected = (res.campaigns || []).find(c => c.id === preselectedCampaignId);
          if (preselected) setSelectedCampaign(preselected);
        }
      } catch (err) {
        console.error('Failed to load campaigns:', err);
        showToast('Could not load campaigns', true);
      }
    };
    loadCampaigns();
  }, [preselectedCampaignId]);

  const filteredCampaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaign) {
      showToast('Please select a campaign', true);
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt < 1) {
      showToast('Please enter a valid amount (minimum $1)', true);
      return;
    }
    setLoading(true);
    try {
      if (currentUser) {
        // Logged in user – donate from wallet
        await walletApi.donateFromWallet({
          campaign_id: selectedCampaign.id,
          amount: amt,
          donor_name: currentUser.name,
          donor_email: currentUser.email,
          message,
          is_monthly: isMonthly,
        });
        showToast(`Thank you for donating $${amt} to ${selectedCampaign.title}!`);
      } else {
        // Guest donation flow
        const guestName = document.getElementById('guest_name')?.value || '';
        const guestEmail = document.getElementById('guest_email')?.value || '';
        if (!guestEmail) {
          showToast('Guest email is required', true);
          setLoading(false);
          return;
        }
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/guest-donations/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaign_id: selectedCampaign.id,
            guest_name: guestName,
            guest_email: guestEmail,
            amount: amt,
            message,
            payment_method: 'bank_transfer',
          }),
        });
        showToast('Donation request received! Admin will send payment instructions shortly.');
      }
      // Reset form
      setAmount('');
      setMessage('');
      setIsMonthly(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [10, 25, 50, 100, 250];

  return (
    <form onSubmit={handleSubmit} className="donation-form-modern">
      {/* Campaign Selection Header */}
      <div className="form-section">
        <label className="form-label-modern">Select a Campaign to Support</label>
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="campaigns-grid">
          {filteredCampaigns.length === 0 ? (
            <div className="no-campaigns">No campaigns found</div>
          ) : (
            filteredCampaigns.map(campaign => (
              <div
                key={campaign.id}
                className={`campaign-card ${selectedCampaign?.id === campaign.id ? 'selected' : ''}`}
                onClick={() => setSelectedCampaign(campaign)}
              >
                {campaign.image_url && (
                  <div
                    className="campaign-card-image"
                    style={{ backgroundImage: `url(${campaign.image_url})` }}
                  />
                )}
                <div className="campaign-card-content">
                  <h4>{campaign.title}</h4>
                  <div className="campaign-stats">
                    <span>Raised: ${(campaign.raised || 0).toLocaleString()}</span>
                    <span>Goal: ${(campaign.goal || 0).toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(((campaign.raised || 0) / campaign.goal) * 100, 100)}%` }}
                    />
                  </div>
                  {campaign.category && <span className="campaign-category">{campaign.category}</span>}
                </div>
                {selectedCampaign?.id === campaign.id && (
                  <div className="selected-check">✓</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Donation Amount & Details */}
      {selectedCampaign && (
        <div className="form-section donation-details">
          <label className="form-label-modern">Donation Amount (USD)</label>
          <div className="amount-buttons-modern">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                type="button"
                className={`amount-pill ${parseFloat(amount) === amt ? 'active' : ''}`}
                onClick={() => setAmount(amt.toString())}
              >
                ${amt}
              </button>
            ))}
            <input
              type="number"
              placeholder="Custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="custom-amount-input"
              min="1"
              step="0.01"
            />
          </div>

          <label className="form-label-modern">Message (Optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a supportive message..."
            rows="3"
            className="message-input"
          />

          {currentUser && (
            <div className="checkbox-wrapper">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isMonthly}
                  onChange={(e) => setIsMonthly(e.target.checked)}
                />
                <span>Make this a monthly donation</span>
              </label>
            </div>
          )}

          {!currentUser && (
            <div className="guest-fields">
              <input
                type="text"
                id="guest_name"
                placeholder="Your name (optional)"
                className="guest-input"
              />
              <input
                type="email"
                id="guest_email"
                placeholder="Your email *"
                required
                className="guest-input"
              />
            </div>
          )}

          <button type="submit" className="donate-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : `Donate ${amount ? `$${parseFloat(amount).toFixed(2)}` : ''}`}
          </button>
        </div>
      )}
    </form>
  );
};

export default DonationForm;