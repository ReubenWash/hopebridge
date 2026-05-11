import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { donationApi, walletApi } from '../services/api';
import PayPalButton from './PayPalButton';

const AMOUNT_PRESETS = [10, 25, 50, 100, 250];

export default function DonationForm() {
  const { currentUser, approvedCampaigns, loadCampaigns, walletBalance, refreshWallet, showToast } = useApp();

  // Form state
  const [campaignId, setCampaignId] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState(50);
  const [activePreset, setActivePreset] = useState(50);
  const [message, setMessage] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal' or 'wallet'
  const [loading, setLoading] = useState(false);

  // Prefill user info if logged in
  useEffect(() => {
    if (currentUser) {
      setDonorName(currentUser.name || '');
      setDonorEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Load campaigns on mount
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

  const handleWalletDonation = async () => {
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
      const res = await walletApi.donateFromWallet({
        campaign_id: parseInt(campaignId),
        amount: parseFloat(amount),
        donor_name: donorName || currentUser?.name,
        donor_email: donorEmail || currentUser?.email,
        message,
        is_monthly: isMonthly,
      });
      showToast(res.message || 'Donation successful!');
      // Refresh wallet balance and campaigns
      if (refreshWallet) refreshWallet();
      loadCampaigns();
      // Clear form
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

  // Determine if PayPal button should be shown
  const showPayPal = !loading && paymentMethod === 'paypal' && campaignId && amount > 0;

  return (
    <div className="donation-form-card">
      <h3>Make a Donation</h3>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Campaign selection */}
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

        {/* Donor info */}
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

        {/* Payment method (only for logged-in users) */}
        {currentUser && (
          <div className="form-group">
            <label className="form-label-custom">Payment Method</label>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                /> Pay with PayPal / Card
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={() => setPaymentMethod('wallet')}
                /> Pay from Wallet (Balance: ${walletBalance.toFixed(2)})
              </label>
            </div>
          </div>
        )}

        {/* Amount selection */}
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

        {/* Message */}
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

        {/* Monthly checkbox */}
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

        {/* Submit button for wallet / fallback */}
        {paymentMethod === 'wallet' && currentUser ? (
          <button
            type="button"
            className="btn-donate-submit"
            onClick={handleWalletDonation}
            disabled={loading || !campaignId || !amount}
          >
            {loading ? 'Processing...' : `Donate $${amount} from Wallet`}
          </button>
        ) : null}
      </form>

      {/* PayPal button (only when PayPal method selected and form is valid) */}
      {showPayPal && (
        <div style={{ marginTop: '20px' }}>
          <PayPalButton
            campaignId={parseInt(campaignId)}
            amount={parseFloat(amount)}
            donorInfo={{
              name: donorName,
              email: donorEmail,
              message,
              isMonthly,
            }}
            onSuccess={() => {
              // Clear form or show success message
              setCampaignId('');
              setMessage('');
              setIsMonthly(false);
              setAmount(50);
              setActivePreset(50);
              loadCampaigns(); // refresh campaign raised amounts
            }}
            onError={(err) => console.error(err)}
          />
        </div>
      )}
    </div>
  );
}