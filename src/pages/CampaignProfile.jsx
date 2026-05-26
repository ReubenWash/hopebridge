import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { campaignApi, donationApi, userApi } from '../services/api';
import DonationForm from '../components/DonationForm';

// ── Style injection (unchanged, but kept for brevity) ──
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const el = document.createElement('style');
  el.textContent = `
    /* ... all your existing CSS ... */
    /* (keep the same styles from your original file) */
  `;
  document.head.appendChild(el);
};

// ── Icons (keep as is) ──
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none' }) => (/* ... */);
const ICO = { /* ... */ };

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
  const [galleryImages, setGalleryImages] = useState([]);   // NEW: store gallery separately
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
      // 1. Fetch campaign details
      const campRes = await campaignApi.getById(id);
      const campaignData = campRes.campaign;
      setCampaign(campaignData);

      // 2. Fetch donations for this campaign
      const donRes = await donationApi.getCampaignDons(id).catch(() => ({ donations: [], total: 0 }));
      setDonations(donRes.donations || []);
      setTotal(donRes.total || 0);

      // 3. Fetch creator info if creator_id exists
      if (campaignData?.creator_id) {
        try {
          const creatorRes = await userApi.getById(campaignData.creator_id);
          setCreator(creatorRes?.user || null);
        } catch (err) {
          console.warn('Could not load creator details');
        }
      }

      // 4. Fetch campaign updates
      try {
        const updatesRes = await campaignApi.getUpdates?.(id);
        setUpdates(updatesRes?.updates || []);
      } catch (err) {
        console.warn('Could not load updates');
      }

      // 5. Fetch gallery images (if campaign object doesn't already include them)
      let gallery = campaignData.gallery_images || [];
      if (!gallery.length) {
        // Try to fetch from a dedicated gallery endpoint (if exists)
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
  const gallery = galleryImages; // use the fetched gallery array
  const daysLeft = Math.max(0, 30 - Math.floor((Date.now() - new Date(campaign.created_at)) / 86400000));
  const desc = campaign.description || '';
  const longDesc = desc.length > 480;

  return (
    <div className="cp-wrap">
      {/* Nav (unchanged) */}
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

      {/* Hero section (unchanged) */}
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

      {/* Body (unchanged except gallery source) */}
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

          {/* Story tab (unchanged) */}
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

          {/* Donations tab (unchanged) */}
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

          {/* Updates tab (unchanged) */}
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

          {/* Gallery tab (uses fetched galleryImages) */}
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

        {/* Sidebar (unchanged) */}
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

      {/* Share panel (unchanged) */}
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

      {/* Lightbox (unchanged) */}
      {lightbox && (
        <div className="cp-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Full size" />
        </div>
      )}
    </div>
  );
}