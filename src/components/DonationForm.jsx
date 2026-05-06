import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { donationApi } from '../services/api'

const PRESETS = [10, 25, 50, 100, 250]
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'   // sandbox default

export default function DonationForm() {
  const { 
    approvedCampaigns, 
    donate, 
    donateFromWallet, 
    currentUser, 
    walletBalance, 
    refreshWallet,
    showToast 
  } = useApp()
  
  const [campaignId, setCampaignId] = useState('')
  const [donorName, setDonorName]   = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [amount, setAmount]         = useState(50)
  const [activePreset, setActivePreset] = useState(50)
  const [message, setMessage]       = useState('')
  const [monthly, setMonthly]       = useState(false)
  const [busy, setBusy]             = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('external') // 'external' or 'wallet'

  // PayPal state
  const [paypalSdkReady, setPaypalSdkReady] = useState(false)
  const paypalButtonRef = useRef(null)

  // Load PayPal SDK once
  useEffect(() => {
    if (window.paypal) {
      setPaypalSdkReady(true)
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`
    script.onload = () => setPaypalSdkReady(true)
    document.body.appendChild(script)
  }, [])

  // Render PayPal button only for external payment method and when wallet is not selected
  useEffect(() => {
    // Only render PayPal if external method is selected (or guest)
    const shouldRenderPayPal = paypalSdkReady && campaignId && amount > 0 && paypalButtonRef.current && (!currentUser || paymentMethod === 'external')
    if (!shouldRenderPayPal) return

    paypalButtonRef.current.innerHTML = ''

    window.paypal.Buttons({
      createOrder: async () => {
        try {
          const res = await donationApi.createPayPalOrder({
            campaign_id: parseInt(campaignId),
            amount: parseFloat(amount),
            donor_name: donorName || 'Anonymous',
            donor_email: donorEmail || '',
            message,
            is_monthly: monthly,
          })
          return res.orderID
        } catch (err) {
          showToast(err.message, true)
          throw err
        }
      },
      onApprove: async (data) => {
        try {
          await donationApi.capturePayPalOrder(data.orderID)
          showToast('PayPal donation successful – thank you!')
          clearForm()
        } catch (err) {
          showToast(err.message, true)
        }
      },
      onError: (err) => showToast('PayPal error: ' + err, true),
    }).render(paypalButtonRef.current)
  }, [paypalSdkReady, campaignId, amount, donorName, donorEmail, message, monthly, currentUser, paymentMethod])

  const clearForm = () => {
    setDonorName('')
    setDonorEmail('')
    setAmount(50)
    setActivePreset(50)
    setMessage('')
    setCampaignId('')
  }

  const handlePreset = (v) => { setActivePreset(v); setAmount(v) }
  const handleCustom = (v) => { setActivePreset(null); setAmount(v) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!campaignId) { showToast('Please select a campaign', true); return }
    
    // For guest or external payment method, use card/PayPal flow (button handles it)
    if (!currentUser || paymentMethod === 'external') {
      // The PayPal button or regular donation button will handle it.
      // Regular card donation (if we had a card form) would go here, but we rely on the button.
      // Since we have a "Donate Now" button that calls donate() for card (not PayPal), we need to branch.
      // Actually the current UI has a submit button that calls donate() for card – we should keep that.
      // For simplicity, we keep the existing card flow via donate() for non-PayPal.
      // But note: the PayPal button is separate and handles its own flow.
      // The existing submit button is for card donations (using the backend stripe-like? Actually it's a direct POST).
      // So if external method is selected, we call the regular donate().
      setBusy(true)
      try {
        await donate({
          campaign_id: parseInt(campaignId),
          donor_name: donorName,
          donor_email: donorEmail,
          amount: parseFloat(amount),
          message,
          is_monthly: monthly,
        })
        clearForm()
      } catch (err) {
        showToast(err.message, true)
      } finally {
        setBusy(false)
      }
    } else if (paymentMethod === 'wallet') {
      // Wallet donation
      if (walletBalance < amount) {
        showToast(`Insufficient wallet balance. Available: $${walletBalance.toFixed(2)}`, true)
        return
      }
      setBusy(true)
      try {
        await donateFromWallet({
          campaign_id: parseInt(campaignId),
          amount: parseFloat(amount),
          donor_name: donorName || currentUser.name,
          donor_email: donorEmail || currentUser.email,
          message,
          is_monthly: monthly,
        })
        clearForm()
        if (refreshWallet) refreshWallet()
      } catch (err) {
        showToast(err.message, true)
      } finally {
        setBusy(false)
      }
    }
  }

  return (
    <div className="donation-form-card">
      <h3>Make Your Donation</h3>
      <form onSubmit={handleSubmit}>
        <label className="form-label-custom">Select Campaign *</label>
        <select className="form-ctrl" value={campaignId} onChange={e => setCampaignId(e.target.value)} required>
          <option value="">-- Choose a campaign --</option>
          {approvedCampaigns.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <label className="form-label-custom">Full Name *</label>
        <input className="form-ctrl" type="text" placeholder="John Doe" value={donorName} onChange={e => setDonorName(e.target.value)} required />

        <label className="form-label-custom">Email Address *</label>
        <input className="form-ctrl" type="email" placeholder="john@example.com" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} required />

        {/* Payment method selector for logged-in users */}
        {currentUser && (
          <div className="payment-method-row" style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '20px' }}>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="external" 
                checked={paymentMethod === 'external'} 
                onChange={() => setPaymentMethod('external')} 
              />
              Pay with Card / PayPal
            </label>
            <label>
              <input 
                type="radio" 
                name="paymentMethod" 
                value="wallet" 
                checked={paymentMethod === 'wallet'} 
                onChange={() => setPaymentMethod('wallet')} 
              />
              Pay from Wallet (Balance: ${walletBalance.toFixed(2)})
            </label>
          </div>
        )}

        <label className="form-label-custom">Donation Amount (USD)</label>
        <div className="amount-buttons">
          {PRESETS.map(p => (
            <button key={p} type="button" className={`amount-preset${activePreset === p ? ' active' : ''}`} onClick={() => handlePreset(p)}>${p}</button>
          ))}
        </div>
        <input className="form-ctrl" type="number" min="1" value={amount} onChange={e => handleCustom(e.target.value)} placeholder="Or enter custom amount" />

        <label className="form-label-custom">Message (Optional)</label>
        <textarea className="form-ctrl" rows="2" placeholder="Leave a message..." value={message} onChange={e => setMessage(e.target.value)} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <input type="checkbox" id="monthlyCheck" checked={monthly} onChange={e => setMonthly(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
          <label htmlFor="monthlyCheck" style={{ fontSize: '.9rem', cursor: 'pointer', marginBottom: 0 }}>Make this a monthly recurring donation</label>
        </div>

        {/* Submit button for card/wallet (not for PayPal) */}
        <button type="submit" className="btn-donate-submit" disabled={busy}>
          <i className="fas fa-heart"></i> {busy ? 'Processing...' : 'Donate Now'}
        </button>
      </form>

      {/* PayPal button – only shown for external method and when campaign and amount are set */}
      {(!currentUser || paymentMethod === 'external') && (
        <div style={{ marginTop: '20px' }}>
          <div ref={paypalButtonRef}></div>
          {!paypalSdkReady && <p style={{ color: '#777', fontSize: '0.9rem' }}>Loading PayPal...</p>}
        </div>
      )}
    </div>
  )
}