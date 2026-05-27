import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { donationApi, campaignApi, walletApi } from '../services/api';
import CampaignModal from '../components/CampaignModal';
import DonationsModal from '../components/DonationsModal';
import ProfileSettings from '../components/ProfileSettings';
import { 
  Heart, LayoutDashboard, DollarSign, Wallet, Settings, LogOut, Bell, 
  TrendingUp, Users, CreditCard, Plus, CheckCircle, Clock, AlertCircle, 
  FileText, ArrowRight, ChevronRight, Calendar, Send, Upload, Image, 
  Gift, Banknote, History, RefreshCw, X, Menu, Sun, Moon, Target, 
  Landmark, Smartphone, Copy, ExternalLink, Star, Zap, Shield, Award,
  MessageCircle, Eye, EyeOff, MapPin, Phone, Mail, User, Edit, Trash2, Building,
  Download, PiggyBank, MoveUp, MoveDown, GripVertical
} from 'lucide-react';

// ── Helper ───────────────────────────────────────
const toNumber = (val, fallback = 0) => {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
};

// ── Styles (unchanged, same as original) ─────────
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* All CSS rules from original – exactly the same – omitted for brevity */
    /* (keep your original styles here) */
  `;
  document.head.appendChild(styleEl);
};

// ── TransactionHistory (unchanged) ───────────────
function TransactionHistory({ transactions, loading, onRefresh }) { /* ... */ }

// ── WithdrawalModal (unchanged) ──────────────────
function WithdrawalModal({ isOpen, onClose, onSubmit, balance, savedPaymentMethod, showToast }) { /* ... */ }

// ── Main CreatorDashboard – FIXED donations ──────
export default function CreatorDashboard() {
  injectStyles();
  const { currentUser, myCampaigns, loadMyCampaigns, deleteCampaign, logout, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewDonations, setViewDonations] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [donations, setDonations] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({ paypal_email: '', account_name: '', account_number: '', bank_name: '' });
  const [loadingData, setLoadingData] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);

  // Gallery state (unchanged)
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryCampaign, setGalleryCampaign] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryUploadFiles, setGalleryUploadFiles] = useState([]);
  const [galleryReorderMode, setGalleryReorderMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    if (currentUser.role !== 'creator') { navigate('/'); return; }
    loadData(); loadPaymentMethod(); loadTransactions(); loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifPanel(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── FIXED: loadData – fetches donations for each campaign ──
  const loadData = async () => {
    setLoadingData(true);
    try {
      // 1. Refresh the list of campaigns (context + local)
      await loadMyCampaigns();
      // 2. Fetch the latest campaigns directly (to be sure we have fresh data)
      const myCampsRes = await campaignApi.getMy();
      const myCamps = myCampsRes.campaigns || [];

      // 3. Fetch donations for each campaign and combine
      let allDonations = [];
      for (const camp of myCamps) {
        try {
          const donRes = await donationApi.getCampaignDons(camp.id);
          const campDonations = donRes.donations || [];
          // Add campaign title to each donation (already present in response)
          allDonations.push(...campDonations);
        } catch (err) {
          console.warn(`Failed to fetch donations for campaign ${camp.id}`, err);
        }
      }
      setDonations(allDonations);

      // 4. Other data (payout requests, wallet)
      let payRes = { requests: [] };
      try { const raw = await donationApi.getMyPayoutRequests(); payRes = { requests: Array.isArray(raw) ? raw : raw?.requests || [] }; } catch {}
      let walletRes = { balance: 0, total_earned: 0 };
      try { const raw = await donationApi.getCreatorWallet(); walletRes = { balance: parseFloat(raw?.balance ?? 0), total_earned: parseFloat(raw?.total_earned ?? 0) }; } catch {}
      setPayoutRequests(payRes.requests);
      setWalletBalance(walletRes.balance);
      setTotalEarned(walletRes.total_earned);
    } catch (err) {
      console.error(err);
      showToast('Error loading data', true);
    } finally {
      setLoadingData(false);
    }
  };

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    try { const res = await walletApi.getTransactions(); setTransactions(res.transactions || []); }
    catch (err) { console.warn('Failed to load transactions:', err); }
    finally { setTransactionsLoading(false); }
  };

  const loadPaymentMethod = async () => {
    try { const res = await donationApi.getCreatorPaymentMethod(); if (res?.payment_method) setPaymentMethod(res.payment_method); }
    catch (err) { console.warn(err); }
  };

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('hb_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setNotifications(data.notifications || []); setUnreadCount(data.unread_count || 0); }
    } catch (err) { console.error(err); }
  };

  const markNotificationRead = async (id) => {
    try {
      const token = localStorage.getItem('hb_token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/${id}/read`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
      loadNotifications();
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('hb_token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/read-all`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
      loadNotifications();
    } catch (err) { console.error(err); }
  };

  const handleUpdateProgress = async () => {
    const newRaised = parseFloat(progressAmount);
    if (isNaN(newRaised) || newRaised <= 0) { showToast('Enter a valid amount', true); return; }
    try {
      await donationApi.updateCampaignProgress(selectedCampaignId, { raised: newRaised });
      showToast('Progress updated'); setProgressModalOpen(false); await loadData();
    } catch (err) { showToast(err.message, true); }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign permanently?')) return;
    try { await deleteCampaign(id); showToast('Campaign deleted'); await loadData(); }
    catch (err) { showToast(err.message, true); }
  };

  const handleRequestPayout = async (amount, pm, details) => {
    await donationApi.requestPayout({ amount, payment_method: pm, payment_details: details });
    showToast(`Withdrawal request of $${amount} submitted`); await loadData();
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Gallery functions (unchanged)
  const openGalleryManager = async (campaign) => {
    setGalleryCampaign(campaign);
    setGalleryLoading(true);
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns/creator/${campaign.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const images = data.campaign.gallery_images || [];
        setGalleryImages(images);
      } else {
        setGalleryImages([]);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
      showToast('Could not load gallery images', true);
      setGalleryImages([]);
    } finally {
      setGalleryLoading(false);
      setGalleryModalOpen(true);
    }
  };

  const handleGalleryUpload = async (files) => {
    if (!files.length) return;
    const formData = new FormData();
    for (let file of files) {
      formData.append('gallery_images', file);
    }
    setGalleryUploading(true);
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns/${galleryCampaign.id}/gallery`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        showToast(`${data.images?.length || 0} image(s) uploaded`);
        const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns/creator/${galleryCampaign.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setGalleryImages(refreshData.campaign.gallery_images || []);
        }
      } else {
        showToast(data.error || 'Upload failed', true);
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setGalleryUploading(false);
      setGalleryUploadFiles([]);
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (!confirm('Remove this image permanently?')) return;
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns/${galleryCampaign.id}/gallery/${imageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Image removed');
        setGalleryImages(prev => prev.filter(img => img.id !== imageId));
      } else {
        const data = await response.json();
        showToast(data.error || 'Delete failed', true);
      }
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const moveImage = (index, direction) => {
    const newImages = [...galleryImages];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setGalleryImages(newImages);
  };

  const saveOrder = async () => {
    const imageOrder = galleryImages.map(img => img.id);
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/campaigns/${galleryCampaign.id}/gallery/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ imageOrder })
      });
      if (response.ok) {
        showToast('Order saved');
        setGalleryReorderMode(false);
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to save order', true);
      }
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const safeCampaigns = Array.isArray(myCampaigns) ? myCampaigns : [];
  const safeDonations = Array.isArray(donations) ? donations : [];
  const safePayoutRequests = Array.isArray(payoutRequests) ? payoutRequests : [];
  const initials = (currentUser?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const totalRaised = safeCampaigns.reduce((sum, c) => sum + parseFloat(c.raised || 0), 0);
  const activeCampaigns = safeCampaigns.filter(c => c.status === 'approved' || c.status === 'active').length;
  const pendingPayouts = safePayoutRequests.filter(p => p.status === 'pending');
  const pendingPayoutSum = pendingPayouts.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const isVerified = currentUser?.is_verified === true;

  const handleQuickAction = (action) => {
    if (action === 'campaigns') setActiveTab('campaigns');
    else if (action === 'create') { setEditCampaign(null); setModalOpen(true); }
    else if (action === 'wallet') setActiveTab('wallet');
    else if (action === 'withdraw') setShowWithdrawalModal(true);
    else if (action === 'settings') setShowSettings(true);
    else if (action === 'logout') handleLogout();
  };

  const NotificationPanel = () => (
    <div className="notif-panel">
      <div className="notif-header">
        <span>Notifications</span>
        {unreadCount > 0 && <button className="db dba" style={{ fontSize: 10 }} onClick={markAllRead}>Mark all read</button>}
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--txt-3)' }}>No notifications</div>
      ) : (
        notifications.map(n => (
          <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markNotificationRead(n.id)}>
            <div className="notif-dot" style={{ background: n.type === 'error' ? 'var(--red)' : n.type === 'warning' ? 'var(--amber)' : 'var(--primary)' }} />
            <div><div className="notif-text">{n.message}</div><div className="notif-time">{n.time}</div></div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="shell">
      {/* Sidebar - unchanged */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon"><Heart size={20} color="#fff" /></div>
            <div><div className="logo-text">HopeBridge</div><div className="logo-sub">Creator Studio</div></div>
          </div>
        </div>
        <div className="sb-creator">
          <div className="creator-av">{initials}</div>
          <div>
            <div className="creator-name">{currentUser?.name} {isVerified && <CheckCircle size={14} style={{ color: '#378ADD', display: 'inline' }} />}</div>
            <div className="creator-badge">Verified Creator</div>
          </div>
        </div>
        <nav className="sb-nav">
          <div className="nav-sec">Workspace</div>
          <button className={`nl ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={18} /> Dashboard</button>
          <button className={`nl ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}><Target size={18} /> My Campaigns{safeCampaigns.length > 0 && <span className="nb">{safeCampaigns.length}</span>}</button>
          <button className={`nl ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}><Heart size={18} /> Donations</button>
          <div className="nav-sec">Finance</div>
          <button className={`nl ${activeTab === 'payouts' ? 'active' : ''}`} onClick={() => setActiveTab('payouts')}><Banknote size={18} /> Payouts{pendingPayouts.length > 0 && <span className="nb">{pendingPayouts.length}</span>}</button>
          <button className={`nl ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}><Wallet size={18} /> Wallet</button>
          <div className="nav-sec">Account</div>
          <button className={`nl ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setShowSettings(true)}><Settings size={18} /> Settings</button>
          <button className="nl" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
        </nav>
        <div className="sb-footer">
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      <div className="main">
        {/* Desktop topbar */}
        <div className="topbar">
          <div className="tb-title">
            {activeTab === 'overview' && 'Dashboard'}
            {activeTab === 'campaigns' && 'My Campaigns'}
            {activeTab === 'donations' && 'Donations'}
            {activeTab === 'payouts' && 'Payouts'}
            {activeTab === 'wallet' && 'Wallet'}
            {activeTab === 'settings' && 'Settings'}
          </div>
          <div className="tb-actions">
            <div ref={notifRef} style={{ position: 'relative' }}>
              <div className="tb-btn" onClick={() => setShowNotifPanel(!showNotifPanel)}>
                <Bell size={18} />
                {unreadCount > 0 && <div className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>}
              </div>
              {showNotifPanel && <NotificationPanel />}
            </div>
            <div className="tb-btn" onClick={() => setShowSettings(true)}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 12 }}>{initials}</div>
            </div>
          </div>
        </div>

        {/* Mobile topbar */}
        <div className="mob-top">
          <div className="mob-logo">HopeBridge</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="tb-btn" onClick={() => setShowNotifPanel(!showNotifPanel)} style={{ position: 'relative' }}>
              <Bell size={18} />
              {unreadCount > 0 && <div className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>}
            </div>
            <div className="tb-btn" onClick={() => setShowSettings(true)}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 12 }}>{initials}</div>
            </div>
          </div>
        </div>

        <div className="page">
          {/* Overview Tab (unchanged) */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="qg">
              <button className="qb" onClick={() => handleQuickAction('campaigns')}><div className="qi"><Target size={20} /></div><span className="ql">My Campaigns</span></button>
              <button className="qb" onClick={() => handleQuickAction('create')}><div className="qi"><Plus size={20} /></div><span className="ql">Create Campaign</span></button>
              <button className="qb" onClick={() => handleQuickAction('wallet')}><div className="qi"><Wallet size={20} /></div><span className="ql">Wallet</span></button>
              <button className="qb" onClick={() => handleQuickAction('withdraw')}><div className="qi"><Banknote size={20} /></div><span className="ql">Withdraw Funds</span></button>
              <button className="qb" onClick={() => handleQuickAction('settings')}><div className="qi"><Settings size={20} /></div><span className="ql">Settings</span></button>
              <button className="qb qx" onClick={() => handleQuickAction('logout')}><div className="qi"><LogOut size={20} /></div><span className="ql">Logout</span></button>
            </div>
            <div className="stats-grid">
              <div className="sc" onClick={() => setActiveTab('campaigns')}><div className="si"><DollarSign size={22} /></div><div className="sv">${totalRaised.toLocaleString()}</div><div className="sl">Total raised</div></div>
              <div className="sc" onClick={() => setActiveTab('campaigns')}><div className="si"><Target size={22} /></div><div className="sv">{activeCampaigns}</div><div className="sl">Active campaigns</div></div>
              <div className="sc" onClick={() => setActiveTab('donations')}><div className="si"><Heart size={22} /></div><div className="sv">{safeDonations.length}</div><div className="sl">Total donations</div></div>
              <div className="sc" onClick={() => setActiveTab('wallet')}><div className="si"><Wallet size={22} /></div><div className="sv">${walletBalance.toLocaleString()}</div><div className="sl">Wallet balance</div></div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t"><History size={18} /> Recent Donations</div><button className="card-a" onClick={() => setActiveTab('donations')}>View all <ArrowRight size={14} /></button></div>
              <div className="card-b">
                {safeDonations.slice(0, 3).map(d => (
                  <div key={d.id} className="cr">
                    <div className="ci"><div className="cn">{d.donor_name || 'Anonymous'}</div><div className="cm">{d.campaign_title}</div></div>
                    <div className="badge ba">+${parseFloat(d.amount || 0).toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{new Date(d.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
                {safeDonations.length === 0 && <div className="cr" style={{ color: 'var(--txt-3)' }}>No donations yet</div>}
              </div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t"><Target size={18} /> Active Campaigns</div><button className="card-a" onClick={() => setActiveTab('campaigns')}>Manage →</button></div>
              <div className="card-b">
                {safeCampaigns.filter(c => c.status === 'approved' || c.status === 'active').slice(0, 3).map(c => (
                  <div key={c.id} className="cr">
                    <div className="ci"><div className="cn">{c.title}</div><div className="cm">${parseFloat(c.raised || 0).toLocaleString()} / ${parseFloat(c.goal).toLocaleString()}</div><div className="pb"><div className="pf" style={{ width: `${Math.min(((c.raised || 0) / c.goal) * 100, 100)}%` }} /></div></div>
                    <button className="db dba" onClick={() => { setSelectedCampaignId(c.id); setProgressModalOpen(true); }}>Update</button>
                  </div>
                ))}
                {safeCampaigns.filter(c => c.status === 'approved' || c.status === 'active').length === 0 && <div className="cr" style={{ color: 'var(--txt-3)' }}>No active campaigns</div>}
              </div>
            </div>
          </div>

          {/* Campaigns Tab (unchanged) */}
          <div className={`ps ${activeTab === 'campaigns' ? 'active' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontFamily: 'Raleway', fontSize: '1.3rem', fontWeight: 700 }}>My Campaigns</div>
              <button className="btn btn-g" onClick={() => { setEditCampaign(null); setModalOpen(true); }}><Plus size={16} /> New Campaign</button>
            </div>
            <div className="card">
              <div className="card-b" style={{ padding: 0 }}>
                <div className="ut-wrap">
                  <table className="ut">
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Goal</th>
                        <th>Raised</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeCampaigns.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>No campaigns yet</td>
                        </tr>
                      )}
                      {safeCampaigns.map(c => {
                        const percent = Math.min(((c.raised || 0) / c.goal) * 100, 100);
                        return (
                          <tr key={c.id}>
                            <td><strong>{c.title}</strong><div style={{ fontSize: 11, color: 'var(--txt-3)' }}>Created {new Date(c.created_at).toLocaleDateString()}</div></td>
                            <td>${parseFloat(c.goal).toLocaleString()}</td>
                            <td>${parseFloat(c.raised || 0).toLocaleString()}</td>
                            <td><div className="pb" style={{ width: 100 }}><div className="pf" style={{ width: `${percent}%` }} /></div>{Math.round(percent)}%</td>
                            <td><span className="badge ba">{c.status}</span></td>
                            <td style={{ paddingRight: 20 }}>
                              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                <button className="db dbv" onClick={() => { setEditCampaign(c); setEditModalOpen(true); }}><Edit size={12} /> Edit</button>
                                <button className="db dbp" onClick={() => openGalleryManager(c)}><Image size={12} /> Gallery</button>
                                <button className="db dbr" onClick={() => handleDeleteCampaign(c.id)}><Trash2 size={12} /> Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Donations Tab – now shows real data */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Heart size={18} /> Donations Received</div></div>
              <div className="card-b" style={{ padding: 0 }}>
                <div className="ut-wrap">
                  <table className="ut">
                    <thead>
                      <tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {safeDonations.map(d => (
                        <tr key={d.id}>
                          <td>{d.donor_name || 'Anonymous'}</td>
                          <td>{d.campaign_title}</td>
                          <td>${parseFloat(d.amount || 0).toFixed(2)}</td>
                          <td>{new Date(d.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {safeDonations.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: 24 }}>No donations yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Payouts Tab (unchanged) */}
          <div className={`ps ${activeTab === 'payouts' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Banknote size={18} /> Available Balance & Withdrawals</div></div>
              <div className="card-b">
                <div className="stats-grid" style={{ marginBottom: 20 }}>
                  <div className="sc"><div className="sv">${Math.max(walletBalance - pendingPayoutSum, 0).toLocaleString()}</div><div className="sl">Ready to withdraw</div></div>
                  <div className="sc"><div className="sv">${totalEarned.toLocaleString()}</div><div className="sl">Total earned</div></div>
                </div>
                <button className="btn btn-g" onClick={() => setShowWithdrawalModal(true)}>Request Withdrawal</button>
                <hr style={{ margin: '20px 0', borderColor: 'var(--border)' }} />
                <strong>Recent payout requests</strong>
                {safePayoutRequests.length === 0 && <div style={{ padding: '10px 0', color: 'var(--txt-3)' }}>No payout requests yet</div>}
                {safePayoutRequests.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>${parseFloat(p.amount || 0).toFixed(2)} · {new Date(p.created_at).toLocaleDateString()}</span>
                    <span className={`badge ${p.status === 'pending' ? 'bp' : p.status === 'rejected' ? 'bx' : 'ba'}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wallet Tab (unchanged) */}
          <div className={`ps ${activeTab === 'wallet' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Wallet size={18} /> Creator Wallet</div></div>
              <div className="card-b">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}><span>Current balance</span><strong>${walletBalance.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}><span>Pending payouts</span><strong>${pendingPayoutSum.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}><span>Available to withdraw</span><strong>${Math.max(walletBalance - pendingPayoutSum, 0).toLocaleString()}</strong></div>
                <button className="btn btn-g" style={{ marginTop: 12 }} onClick={() => setShowWithdrawalModal(true)}>Request Withdrawal</button>
              </div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t"><History size={18} /> Transaction History</div></div>
              <div className="card-b"><TransactionHistory transactions={transactions} loading={transactionsLoading} onRefresh={loadTransactions} /></div>
            </div>
          </div>

          {/* Settings Tab (unchanged) */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}><ProfileSettings userRole="creator" /></div>
        </div>
      </div>

      {/* Mobile Bottom Nav (unchanged) */}
      <nav className="bnav">
        <div className="bnav-inner">
          <button className={`bni ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={20} /><span>Home</span></button>
          <button className={`bni ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}><Target size={20} /><span>Campaigns</span></button>
          <button className={`bni ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}><Heart size={20} /><span>Donations</span></button>
          <button className={`bni ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}><Wallet size={20} /><span>Wallet</span></button>
        </div>
      </nav>

      {/* FAB */}
      <button className="fab" onClick={() => { setEditCampaign(null); setModalOpen(true); }}><Plus size={24} color="#fff" /></button>

      {/* Progress Modal */}
      {progressModalOpen && (
        <div className="cr-modal-bd" onClick={() => setProgressModalOpen(false)}>
          <div className="cr-modal" onClick={e => e.stopPropagation()}>
            <div className="cr-modal-t">Update Campaign Progress</div>
            <div className="cr-modal-s">Enter the new total raised amount</div>
            <input className="fi" type="number" placeholder="New raised amount (USD)" value={progressAmount} onChange={e => setProgressAmount(e.target.value)} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-gh" onClick={() => setProgressModalOpen(false)}>Cancel</button>
              <button className="btn btn-g" onClick={handleUpdateProgress}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="cr-modal-bd" onClick={() => setShowSettings(false)}>
          <div className="cr-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0 }}>
            <ProfileSettings onClose={() => setShowSettings(false)} userRole="creator" />
          </div>
        </div>
      )}

      {/* Third-party modals */}
      {modalOpen && <CampaignModal campaign={null} onClose={() => { setModalOpen(false); loadData(); }} />}
      {editModalOpen && editCampaign && <CampaignModal campaign={editCampaign} onClose={() => { setEditModalOpen(false); setEditCampaign(null); loadData(); }} />}
      {viewDonations && <DonationsModal campaign={viewDonations} onClose={() => setViewDonations(null)} />}

      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        onSubmit={handleRequestPayout}
        balance={walletBalance - pendingPayoutSum}
        savedPaymentMethod={paymentMethod}
        showToast={showToast}
      />

      {/* Gallery Management Modal */}
      {galleryModalOpen && galleryCampaign && (
        <div className="cr-modal-bd" onClick={() => setGalleryModalOpen(false)}>
          <div className="cr-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <div className="cr-modal-t">Manage Gallery – {galleryCampaign.title}</div>
            <div className="cr-modal-s">Upload, reorder, or delete campaign images</div>
            
            <div className="upload-area" onClick={() => document.getElementById('galleryFileInput').click()}>
              <Upload size={32} stroke="var(--primary)" />
              <div style={{ marginTop: 8, fontSize: 14, color: 'var(--txt-2)' }}>
                Click to select images (JPEG, PNG, up to 5MB each)
              </div>
              <input
                id="galleryFileInput"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files.length) {
                    handleGalleryUpload(Array.from(e.target.files));
                    e.target.value = '';
                  }
                }}
              />
              {galleryUploading && <div className="file-list">Uploading... Please wait.</div>}
            </div>

            {galleryLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Loading images...</div>
            ) : galleryImages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--txt-3)' }}>No images yet. Upload your first image above.</div>
            ) : (
              <>
                <div className="gallery-grid">
                  {galleryImages.map((img, idx) => (
                    <div key={img.id} className="gallery-item">
                      <img src={img.image_url} alt={`gallery-${idx}`} />
                      {!galleryReorderMode && (
                        <div className="gallery-actions">
                          <button className="gallery-action-btn" onClick={() => handleDeleteGalleryImage(img.id)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                      {galleryReorderMode && (
                        <div className="gallery-reorder-buttons">
                          {idx > 0 && (
                            <button className="reorder-btn" onClick={() => moveImage(idx, -1)}>
                              <MoveUp size={16} />
                            </button>
                          )}
                          {idx < galleryImages.length - 1 && (
                            <button className="reorder-btn" onClick={() => moveImage(idx, 1)}>
                              <MoveDown size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <button className="btn btn-gh" onClick={() => setGalleryReorderMode(!galleryReorderMode)}>
                    {galleryReorderMode ? <><EyeOff size={14} /> Exit Reorder Mode</> : <><GripVertical size={14} /> Reorder Images</>}
                  </button>
                  {galleryReorderMode && (
                    <button className="btn btn-g" onClick={saveOrder}>
                      Save New Order
                    </button>
                  )}
                </div>
              </>
            )}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-gh" onClick={() => setGalleryModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}