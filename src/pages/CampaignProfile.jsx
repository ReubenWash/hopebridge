import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { campaignApi, donationApi, userApi } from '../services/api';
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
  const [activeTab, setActiveTab] = useState('story'); // story, updates, donations
  const [campaignUpdates, setCampaignUpdates] = useState([]);
  const [relatedCampaigns, setRelatedCampaigns] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    loadCampaign();
    loadDonations();
    loadCampaignUpdates();
    window.scrollTo(0, 0);
  }, [id]);

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const data = await campaignApi.getById(id);
      setCampaign(data.campaign);
      if (data.campaign.creator_id) {
        try {
          const creatorData = await userApi.getById(data.campaign.creator_id);
          if (creatorData && creatorData.user) {
            setCreator(creatorData.user);
          }
        } catch (err) {
          console.error('Error loading creator:', err);
        }
      }
      // Load related campaigns (same category)
      if (data.campaign.category) {
        const related = await campaignApi.getAll({ category: data.campaign.category, limit: 3 });
        setRelatedCampaigns((related.campaigns || []).filter(c => c.id !== parseInt(id)).slice(0, 3));
      }
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

  const loadCampaignUpdates = async () => {
    try {
      // If your backend has campaign updates endpoint
      // const data = await campaignApi.getUpdates(id);
      // setCampaignUpdates(data.updates || []);
      setCampaignUpdates([]); // Placeholder
    } catch (err) {
      console.error('Error loading updates:', err);
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleFollow = () => {
    showToast('Follow feature coming soon!');
  };

  const handleReport = () => {
    showToast('Report feature coming soon!');
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
        <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#e8531e', marginBottom: '1rem' }}></i>
        <h2>Campaign Not Found</h2>
        <p>The campaign you're looking for doesn't exist or has been removed.</p>
        <button onClick={handleGoHome} className="btn-primary-custom">
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
      </div>
    );
  }

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const daysLeft = campaign.created_at
    ? Math.max(0, 30 - Math.floor((Date.now() - new Date(campaign.created_at)) / (1000 * 60 * 60 * 24)))
    : 30;
  const isFullyFunded = campaign.raised >= campaign.goal;

  return (
    <div className="campaign-profile">
      {/* Back Navigation Bar */}
      <div className="campaign-nav-bar">
        <button onClick={handleBack} className="nav-back-btn">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button onClick={handleGoHome} className="nav-home-btn">
          <i className="fas fa-home"></i> Home
        </button>
        <div className="nav-actions">
          <button onClick={handleShare} className="nav-share-btn">
            <i className="fas fa-share-alt"></i> Share
          </button>
          <button onClick={handleFollow} className="nav-follow-btn">
            <i className="fas fa-heart"></i> Follow
          </button>
          <button onClick={handleReport} className="nav-report-btn">
            <i className="fas fa-flag"></i>
          </button>
        </div>
      </div>

      {/* Hero Section with Gallery */}
      <div className="campaign-hero">
        <div
          className="campaign-hero-bg"
          style={{ backgroundImage: `url(${campaign.image_url || 'https://placehold.co/1200x500?text=Campaign+Image'})` }}
        >
          <div className="campaign-hero-overlay"></div>
        </div>
        <div className="campaign-hero-content">
          <div className="campaign-badges">
            <span className="campaign-category">
              <i className="fas fa-tag"></i> {campaign.category || 'Cause'}
            </span>
            {isFullyFunded && (
              <span className="campaign-badge-funded">
                <i className="fas fa-check-circle"></i> Fully Funded!
              </span>
            )}
            {campaign.status === 'pending' && (
              <span className="campaign-badge-pending">
                <i className="fas fa-clock"></i> Pending Review
              </span>
            )}
          </div>
          <h1>{campaign.title}</h1>
          <div className="campaign-creator-info">
            <div className="creator-avatar">
              {creator?.name?.charAt(0) || 'U'}
            </div>
            <div className="creator-details">
              <div className="creator-name">
                Created by {creator?.name || campaign.creator_name || 'Anonymous'}
              </div>
              <div className="campaign-date">
                <i className="far fa-calendar-alt"></i>
                Started {new Date(campaign.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="campaign-container">
        <div className="campaign-main">
          {/* Tabs */}
          <div className="campaign-tabs">
            <button
              className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
              onClick={() => setActiveTab('story')}
            >
              <i className="fas fa-book-open"></i> Story
            </button>
            <button
              className={`tab-btn ${activeTab === 'updates' ? 'active' : ''}`}
              onClick={() => setActiveTab('updates')}
            >
              <i className="fas fa-newspaper"></i> Updates ({campaignUpdates.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
              onClick={() => setActiveTab('donations')}
            >
              <i className="fas fa-hand-holding-heart"></i> Donations ({donations.length})
            </button>
          </div>

          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="campaign-section">
              <div className="campaign-description">
                <div
                  className={showFullDescription ? 'description-full' : 'description-truncated'}
                  dangerouslySetInnerHTML={{ __html: campaign.description || 'No description provided.' }}
                />
                {campaign.description && campaign.description.length > 500 && (
                  <button
                    className="read-more-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                    <i className={`fas fa-chevron-${showFullDescription ? 'up' : 'down'}`}></i>
                  </button>
                )}
              </div>

              {/* Impact Stats */}
              <div className="impact-stats">
                <h3><i className="fas fa-chart-line"></i> Impact So Far</h3>
                <div className="impact-grid">
                  <div className="impact-item">
                    <div className="impact-number">{donations.length}</div>
                    <div className="impact-label">Donations Received</div>
                  </div>
                  <div className="impact-item">
                    <div className="impact-number">{donations.filter(d => d.is_monthly).length}</div>
                    <div className="impact-label">Monthly Donors</div>
                  </div>
                  <div className="impact-item">
                    <div className="impact-number">{Math.floor(donations.length / 10) + 1}</div>
                    <div className="impact-label">Supporters</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === 'updates' && (
            <div className="campaign-section">
              <h2><i className="fas fa-newspaper"></i> Campaign Updates</h2>
              {campaignUpdates.length === 0 ? (
                <div className="no-updates">
                  <i className="far fa-newspaper"></i>
                  <p>No updates yet. Check back soon!</p>
                  <p className="update-note">Campaign creators post updates about progress, milestones, and how funds are being used.</p>
                </div>
              ) : (
                <div className="updates-list">
                  {campaignUpdates.map(update => (
                    <div key={update.id} className="update-item">
                      <div className="update-header">
                        <div className="update-title">{update.title}</div>
                        <div className="update-date">{new Date(update.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="update-content">{update.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="campaign-section">
              <h2><i className="fas fa-hand-holding-heart"></i> Recent Donations</h2>
              {donations.length === 0 ? (
                <div className="no-donations">
                  <i className="fas fa-gift"></i>
                  <p>No donations yet. Be the first to donate!</p>
                </div>
              ) : (
                <>
                  <div className="donations-summary">
                    <div className="summary-stat">
                      <span className="stat-value">${totalDonations.toLocaleString()}</span>
                      <span className="stat-label">Total Raised</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-value">{donations.length}</span>
                      <span className="stat-label">Total Donations</span>
                    </div>
                  </div>
                  <div className="donations-list">
                    {donations.map(donation => (
                      <div key={donation.id} className="donation-item">
                        <div className="donor-info">
                          <div className="donor-avatar">
                            {donation.donor_name?.charAt(0) || 'A'}
                          </div>
                          <div className="donor-details">
                            <div className="donor-name">
                              <strong>{donation.donor_name || 'Anonymous'}</strong>
                              {donation.is_monthly && (
                                <span className="monthly-badge">
                                  <i className="fas fa-sync-alt"></i> Monthly
                                </span>
                              )}
                            </div>
                            <span className="donation-date">
                              <i className="far fa-calendar-alt"></i>
                              {new Date(donation.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="donation-amount">
                            <i className="fas fa-dollar-sign"></i>
                            {parseFloat(donation.amount).toLocaleString()}
                          </div>
                        </div>
                        {donation.message && (
                          <div className="donation-message">
                            <i className="fas fa-quote-left"></i>
                            "{donation.message}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="campaign-sidebar">
          {/* Progress Card */}
          <div className="progress-card">
            <div className="raised-amount">
              <span className="amount">
                <i className="fas fa-dollar-sign"></i> {campaign.raised?.toLocaleString()}
              </span>
              <span className="goal">raised of ${campaign.goal?.toLocaleString()} goal</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-stats">
              <span><i className="fas fa-chart-line"></i> {Math.round(progress)}% funded</span>
              <span><i className="far fa-clock"></i> {daysLeft} days left</span>
            </div>

            <button className="donate-now-btn" onClick={handleDonateClick} disabled={isFullyFunded}>
              <i className="fas fa-heart"></i> {isFullyFunded ? 'Campaign Complete' : 'Donate Now'}
            </button>

            <button className="share-btn" onClick={handleShare}>
              <i className="fas fa-share-alt"></i> Share Campaign
            </button>

            {/* Funding breakdown */}
            <div className="funding-breakdown">
              <div className="breakdown-item">
                <span>Raised:</span>
                <strong>${campaign.raised?.toLocaleString()}</strong>
              </div>
              <div className="breakdown-item">
                <span>Remaining:</span>
                <strong>${Math.max(0, campaign.goal - campaign.raised).toLocaleString()}</strong>
              </div>
              <div className="breakdown-item">
                <span>Donors:</span>
                <strong>{donations.length}</strong>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          {showDonateForm && (
            <div className="donation-form-card">
              <div className="donation-form-header">
                <h3><i className="fas fa-gift"></i> Make a Donation</h3>
                <button className="close-form-btn" onClick={() => setShowDonateForm(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <DonationForm
                campaignId={campaign.id}
                onSuccess={() => {
                  setShowDonateForm(false);
                  loadCampaign();
                  loadDonations();
                  refreshWallet();
                }}
              />
            </div>
          )}

          {/* Creator Info Card */}
          <div className="creator-card">
            <h3><i className="fas fa-user-circle"></i> About the Creator</h3>
            <div className="creator-profile">
              <div className="creator-avatar-lg">
                {creator?.name?.charAt(0) || 'C'}
              </div>
              <div className="creator-bio">
                <div className="creator-fullname">{creator?.name || campaign.creator_name}</div>
                <div className="creator-joined">
                  Member since {creator?.created_at ? new Date(creator.created_at).getFullYear() : '2024'}
                </div>
              </div>
            </div>
            <button className="contact-creator-btn" onClick={() => showToast('Contact creator feature coming soon')}>
              <i className="fas fa-envelope"></i> Contact Creator
            </button>
          </div>

          {/* Related Campaigns */}
          {relatedCampaigns.length > 0 && (
            <div className="related-campaigns">
              <h3><i className="fas fa-heart"></i> You Might Also Like</h3>
              {relatedCampaigns.map(camp => (
                <div key={camp.id} className="related-card" onClick={() => navigate(`/campaign/${camp.id}`)}>
                  <img src={camp.image_url || 'https://placehold.co/80x80'} alt={camp.title} />
                  <div>
                    <div className="related-title">{camp.title}</div>
                    <div className="related-progress">
                      ${camp.raised?.toLocaleString()} raised of ${camp.goal?.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .campaign-profile {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .campaign-nav-bar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
          padding: 12px 24px;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        .nav-back-btn, .nav-home-btn, .nav-share-btn, .nav-follow-btn, .nav-report-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .nav-back-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .nav-back-btn:hover {
          background: #e5e7eb;
        }

        .nav-home-btn {
          background: #e8531e;
          color: white;
        }

        .nav-home-btn:hover {
          background: #c4400f;
        }

        .nav-share-btn {
          background: #27a96c;
          color: white;
        }

        .nav-share-btn:hover {
          background: #1d9e75;
        }

        .nav-follow-btn {
          background: #ef4444;
          color: white;
        }

        .nav-follow-btn:hover {
          background: #dc2626;
        }

        .nav-report-btn {
          background: #f3f4f6;
          color: #6b7280;
        }

        .campaign-hero {
          position: relative;
          height: 450px;
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
          background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 100%);
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

        .campaign-badges {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .campaign-category {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(232, 83, 30, 0.9);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .campaign-badge-funded {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #27a96c;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .campaign-badge-pending {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f59e0b;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .campaign-hero-content h1 {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 20px;
          max-width: 800px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .campaign-creator-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .creator-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8531e, #f47c50);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          color: white;
        }

        .creator-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .campaign-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          opacity: 0.8;
          margin-top: 4px;
        }

        .campaign-container {
          max-width: 1200px;
          margin: -30px auto 0;
          padding: 0 24px 40px;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
        }

        .campaign-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab-btn {
          padding: 12px 24px;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn:hover {
          color: #e8531e;
        }

        .tab-btn.active {
          color: #e8531e;
          border-bottom: 2px solid #e8531e;
          margin-bottom: -2px;
        }

        .campaign-section {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .campaign-description {
          line-height: 1.8;
          color: #444;
        }

        .description-truncated {
          max-height: 300px;
          overflow: hidden;
          position: relative;
        }

        .description-truncated::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(transparent, white);
        }

        .read-more-btn {
          margin-top: 16px;
          background: none;
          border: none;
          color: #e8531e;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .impact-stats {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
        }

        .impact-stats h3 {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .impact-item {
          text-align: center;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .impact-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: #e8531e;
        }

        .impact-label {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 4px;
        }

        .donations-summary {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
          padding: 16px;
          background: linear-gradient(135deg, #fef3c7, #fffbeb);
          border-radius: 12px;
        }

        .summary-stat {
          flex: 1;
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #e8531e;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .donations-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .donation-item {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.2s;
        }

        .donation-item:hover {
          background: #fafafa;
        }

        .donor-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .donor-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #27a96c, #1d9e75);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .donor-details {
          flex: 1;
        }

        .donor-name {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .monthly-badge {
          font-size: 0.7rem;
          background: #dbeafe;
          color: #1e40af;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .donation-date {
          font-size: 0.75rem;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .donation-amount {
          font-weight: 700;
          color: #e8531e;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .donation-message {
          margin-top: 10px;
          padding: 10px 12px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #6b7280;
          font-style: italic;
          display: flex;
          gap: 8px;
        }

        .donation-message i {
          color: #9ca3af;
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
          margin-bottom: 20px;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .donate-now-btn {
          background: linear-gradient(135deg, #e8531e, #f47c50);
          color: white;
        }

        .donate-now-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(232,83,30,0.3);
        }

        .donate-now-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .share-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .share-btn:hover {
          background: #e5e7eb;
        }

        .funding-breakdown {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 0.85rem;
        }

        .creator-card, .related-campaigns {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-top: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .creator-card h3, .related-campaigns h3 {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
        }

        .creator-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .creator-avatar-lg {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8531e, #f47c50);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.4rem;
          color: white;
        }

        .creator-fullname {
          font-weight: 700;
          font-size: 1rem;
        }

        .creator-joined {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .contact-creator-btn {
          width: 100%;
          padding: 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .related-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .related-card:hover {
          background: #f3f4f6;
        }

        .related-card img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .related-title {
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .related-progress {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .donation-form-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-top: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }

        .donation-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .close-form-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #9ca3af;
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
            height: 400px;
          }

          .campaign-hero-content h1 {
            font-size: 1.8rem;
          }

          .campaign-nav-bar {
            flex-wrap: wrap;
            padding: 10px 16px;
          }

          .nav-actions {
            margin-top: 8px;
            width: 100%;
            justify-content: space-between;
          }

          .impact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}