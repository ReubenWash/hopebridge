import { useState, useEffect, useRef } from 'react';
import { donationApi } from '../services/api';
import { useApp } from '../context/AppContext';

const PayPalButton = ({ campaignId, amount, donorInfo, onSuccess, onError }) => {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const buttonContainer = useRef(null);
  const [clientId, setClientId] = useState(null);

  // Fetch PayPal client ID from backend (public endpoint)
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings/public`);
        const data = await res.json();
        setClientId(data.paypal_client_id);
      } catch (err) {
        console.error('Failed to load PayPal client ID', err);
        showToast('Payment gateway not available. Please try again later.', true);
      }
    };
    fetchClientId();
  }, []);

  // Load PayPal SDK when clientId is available
  useEffect(() => {
    if (!clientId) return;
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.onload = () => setSdkReady(true);
    script.onerror = () => {
      console.error('PayPal SDK failed to load');
      showToast('Payment gateway could not be loaded. Please try again.', true);
    };
    document.body.appendChild(script);
    return () => {
      // Cleanup is optional – we keep the script for subsequent renders
    };
  }, [clientId]);

  // Render PayPal button when SDK is ready and we have required data
  useEffect(() => {
    if (!sdkReady || !buttonContainer.current || !campaignId || !amount || amount <= 0) return;

    // Clear any previous button
    buttonContainer.current.innerHTML = '';

    window.paypal.Buttons({
      createOrder: async () => {
        setLoading(true);
        try {
          const response = await donationApi.createPayPalOrder({
            campaign_id: campaignId,
            amount: parseFloat(amount),
            donor_name: donorInfo.name || 'Anonymous',
            donor_email: donorInfo.email || '',
            message: donorInfo.message || '',
            is_monthly: donorInfo.isMonthly || false,
          });
          return response.orderID;
        } catch (err) {
          const errorMsg = err.response?.data?.error || 'Failed to create PayPal order';
          showToast(errorMsg, true);
          onError?.(err);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      onApprove: async (data) => {
        setLoading(true);
        try {
          const response = await donationApi.capturePayPalOrder(data.orderID);
          showToast(response.message || 'Donation successful! Thank you.');
          onSuccess?.(response.donation);
        } catch (err) {
          const errorMsg = err.response?.data?.error || 'Payment capture failed';
          showToast(errorMsg, true);
          onError?.(err);
        } finally {
          setLoading(false);
        }
      },
      onError: (err) => {
        console.error('PayPal error', err);
        showToast('Payment error. Please try again later.', true);
        onError?.(err);
        setLoading(false);
      },
    }).render(buttonContainer.current);
  }, [sdkReady, campaignId, amount, donorInfo, onSuccess, onError]);

  if (!clientId) return <div className="text-center">Loading payment gateway...</div>;
  if (!sdkReady) return <div className="text-center">Loading PayPal...</div>;

  return (
    <div className="paypal-button-container">
      {loading && <div className="paypal-loader">Processing payment...</div>}
      <div ref={buttonContainer} style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }} />
    </div>
  );
};

export default PayPalButton;