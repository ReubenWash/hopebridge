import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { walletApi } from '../services/api';

const AMOUNT_PRESETS = [10, 25, 50, 100, 250];

export default function DonationForm() {
  const { currentUser, approvedCampaigns, loadCampaigns, walletBalance, refreshWallet, showToast } = useApp();

  const [campaignId, setCampaignId] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState(50);
  const [activePreset, setActivePreset] = useState(50);
  const [message, setMessage] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDonorName(currentUser.name || '');
      setDonorEmail(currentUser.email || '');
    }
  }, [currentUser]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handlePreset = (value) => {
    setActivePreset(value);
    setAmount(value);
  };

  const handleCustomAmount = (e) => {
    const val = parseFloat(e.target.value);
    setAmount(isNaN(val) ? '' : val);
    setActivePreset(null);
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
      
      // Refresh data
      if (refreshWallet) refreshWallet();
      loadCampaigns();
      
      // Reset form
      setCampaignId('');
      setMessage('');
      setIsMonthly(false);
      setAmount(50);
      setActivePreset(50);
    } catch (err) {
      showToast(err.response?.data?.error || 'Wallet donation failed', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-card">
      <h3>Make a Donation from Wallet</h3>
      {!currentUser && (
        <div style={{ background: '#fff5f0', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          ⚡ Please <strong>log in</strong> to donate from your wallet.
        </div>
      )}

      <form onSubmit={handleWalletDonation}>
        <div className="form-group">
          <label className="form-label-custom">Select Campaign *</label>
          <select
            className="form-ctrl"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            required
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
          <label className="form-label-custom">Your Name *</label>
          <input
            type="text"
            className="form-ctrl"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label-custom">Email Address *</label>
          <input
            type="email"
            className="form-ctrl"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            required
          />
        </div>

        {currentUser && (
          <div className="form-group" style={{ background: '#e1f5ee', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <strong>💰 Wallet balance: ${walletBalance.toFixed(2)}</strong>
          </div>
        )}

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
          disabled={loading || !campaignId || !amount || !currentUser}
        >
          {loading ? 'Processing...' : `Donate $${amount} from Wallet`}
        </button>
      </form>
    </div>
  );
}