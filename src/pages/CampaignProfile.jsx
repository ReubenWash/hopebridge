import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { campaignApi, donationApi, userApi } from '../services/api';
import DonationForm from '../components/DonationForm';

let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const el = document.createElement('style');
  el.textContent = `
    :root {
      --sage: #4a7c59;
      --sage-d: #3a6147;
      --sage-l: #e8f0eb;
      --warm: #f5f0e8;
      --gold: #c9a84c;
      --txt: #1a1a1a;
      --txt-2: #555;
      --txt-3: #999;
      --surface: #fff;
      --border: rgba(0,0,0,0.08);
      --sh: 0 2px 12px rgba(0,0,0,0.07);
      --sh-lg: 0 8px 32px rgba(0,0,0,0.12);
      --r: 12px;
      --r-lg: 20px;
      --tr: 0.2s ease;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Open Sans', sans-serif; background: var(--warm); color: var(--txt); }

    /* Loading */
    .cp-loading { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; background: var(--warm); }
    .cp-spinner { width: 40px; height: 40px; border: 3px solid var(--sage-l); border-top-color: var(--sage); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Nav */
    .cp-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; }
    .cp-nav-left { display: flex; align-items: center; gap: 16px; }
    .cp-nav-right { display: flex; gap: 10px; }
    .cp-nav-brand { font-family: 'Raleway', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--sage); }

    /* Buttons */
    .cp-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all var(--tr); }
    .cp-btn-ghost { background: none; color: var(--txt-2); }
    .cp-btn-ghost:hover { background: var(--sage-l); color: var(--sage); }
    .cp-btn-outline { background: none; border: 1.5px solid var(--sage); color: var(--sage); }
    .cp-btn-outline:hover { background: var(--sage-l); }
    .cp-btn-sage { background: var(--sage); color: #fff; }
    .cp-btn-sage:hover { background: var(--sage-d); transform: translateY(-1px); }
    .cp-btn-sage:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    /* Hero */
    .cp-hero { position: relative; height: 420px; overflow: hidden; }
    .cp-hero-img { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 8s ease; }
    .cp-hero:hover .cp-hero-img { transform: scale(1.04); }
    .cp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, transparent 100%); }
    .cp-hero-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 32px 36px; }
    .cp-hero-pills { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .cp-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
    .cp-pill-cat { background: rgba(74,124,89,0.85); color: #fff; }
    .cp-pill-funded { background: rgba(201,168,76,0.9); color: #fff; }
    .cp-hero-title { font-family: 'Raleway', sans-serif; font-size: clamp(1.5rem, 3vw, 2.4rem); font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 14px; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }
    .cp-creator-row { display: flex; align-items: center; gap: 10px; }
    .cp-av { width: 36px; height: 36px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 15px; border: 2px solid rgba(255,255,255,0.4); }
    .cp-creator-name { color: #fff; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; }
    .cp-verified { background: var(--sage); padding: 2px 7px; border-radius: 20px; font-size: 10px; display: inline-flex; align-items: center; gap: 3px; }
    .cp-creator-meta { color: rgba(255,255,255,0.65); font-size: 12px; margin-top: 2px; display: flex; align-items: center; gap: 4px; }

    /* Body Layout */
    .cp-body { display: grid; grid-template-columns: 1fr 360px; gap: 28px; max-width: 1100px; margin: 32px auto; padding: 0 24px 60px; }
    .cp-main { display: flex; flex-direction: column; gap: 20px; }
    .cp-sidebar { display: flex; flex-direction: column; gap: 20px; }

    /* Tabs */
    .cp-tabs { display: flex; gap: 4px; background: #fff; border-radius: var(--r); padding: 6px; box-shadow: var(--sh); flex-wrap: wrap; }
    .cp-tab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--txt-2); transition: all var(--tr); }
    .cp-tab:hover { background: var(--sage-l); color: var(--sage); }
    .cp-tab.active { background: var(--sage); color: #fff; }

    /* Card */
    .cp-card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh); padding: 24px; border: 1px solid var(--border); }
    .cp-card-title { font-family: 'Raleway', sans-serif; font-size: 1.05rem; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
    .cp-card-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--sage-l); display: flex; align-items: center; justify-content: center; }

    /* Story */
    .cp-story { font-size: 14.5px; line-height: 1.8; color: var(--txt-2); white-space: pre-wrap; }
    .cp-story-truncated { max-height: 200px; overflow: hidden; }
    .cp-story-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(transparent, var(--surface)); }
    .cp-read-more { display: block; margin-top: 12px; background: none; border: none; color: var(--sage); font-weight: 700; cursor: pointer; font-size: 13px; }
    .cp-read-more:hover { text-decoration: underline; }

    /* Empty state */
    .cp-empty { text-align: center; padding: 40px 20px; }
    .cp-empty-icon { font-size: 36px; margin-bottom: 8px; }
    .cp-empty-txt { color: var(--txt-3); font-size: 14px; }

    /* Donations */
    .cp-don-summary { display: flex; gap: 24px; padding: 16px 0; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
    .cp-don-stat { display: flex; flex-direction: column; }
    .cp-don-stat-val { font-family: 'Raleway', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--sage); }
    .cp-don-stat-lbl { font-size: 12px; color: var(--txt-3); margin-top: 2px; }
    .cp-don-list { display: flex; flex-direction: column; gap: 12px; }
    .cp-don-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .cp-don-item:last-child { border-bottom: none; }
    .cp-don-av { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--sage), var(--sage-d)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 15px; flex-shrink: 0; }
    .cp-don-info { flex: 1; }
    .cp-don-name { font-weight: 600; font-size: 14px; }
    .cp-don-date { font-size: 11px; color: var(--txt-3); margin-top: 2px; }
    .cp-don-msg { font-size: 13px; color: var(--txt-2); margin-top: 4px; font-style: italic; }
    .cp-don-amount { font-weight: 700; color: var(--sage); font-size: 15px; white-space: nowrap; }

    /* Updates */
    .cp-update { padding: 16px 0; border-bottom: 1px solid var(--border); }
    .cp-update:last-child { border-bottom: none; }
    .cp-update-date { font-size: 11px; color: var(--txt-3); margin-bottom: 4px; }
    .cp-update-title { font-weight: 700; font-size: 15px; margin-bottom: 6px; }
    .cp-update-body { font-size: 13.5px; color: var(--txt-2); line-height: 1.7; }

    /* Gallery */
    .cp-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .cp-gallery-img { border-radius: 10px; overflow: hidden; aspect-ratio: 1; cursor: pointer; transition: transform var(--tr); }
    .cp-gallery-img:hover { transform: scale(1.03); }
    .cp-gallery-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

    /* Lightbox */
    .cp-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .cp-lightbox img { max-width: 90vw; max-height: 90vh; border-radius: 12px; object-fit: contain; }

    /* Progress card */
    .cp-progress-card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh-lg); padding: 24px; border: 1px solid var(--border); }
    .cp-raised-big { font-family: 'Raleway', sans-serif; font-size: 2rem; font-weight: 900; color: var(--sage); }
    .cp-raised-of { font-size: 13px; color: var(--txt-3); margin-bottom: 14px; }
    .cp-progbar { height: 8px; background: var(--sage-l); border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
    .cp-progfill { height: 100%; background: linear-gradient(90deg, var(--sage), var(--gold)); border-radius: 4px; transition: width 0.8s ease; }
    .cp-prog-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--txt-3); margin-bottom: 20px; }
    .cp-stat-row { display: flex; gap: 0; border-top: 1px solid var(--border); margin-top: 20px; padding-top: 16px; }
    .cp-stat { flex: 1; text-align: center; }
    .cp-stat:not(:last-child) { border-right: 1px solid var(--border); }
    .cp-stat-val { font-family: 'Raleway', sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--txt); }
    .cp-stat-lbl { font-size: 11px; color: var(--txt-3); margin-top: 2px; }
    .cp-donate-btn { width: 100%; padding: 14px; border-radius: 10px; background: var(--sage); color: #fff; border: none; cursor: pointer; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all var(--tr); margin-bottom: 10px; }
    .cp-donate-btn:hover:not(:disabled) { background: var(--sage-d); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74,124,89,0.4); }
    .cp-donate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .cp-share-btn { width: 100%; padding: 10px; border-radius: 10px; background: none; border: 1.5px solid var(--border); color: var(--txt-2); cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all var(--tr); }
    .cp-share-btn:hover { border-color: var(--sage); color: var(--sage); background: var(--sage-l); }

    /* Donate panel */
    .cp-donate-panel { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh); padding: 20px; border: 1px solid var(--border); }
    .cp-donate-panel-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .cp-donate-panel-title { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 1rem; }
    .cp-close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--txt-3); line-height: 1; }
    .cp-close-btn:hover { color: var(--txt); }

    /* Creator card */
    .cp-creator-card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh); padding: 20px; border: 1px solid var(--border); }
    .cp-creator-card-title { font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .07em; color: var(--txt-3); margin-bottom: 14px; }
    .cp-creator-row-inner { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .cp-creator-av-lg { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--sage), var(--gold)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px; }
    .cp-creator-nm { font-weight: 700; font-size: 15px; }
    .cp-creator-since { font-size: 12px; color: var(--txt-3); margin-top: 2px; }

    /* Share panel */
    .cp-share-panel { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #fff; border-radius: 40px; box-shadow: var(--sh-lg); padding: 12px 20px; display: flex; align-items: center; gap: 16px; z-index: 500; border: 1px solid var(--border); }
    .cp-share-links { display: flex; gap: 8px; }
    .cp-share-link { width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; color: #fff; transition: transform var(--tr); }
    .cp-share-link:hover { transform: scale(1.1); }
    .cp-share-wa { background: #25D366; }
    .cp-share-fb { background: #1877F2; }
    .cp-share-tw { background: #000; }
    .cp-share-cp { background: var(--sage); }
    .cp-share-close { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--txt-3); }

    /* Fade animation */
    .cp-fade { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

    /* Responsive */
    @media (max-width: 768px) {
      .cp-body { grid-template-columns: 1fr; padding: 0 16px 80px; margin-top: 20px; }
      .cp-hero { height: 280px; }
      .cp-hero-content { padding: 20px; }
      .cp-hero-title { font-size: 1.4rem; }
      .cp-nav { padding: 10px 16px; }
      .cp-gallery { grid-template-columns: repeat(2, 1fr); }
      .cp-tabs { gap: 2px; }
      .cp-tab { padding: 7px 10px; font-size: 12px; }
    }
  `;
  document.head.appendChild(el);
};

