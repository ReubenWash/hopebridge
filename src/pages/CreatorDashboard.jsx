import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { donationApi, campaignApi } from '../services/api';
import CampaignModal from '../components/CampaignModal';
import DonationsModal from '../components/DonationsModal';

// Helper for safe API calls
const safeGet = async (apiCall, fallback) => {
  try {
    return await apiCall();
  } catch (err) {
    console.warn('API call failed:', err);
    return fallback;
  }
};

// Global style injection (once)
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    :root {
      --green: #1D9E75; --green-d: #0F6E56; --green-dd: #085041; --green-l: #E1F5EE; --green-m: #9FE1CB;
      --red: #E24B4A; --red-l: #FCEBEB; --amber: #EF9F27; --amber-l: #FAEEDA; --blue: #378ADD; --blue-l: #E6F1FB;
      --bg: #EEF1F5; --surface: #FFFFFF; --surface-2: #F6F8FA; --border: rgba(0,0,0,0.07); --border-2: rgba(0,0,0,0.13);
      --txt: #111318; --txt-2: #5A6272; --txt-3: #9AA3B2;
      --sidebar-w: 260px; --topbar-h: 64px; --bottom-nav: 68px;
      --r-sm: 10px; --r-md: 14px; --r-lg: 20px; --r-xl: 26px;
      --sh-sm: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      --fd: 'Instrument Serif', Georgia, serif; --fb: 'DM Sans', sans-serif; --tr: 0.2s ease;
    }
    body { font-family: var(--fb); background: var(--bg); color: var(--txt); min-height: 100vh; }
    .shell { display: flex; min-height: 100vh; }
    .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 200; overflow-y: auto; }
    .sb-logo { padding: 22px 20px 14px; border-bottom: 1px solid var(--border); }
    .logo-mark { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-icon { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green); display: flex; align-items: center; justify-content: center; }
    .logo-icon svg { width: 20px; height: 20px; stroke: #fff; stroke-width: 2; fill: none; }
    .logo-text { font-family: var(--fd); font-size: 19px; color: var(--txt); }
    .logo-sub { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--txt-3); }
    .sb-creator { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
    .creator-av { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--green), var(--green-d)); display: flex; align-items: center; justify-content: center; font-weight: 600; color: #fff; }
    .creator-name { font-weight: 600; font-size: 14px; }
    .creator-badge { font-size: 11px; color: var(--txt-3); background: var(--green-l); padding: 2px 8px; border-radius: 20px; display: inline-block; margin-top: 4px; }
    .sb-nav { flex: 1; padding: 10px; }
    .nav-sec { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--txt-3); padding: 10px 10px 4px; }
    .nl { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--r-sm); cursor: pointer; border: none; background: none; width: 100%; text-align: left; color: var(--txt-2); font-size: 13.5px; font-weight: 500; transition: all var(--tr); }
    .nl:hover { background: var(--bg); color: var(--txt); }
    .nl.active { background: var(--green-l); color: var(--green-d); font-weight: 600; }
    .nl svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.8; fill: none; }
    .nb { margin-left: auto; font-size: 10px; font-weight: 700; background: var(--amber); color: #fff; padding: 2px 7px; border-radius: 20px; }
    .sb-footer { padding: 12px 10px; border-top: 1px solid var(--border); }
    .main { flex: 1; margin-left: var(--sidebar-w); }
    .topbar { height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 16px; position: sticky; top: 0; z-index: 100; }
    .tb-title { font-family: var(--fd); font-size: 22px; flex: 1; }
    .tb-actions { display: flex; gap: 10px; }
    .tb-btn { width: 38px; height: 38px; border-radius: var(--r-sm); background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background var(--tr); }
    .tb-btn svg { width: 18px; height: 18px; stroke: var(--txt-2); }
    .page { padding: 28px; }
    .ps { display: none; }
    .ps.active { display: block; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .sc { background: var(--surface); border-radius: var(--r-lg); padding: 20px; box-shadow: var(--sh-sm); position: relative; overflow: hidden; }
    .sc .si { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green-l); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .sc .si svg { stroke: var(--green-d); width: 18px; height: 18px; }
    .sv { font-family: var(--fd); font-size: 32px; line-height: 1; }
    .sl { font-size: 12px; color: var(--txt-2); margin-top: 4px; }
    .sd { font-size: 11px; font-weight: 700; margin-top: 8px; }
    .card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh-sm); overflow: hidden; margin-bottom: 24px; }
    .card-h { display: flex; justify-content: space-between; padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
    .card-t { font-family: var(--fd); font-size: 17px; }
    .card-a { font-size: 12px; font-weight: 600; color: var(--green); background: none; border: none; cursor: pointer; }
    .card-b { padding: 16px 20px; }
    .badge { font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 20px; display: inline-block; }
    .ba { background: var(--green-l); color: var(--green-d); }
    .bp { background: var(--amber-l); color: #854F0B; }
    .br { background: var(--blue-l); color: #185FA5; }
    .bx { background: var(--red-l); color: var(--red); }
    .cr { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .cr:last-child { border-bottom: none; }
    .ci { flex: 1; }
    .cn { font-weight: 600; font-size: 14px; }
    .cm { font-size: 11px; color: var(--txt-3); margin-top: 2px; }
    .pb { height: 4px; background: var(--bg); border-radius: 2px; margin-top: 6px; overflow: hidden; }
    .pf { height: 100%; background: var(--green); border-radius: 2px; }
    .ut { width: 100%; border-collapse: collapse; }
    .ut th { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--txt-3); text-align: left; padding: 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .ut td { padding: 14px 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
    .db { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: opacity var(--tr); }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .btn { padding: 10px 18px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; }
    .btn-g { background: var(--green); color: #fff; }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); }
    .modal-bd { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity .25s; }
    .modal-bd.open { opacity: 1; pointer-events: all; }
    .modal { background: var(--surface); border-radius: var(--r-xl); padding: 28px; width: 90%; max-width: 420px; }
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border-2); border-radius: var(--r-sm); margin-bottom: 16px; font-family: var(--fb); }
    .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: rgba(17,19,24,0.93); color: #fff; padding: 10px 24px; border-radius: 40px; font-size: 13px; z-index: 9999; opacity: 0; transition: opacity .2s; pointer-events: none; }
    .toast.show { opacity: 1; }
    .mob-top, .bnav, .fab { display: none; }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .topbar { display: none; }
      .mob-top { display: flex; height: 58px; background: var(--surface); align-items: center; padding: 0 16px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border); }
      .bnav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; height: 68px; background: var(--surface); border-top: 1px solid var(--border); z-index: 200; }
      .bnav-inner { display: flex; width: 100%; max-width: 500px; margin: 0 auto; }
      .bni { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: none; border: none; }
      .bni.active .bni-icon svg { stroke: var(--green); }
      .bni-lbl { font-size: 10px; font-weight: 600; color: var(--txt-3); }
      .fab { display: flex; position: fixed; right: 20px; bottom: 82px; width: 52px; height: 52px; background: var(--green); border-radius: 50%; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.2); z-index: 150; border: none; }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
    }
  `;
  document.head.appendChild(styleEl);
};

export default function CreatorDashboard() {
  injectStyles();

  const { currentUser, myCampaigns, loadMyCampaigns, deleteCampaign, logout, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [viewDonations, setViewDonations] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');
  const [donations, setDonations] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState({ paypal_email: '' });
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Auth check & initial data load
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (currentUser.role !== 'creator') {
      navigate('/');
      return;
    }
    loadData();
    loadPaymentMethod();
  }, [currentUser]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      await loadMyCampaigns();
      const [donRes, payRes, walletRes] = await Promise.all([
        safeGet(() => donationApi.getMyDonations?.(), { donations: [] }),
        safeGet(() => donationApi.getMyPayoutRequests?.(), { requests: [] }),
        safeGet(() => donationApi.getCreatorWallet?.(), { balance: 0, total_earned: 0 }),
      ]);
      setDonations(donRes.donations || []);
      setPayoutRequests(payRes.requests || []);
      setWalletBalance(walletRes.balance ?? 0);
      setTotalEarned(walletRes.total_earned ?? 0);
    } catch (err) {
      console.error(err);
      showToast('Error loading data', true);
    } finally {
      setLoadingData(false);
    }
  };

  const loadPaymentMethod = async () => {
    try {
      const res = await donationApi.getCreatorPaymentMethod();
      if (res.payment_method) setPaymentMethod(res.payment_method);
    } catch { /* ignore */ }
  };

  const savePaymentMethod = async (e) => {
    e.preventDefault();
    setLoadingPayment(true);
    try {
      await donationApi.saveCreatorPaymentMethod(paymentMethod);
      showToast('Payment method saved');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleUpdateProgress = async () => {
    const newRaised = parseFloat(progressAmount);
    if (isNaN(newRaised) || newRaised <= 0) {
      showToast('Enter a valid amount', true);
      return;
    }
    try {
      await donationApi.updateCampaignProgress?.(selectedCampaignId, { raised: newRaised });
      showToast('Progress updated');
      setProgressModalOpen(false);
      await loadData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign permanently?')) return;
    try {
      await deleteCampaign(id);
      showToast('Campaign deleted');
      await loadData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(prompt('Amount to withdraw (USD)', '100'));
    if (!amount || amount <= 0) return;
    try {
      await donationApi.requestPayout?.({ amount });
      showToast(`Withdrawal request of $${amount} submitted`);
      await loadData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleSaveSettings = async () => {
    // In a real implementation, you'd save name/email/bank account
    showToast('Settings saved (demo)');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = (currentUser?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const totalRaised = myCampaigns.reduce((sum, c) => sum + parseFloat(c.raised || 0), 0);
  const activeCampaigns = myCampaigns.filter(c => c.status === 'approved' || c.status === 'active').length;
  const pendingPayoutSum = payoutRequests.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon"><svg viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg></div>
            <div><div className="logo-text">HopeBridge</div><div className="logo-sub">Creator Studio</div></div>
          </div>
        </div>
        <div className="sb-creator">
          <div className="creator-av">{initials}</div>
          <div>
            <div className="creator-name">{currentUser?.name}</div>
            <div className="creator-badge">Verified Creator</div>
          </div>
        </div>
        <nav className="sb-nav">
          <div className="nav-sec">Workspace</div>
          <button className={`nl ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </button>
          <button className={`nl ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}>
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
            My Campaigns
            <span className="nb">{myCampaigns.length}</span>
          </button>
          <button className={`nl ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>
            Donations
          </button>
          <div className="nav-sec">Finance</div>
          <button className={`nl ${activeTab === 'payouts' ? 'active' : ''}`} onClick={() => setActiveTab('payouts')}>
            <svg viewBox="0 0 24 24"><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            Payouts
            {pendingPayoutSum > 0 && <span className="nb">{payoutRequests.filter(p => p.status === 'pending').length}</span>}
          </button>
          <button className={`nl ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
            <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Wallet
          </button>
          <div className="nav-sec">Account</div>
          <button className={`nl ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Settings
          </button>
        </nav>
        <div className="sb-footer">
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}>
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="main">
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
            <div className="tb-btn" onClick={() => showToast('Notifications')}>
              <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <button className="tb-btn" onClick={handleLogout} style={{ background: 'var(--red-l)', borderColor: 'var(--red)' }}>
              <svg viewBox="0 0 24 24" style={{ stroke: 'var(--red)' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
            <div className="tb-btn" onClick={() => showToast('Profile')}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff' }}>{initials}</div>
            </div>
          </div>
        </div>

        <div className="mob-top">
          <div className="mob-logo">HopeBridge</div>
          <div className="tb-actions">
            <button className="tb-btn" onClick={handleLogout} style={{ background: 'var(--red-l)', borderColor: 'var(--red)' }}>
              <svg viewBox="0 0 24 24" style={{ stroke: 'var(--red)' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
            <div className="tb-btn" onClick={() => showToast('Profile')}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff' }}>{initials}</div>
            </div>
          </div>
        </div>

        <div className="page">
          {loadingData && <div style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', borderRadius: 6, marginBottom: 12 }}>Loading your data...</div>}

          {/* Overview Page */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="sc">
                <div className="si"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg></div>
                <div className="sv">${totalRaised.toLocaleString()}</div>
                <div className="sl">Total raised</div>
                <div className="sd dup">↑12%</div>
              </div>
              <div className="sc">
                <div className="si"><svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg></div>
                <div className="sv">{activeCampaigns}</div>
                <div className="sl">Active campaigns</div>
              </div>
              <div className="sc">
                <div className="si"><svg viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg></div>
                <div className="sv">{donations.length}</div>
                <div className="sl">Total donations</div>
              </div>
              <div className="sc">
                <div className="si"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
                <div className="sv">${walletBalance.toLocaleString()}</div>
                <div className="sl">Wallet balance</div>
              </div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t">Recent Donations</div><button className="card-a" onClick={() => setActiveTab('donations')}>View all →</button></div>
              <div className="card-b">
                {donations.slice(0, 3).map(d => (
                  <div key={d.id} className="cr">
                    <div className="ci">
                      <div className="cn">{d.donor_name}</div>
                      <div className="cm">{d.campaign_title}</div>
                    </div>
                    <div className="badge ba">+${d.amount}</div>
                    <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{new Date(d.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
                {donations.length === 0 && <div className="cr">No donations yet</div>}
              </div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t">Active Campaigns</div><button className="card-a" onClick={() => setActiveTab('campaigns')}>Manage →</button></div>
              <div className="card-b">
                {myCampaigns.filter(c => c.status === 'approved' || c.status === 'active').map(c => (
                  <div key={c.id} className="cr">
                    <div className="ci">
                      <div className="cn">{c.title}</div>
                      <div className="cm">${c.raised?.toLocaleString()} / ${c.goal?.toLocaleString()}</div>
                      <div className="pb"><div className="pf" style={{ width: `${((c.raised || 0) / c.goal) * 100}%` }}></div></div>
                    </div>
                    <button className="db dba" onClick={() => { setSelectedCampaignId(c.id); setProgressModalOpen(true); }}>Update</button>
                  </div>
                ))}
                {myCampaigns.filter(c => c.status === 'approved' || c.status === 'active').length === 0 && <div className="cr">No active campaigns</div>}
              </div>
            </div>
          </div>

          {/* Campaigns Page */}
          <div className={`ps ${activeTab === 'campaigns' ? 'active' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="sht" style={{ fontFamily: 'var(--fd)', fontSize: 20 }}>My Campaigns</div>
              <button className="btn btn-g" onClick={() => { setEditCampaign(null); setModalOpen(true); }}>+ New Campaign</button>
            </div>
            <div className="card">
              <div className="card-b" style={{ padding: 0 }}>
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
                    {myCampaigns.map(c => {
                      const percent = ((c.raised || 0) / c.goal) * 100;
                      return (
                        <tr key={c.id}>
                          <td><strong>{c.title}</strong><div style={{ fontSize: 11, color: 'var(--txt-3)' }}>Created {new Date(c.created_at).toLocaleDateString()}</div></td>
                          <td>${c.goal?.toLocaleString()}</td>
                          <td>${c.raised?.toLocaleString()}</td>
                          <td>
                            <div className="pb" style={{ width: 100 }}>
                              <div className="pf" style={{ width: `${percent}%` }}></div>
                            </div>
                            {Math.round(percent)}%
                          </td>
                          <td><span className="badge ba">{c.status}</span></td>
                          <td>
                            <button className="db dba" onClick={() => { setSelectedCampaignId(c.id); setProgressModalOpen(true); }}>Update</button>
                            <button className="db dbr" onClick={() => handleDeleteCampaign(c.id)}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Donations Page */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t">Donations Received</div></div>
              <div className="card-b" style={{ padding: 0 }}>
                <table className="ut">
                  <thead>
                    <tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.id}>
                        <td>{d.donor_name}</td>
                        <td>{d.campaign_title}</td>
                        <td>${d.amount}</td>
                        <td>{new Date(d.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payouts Page */}
          <div className={`ps ${activeTab === 'payouts' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t">Available Balance & Withdrawals</div></div>
              <div className="card-b">
                <div className="stats-grid" style={{ marginBottom: 20 }}>
                  <div className="sc"><div className="sv">${(walletBalance - pendingPayoutSum).toLocaleString()}</div><div className="sl">Ready to withdraw</div></div>
                  <div className="sc"><div className="sv">${totalEarned.toLocaleString()}</div><div className="sl">Total earned (all time)</div></div>
                </div>
                <button className="btn btn-g" onClick={handleRequestPayout}>Request Withdrawal</button>
                <hr style={{ margin: '20px 0', borderColor: 'var(--border)' }} />
                <div><strong>Recent payout requests</strong>
                  {payoutRequests.map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <span>${p.amount} · {new Date(p.created_at).toLocaleDateString()}</span>
                      <span className={`badge ${p.status === 'pending' ? 'bp' : 'ba'}`}>{p.status}</span>
                    </div>
                  ))}
                  {payoutRequests.length === 0 && <div style={{ padding: '10px 0', color: 'var(--txt-3)' }}>No payout requests yet</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Page */}
          <div className={`ps ${activeTab === 'wallet' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t">Creator Wallet</div></div>
              <div className="card-b">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}><span>Current balance</span><strong>${walletBalance.toLocaleString()}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}><span>Pending payouts</span><strong>${pendingPayoutSum.toLocaleString()}</strong></div>
                <button className="btn btn-g" style={{ marginTop: 12 }} onClick={() => showToast('Transaction history (demo)')}>View Statement</button>
              </div>
            </div>
          </div>

          {/* Settings Page */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t">Profile Settings</div></div>
              <div className="card-b">
                <label className="fl">Display Name</label>
                <input className="fi" type="text" defaultValue={currentUser?.name} id="creatorName" />
                <label className="fl">Email</label>
                <input className="fi" type="email" defaultValue={currentUser?.email} id="creatorEmail" />
                <label className="fl">Bank Account (for payouts)</label>
                <input className="fi" type="text" id="bankAccount" placeholder="Account number" />
                <button className="btn btn-g" onClick={handleSaveSettings}>Save Changes</button>
              </div>
            </div>
            <div className="card" style={{ marginTop: 20 }}>
              <div className="card-h"><div className="card-t">Payment Methods</div></div>
              <div className="card-b">
                <form onSubmit={savePaymentMethod}>
                  <label className="fl">PayPal Email Address</label>
                  <input className="fi" type="email" value={paymentMethod.paypal_email} onChange={e => setPaymentMethod({ paypal_email: e.target.value })} placeholder="you@example.com" required />
                  <button type="submit" className="btn btn-g" disabled={loadingPayment}>{loadingPayment ? 'Saving...' : 'Save Payment Method'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bnav">
        <div className="bnav-inner">
          {['overview', 'campaigns', 'donations', 'wallet'].map(tab => (
            <button key={tab} className={`bni ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              <div className="bni-icon">
                {tab === 'overview' && <svg width="20" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
                {tab === 'campaigns' && <svg width="20" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>}
                {tab === 'donations' && <svg width="20" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>}
                {tab === 'wallet' && <svg width="20" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
              </div>
              <span className="bni-lbl">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>
      </nav>

      <button className="fab" onClick={() => { setEditCampaign(null); setModalOpen(true); }}>
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>

      {/* Progress Update Modal */}
      <div className={`modal-bd ${progressModalOpen ? 'open' : ''}`} onClick={() => setProgressModalOpen(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="card-t" style={{ marginBottom: 12 }}>Update Campaign Progress</div>
          <input className="fi" type="number" placeholder="New raised amount (USD)" value={progressAmount} onChange={e => setProgressAmount(e.target.value)} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-gh" onClick={() => setProgressModalOpen(false)}>Cancel</button>
            <button className="btn btn-g" onClick={handleUpdateProgress}>Update</button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CampaignModal campaign={editCampaign} onClose={() => { setModalOpen(false); setEditCampaign(null); loadData(); }} />
      )}

      {viewDonations && (
        <DonationsModal campaign={viewDonations} onClose={() => setViewDonations(null)} />
      )}
    </div>
  );
}