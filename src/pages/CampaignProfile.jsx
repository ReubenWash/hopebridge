import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { campaignApi, donationApi, userApi } from '../services/api';
import DonationForm from '../components/DonationForm';

// ── Style injection ───────────────────────────────
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const el = document.createElement('style');
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    :root {
      --ink:#0D0D0D;--ink-2:#3A3A3A;--ink-3:#7A7A7A;--ink-4:#BDBDBD;
      --paper:#FAFAF8;--paper-2:#F2F1EE;--paper-3:#E8E6E1;
      --sage:#2D6A4F;--sage-l:#D8F3DC;--sage-d:#1B4332;
      --coral:#C45B3A;--coral-l:#FDEBD4;
      --gold:#C49A3C;--gold-l:#FDF6E3;
      --blue:#2B5EA7;--blue-l:#EBF1FA;
      --r:16px;--r-lg:24px;--r-xl:32px;
      --sh:0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04);
      --sh-lg:0 8px 40px rgba(0,0,0,.10);
      --fd:'Playfair Display',Georgia,serif;
      --fb:'DM Sans',system-ui,sans-serif;
      --tr:.22s ease;
    }

    .cp-wrap { font-family:var(--fb); background:var(--paper); min-height:100vh; color:var(--ink); }

    /* ── Nav ── */
    .cp-nav {
      position:sticky; top:0; z-index:200;
      background:rgba(250,250,248,.92); backdrop-filter:blur(16px);
      border-bottom:1px solid var(--paper-3);
      padding:0 28px; height:60px;
      display:flex; align-items:center; justify-content:space-between;
    }
    .cp-nav-left { display:flex; align-items:center; gap:8px; }
    .cp-nav-right { display:flex; align-items:center; gap:8px; }
    .cp-nav-brand { font-family:var(--fd); font-size:17px; color:var(--ink); font-weight:600; }
    .cp-btn {
      display:inline-flex; align-items:center; gap:6px;
      padding:8px 16px; border-radius:40px; border:none; cursor:pointer;
      font-family:var(--fb); font-size:13px; font-weight:500;
      transition:all var(--tr); white-space:nowrap;
    }
    .cp-btn-ghost { background:var(--paper-2); color:var(--ink-2); }
    .cp-btn-ghost:hover { background:var(--paper-3); }
    .cp-btn-sage { background:var(--sage); color:#fff; }
    .cp-btn-sage:hover { background:var(--sage-d); transform:translateY(-1px); }
    .cp-btn-outline { background:transparent; color:var(--ink); border:1.5px solid var(--paper-3); }
    .cp-btn-outline:hover { border-color:var(--ink-4); background:var(--paper-2); }

    /* ── Hero ── */
    .cp-hero {
      position:relative; height:520px; overflow:hidden;
    }
    .cp-hero-img {
      position:absolute; inset:0;
      background-size:cover; background-position:center;
      transition:transform 8s ease;
    }
    .cp-hero:hover .cp-hero-img { transform:scale(1.04); }
    .cp-hero-overlay {
      position:absolute; inset:0;
      background:linear-gradient(160deg,rgba(13,13,13,.72) 0%,rgba(13,13,13,.2) 55%,rgba(13,13,13,.55) 100%);
    }
    .cp-hero-content {
      position:relative; z-index:2; height:100%;
      max-width:1160px; margin:0 auto; padding:0 32px;
      display:flex; flex-direction:column; justify-content:flex-end; padding-bottom:52px;
      color:#fff;
    }
    .cp-hero-pills { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
    .cp-pill {
      display:inline-flex; align-items:center; gap:5px;
      padding:5px 13px; border-radius:30px;
      font-size:11px; font-weight:600; letter-spacing:.04em; text-transform:uppercase;
    }
    .cp-pill-cat { background:rgba(255,255,255,.18); backdrop-filter:blur(8px); color:#fff; border:1px solid rgba(255,255,255,.25); }
    .cp-pill-funded { background:var(--sage); color:#fff; }
    .cp-hero-title {
      font-family:var(--fd); font-size:clamp(26px,4vw,52px);
      font-weight:800; line-height:1.13; margin-bottom:20px;
      max-width:780px; text-shadow:0 2px 8px rgba(0,0,0,.25);
    }
    .cp-creator-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .cp-av { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--sage); font-weight:700; font-size:14px; color:#fff; flex-shrink:0; border:2px solid rgba(255,255,255,.35); }
    .cp-creator-name { font-size:14px; font-weight:500; display:flex; align-items:center; gap:6px; }
    .cp-creator-meta { font-size:12px; color:rgba(255,255,255,.65); margin-top:2px; }
    .cp-verified { background:var(--blue); color:#fff; border-radius:20px; padding:2px 8px; font-size:10px; font-weight:700; display:inline-flex; align-items:center; gap:3px; }

    /* ── Layout ── */
    .cp-body {
      max-width:1160px; margin:0 auto; padding:40px 32px 80px;
      display:grid; grid-template-columns:1fr 360px; gap:48px;
    }

    /* ── Tabs ── */
    .cp-tabs {
      display:flex; gap:2px; border-bottom:1px solid var(--paper-3); margin-bottom:32px;
    }
    .cp-tab {
      padding:10px 18px; border:none; background:none; cursor:pointer;
      font-family:var(--fb); font-size:13px; font-weight:500; color:var(--ink-3);
      display:inline-flex; align-items:center; gap:6px;
      border-bottom:2px solid transparent; margin-bottom:-1px;
      transition:all var(--tr);
    }
    .cp-tab:hover { color:var(--ink); }
    .cp-tab.active { color:var(--sage); border-bottom-color:var(--sage); font-weight:600; }

    /* ── Section card ── */
    .cp-card {
      background:var(--paper); border:1px solid var(--paper-3);
      border-radius:var(--r-lg); padding:32px; margin-bottom:24px;
      box-shadow:var(--sh);
    }
    .cp-card-title {
      font-family:var(--fd); font-size:20px; font-weight:600;
      color:var(--ink); margin-bottom:20px; display:flex; align-items:center; gap:10px;
    }
    .cp-card-icon { width:32px; height:32px; border-radius:8px; background:var(--sage-l); display:flex; align-items:center; justify-content:center; flex-shrink:0; }

    /* ── Story text ── */
    .cp-story {
      font-size:15.5px; line-height:1.85; color:var(--ink-2);
      font-weight:300; letter-spacing:.01em;
    }
    .cp-story-truncated { max-height:260px; overflow:hidden; position:relative; }
    .cp-story-fade { position:absolute; bottom:0; left:0; right:0; height:80px; background:linear-gradient(transparent,var(--paper)); }
    .cp-read-more { margin-top:14px; background:none; border:none; color:var(--sage); font-family:var(--fb); font-size:13px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px; }

    /* ── Donations list ── */
    .cp-don-summary {
      display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px;
    }
    .cp-don-stat {
      background:var(--gold-l); border-radius:var(--r); padding:18px 20px;
      border:1px solid #EDD98A;
    }
    .cp-don-stat-val { font-family:var(--fd); font-size:26px; font-weight:800; color:var(--gold); display:block; }
    .cp-don-stat-lbl { font-size:12px; color:var(--ink-3); margin-top:2px; }
    .cp-don-list { max-height:420px; overflow-y:auto; }
    .cp-don-item {
      display:flex; align-items:center; gap:12px;
      padding:14px 0; border-bottom:1px solid var(--paper-2);
      transition:background var(--tr);
    }
    .cp-don-item:last-child { border-bottom:none; }
    .cp-don-av { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--sage),var(--sage-d)); display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; font-size:13px; flex-shrink:0; }
    .cp-don-info { flex:1; }
    .cp-don-name { font-size:14px; font-weight:600; color:var(--ink); }
    .cp-don-date { font-size:11px; color:var(--ink-3); margin-top:2px; }
    .cp-don-msg { font-size:13px; color:var(--ink-3); font-style:italic; margin-top:8px; background:var(--paper-2); border-radius:8px; padding:8px 12px; }
    .cp-don-amount { font-family:var(--fd); font-size:17px; font-weight:700; color:var(--sage); }

    /* ── Updates ── */
    .cp-update {
      padding:20px 0; border-bottom:1px solid var(--paper-2);
    }
    .cp-update:last-child { border-bottom:none; }
    .cp-update-title { font-family:var(--fd); font-size:16px; font-weight:600; margin-bottom:6px; }
    .cp-update-date { font-size:11px; color:var(--ink-3); font-weight:500; text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
    .cp-update-body { font-size:14px; line-height:1.7; color:var(--ink-2); }

    /* ── Gallery ── */
    .cp-gallery { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
    .cp-gallery-img {
      aspect-ratio:1; border-radius:var(--r); overflow:hidden; cursor:pointer;
      transition:transform var(--tr), box-shadow var(--tr);
    }
    .cp-gallery-img:hover { transform:scale(1.03); box-shadow:var(--sh-lg); }
    .cp-gallery-img img { width:100%; height:100%; object-fit:cover; display:block; }

    /* ── Progress sidebar card ── */
    .cp-progress-card {
      background:var(--paper); border:1px solid var(--paper-3);
      border-radius:var(--r-xl); padding:28px;
      box-shadow:var(--sh-lg); position:sticky; top:80px;
    }
    .cp-raised-big { font-family:var(--fd); font-size:38px; font-weight:800; color:var(--ink); line-height:1; }
    .cp-raised-of { font-size:13px; color:var(--ink-3); margin-top:4px; margin-bottom:18px; }
    .cp-progbar { height:8px; background:var(--paper-3); border-radius:20px; overflow:hidden; margin-bottom:10px; }
    .cp-progfill { height:100%; background:linear-gradient(90deg,var(--sage),#52B788); border-radius:20px; transition:width 1s ease; }
    .cp-prog-meta { display:flex; justify-content:space-between; font-size:12px; color:var(--ink-3); font-weight:500; margin-bottom:24px; }
    .cp-donate-btn {
      width:100%; padding:15px; border:none; border-radius:var(--r);
      background:var(--sage); color:#fff; font-family:var(--fd);
      font-size:17px; font-weight:600; cursor:pointer; display:flex;
      align-items:center; justify-content:center; gap:8px;
      transition:all var(--tr); margin-bottom:10px;
    }
    .cp-donate-btn:hover:not(:disabled) { background:var(--sage-d); transform:translateY(-2px); box-shadow:0 8px 24px rgba(45,106,79,.35); }
    .cp-donate-btn:disabled { opacity:.5; cursor:not-allowed; }
    .cp-share-btn {
      width:100%; padding:12px; border:1.5px solid var(--paper-3); border-radius:var(--r);
      background:transparent; color:var(--ink-2); font-family:var(--fb);
      font-size:14px; font-weight:500; cursor:pointer; display:flex;
      align-items:center; justify-content:center; gap:8px;
      transition:all var(--tr);
    }
    .cp-share-btn:hover { border-color:var(--ink-3); background:var(--paper-2); }
    .cp-stat-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-top:20px; padding-top:20px; border-top:1px solid var(--paper-3); }
    .cp-stat { text-align:center; }
    .cp-stat-val { font-family:var(--fd); font-size:18px; font-weight:700; color:var(--ink); }
    .cp-stat-lbl { font-size:10px; color:var(--ink-3); text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }

    /* ── Creator mini card ── */
    .cp-creator-card {
      background:var(--paper); border:1px solid var(--paper-3);
      border-radius:var(--r-lg); padding:22px; margin-top:16px;
      box-shadow:var(--sh);
    }
    .cp-creator-card-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--ink-3); margin-bottom:14px; }
    .cp-creator-row-inner { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
    .cp-creator-av-lg { width:46px; height:46px; border-radius:50%; background:linear-gradient(135deg,var(--sage),var(--sage-d)); display:flex; align-items:center; justify-content:center; font-family:var(--fd); font-size:18px; font-weight:800; color:#fff; flex-shrink:0; }
    .cp-creator-nm { font-size:15px; font-weight:600; color:var(--ink); }
    .cp-creator-since { font-size:12px; color:var(--ink-3); margin-top:2px; }

    /* ── Share panel ── */
    .cp-share-panel {
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      background:var(--ink); color:#fff; border-radius:40px; padding:14px 24px;
      display:flex; align-items:center; gap:16px; z-index:500;
      box-shadow:0 8px 32px rgba(0,0,0,.35);
      animation:slideUp .3s ease;
    }
    .cp-share-close { background:none; border:none; color:#fff; cursor:pointer; font-size:18px; line-height:1; }
    .cp-share-links { display:flex; gap:10px; }
    .cp-share-link {
      width:36px; height:36px; border-radius:50%; border:none; cursor:pointer;
      display:flex; align-items:center; justify-content:center; font-size:14px;
      font-weight:700; transition:transform var(--tr);
    }
    .cp-share-link:hover { transform:scale(1.1); }
    .cp-share-wa { background:#25D366; color:#fff; }
    .cp-share-fb { background:#1877F2; color:#fff; }
    .cp-share-tw { background:#000; color:#fff; }
    .cp-share-cp { background:#fff; color:var(--ink); }

    /* ── Donation form wrapper ── */
    .cp-donate-panel {
      border:1px solid var(--paper-3); border-radius:var(--r-lg); padding:24px; margin-top:16px;
      background:var(--paper-2); box-shadow:var(--sh);
    }
    .cp-donate-panel-hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .cp-donate-panel-title { font-family:var(--fd); font-size:18px; font-weight:600; }
    .cp-close-btn { background:none; border:none; cursor:pointer; color:var(--ink-3); font-size:20px; line-height:1; }
    .cp-close-btn:hover { color:var(--ink); }

    /* ── Image lightbox ── */
    .cp-lightbox { position:fixed; inset:0; background:rgba(0,0,0,.92); z-index:1000; display:flex; align-items:center; justify-content:center; cursor:pointer; }
    .cp-lightbox img { max-width:90vw; max-height:88vh; border-radius:12px; object-fit:contain; box-shadow:0 16px 80px rgba(0,0,0,.6); }

    /* ── Empty states ── */
    .cp-empty { text-align:center; padding:48px 24px; color:var(--ink-3); }
    .cp-empty-icon { font-size:40px; margin-bottom:12px; opacity:.4; }
    .cp-empty-txt { font-size:14px; }

    /* ── Loading / Error ── */
    .cp-loading { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; background:var(--paper); font-family:var(--fb); color:var(--ink-3); }
    .cp-spinner { width:40px; height:40px; border:3px solid var(--paper-3); border-top-color:var(--sage); border-radius:50%; animation:spin .8s linear infinite; }

    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes slideUp { from { transform:translateX(-50%) translateY(20px); opacity:0; } to { transform:translateX(-50%) translateY(0); opacity:1; } }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    .cp-fade { animation:fadeIn .4s ease; }

    /* ── Mobile ── */
    @media (max-width:820px) {
      .cp-body { grid-template-columns:1fr; gap:0; padding:24px 16px 64px; }
      .cp-hero { height:420px; }
      .cp-hero-content { padding:0 20px 36px; }
      .cp-progress-card { position:relative; top:0; margin-bottom:24px; }
      .cp-sidebar { order:-1; }
      .cp-nav { padding:0 16px; }
      .cp-don-summary { grid-template-columns:1fr 1fr; }
      .cp-gallery { grid-template-columns:repeat(2,1fr); }
      .cp-card { padding:20px; }
    }
  `;
  document.head.appendChild(el);
};

// ── Icons (inline SVG) ────────────────────────────
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICO = {
  back:     'M19 12H5M12 5l-7 7 7 7',
  home:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  share:    'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  tag:      'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
  check:    'M20 6L9 17l-5-5',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  shield:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  heart:    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  info:     'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-6v-4m0-4h.01',
  news:     'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM9 7h6M9 11h6M9 15h4',
  users:    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm11 4a3 3 0 0 1 0 6',
  camera:   'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  x:        'M18 6L6 18M6 6l12 12',
  mail:     'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 8 8-8',
  trend:    'M23 6l-9.5 9.5-5-5L1 18',
  clock:    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-6v-4l3-3',
  copy:     'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4zM14 2v4h4M10 13h4M10 17h4M10 9h1',
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
    try {
      const [campRes, donRes] = await Promise.all([
        campaignApi.getById(id),
        donationApi.getCampaignDons(id).catch(() => ({ donations: [], total: 0 })),
      ]);
      setCampaign(campRes.campaign);
      setDonations(donRes.donations || []);
      setTotal(donRes.total || 0);
      if (campRes.campaign?.creator_id) {
        userApi.getById(campRes.campaign.creator_id)
          .then(r => setCreator(r?.user || null))
          .catch(() => {});
      }
      campaignApi.getUpdates?.(id)
        .then(r => setUpdates(r?.updates || []))
        .catch(() => {});
    } catch (err) {
      console.error('Load error:', err);
      setError('Campaign not found');
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

  const handleDonate = () => {
    setShowDonate(true);
  };

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
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700 }}>Campaign Not Found</div>
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
  const gallery = campaign.gallery_images || [];
  const daysLeft = Math.max(0, 30 - Math.floor((Date.now() - new Date(campaign.created_at)) / 86400000));
  const desc = campaign.description || '';
  const longDesc = desc.length > 480;

  return (
    <div className="cp-wrap">
      {/* ── Nav ── */}
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

      {/* ── Hero ── */}
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

      {/* ── Body ── */}
      <div className="cp-body">

        {/* ── Left: content ── */}
        <div className="cp-main cp-fade">
          {/* Tabs */}
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
                {gallery.map((img, i) => (
                  <div key={i} className="cp-gallery-img" onClick={() => setLightbox(img)}>
                    <img src={img} alt={`Gallery ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="cp-sidebar cp-fade">

          {/* Progress card */}
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

          {/* Donate form - unified (handles both logged-in and guest) */}
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

          {/* Creator card */}
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
            <button
              className="cp-share-btn"
              style={{ fontSize: 13 }}
              onClick={() => showToast('Contact feature coming soon')}
            >
              <Icon d={ICO.mail} size={13} /> Contact Creator
            </button>
          </div>
        </div>
      </div>

      {/* ── Share floating panel ── */}
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

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="cp-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Full size" />
        </div>
      )}
    </div>
  );
}