// ── SVG Icon component ──
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke={stroke}
    fill={fill}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', flexShrink: 0 }}
  >
    <path d={d} />
  </svg>
);

// ── Icon paths ──
const ICO = {
  back: 'M19 12H5M12 19l-7-7 7-7',
  share: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01',
  check: 'M20 6L9 17l-5-5',
  info: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01',
  calendar: 'M3 9h18M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zM8 2v2M16 2v2',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  trend: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  clock: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
  news: 'M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2',
  camera: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  copy: 'M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z',
};

export default function CampaignProfile() {
  injectStyles();

  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, showToast, refreshWallet } = useApp();

  const [campaign, setCampaign] = useState(null);
  const [creator, setCreator] = useState(null);
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [updates, setUpdates] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('story');
  const [showStory, setShowStory] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [showDonate, setShowDonate] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAll();
  }, [id]);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const campRes = await campaignApi.getById(id);
      const campaignData = campRes.campaign;
      setCampaign(campaignData);

      const donRes = await donationApi.getCampaignDons(id).catch(() => ({ donations: [], total: 0 }));
      setDonations(donRes.donations || []);
      setTotal(donRes.total || 0);

      if (campaignData?.creator_id) {
        try {
          const creatorRes = await userApi.getById(campaignData.creator_id);
          setCreator(creatorRes?.user || null);
        } catch (err) {
          console.warn('Could not load creator details');
        }
      }

      try {
        const updatesRes = await campaignApi.getUpdates?.(id);
        setUpdates(updatesRes?.updates || []);
      } catch (err) {
        console.warn('Could not load updates');
      }

      let gallery = campaignData.gallery_images || [];
      if (!gallery.length) {
        try {
          const galleryRes = await campaignApi.getGallery?.(id);
          gallery = galleryRes?.images || [];
        } catch (err) {
          console.warn('No gallery endpoint or gallery empty');
        }
      }
      setGalleryImages(gallery);

    } catch (err) {
      console.error('Load error:', err);
      setError('Campaign not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `Support "${campaign?.title}" on HopeBridge`;
    if (platform === 'wa') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    if (platform === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    if (platform === 'tw') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      showToast('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDonate = () => setShowDonate(true);

  if (loading) {
    return (
      <div className="cp-loading">
        <div className="cp-spinner" />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Loading campaign…</span>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="cp-loading" style={{ gap: 12 }}>
        <div style={{ fontSize: 40 }}>🔍</div>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 24, fontWeight: 700 }}>Campaign Not Found</div>
        <div style={{ fontSize: 14, color: '#999' }}>This campaign may have been removed or never existed.</div>
        <button className="cp-btn cp-btn-sage" onClick={() => navigate('/')} style={{ marginTop: 8 }}>
          ← Back to Home
        </button>
      </div>
    );
  }

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const isFunded = campaign.raised >= campaign.goal;
  const isVerified = creator?.is_verified;
  const gallery = galleryImages;
  const daysLeft = Math.max(0, 30 - Math.floor((Date.now() - new Date(campaign.created_at)) / 86400000));
  const desc = campaign.description || '';
  const longDesc = desc.length > 480;

  return (
    <div className="cp-wrap">
      {/* Nav */}
      <nav className="cp-nav">
        <div className="cp-nav-left">
          <button className="cp-btn cp-btn-ghost" onClick={() => navigate(-1)}>
            <Icon d={ICO.back} size={15} /> Back
          </button>
          <span className="cp-nav-brand">HopeBridge</span>
        </div>
        <div className="cp-nav-right">
          <button className="cp-btn cp-btn-outline" onClick={() => setShowShare(s => !s)}>
            <Icon d={ICO.share} size={15} /> Share
          </button>
          <button className="cp-btn cp-btn-sage" onClick={handleDonate} disabled={isFunded}>
            <Icon d={ICO.heart} size={15} fill="#fff" /> {isFunded ? 'Funded ✓' : 'Donate'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="cp-hero">
        <div className="cp-hero-img" style={{ backgroundImage: `url(${campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1400'})` }} />
        <div className="cp-hero-overlay" />
        <div className="cp-hero-content">
          <div className="cp-hero-pills">
            <span className="cp-pill cp-pill-cat">
              <Icon d={ICO.tag} size={11} stroke="#fff" /> {campaign.category || 'Cause'}
            </span>
            {isFunded && <span className="cp-pill cp-pill-funded"><Icon d={ICO.check} size={11} stroke="#fff" /> Fully Funded</span>}
          </div>
          <h1 className="cp-hero-title">{campaign.title}</h1>
          <div className="cp-creator-row">
            <div className="cp-av">{(creator?.name || campaign.creator_name || 'U').charAt(0).toUpperCase()}</div>
            <div>
              <div className="cp-creator-name">
                {creator?.name || campaign.creator_name || 'Anonymous'}
                {isVerified && <span className="cp-verified"><Icon d={ICO.shield} size={9} stroke="#fff" /> Verified</span>}
              </div>
              <div className="cp-creator-meta">
                <Icon d={ICO.calendar} size={11} stroke="rgba(255,255,255,.6)" />
                {' '}Started {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="cp-body">
        {/* Left column */}
        <div className="cp-main cp-fade">
          <div className="cp-tabs">
            {[
              { key: 'story', label: 'Story', icon: ICO.info },
              { key: 'donations', label: `Donations (${donations.length})`, icon: ICO.heart },
              { key: 'updates', label: `Updates (${updates.length})`, icon: ICO.news },
              ...(gallery.length ? [{ key: 'gallery', label: 'Gallery', icon: ICO.camera }] : []),
            ].map(({ key, label, icon }) => (
              <button key={key} className={`cp-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
                <Icon d={icon} size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Story */}
          {tab === 'story' && (
            <div className="cp-card cp-fade">
              <div className="cp-card-title">
                <div className="cp-card-icon"><Icon d={ICO.info} size={16} stroke="var(--sage)" /></div>
                Campaign Story
              </div>
              {desc ? (
                <>
                  <div className={longDesc && !showStory ? 'cp-story cp-story-truncated' : 'cp-story'} style={{ position: 'relative' }}>
                    {desc}
                    {longDesc && !showStory && <div className="cp-story-fade" />}
                  </div>
                  {longDesc && (
                    <button className="cp-read-more" onClick={() => setShowStory(s => !s)}>
                      {showStory ? 'Show less ↑' : 'Read full story →'}
                    </button>
                  )}
                </>
              ) : (
                <div className="cp-empty"><div className="cp-empty-icon">📝</div><div className="cp-empty-txt">No story added yet.</div></div>
              )}
            </div>
          )}

          {/* Donations */}
          {tab === 'donations' && (
            <div className="cp-card cp-fade">
              <div className="cp-card-title">
                <div className="cp-card-icon"><Icon d={ICO.heart} size={16} stroke="var(--sage)" /></div>
                Supporters
              </div>
              {donations.length === 0 ? (
                <div className="cp-empty"><div className="cp-empty-icon">💛</div><div className="cp-empty-txt">No donations yet — be the first!</div></div>
              ) : (
                <>
                  <div className="cp-don-summary">
                    <div className="cp-don-stat">
                      <span className="cp-don-stat-val">${total.toLocaleString()}</span>
                      <span className="cp-don-stat-lbl">Total Raised</span>
                    </div>
                    <div className="cp-don-stat">
                      <span className="cp-don-stat-val">{donations.length}</span>
                      <span className="cp-don-stat-lbl">Supporters</span>
                    </div>
                  </div>
                  <div className="cp-don-list">
                    {donations.map(d => (
                      <div key={d.id} className="cp-don-item">
                        <div className="cp-don-av">{(d.donor_name || 'A').charAt(0).toUpperCase()}</div>
                        <div className="cp-don-info">
                          <div className="cp-don-name">{d.donor_name || 'Anonymous'}</div>
                          <div className="cp-don-date">{new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          {d.message && <div className="cp-don-msg">"{d.message}"</div>}
                        </div>
                        <div className="cp-don-amount">${parseFloat(d.amount).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Updates */}
          {tab === 'updates' && (
            <div className="cp-card cp-fade">
              <div className="cp-card-title">
                <div className="cp-card-icon"><Icon d={ICO.news} size={16} stroke="var(--sage)" /></div>
                Campaign Updates
              </div>
              {updates.length === 0 ? (
                <div className="cp-empty"><div className="cp-empty-icon">📢</div><div className="cp-empty-txt">No updates yet. Check back soon!</div></div>
              ) : (
                updates.map(u => (
                  <div key={u.id} className="cp-update">
                    <div className="cp-update-date">{new Date(u.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    <div className="cp-update-title">{u.title}</div>
                    <div className="cp-update-body">{u.content}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Gallery */}
          {tab === 'gallery' && gallery.length > 0 && (
            <div className="cp-card cp-fade">
              <div className="cp-card-title">
                <div className="cp-card-icon"><Icon d={ICO.camera} size={16} stroke="var(--sage)" /></div>
                Photo Gallery
              </div>
              <div className="cp-gallery">
                {gallery.map((img, i) => {
                  const imageUrl = typeof img === 'string' ? img : img.image_url;
                  return (
                    <div key={i} className="cp-gallery-img" onClick={() => setLightbox(imageUrl)}>
                      <img src={imageUrl} alt={`Gallery ${i + 1}`} loading="lazy" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="cp-sidebar cp-fade">
          <div className="cp-progress-card">
            <div className="cp-raised-big">${parseFloat(campaign.raised || 0).toLocaleString()}</div>
            <div className="cp-raised-of">raised of ${parseFloat(campaign.goal).toLocaleString()} goal</div>
            <div className="cp-progbar"><div className="cp-progfill" style={{ width: `${progress}%` }} /></div>
            <div className="cp-prog-meta">
              <span><Icon d={ICO.trend} size={11} /> {Math.round(progress)}% funded</span>
              <span><Icon d={ICO.clock} size={11} /> {daysLeft} days left</span>
            </div>
            <button className="cp-donate-btn" onClick={handleDonate} disabled={isFunded}>
              <Icon d={ICO.heart} size={18} fill="#fff" stroke="#fff" />
              {isFunded ? 'Campaign Complete' : 'Donate Now'}
            </button>
            <button className="cp-share-btn" onClick={() => setShowShare(s => !s)}>
              <Icon d={ICO.share} size={15} /> Share Campaign
            </button>
            <div className="cp-stat-row">
              <div className="cp-stat">
                <div className="cp-stat-val">{donations.length}</div>
                <div className="cp-stat-lbl">Donors</div>
              </div>
              <div className="cp-stat">
                <div className="cp-stat-val">{Math.round(progress)}%</div>
                <div className="cp-stat-lbl">Funded</div>
              </div>
              <div className="cp-stat">
                <div className="cp-stat-val">{daysLeft}</div>
                <div className="cp-stat-lbl">Days left</div>
              </div>
            </div>
          </div>

          {showDonate && (
            <div className="cp-donate-panel cp-fade">
              <div className="cp-donate-panel-hdr">
                <div className="cp-donate-panel-title">Make a Donation</div>
                <button className="cp-close-btn" onClick={() => setShowDonate(false)}>×</button>
              </div>
              <DonationForm
                campaignId={campaign.id}
                onSuccess={() => {
                  setShowDonate(false);
                  loadAll();
                  if (refreshWallet) refreshWallet();
                }}
              />
            </div>
          )}

          <div className="cp-creator-card">
            <div className="cp-creator-card-title">Campaign Creator</div>
            <div className="cp-creator-row-inner">
              <div className="cp-creator-av-lg">{(creator?.name || campaign.creator_name || 'C').charAt(0).toUpperCase()}</div>
              <div>
                <div className="cp-creator-nm">
                  {creator?.name || campaign.creator_name || 'Anonymous'}
                  {isVerified && ' ✓'}
                </div>
                <div className="cp-creator-since">
                  Member since {creator?.created_at ? new Date(creator.created_at).getFullYear() : '2024'}
                </div>
              </div>
            </div>
            <button className="cp-share-btn" style={{ fontSize: 13 }} onClick={() => showToast('Contact feature coming soon')}>
              <Icon d={ICO.mail} size={13} /> Contact Creator
            </button>
          </div>
        </div>
      </div>

      {/* Share panel */}
      {showShare && (
        <div className="cp-share-panel">
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500 }}>Share this campaign</span>
          <div className="cp-share-links">
            <button className="cp-share-link cp-share-wa" title="WhatsApp" onClick={() => handleShare('wa')}>W</button>
            <button className="cp-share-link cp-share-fb" title="Facebook" onClick={() => handleShare('fb')}>f</button>
            <button className="cp-share-link cp-share-tw" title="X / Twitter" onClick={() => handleShare('tw')}>𝕏</button>
            <button className="cp-share-link cp-share-cp" title="Copy link" onClick={() => handleShare('copy')}>
              {copied ? '✓' : <Icon d={ICO.copy} size={14} />}
            </button>
          </div>
          <button className="cp-share-close" onClick={() => setShowShare(false)}>×</button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="cp-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Full size" />
        </div>
      )}
    </div>
  );
}