// src/components/GuestDonationModal.jsx
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function GuestDonationModal({ isOpen, onClose, campaignId, campaignTitle, onSuccess }) {
  const [step, setStep] = useState(1);
  const [donationId, setDonationId] = useState(null);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    amount: '',
    message: ''
  });
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const showToast = (message, isError = false) => {
    const toastEvent = new CustomEvent('showToast', { 
      detail: { message, type: isError ? 'error' : 'success' } 
    });
    window.dispatchEvent(toastEvent);
  };

  // Step 1: Request donation
  const handleRequestDonation = async (e) => {
    e.preventDefault();
    if (!formData.guest_email || !formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid email and amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/guest-donations/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaignId,
          guest_name: formData.guest_name,
          guest_email: formData.guest_email,
          amount: parseFloat(formData.amount),
          message: formData.message
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process donation request');

      setDonationId(data.donation.id);
      setStep(2);
      showToast('Request submitted! Check your email for payment instructions.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Upload proof
  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      setError('Please select a proof image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('proof', proofFile);

      const response = await fetch(`${API_URL}/guest-donations/upload-proof/${donationId}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload proof');

      setStep(4);
      showToast('Proof uploaded! Admin will verify your donation.');
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setStep(1);
    setDonationId(null);
    setFormData({ guest_name: '', guest_email: '', amount: '', message: '' });
    setProofFile(null);
    setProofPreview(null);
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <div className="hb-modal-bd" onClick={handleClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        
        {/* Step 1: Donation Form */}
        {step === 1 && (
          <>
            <div className="hb-modal-t">Donate as Guest</div>
            <div className="hb-modal-s">
              Support "{campaignTitle?.length > 50 ? campaignTitle.substring(0, 50) + '...' : campaignTitle}" without creating an account.
              Admin will send payment instructions to your email.
            </div>
            
            <form onSubmit={handleRequestDonation}>
              <label className="fl">Your Name (Optional)</label>
              <input
                type="text"
                name="guest_name"
                className="fi"
                value={formData.guest_name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              
              <label className="fl">Email Address *</label>
              <input
                type="email"
                name="guest_email"
                className="fi"
                value={formData.guest_email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
              
              <label className="fl">Donation Amount ($) *</label>
              <input
                type="number"
                name="amount"
                className="fi"
                value={formData.amount}
                onChange={handleChange}
                placeholder="50"
                min="1"
                step="0.01"
                required
              />
              
              <label className="fl">Message (Optional)</label>
              <textarea
                name="message"
                className="fi"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                placeholder="Leave a supportive message..."
              />
              
              {error && (
                <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 16, padding: 8, background: 'var(--red-l)', borderRadius: 6 }}>
                  {error}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-g" disabled={loading}>
                  {loading ? 'Processing...' : 'Request Donation →'}
                </button>
                <button type="button" className="btn btn-gh" onClick={handleClose}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 2: Waiting for Instructions */}
        {step === 2 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <div className="hb-modal-t">Check Your Email</div>
            <div className="hb-modal-s">
              Admin will send payment instructions to <strong>{formData.guest_email}</strong> shortly.
              Follow the instructions to complete your donation.
            </div>
            
            <div style={{ background: 'var(--green-l)', padding: 16, borderRadius: 12, marginBottom: 20, textAlign: 'left' }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>📋 What happens next?</strong>
              <ol style={{ marginLeft: 20, color: 'var(--txt-2)', fontSize: 13, lineHeight: 1.8 }}>
                <li>Check your email for payment details</li>
                <li>Make the payment using the provided instructions</li>
                <li>Come back here to upload your payment proof</li>
              </ol>
            </div>
            
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-g" onClick={() => setStep(3)} style={{ flex: 1 }}>
                I've Made the Payment → Upload Proof
              </button>
              <button className="btn btn-gh" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Proof */}
        {step === 3 && (
          <>
            <div className="hb-modal-t">Upload Payment Proof</div>
            <div className="hb-modal-s">
              Upload a screenshot or photo of your payment confirmation.
              Accepted formats: PNG, JPG, JPEG
            </div>
            
            <form onSubmit={handleUploadProof}>
              <label className="fl">Payment Proof Image *</label>
              <input
                type="file"
                className="fi"
                accept="image/*"
                onChange={handleFileChange}
                style={{ padding: '8px' }}
                required
              />
              
              {proofPreview && (
                <div style={{ marginTop: 12, marginBottom: 16 }}>
                  <img src={proofPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} />
                </div>
              )}
              
              {error && (
                <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 16, padding: 8, background: 'var(--red-l)', borderRadius: 6 }}>
                  {error}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-g" disabled={loading}>
                  {loading ? 'Uploading...' : 'Submit Proof →'}
                </button>
                <button type="button" className="btn btn-gh" onClick={() => setStep(2)}>
                  Back
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div className="hb-modal-t">Thank You for Your Donation!</div>
            <div className="hb-modal-s">
              Your payment proof has been submitted successfully. 
              Admin will verify and process your donation shortly.
              You will receive a confirmation email once approved.
            </div>
            
            <div style={{ background: 'var(--blue-l)', padding: 16, borderRadius: 12, marginBottom: 20, textAlign: 'left' }}>
              <strong>💡 What happens now?</strong>
              <ul style={{ marginLeft: 20, marginTop: 8, color: 'var(--txt-2)', fontSize: 13, lineHeight: 1.8 }}>
                <li>Admin will review your payment proof</li>
                <li>Once verified, your donation will be credited to the campaign</li>
                <li>You'll receive a confirmation email</li>
              </ul>
            </div>
            
            <button className="btn btn-g" onClick={handleClose} style={{ width: '100%' }}>
              Close
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}