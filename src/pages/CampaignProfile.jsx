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
  Loader2
} from 'lucide-react';

// Global style injection
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .campaign-profile {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
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
    .nav-left, .nav-right {
      display: flex;
      gap: 12px;
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
    .nav-home { background: #e8531e; color: white; }
    .nav-home:hover { background: #c4400f; transform: translateY(-1px); }
    .nav-share { background: #27a96c; color: white; }
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
      background: rgba(232, 83, 30, 0.95);
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
      background: #27a96c;
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
    .creator-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }
    .creator-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8531e, #f47c50);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      color: white;
    }
    .creator-info {
      flex: 1;
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
    .campaign-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 2px solid #e5e7eb;
      background: white;
      border-radius: 16px 16px 0 0;
      padding: 0 24px;
    }
    .tab-btn {
      padding: 14px 24px;
      background: none;
      border: none;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: inherit;
      position: relative;
    }
    .tab-btn:hover { color: #e8531e; }
    .tab-btn.active {
      color: #e8531e;
    }
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: #e8531e;
    }
    .campaign-section {
      background: white;
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .section-title {
      font-size: 1.4rem;
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
      font-family: inherit;
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
      border-radius: 16px;
      transition: transform 0.2s;
    }
    .impact-item:hover { transform: translateY(-4px); }
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
    .gallery-section {
      margin-top: 24px;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 16px;
    }
    .gallery-item {
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .gallery-item:hover { transform: scale(1.05); }
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .donations-summary {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;
      padding: 20px;
      background: linear-gradient(135deg, #fef3c7, #fffbeb);
      border-radius: 16px;
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
    .donations-list {
      max-height: 500px;
      overflow-y: auto;
    }
    .donation-item {
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      transition: background 0.2s;
    }
    .donation-item:hover { background: #fafafa; }
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
    .donor-details { flex: 1; }
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
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .donation-date {
      font-size: 0.7rem;
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
      border-radius: 12px;
      font-size: 0.85rem;
      color: #6b7280;
      font-style: italic;
      display: flex;
      gap: 8px;
    }
    .progress-card {
      background: white;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      position: sticky;
      top: 100px;
    }
    .raised-amount { text-align: center; margin-bottom: 20px; }
    .raised-amount .amount {
      font-size: 2rem;
      font-weight: 800;
      color: #e8531e;
      display: block;
    }
    .progress-bar {
      height: 12px;
      background: #e5e7eb;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #e8531e, #f47c50);
      border-radius: 20px;
      transition: width 0.5s ease;
    }
    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #6b7280;
      margin-bottom: 24px;
    }
    .donate-btn, .share-action-btn {
      width: 100%;
      padding: 14px;
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
    .donate-btn {
      background: linear-gradient(135deg, #e8531e, #f47c50);
      color: white;
    }
    .donate-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(232,83,30,0.3);
    }
    .donate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .share-action-btn {
      background: #f3f4f6;
      color: #374151;
    }
    .share-action-btn:hover { background: #e5e7eb; }
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
    .creator-card, .related-card-container {
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
      background: linear-gradient(135deg, #e8531e, #f47c50);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
    }
    .creator-fullname { font-weight: 700; font-size: 1rem; }
    .creator-joined { font-size: 0.75rem; color: #6b7280; margin-top: 4px; }
    .contact-btn {
      width: 100%;
      padding: 10px;
      background: #f3f4f6;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
    }
    .related-campaigns {
      margin-top: 24px;
    }
    .related-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      cursor: pointer;
      border-radius: 12px;
      transition: background 0.2s;
      text-decoration: none;
      color: inherit;
    }
    .related-item:hover { background: #f3f4f6; }
    .related-img {
      width: 70px;
      height: 70px;
      border-radius: 12px;
      object-fit: cover;
    }
    .related-info { flex: 1; }
    .related-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; }
    .related-progress { font-size: 0.75rem; color: #6b7280; }
    .loading-container, .error-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid #f3f4f6;
      border-top-color: #e8531e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .modal-image {
      max-width: 90vw;
      max-height: 90vh;
      border-radius: 8px;
    }
    @media (max-width: 768px) {
      .campaign-container { grid-template-columns: 1fr; }
      .campaign-hero { height: 350px; }
      .campaign-hero-content h1 { font-size: 1.8rem; }
      .campaign-nav-bar { flex-wrap: wrap; }
      .nav-left, .nav-right { width: 100%; justify-content: space-between; }
      .impact-grid { grid-template-columns: 1fr; }
      .gallery-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `;
  document.head.appendChild(styleEl);
};

// Image Gallery Modal
function ImageModal({ src, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <img src={src} alt="Full size" className="modal-image" />
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
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sample gallery images (can be replaced with actual campaign images)
  const galleryImages = [
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=400&fit=crop'
  ];

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading campaign...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="error-container">
        <AlertCircle size={48} color="#e8531e" />
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
        </div>
        <div className="nav-right">
          <button onClick={handleShare} className="nav-btn nav-share">
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

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
              <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
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
            <>
              <div className="campaign-section">
                <div className="campaign-description">
                  <div className={showFullDescription ? 'description-full' : 'description-truncated'}>
                    {campaign.description || 'No description provided.'}
                  </div>
                  {campaign.description && campaign.description.length > 500 && (
                    <button className="read-more-btn" onClick={() => setShowFullDescription(!showFullDescription)}>
                      {showFullDescription ? 'Show less' : 'Read more'}
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>

                {/* Impact Stats */}
                <div className="impact-stats">
                  <h3><TrendingUp size={18} /> Impact So Far</h3>
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
                      <div className="impact-number">{Math.floor(donations.length / 5) + 1}</div>
                      <div className="impact-label">Lives Impacted</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Updates Tab */}
          {activeTab === 'updates' && (
            <div className="campaign-section">
              <h2 className="section-title"><Newspaper size={20} /> Campaign Updates</h2>
              {campaignUpdates.length === 0 ? (
                <div className="no-updates" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <Newspaper size={48} style={{ marginBottom: 12 }} />
                  <p>No updates yet. Check back soon!</p>
                  <p style={{ fontSize: 12, marginTop: 8 }}>Campaign creators post updates about progress, milestones, and how funds are being used.</p>
                </div>
              ) : (
                <div className="updates-list">
                  {campaignUpdates.map(update => (
                    <div key={update.id} className="update-item" style={{ padding: 16, borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <strong>{update.title}</strong>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(update.created_at).toLocaleDateString()}</span>
                      </div>
                      <div style={{ lineHeight: 1.6 }}>{update.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div className="campaign-section">
              <h2 className="section-title"><HandHeart size={20} /> Recent Donations</h2>
              {donations.length === 0 ? (
                <div className="no-donations" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <Gift size={48} style={{ marginBottom: 12 }} />
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
                                  <Calendar size={10} /> Monthly
                                </span>
                              )}
                            </div>
                            <span className="donation-date">
                              <Calendar size={10} />
                              {new Date(donation.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="donation-amount">
                            <DollarSign size={14} />
                            {parseFloat(donation.amount).toLocaleString()}
                          </div>
                        </div>
                        {donation.message && (
                          <div className="donation-message">
                            <MessageCircle size={14} />
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
              <p style={{ marginBottom: 16, color: '#6b7280' }}>See the impact your donations are making</p>
              <div className="gallery-grid">
                {galleryImages.map((img, index) => (
                  <div 
                    key={index} 
                    className="gallery-item" 
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Gallery ${index + 1}`} />
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
                <DollarSign size={20} /> {campaign.raised?.toLocaleString()}
              </span>
              <span className="goal">raised of ${campaign.goal?.toLocaleString()} goal</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-stats">
              <span><TrendingUp size={12} /> {Math.round(progress)}% funded</span>
              <span><Clock size={12} /> {30} days left</span>
            </div>

            <button className="donate-btn" onClick={handleDonateClick} disabled={isFullyFunded}>
              <Heart size={18} /> {isFullyFunded ? 'Campaign Complete' : 'Donate Now'}
            </button>

            <button className="share-action-btn" onClick={handleShare}>
              <Share2 size={16} /> Share Campaign
            </button>

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
            <div className="donation-form-card" style={{ background: 'white', borderRadius: 20, padding: 24, marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}><Gift size={18} /> Make a Donation</h3>
                <button className="close-form-btn" onClick={() => setShowDonateForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
                <div className="creator-fullname">{creator?.name || campaign.creator_name}</div>
                <div className="creator-joined">
                  Member since {creator?.created_at ? new Date(creator.created_at).getFullYear() : '2024'}
                </div>
              </div>
            </div>
            <button className="contact-btn" onClick={() => showToast('Contact creator feature coming soon')}>
              <Mail size={14} /> Contact Creator
            </button>
          </div>

          {/* Related Campaigns */}
          {relatedCampaigns.length > 0 && (
            <div className="related-card-container">
              <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Heart size={18} /> You Might Also Like</h3>
              {relatedCampaigns.map(camp => (
                <div key={camp.id} className="related-item" onClick={() => navigate(`/campaign/${camp.id}`)}>
                  <img src={camp.image_url || 'https://placehold.co/80x80'} alt={camp.title} className="related-img" />
                  <div className="related-info">
                    <div className="related-title">{camp.title}</div>
                    <div className="related-progress">
                      ${camp.raised?.toLocaleString()} raised of ${camp.goal?.toLocaleString()}
                    </div>
                    <div className="progress-bar" style={{ marginTop: 6, height: 3 }}>
                      <div className="progress-fill" style={{ width: `${(camp.raised / camp.goal) * 100}%`, height: 3 }}></div>
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