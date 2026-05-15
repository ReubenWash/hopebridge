import { useState, useEffect, useRef } from 'react'
import { donationApi } from '../services/api'
import { useApp } from '../context/AppContext'

const PayPalButton = ({ campaignId, amount, donorInfo, onSuccess, onError }) => {
  const { showToast } = useApp()
  const [loading, setLoading]   = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const [clientId, setClientId] = useState(null)
  const [sdkError, setSdkError] = useState(null)
  const buttonContainer = useRef(null)
  const rendered = useRef(false)

  // Fetch PayPal client ID
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const res  = await fetch(`${BASE}/settings/public`)
        if (!res.ok) throw new Error('Failed to load payment config')
        const data = await res.json()
        if (!data.paypal_client_id) {
          setSdkError('PayPal is not configured. Please contact the site admin.')
          return
        }
        setClientId(data.paypal_client_id)
      } catch (err) {
        setSdkError('Payment gateway unavailable. Please try again later.')
        console.error('PayPal client ID fetch failed:', err)
      }
    }
    fetchClientId()
  }, [])

  // Load PayPal SDK
  useEffect(() => {
    if (!clientId) return

    // Already loaded
    if (window.paypal) {
      setSdkReady(true)
      return
    }

    // Remove old script if any
    const oldScript = document.getElementById('paypal-sdk')
    if (oldScript) oldScript.remove()

    const script = document.createElement('script')
    script.id  = 'paypal-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`
    script.onload = () => setSdkReady(true)
    script.onerror = () => {
      setSdkError('Failed to load PayPal SDK. Please check your network connection.')
    }
    document.body.appendChild(script)
  }, [clientId])

  // Render PayPal button
  useEffect(() => {
    if (!sdkReady || !buttonContainer.current || !campaignId || !amount || amount <= 0) return
    if (rendered.current) return

    rendered.current = true
    buttonContainer.current.innerHTML = ''

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color:  'gold',
        shape:  'rect',
        label:  'donate',
        height: 45,
      },

      createOrder: async () => {
        setLoading(true)
        try {
          const response = await donationApi.createPayPalOrder({
            campaign_id:  campaignId,
            amount:       parseFloat(amount),
            donor_name:   donorInfo?.name  || 'Anonymous',
            donor_email:  donorInfo?.email || '',
            message:      donorInfo?.message   || '',
            is_monthly:   donorInfo?.isMonthly || false,
          })
          return response.orderID
        } catch (err) {
          const msg = err.message || 'Failed to create PayPal order'
          showToast(msg, true)
          onError?.(err)
          throw err
        } finally {
          setLoading(false)
        }
      },

      onApprove: async (data) => {
        setLoading(true)
        try {
          const response = await donationApi.capturePayPalOrder(data.orderID)
          showToast(response.message || 'Donation successful! Thank you. ❤')
          onSuccess?.(response.donation)
        } catch (err) {
          showToast(err.message || 'Payment capture failed', true)
          onError?.(err)
        } finally {
          setLoading(false)
        }
      },

      onCancel: () => {
        showToast('Payment cancelled.', true)
      },

      onError: (err) => {
        console.error('PayPal error:', err)
        showToast('Payment error. Please try again.', true)
        onError?.(err)
        setLoading(false)
      },
    }).render(buttonContainer.current)
  }, [sdkReady, campaignId, amount])

  // Re-render when amount/campaign changes (destroy and recreate)
  useEffect(() => {
    if (!sdkReady) return
    rendered.current = false
    if (buttonContainer.current) buttonContainer.current.innerHTML = ''
    // Re-trigger the above effect
    rendered.current = false
    setTimeout(() => {
      if (!buttonContainer.current) return
      rendered.current = true
      window.paypal?.Buttons({
        style: { layout:'vertical', color:'gold', shape:'rect', label:'donate', height:45 },
        createOrder: async () => {
          setLoading(true)
          try {
            const r = await donationApi.createPayPalOrder({
              campaign_id: campaignId, amount: parseFloat(amount),
              donor_name: donorInfo?.name||'Anonymous', donor_email: donorInfo?.email||'',
              message: donorInfo?.message||'', is_monthly: donorInfo?.isMonthly||false,
            })
            return r.orderID
          } catch (err) { showToast(err.message,true); throw err }
          finally { setLoading(false) }
        },
        onApprove: async (data) => {
          setLoading(true)
          try {
            const r = await donationApi.capturePayPalOrder(data.orderID)
            showToast(r.message||'Donation successful! ❤')
            onSuccess?.(r.donation)
          } catch (err) { showToast(err.message||'Capture failed',true); onError?.(err) }
          finally { setLoading(false) }
        },
        onCancel: () => showToast('Payment cancelled.',true),
        onError: (err) => { showToast('Payment error.',true); onError?.(err); setLoading(false) },
      }).render(buttonContainer.current)
    }, 100)
  }, [amount, campaignId])

  if (sdkError) {
    return (
      <div style={{
        background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10,
        padding: '14px 16px', fontSize: '0.88rem', color: '#991b1b', textAlign: 'center',
      }}>
        ⚠ {sdkError}
      </div>
    )
  }

  if (!clientId) {
    return (
      <div style={{
        background: '#f3f4f6', borderRadius: 10, padding: '16px',
        textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem',
      }}>
        <div style={{ marginBottom: 6 }}>⏳ Loading payment gateway...</div>
        <div style={{ fontSize: '0.78rem' }}>
          Make sure PayPal is configured in admin settings.
        </div>
      </div>
    )
  }

  if (!sdkReady) {
    return (
      <div style={{
        background: '#f3f4f6', borderRadius: 10, padding: '16px',
        textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem',
      }}>
        ⏳ Loading PayPal...
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(255,255,255,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 8, fontSize: '0.9rem', color: '#374151', fontWeight: 600,
        }}>
          Processing…
        </div>
      )}
      <div
        ref={buttonContainer}
        style={{ opacity: loading ? 0.5 : 1, minHeight: 50 }}
      />
    </div>
  )
}

export default PayPalButton