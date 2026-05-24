import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { campaignApi, donationApi, userApi } from '../services/api';
import DonationForm from '../components/DonationForm';
import {
  ArrowLeft,
  Home,
  Tag,
  UserCircle,
  Calendar,
  Info,
  Newspaper,
  HandHeart,
  DollarSign,
  Heart,
  Share2,
  Gift,
  X,
  Clock,
  TrendingUp,
  CheckCircle,
  Users,
  Award,
  Shield,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Copy,
  Check,
  Star,
  MessageCircle,
  Image as ImageIcon,
  Play,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Loader2,
  Menu
} from 'lucide-react';

// Global style injection
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    :root {
      --primary: #e8531e;
      --primary-dark: #c4400f;
      --primary-light: #f47c50;
      --secondary: #27a96c;
      --dark: #1a1a2e;
      --text: #444;
      --text-light: #777;
      --bg-light: #f8f9fa;
      --grad1: linear-gradient(135deg, #e8531e 0%, #f47c50 50%, #e8531e 100%);
      --grad2: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      --shadow: 0 8px 30px rgba(232, 83, 30, 0.18);
      --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .campaign-profile {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    }
    
    /* Dark Mode Support */
    body.dark-mode .campaign-profile {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
    
    body.dark-mode .campaign-section,
    body.dark-mode .progress-card,
    body.dark-mode .creator-card,
    body.dark-mode .related-card-container,
    body.dark-mode .campaign-tabs {
      background: #1e1e36;
      border-color: rgba(255,255,255,0.1);
    }
    
    body.dark-mode .campaign-section .section-title,
    body.dark-mode .progress-card .raised-amount .amount,
    body.dark-mode .creator-card h3,
    body.dark-mode .related-card-container h3 {
      color: #fff;
    }
    
    body.dark-mode .campaign-description {
      color: #ccc;
    }
    
    body.dark-mode .impact-item {
      background: #2a2a40;
    }
    
    body.dark-mode .impact-item .impact-label {
      color: #aaa;
    }
    
    body.dark-mode .donation-item {
      border-bottom-color: rgba(255,255,255,0.1);
    }
    
    body.dark-mode .donation-item:hover {
      background: #2a2a40;
    }
    
    body.dark-mode .donation-message {
      background: #2a2a40;
      color: #ccc;
    }

    .campaign-nav-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      padding: 12px 24px;
      display: flex;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 20px rgba(0,0,0,0.08);
    }
    
    body.dark-mode .campaign-nav-bar {
      background: rgba(26,26,46,0.95);
    }
    
    body.dark-mode .nav-back {
      background: #2a2a40;
      color: #ccc;
    }
    
    body.dark-mode .nav-back:hover {
      background: #3a3a50;
    }

    .nav-left, .nav-right {
      display: flex;
      gap: 12px;
    }
    
    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }

    .nav-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 40px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      font-family: inherit;
    }
    .nav-back { background: #f3f4f6; color: #374151; }
    .nav-back:hover { background: #e5e7eb; transform: translateX(-2px); }
    .nav-home { background: var(--grad1); color: white; }
    .nav-home:hover { transform: translateY(-1px); box-shadow: var(--shadow); }
    .nav-share { background: var(--secondary); color: white; }
    .nav-share:hover { background: #1d9e75; }

    .campaign-hero {
      position: relative;
      height: 500px;
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
      transition: transform 0.5s ease;
    }
    .campaign-hero:hover .campaign-hero-bg {
      transform: scale(1.05);
    }
    .campaign-hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 100%);
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
      flex-wrap: wrap;
    }
    .badge-category {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--primary);
      padding: 6px 16px;
      border-radius: 30px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      backdrop-filter: blur(4px);
    }
    .badge-funded {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--secondary);
      padding: 6px 16px;
      border-radius: 30px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .campaign-hero-content h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 20px;
      max-width: 800px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      line-height: 1.2;
    }
    
    @media (max-width: 768px) {
      .campaign-hero-content h1 {
        font-size: 1.8rem;
      }
      .campaign-hero {
        height: 400px;
      }
    }

    .creator-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .creator-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--grad1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      color: white;
      flex-shrink: 0;
    }
    .creator-info {
      flex: 1;
      min-width: 150px;
    }
    .creator-name {
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .verified-badge {
      background: #378ADD;
      border-radius: 20px;
      padding: 2px 8px;
      font-size: 0.7rem;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .campaign-container {
      max-width: 1200px;
      margin: -40px auto 0;
      padding: 0 24px 60px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
      position: relative;
      z-index: 3;
    }
    
    @media (max-width: 768px) {
      .campaign-container {
        grid-template-columns: 1fr;
        gap: 24px;
        padding: 0 16px 60px;
      }
      .campaign-nav-bar {
        flex-wrap: wrap;
      }
      .nav-left, .nav-right {
        width: 100%;
        justify-content: space-between;
      }
      .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .nav-left .nav-btn:not(.nav-back) {
        display: none;
      }
      .nav-left .mobile-menu-btn {
        display: flex;
      }
    }

    .campaign-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 24px;
      background: white;
      border-radius: 16px;
      overflow-x: auto;
      white-space: nowrap;
      box-shadow: var(--shadow-card);
    }
    
    @media (max-width: 768px) {
      .campaign-tabs {
        justify-content: space-between;
      }
      .tab-btn {
        padding: 10px 12px;
        font-size: 0.85rem;
      }
    }

    .tab-btn {
      padding: 14px 20px;
      background: none;
      border: none;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      position: relative;
    }
    .tab-btn:hover { color: var(--primary); }
    .tab-btn.active {
      color: var(--primary);
      background: rgba(232,83,30,0.05);
    }
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary);
    }

    .campaign-section {
      background: white;
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-card);
    }
    
    @media (max-width: 768px) {
      .campaign-section {
        padding: 20px;
      }
      .section-title {
        font-size: 1.2rem;
      }
    }

    .section-title {
      font-size: 1.3rem;
      margin-bottom: 20px;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .campaign-description {
      line-height: 1.9;
      color: #444;
      font-size: 1rem;
    }

    .progress-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: var(--shadow-card);
      position: sticky;
      top: 100px;
    }
    
    @media (max-width: 768px) {
      .progress-card {
        position: relative;
        top: 0;
      }
    }

    .raised-amount {
      text-align: center;
      margin-bottom: 20px;
    }
    .raised-amount .amount {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      display: block;
    }
    .raised-amount .goal {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .progress-bar {
      height: 10px;
      background: #e5e7eb;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .progress-fill {
      height: 100%;
      background: var(--grad1);
      border-radius: 20px;
      transition: width 0.5s ease;
    }

    .donate-btn {
      width: 100%;
      padding: 14px;
      background: var(--grad1);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
    }
    .donate-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }
    .donate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .share-action-btn {
      width: 100%;
      padding: 12px;
      background: #f3f4f6;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
    }
    
    .creator-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-top: 24px;
    }
    
    .creator-profile {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .creator-avatar-lg {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--grad1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
      flex-shrink: 0;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleEl);
};

