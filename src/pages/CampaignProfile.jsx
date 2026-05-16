import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { campaignApi, donationApi, walletApi } from '../services/api';
import DonationForm from '../components/DonationForm';

export default function CampaignProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, showToast, walletBalance, refreshWallet } = useApp();
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [creator, setCreator] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCampaign();
    loadDonations();
  }, [id]);

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const data = await campaignApi.getById(id);
      setCampaign(data.campaign);
      // Get creator info
      const creatorData = await campaignApi.getCreator?.(data.campaign.creator_id);
      if (creatorData) setCreator(creatorData.user);
    } catch (err) {
      console.error('Error loading campaign:', err);
      setError('Campaign not found');
      showToast('Failed to load campaign', true);
    } finally {
      setLoading(false);
    }
  };

  const loadDonations = async () => {
    try {
      const data = await donationApi.getCampaignDons(id);
      setDonations(data.donations || []);
      setTotalDonations(data.total || 0);
    } catch (err) {
      console.error('Error loading donations:', err);
    }
  };

  const handleDonateClick = () => {
    if (!currentUser) {
      showToast('Please login to donate', true);
      return;
    }
    setShowDonateForm(true);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="campaign-profile-loading">
        <div className="spinner"></div>
        <p>Loading campaign...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="campaign-profile-error">
        <h2>Campaign Not Found</h2>
        <p>The campaign you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="btn-primary-custom">
          Back to Home
        </button>
      </div>
    );
  }

  const progress = (campaign.raised / campaign.goal) * 100;
  const daysLeft = campaign.days_left || 30; // You can add this to your campaign table

  return (
    <div className="campaign-profile">
      {/* Hero Section */}
      <div className="campaign-hero">
        <div 
          className="campaign-hero-bg"
          style={{ backgroundImage: `url(${campaign.image_url || 'https://placehold.co/1200x400?text=Campaign+Image'})` }}
        >
          <div className="campaign-hero-overlay"></div>
        </div>
        <div className="campaign-hero-content">
          <div className="campaign-category">{campaign.category || 'Cause'}</div>
          <h1>{campaign.title}</h1>
          <div className="campaign-creator">
            <span className="creator-avatar">👤</span>
            <span>Created by {creator?.name || campaign.creator_name || 'Anonymous'}</span>
          </div>
        </div>
      </div>

      <div className="campaign-container">
        <div className="campaign-main">
          {/* Description */}
          <div className="campaign-section">
            <h2>About This Campaign</h2>
            <div className="campaign-description">
              {campaign.description || 'No description provided.'}
            </div>
          </div>

          {/* Updates Section (optional - you can add updates table) */}
          <div className="campaign-section">
            <h2>Updates</h2>
            <div className="campaign-updates">
              <p>No updates yet. Check back soon!</p>
            </div>
          </div>

          {/* Donations List */}
          <div className="campaign-section">
            <h2>Recent Donations</h2>
            {donations.length === 0 ? (
              <p>No donations yet. Be the first to donate!</p>
            ) : (
              <div className="donations-list">
                {donations.slice(0, 10).map(donation => (
                  <div key={donation.id} className="donation-item">
                    <div className="donor-info">
                      <strong>{donation.donor_name || 'Anonymous'}</strong>
                      <span className="donation-date">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="donation-amount">
                      ${parseFloat(donation.amount).toLocaleString()}
                    </div>
                    {donation.message && (
                      <div className="donation-message">"{donation.message}"</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="campaign-sidebar">
          {/* Progress Card */}
          <div className="progress-card">
            <div className="raised-amount">
              <span className="amount">${campaign.raised?.toLocaleString()}</span>
              <span className="goal">raised of ${campaign.goal?.toLocaleString()} goal</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <div className="progress-stats">
              <span>{Math.round(progress)}% funded</span>
              <span>{daysLeft} days left</span>
            </div>
            
            <button className="donate-now-btn" onClick={handleDonateClick}>
              ❤ Donate Now
            </button>
            
            <button className="share-btn" onClick={handleShare}>
              📤 Share Campaign
            </button>
          </div>

          {/* Donation Form (when clicked) */}
          {showDonateForm && (
            <div className="donation-form-card">
              <h3>Make a Donation</h3>
              <DonationForm campaignId={campaign.id} onSuccess={() => {
                setShowDonateForm(false);
                loadCampaign();
                loadDonations();
                refreshWallet();
              }} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .campaign-profile {
          min-height: 100vh;
          background: #f8f9fa;
        }
        
        .campaign-hero {
          position: relative;
          height: 400px;
          overflow: hidden;
        }
        
        .campaign-hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
        }
        
        .campaign-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%);
        }
        
        .campaign-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          color: white;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 60px;
        }
        
        .campaign-category {
          display: inline-block;
          background: rgba(232, 83, 30, 0.9);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 16px;
          width: fit-content;
        }
        
        .campaign-hero-content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          max-width: 800px;
        }
        
        .campaign-creator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .creator-avatar {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .campaign-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }
        
        .campaign-section {
          background: white;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 32px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        
        .campaign-section h2 {
          font-size: 1.4rem;
          margin-bottom: 20px;
          color: #1a1a2e;
        }
        
        .campaign-description {
          line-height: 1.8;
          color: #444;
        }
        
        .progress-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          position: sticky;
          top: 20px;
        }
        
        .raised-amount {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .raised-amount .amount {
          font-size: 2rem;
          font-weight: 800;
          color: #e8531e;
          display: block;
        }
        
        .raised-amount .goal {
          font-size: 0.9rem;
          color: #6b7280;
        }
        
        .progress-bar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #e8531e, #f47c50);
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        
        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 24px;
        }
        
        .donate-now-btn, .share-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 12px;
        }
        
        .donate-now-btn {
          background: linear-gradient(135deg, #e8531e, #f47c50);
          color: white;
        }
        
        .donate-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(232,83,30,0.3);
        }
        
        .share-btn {
          background: #f3f4f6;
          color: #374151;
        }
        
        .share-btn:hover {
          background: #e5e7eb;
        }
        
        .donations-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .donation-item {
          padding: 16px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .donation-item:last-child {
          border-bottom: none;
        }
        
        .donor-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .donation-date {
          font-size: 0.8rem;
          color: #9ca3af;
        }
        
        .donation-amount {
          font-weight: 700;
          color: #e8531e;
          margin-bottom: 8px;
        }
        
        .donation-message {
          font-size: 0.9rem;
          color: #6b7280;
          font-style: italic;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .donation-form-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-top: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        
        .campaign-profile-loading, .campaign-profile-error {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f4f6;
          border-top-color: #e8531e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .campaign-container {
            grid-template-columns: 1fr;
          }
          
          .campaign-hero {
            height: 300px;
          }
          
          .campaign-hero-content h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}