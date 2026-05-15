import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { walletApi } from '../services/api'
import PayPalButton from './PayPalButton'

const AMOUNT_PRESETS = [10, 25, 50, 100, 250]

export default function DonationForm({ presetCampaignId }) {
  const {
    currentUser, approvedCampaigns, loadCampaigns,
    walletBalance, refreshWallet, showToast,
  } = useApp()

  const [campaignId,    setCampaignId]    = useState(presetCampaignId || '')
  const [donorName,     setDonorName]     = useState('')
  const [donorEmail,    setDonorEmail]    = useState('')
  const [amount,        setAmount]        = useState(50)
  const [activePreset,  setActivePreset]  = useState(50)
  const [message,       setMessage]       = useState('')
  const [isMonthly,     setIsMonthly]     = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [loading,       setLoading]       = useState(false)
  const [success,       setSuccess]       = useState(null)

  // Prefill user info
  useEffect(() => {
    if (currentUser) {
      setDonorName(currentUser.name || '')
      setDonorEmail(currentUser.email || '')
    }
  }, [currentUser])

  useEffect(() => { loadCampaigns() }, [])

  useEffect(() => {
    if (presetCampaignId) setCampaignId(presetCampaignId)
  }, [presetCampaignId])

  const handlePreset = (val) => { setActivePreset(val); setAmount(val) }
  const handleCustomAmount = (e) => {
    const val = parseFloat(e.target.value)
    setAmount(isNaN(val) ? '' : val)
    setActivePreset(null)
  }

  const handleWalletDonation = async () => {
    if (!campaignId) { showToast('Please select a campaign', true); return }
    if (!amount || amount <= 0) { showToast('Enter a valid amount', true); return }
    if (!donorName.trim()) { showToast('Your name is required', true); return }
    if (amount > walletBalance) {
      showToast(`Insufficient balance ($${walletBalance.toFixed(2)} available). Add funds via wallet.`, true)
      return
    }
    setLoading(true)
    try {
      const res = await walletApi.donateFromWallet({
        campaign_id:  parseInt(campaignId),
        amount:       parseFloat(amount),
        donor_name:   donorName,
        donor_email:  donorEmail,
        message,
        is_monthly:   isMonthly,
      })
      showToast(res.message || 'Donation successful! Thank you ❤')
      setSuccess(res)
      if (refreshWallet) refreshWallet()
      loadCampaigns()
      resetForm()
    } catch (err) {
      showToast(err.message || 'Wallet donation failed', true)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCampaignId('')
    setMessage('')
    setIsMonthly(false)
    setAmount(50)
    setActivePreset(50)
  }

  const handlePayPalSuccess = (donation) => {
    setSuccess(donation)
    resetForm()
    loadCampaigns()
  }

  const showPayPal = paymentMethod === 'paypal' && campaignId && amount > 0 && donorName.trim()

  return (
    <div className="donation-form-card">
      {success ? (
        <div style={{ textAlign:'center', padding:'30px 20px' }}>
          <div style={{ fontSize:'3rem', marginBottom:12 }}>🎉</div>
          <h3 style={{ color:'#0F6E56', marginBottom:8 }}>Thank You!</h3>
          <p style={{ color:'#6b7280', marginBottom:16 }}>
            Your donation has been received. You're making a real difference!
          </p>
          <button
            onClick={() => setSuccess(null)}
            style={{
              background:'linear-gradient(135deg,#e8531e,#f47c50)',
              color:'#fff', border:'none', padding:'12px 28px',
              borderRadius:8, cursor:'pointer', fontWeight:700, fontFamily:'inherit',
            }}
          >
            Donate Again
          </button>
        </div>
      ) : (
        <>
          <h3>Make a Donation</h3>

          {/* Campaign */}
          <div className="form-group" style={{ marginBottom:18 }}>
            <label className="form-label-custom">Select Campaign *</label>
            <select
              className="form-ctrl"
              value={campaignId}
              onChange={e => setCampaignId(e.target.value)}
              required
            >
              <option value="">— Choose a campaign —</option>
              {approvedCampaigns.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Donor info */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:18 }}>
            <div>
              <label className="form-label-custom">Your Name *</label>
              <input
                type="text" className="form-ctrl"
                value={donorName} onChange={e => setDonorName(e.target.value)}
                placeholder="Full name" required style={{ marginBottom:0 }}
              />
            </div>
            <div>
              <label className="form-label-custom">Email *</label>
              <input
                type="email" className="form-ctrl"
                value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
                placeholder="you@example.com" required style={{ marginBottom:0 }}
              />
            </div>
          </div>

          {/* Payment method (logged-in only) */}
          {currentUser && (
            <div style={{ marginBottom:18 }}>
              <label className="form-label-custom">Payment Method</label>
              <div style={{ display:'flex', gap:10 }}>
                {[
                  { val:'paypal', label:'💳 PayPal / Card' },
                  { val:'wallet', label:`💰 Wallet ($${walletBalance.toFixed(2)})` },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPaymentMethod(val)}
                    style={{
                      flex:1, padding:'10px 8px', border:`2px solid ${paymentMethod===val ? 'var(--primary)' : '#e5e7eb'}`,
                      borderRadius:8, cursor:'pointer', background: paymentMethod===val ? 'rgba(232,83,30,0.06)' : '#fff',
                      fontWeight:700, fontSize:'0.85rem', color: paymentMethod===val ? 'var(--primary)' : '#6b7280',
                      fontFamily:'inherit', transition:'0.15s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {paymentMethod === 'wallet' && walletBalance < (amount || 0) && (
                <p style={{ fontSize:'0.82rem', color:'#ef4444', marginTop:6 }}>
                  ⚠ Insufficient wallet balance. Use the 💰 wallet button to add funds first.
                </p>
              )}
            </div>
          )}

          {/* Amount */}
          <div style={{ marginBottom:18 }}>
            <label className="form-label-custom">Donation Amount (USD)</label>
            <div className="amount-buttons">
              {AMOUNT_PRESETS.map(val => (
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
              type="number" className="form-ctrl"
              placeholder="Custom amount" min="1" step="1"
              value={amount} onChange={handleCustomAmount}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom:18 }}>
            <label className="form-label-custom">Message (Optional)</label>
            <textarea
              className="form-ctrl" rows="2"
              placeholder="Leave a supportive message..."
              value={message} onChange={e => setMessage(e.target.value)}
            />
          </div>

          {/* Monthly */}
          <div style={{ marginBottom:24 }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.9rem' }}>
              <input
                type="checkbox"
                checked={isMonthly}
                onChange={e => setIsMonthly(e.target.checked)}
              />
              Make this a monthly recurring donation
            </label>
          </div>

          {/* Wallet donate button */}
          {paymentMethod === 'wallet' && currentUser && (
            <button
              type="button"
              className="btn-donate-submit"
              onClick={handleWalletDonation}
              disabled={loading || !campaignId || !amount || amount <= 0}
            >
              {loading ? 'Processing...' : `❤ Donate $${amount || 0} from Wallet`}
            </button>
          )}

          {/* PayPal button */}
          {showPayPal && (paymentMethod === 'paypal' || !currentUser) && (
            <div style={{ marginTop:16 }}>
              <PayPalButton
                campaignId={parseInt(campaignId)}
                amount={parseFloat(amount)}
                donorInfo={{ name:donorName, email:donorEmail, message, isMonthly }}
                onSuccess={handlePayPalSuccess}
                onError={(err) => console.error('PayPal error:', err)}
              />
            </div>
          )}

          {/* Guest PayPal prompt */}
          {!currentUser && campaignId && amount > 0 && donorName.trim() && (
            <div style={{ marginTop:16 }}>
              <PayPalButton
                campaignId={parseInt(campaignId)}
                amount={parseFloat(amount)}
                donorInfo={{ name:donorName, email:donorEmail, message, isMonthly }}
                onSuccess={handlePayPalSuccess}
                onError={(err) => console.error('PayPal error:', err)}
              />
              <p style={{ textAlign:'center', marginTop:12, fontSize:'0.82rem', color:'#9ca3af' }}>
                💡 <a onClick={() => {}} style={{ color:'var(--primary)', cursor:'pointer', fontWeight:600 }}>
                  Create a free account
                </a> to use wallet payments and track your donations.
              </p>
            </div>
          )}

          {/* Show PayPal when form not complete */}
          {!campaignId && (
            <div style={{
              background:'#f9fafb', border:'2px dashed #e5e7eb', borderRadius:10,
              padding:'20px', textAlign:'center', color:'#9ca3af', fontSize:'0.9rem',
            }}>
              Select a campaign and fill in your name to proceed with payment
            </div>
          )}
        </>
      )}
    </div>
  )
}