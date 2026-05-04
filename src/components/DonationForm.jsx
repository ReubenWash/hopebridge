import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { donationApi } from '../services/api'

const PRESETS = [10, 25, 50, 100, 250]
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'   // sandbox default

export default function DonationForm() {
  const { approvedCampaigns, donate, showToast } = useApp()
  const [campaignId, setCampaignId] = useState('')
  const [donorName, setDonorName]   = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [amount, setAmount]         = useState(50)
  const [activePreset, setActivePreset] = useState(50)
  const [message, setMessage]       = useState('')
  const [monthly, setMonthly]       = useState(false)
  const [busy, setBusy]             = useState(false)

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

  // Render PayPal button when SDK ready, campaign selected, and amount > 0
  useEffect(() => {
    if (!paypalSdkReady || !campaignId || !amount || amount <= 0 || !paypalButtonRef.current) return

    // Clear previous button if any
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
          // Clear form
          setDonorName(''); setDonorEmail(''); setAmount(50)
          setActivePreset(50); setMessage(''); setCampaignId('')
        } catch (err) {
          showToast(err.message, true)
        }
      },
      onError: (err) => showToast('PayPal error: ' + err, true),
    }).render(paypalButtonRef.current)
  }, [paypalSdkReady, campaignId, amount, donorName, donorEmail, message, monthly])

  const handlePreset = (v) => { setActivePreset(v); setAmount(v) }
  const handleCustom = (v) => { setActivePreset(null); setAmount(v) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!campaignId) { showToast('Please select a campaign', true); return }
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
      setDonorName(''); setDonorEmail(''); setAmount(50)
      setActivePreset(50); setMessage(''); setCampaignId('')
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setBusy(false)
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

        <button type="submit" className="btn-donate-submit" disabled={busy}>
          <i className="fas fa-heart"></i> {busy ? 'Processing...' : 'Donate Now'}
        </button>
      </form>

      {/* PayPal button */}
      <div style={{ marginTop: '20px' }}>
        <div ref={paypalButtonRef}></div>
        {!paypalSdkReady && <p style={{ color: '#777', fontSize: '0.9rem' }}>Loading PayPal...</p>}
      </div>
    </div>
  )
}