// Image Gallery Modal
function ImageModal({ src, onClose }) {
  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <img 
        src={src} 
        alt="Full size" 
        style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8 }} 
      />
    </div>
  );
}

export default function CampaignProfile() {
  injectStyles();
  
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
  const [activeTab, setActiveTab] = useState('story');
  const [campaignUpdates, setCampaignUpdates] = useState([]);
  const [relatedCampaigns, setRelatedCampaigns] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const galleryImages = campaign?.gallery_images || [];

  useEffect(() => {
    loadCampaign();
    loadDonations();
    loadCampaignUpdates();
    loadRelatedCampaigns();
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
      const data = await campaignApi.getUpdates(id);
      setCampaignUpdates(data.updates || []);
    } catch (err) {
      console.error('Error loading updates:', err);
    }
  };

  const loadRelatedCampaigns = async () => {
    try {
      if (campaign?.category) {
        const data = await campaignApi.getRelated(id, campaign.category);
        setRelatedCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.error('Error loading related campaigns:', err);
    }
  };

  const handleDonateClick = () => {
    if (!currentUser) {
      showToast('Please login to donate', true);
      return;
    }
    setShowDonateForm(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy link', true);
    }
  };

  const handleBack = () => navigate(-1);
  const handleGoHome = () => navigate('/');
  
  // Mobile menu navigation items
  const mobileNavItems = [
    { label: 'Story', action: () => { setActiveTab('story'); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { label: 'Updates', action: () => { setActiveTab('updates'); setMobileMenuOpen(false); } },
    { label: 'Donations', action: () => { setActiveTab('donations'); setMobileMenuOpen(false); } },
    { label: 'Gallery', action: () => { setActiveTab('gallery'); setMobileMenuOpen(false); } },
    { label: 'Donate Now', action: () => { handleDonateClick(); setMobileMenuOpen(false); } },
    { label: 'Share', action: () => { handleShare(); setMobileMenuOpen(false); } },
  ];

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
        <p>Loading campaign...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="error-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <AlertCircle size={48} color="var(--primary)" />
        <h2>Campaign Not Found</h2>
        <p>The campaign you're looking for doesn't exist or has been removed.</p>
        <button onClick={handleGoHome} className="nav-btn nav-home">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    );
  }

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const isFullyFunded = campaign.raised >= campaign.goal;
  const isVerified = creator?.is_verified === true;
  const hasGallery = galleryImages.length > 0;

  return (
    <div className="campaign-profile">
      {/* Navigation Bar */}
      <div className="campaign-nav-bar">
        <div className="nav-left">
          <button onClick={handleBack} className="nav-btn nav-back">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={handleGoHome} className="nav-btn nav-home">
            <Home size={16} /> Home
          </button>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
        <div className="nav-right">
          <button onClick={handleShare} className="nav-btn nav-share">
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 70,
          left: 0,
          right: 0,
          background: 'white',
          zIndex: 200,
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '12px 0'
        }}>
          {mobileNavItems.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: '100%',
                padding: '12px 24px',
                textAlign: 'left',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === item.label.toLowerCase() ? 700 : 500,
                color: activeTab === item.label.toLowerCase() ? 'var(--primary)' : '#333',
                borderLeft: activeTab === item.label.toLowerCase() ? `3px solid var(--primary)` : 'none'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div className="campaign-hero">
        <div 
          className="campaign-hero-bg"
          style={{ backgroundImage: `url(${campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=500&fit=crop'})` }}
        >
          <div className="campaign-hero-overlay"></div>
        </div>
        <div className="campaign-hero-content">
          <div className="campaign-badges">
            <span className="badge-category">
              <Tag size={14} /> {campaign.category || 'Cause'}
            </span>
            {isFullyFunded && (
              <span className="badge-funded">
                <CheckCircle size={14} /> Fully Funded!
              </span>
            )}
          </div>
          <h1>{campaign.title}</h1>
          <div className="creator-section">
            <div className="creator-avatar">
              {creator?.name?.charAt(0) || campaign.creator_name?.charAt(0) || 'U'}
            </div>
            <div className="creator-info">
              <div className="creator-name">
                Created by {creator?.name || campaign.creator_name || 'Anonymous'}
                {isVerified && (
                  <span className="verified-badge">
                    <CheckCircle size={12} /> Verified Creator
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                  <Calendar size={12} /> Started {new Date(campaign.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
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
              <Info size={16} /> Story
            </button>
            <button
              className={`tab-btn ${activeTab === 'updates' ? 'active' : ''}`}
              onClick={() => setActiveTab('updates')}
            >
              <Newspaper size={16} /> Updates ({campaignUpdates.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
              onClick={() => setActiveTab('donations')}
            >
              <Heart size={16} /> Donations ({donations.length})
            </button>
            {hasGallery && (
              <button
                className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                <ImageIcon size={16} /> Gallery
              </button>
            )}
          </div>

          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="campaign-section">
              <h2 className="section-title">
                <Info size={20} /> Campaign Story
              </h2>
              <div className="campaign-description">
                <div className={showFullDescription ? 'description-full' : 'description-truncated'} style={!showFullDescription ? { maxHeight: 300, overflow: 'hidden', position: 'relative' } : {}}>
                  {campaign.description || 'No description provided.'}
                  {!showFullDescription && campaign.description && campaign.description.length > 500 && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 60,
                      background: 'linear-gradient(transparent, white)'
                    }} />
                  )}
                </div>
                {campaign.description && campaign.description.length > 500 && (
                  <button className="read-more-btn" onClick={() => setShowFullDescription(!showFullDescription)} style={{
                    marginTop: 16,
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    {showFullDescription ? 'Show less' : 'Read more'}
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === 'updates' && (
            <div className="campaign-section">
              <h2 className="section-title"><Newspaper size={20} /> Campaign Updates</h2>
              {campaignUpdates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <Newspaper size={48} style={{ marginBottom: 12 }} />
                  <p>No updates yet. Check back soon!</p>
                </div>
              ) : (
                campaignUpdates.map(update => (
                  <div key={update.id} style={{ padding: 16, borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                      <strong>{update.title}</strong>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(update.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ lineHeight: 1.6 }}>{update.content}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="campaign-section">
              <h2 className="section-title"><HandHeart size={20} /> Recent Donations</h2>
              {donations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <Gift size={48} style={{ marginBottom: 12 }} />
                  <p>No donations yet. Be the first to donate!</p>
                </div>
              ) : (
                <>
                  <div className="donations-summary" style={{
                    display: 'flex',
                    gap: 20,
                    marginBottom: 24,
                    padding: 20,
                    background: 'linear-gradient(135deg, #fef3c7, #fffbeb)',
                    borderRadius: 16,
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${totalDonations.toLocaleString()}</span>
                      <span>Total Raised</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{donations.length}</span>
                      <span>Total Donations</span>
                    </div>
                  </div>
                  <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                    {donations.map(donation => (
                      <div key={donation.id} style={{ padding: 16, borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'var(--grad1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: 'white'
                          }}>
                            {donation.donor_name?.charAt(0) || 'A'}
                          </div>
                          <div style={{ flex: 1, minWidth: 150 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <strong>{donation.donor_name || 'Anonymous'}</strong>
                              {donation.is_monthly && (
                                <span style={{ fontSize: '0.7rem', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 20 }}>
                                  Monthly
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                              <Calendar size={10} />
                              {new Date(donation.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            ${parseFloat(donation.amount).toLocaleString()}
                          </div>
                        </div>
                        {donation.message && (
                          <div style={{ marginTop: 10, padding: '10px 12px', background: '#f9fafb', borderRadius: 12, fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic' }}>
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

          {/* Gallery Tab */}
          {activeTab === 'gallery' && hasGallery && (
            <div className="campaign-section">
              <h2 className="section-title"><ImageIcon size={20} /> Photo Gallery</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 12,
                marginTop: 16
              }}>
                {galleryImages.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedImage(img)}
                    style={{
                      aspectRatio: 1,
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src={img} alt={`Gallery ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
          )}
        </div>

        <div className="campaign-sidebar">
          {/* Progress Card */}
          <div className="progress-card">
            <div className="raised-amount">
              <span className="amount">
                <DollarSign size={20} style={{ display: 'inline' }} /> {campaign.raised?.toLocaleString()}
              </span>
              <span className="goal">raised of ${campaign.goal?.toLocaleString()} goal</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-stats" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <span><TrendingUp size={12} /> {Math.round(progress)}% funded</span>
              <span><Clock size={12} /> {Math.max(0, 30 - Math.floor((new Date() - new Date(campaign.created_at)) / (1000 * 60 * 60 * 24)))} days left</span>
            </div>

            <button className="donate-btn" onClick={handleDonateClick} disabled={isFullyFunded}>
              <Heart size={18} /> {isFullyFunded ? 'Campaign Complete' : 'Donate Now'}
            </button>

            <button className="share-action-btn" onClick={handleShare}>
              <Share2 size={16} /> Share Campaign
            </button>

            <div className="funding-breakdown" style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Raised:</span>
                <strong>${campaign.raised?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Remaining:</span>
                <strong>${Math.max(0, campaign.goal - campaign.raised).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Donors:</span>
                <strong>{donations.length}</strong>
              </div>
            </div>
          </div>

          {/* Donation Form Modal */}
          {showDonateForm && (
            <div className="donation-form-card" style={{ background: 'white', borderRadius: 20, padding: 24, marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}><Gift size={18} /> Make a Donation</h3>
                <button onClick={() => setShowDonateForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
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
            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><UserCircle size={18} /> About the Creator</h3>
            <div className="creator-profile">
              <div className="creator-avatar-lg">
                {creator?.name?.charAt(0) || campaign.creator_name?.charAt(0) || 'C'}
              </div>
              <div>
                <div className="creator-fullname" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {creator?.name || campaign.creator_name}
                  {isVerified && <CheckCircle size={14} color="#378ADD" />}
                </div>
                <div className="creator-joined" style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>
                  Member since {creator?.created_at ? new Date(creator.created_at).getFullYear() : '2024'}
                </div>
              </div>
            </div>
            <button className="contact-btn" onClick={() => showToast('Contact creator feature coming soon')} style={{
              width: '100%',
              padding: 10,
              background: '#f3f4f6',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}>
              <Mail size={14} /> Contact Creator
            </button>
          </div>

          {/* Related Campaigns */}
          {relatedCampaigns.length > 0 && (
            <div className="related-card-container" style={{ background: 'white', borderRadius: 20, padding: 24, marginTop: 24 }}>
              <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Heart size={18} /> You Might Also Like</h3>
              {relatedCampaigns.map(camp => (
                <div 
                  key={camp.id} 
                  onClick={() => navigate(`/campaign/${camp.id}`)}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: 12,
                    cursor: 'pointer',
                    borderRadius: 12,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img 
                    src={camp.image_url || 'https://placehold.co/80x80'} 
                    alt={camp.title} 
                    style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{camp.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      ${camp.raised?.toLocaleString()} raised of ${camp.goal?.toLocaleString()}
                    </div>
                    <div className="progress-bar" style={{ marginTop: 6, height: 3, background: '#e5e7eb', borderRadius: 2 }}>
                      <div className="progress-fill" style={{ width: `${(camp.raised / camp.goal) * 100}%`, height: 3, borderRadius: 2 }}></div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#9ca3af" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}