import { useState, useEffect } from 'react';
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
  MessageCircle, Eye, EyeOff, MapPin, Phone, Mail, User, Building,
  Download, PiggyBank
} from 'lucide-react';

// ---------- Helper Functions ----------
const toNumber = (val, fallback = 0) => {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
};

// ---------- Global Style Injection ----------
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    :root {
      --green: #1D9E75; --green-d: #0F6E56; --green-dd: #085041; --green-l: #E1F5EE;
      --red: #E24B4A; --red-l: #FCEBEB; --amber: #EF9F27; --amber-l: #FAEEDA;
      --blue: #378ADD; --blue-l: #E6F1FB;
      --bg: #EEF1F5; --surface: #FFFFFF; --surface-2: #F6F8FA;
      --border: rgba(0,0,0,0.07); --border-2: rgba(0,0,0,0.13);
      --txt: #111318; --txt-2: #5A6272; --txt-3: #9AA3B2;
      --sidebar-w: 260px; --topbar-h: 64px; --bottom-nav: 68px;
      --r-sm: 10px; --r-md: 14px; --r-lg: 20px; --r-xl: 26px;
      --sh-sm: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      --fd: 'Instrument Serif', Georgia, serif; --fb: 'DM Sans', sans-serif;
      --tr: 0.2s ease;
    }
    body.dark-mode {
      --bg: #121212; --surface: #1E1E1E; --surface-2: #2A2A2A;
      --border: rgba(255,255,255,0.1); --txt: #EEEEEE; --txt-2: #AAAAAA; --txt-3: #777777;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { font-family: var(--fb); background: var(--bg); color: var(--txt); min-height: 100vh; }
    .shell { display: flex; min-height: 100vh; }
    .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 200; overflow-y: auto; }
    .sb-logo { padding: 22px 20px 14px; border-bottom: 1px solid var(--border); }
    .logo-mark { display: flex; align-items: center; gap: 10px; }
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
    .page { padding: 28px; }
    .ps { display: none; }
    .ps.active { display: block; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .sc { background: var(--surface); border-radius: var(--r-lg); padding: 20px; box-shadow: var(--sh-sm); }
    .sc .si { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green-l); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .sv { font-family: var(--fd); font-size: 32px; line-height: 1; }
    .sl { font-size: 12px; color: var(--txt-2); margin-top: 4px; }
    .card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh-sm); overflow: hidden; margin-bottom: 24px; }
    .card-h { display: flex; justify-content: space-between; padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
    .card-t { font-family: var(--fd); font-size: 17px; display: flex; align-items: center; gap: 8px; }
    .card-a { font-size: 12px; font-weight: 600; color: var(--green); background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .card-b { padding: 16px 20px; }
    .badge { font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }
    .ba { background: var(--green-l); color: var(--green-d); }
    .bp { background: var(--amber-l); color: #854F0B; }
    .br { background: var(--blue-l); color: #185FA5; }
    .bx { background: var(--red-l); color: var(--red); }
    .cr { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .cr:last-child { border-bottom: none; }
    .ci { flex: 1; }
    .cn { font-weight: 600; font-size: 14px; }
    .cm { font-size: 11px; color: var(--txt-3); margin-top: 2px; display: flex; align-items: center; gap: 4px; }
    .pb { height: 4px; background: var(--bg); border-radius: 2px; margin-top: 6px; overflow: hidden; }
    .pf { height: 100%; background: var(--green); border-radius: 2px; }
    .ut { width: 100%; border-collapse: collapse; }
    .ut th { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--txt-3); text-align: left; padding: 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .ut td { padding: 14px 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
    .db { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .btn { padding: 10px 18px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .btn-g { background: var(--green); color: #fff; }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); }
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border-2); border-radius: var(--r-sm); margin-bottom: 16px; font-family: var(--fb); }
    .fl { font-size: 12px; font-weight: 700; color: var(--txt-2); letter-spacing: .05em; text-transform: uppercase; margin-bottom: 6px; display: block; }
    .modal-bd { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
    .modal { background: var(--surface); border-radius: var(--r-xl); padding: 28px; width: 90%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
    .modal-t { font-family: var(--fd); font-size: 22px; margin-bottom: 6px; }
    .modal-s { font-size: 13px; color: var(--txt-2); margin-bottom: 20px; }
    .mob-top, .bnav { display: none; }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .topbar { display: none; }
      .mob-top { display: flex; height: 58px; background: var(--surface); align-items: center; padding: 0 16px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border); justify-content: space-between; }
      .bnav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; height: 68px; background: var(--surface); border-top: 1px solid var(--border); z-index: 200; }
      .bnav-inner { display: flex; width: 100%; max-width: 500px; margin: 0 auto; }
      .bni { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: none; border: none; cursor: pointer; }
      .bni.active .bni-icon svg { stroke: var(--green); }
      .bni-lbl { font-size: 10px; font-weight: 600; color: var(--txt-3); }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewDonations, setViewDonations] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [donations, setDonations] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState({
    paypal_email: '',
    account_name: '',
    account_number: '',
    bank_name: '',
  });
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    if (currentUser.role !== 'creator') { navigate('/'); return; }
    loadData();
    loadPaymentMethod();
  }, [currentUser]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      await loadMyCampaigns();

      let donRes = { donations: [] };
      try {
        const raw = await donationApi.getMyDonations();
        donRes = { donations: Array.isArray(raw) ? raw : Array.isArray(raw?.donations) ? raw.donations : [] };
      } catch (err) { console.warn('Failed to fetch donations:', err.message); }

      let payRes = { requests: [] };
      try {
        const raw = await donationApi.getMyPayoutRequests();
        payRes = { requests: Array.isArray(raw) ? raw : Array.isArray(raw?.requests) ? raw.requests : [] };
      } catch (err) { console.warn('Failed to fetch payout requests:', err.message); }

      let walletRes = { balance: 0, total_earned: 0 };
      try {
        const raw = await donationApi.getCreatorWallet();
        walletRes = { balance: parseFloat(raw?.balance ?? 0), total_earned: parseFloat(raw?.total_earned ?? 0) };
      } catch (err) { console.warn('Failed to fetch wallet:', err.message); }

      setDonations(donRes.donations);
      setPayoutRequests(payRes.requests);
      setWalletBalance(walletRes.balance);
      setTotalEarned(walletRes.total_earned);
    } catch (err) {
      console.error('Error loading data:', err);
      showToast('Error loading data', true);
    } finally {
      setLoadingData(false);
    }
  };

  const loadPaymentMethod = async () => {
    try {
      const res = await donationApi.getCreatorPaymentMethod();
      if (res?.payment_method) setPaymentMethod(res.payment_method);
    } catch (err) {
      console.warn('Failed to load payment method:', err.message);
    }
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
    if (isNaN(newRaised) || newRaised <= 0) { showToast('Enter a valid amount', true); return; }
    try {
      await donationApi.updateCampaignProgress(selectedCampaignId, { raised: newRaised });
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
    const method = prompt('Payment method (bank, paypal, mobile_money):', 'bank');
    if (!method) return;
    const details = prompt('Payment details (account number/email/phone):', '');
    if (!details) { showToast('Payment details required', true); return; }
    try {
      await donationApi.requestPayout({ amount, payment_method: method, payment_details: details });
      showToast(`Withdrawal request of $${amount} submitted`);
      await loadData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const safeCampaigns = Array.isArray(myCampaigns) ? myCampaigns : [];
  const safeDonations = Array.isArray(donations) ? donations : [];
  const safePayoutRequests = Array.isArray(payoutRequests) ? payoutRequests : [];

  const initials = (currentUser?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const totalRaised = safeCampaigns.reduce((sum, c) => sum + parseFloat(c.raised || 0), 0);
  const activeCampaigns = safeCampaigns.filter(c => c.status === 'approved' || c.status === 'active').length;
  const pendingPayouts = safePayoutRequests.filter(p => p.status === 'pending');
  const pendingPayoutSum = pendingPayouts.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const isVerified = currentUser?.is_verified === true;

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon"><Heart size={20} color="#fff" strokeWidth={2} /></div>
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
          <button className={`nl ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`nl ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}>
            <Target size={18} /> My Campaigns
            {safeCampaigns.length > 0 && <span className="nb">{safeCampaigns.length}</span>}
          </button>
          <button className={`nl ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
            <Heart size={18} /> Donations
          </button>
          <div className="nav-sec">Finance</div>
          <button className={`nl ${activeTab === 'payouts' ? 'active' : ''}`} onClick={() => setActiveTab('payouts')}>
            <Banknote size={18} /> Payouts
            {pendingPayouts.length > 0 && <span className="nb">{pendingPayouts.length}</span>}
          </button>
          <button className={`nl ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
            <Wallet size={18} /> Wallet
          </button>
          <div className="nav-sec">Account</div>
          <button className={`nl ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setShowSettings(true)}>
            <Settings size={18} /> Settings
          </button>
          <button className="nl" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
        <div className="sb-footer">
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
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
            <div className="tb-btn" onClick={() => showToast('Notifications coming soon')}>
              <Bell size={18} />
            </div>
            <div className="tb-btn" onClick={() => setShowSettings(true)}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 12 }}>{initials}</div>
            </div>
          </div>
        </div>

        <div className="mob-top">
          <div className="mob-logo" style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 600 }}>HopeBridge</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="tb-btn" onClick={() => showToast('Notifications coming soon')}>
              <Bell size={18} />
            </div>
            <div className="tb-btn" onClick={() => setShowSettings(true)}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff', fontSize: 12 }}>{initials}</div>
            </div>
          </div>
        </div>

        <div className="page">
          {loadingData && <div style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', borderRadius: 6, marginBottom: 12 }}>Loading your data...</div>}

          {/* Overview Tab */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="sc">
                <div className="si"><DollarSign size={18} /></div>
                <div className="sv">${totalRaised.toLocaleString()}</div>
                <div className="sl">Total raised</div>
              </div>
              <div className="sc">
                <div className="si"><Target size={18} /></div>
                <div className="sv">{activeCampaigns}</div>
                <div className="sl">Active campaigns</div>
              </div>
              <div className="sc">
                <div className="si"><Heart size={18} /></div>
                <div className="sv">{safeDonations.length}</div>
                <div className="sl">Total donations</div>
              </div>
              <div className="sc">
                <div className="si"><Wallet size={18} /></div>
                <div className="sv">${walletBalance.toLocaleString()}</div>
                <div className="sl">Wallet balance</div>
              </div>
            </div>

            <div className="card">
              <div className="card-h">
                <div className="card-t"><History size={18} /> Recent Donations</div>
                <button className="card-a" onClick={() => setActiveTab('donations')}>View all <ArrowRight size={14} /></button>
              </div>
              <div className="card-b">
                {safeDonations.slice(0, 3).map(d => (
                  <div key={d.id} className="cr">
                    <div className="ci">
                      <div className="cn">{d.donor_name || 'Anonymous'}</div>
                      <div className="cm">{d.campaign_title}</div>
                    </div>
                    <div className="badge ba">+${parseFloat(d.amount || 0).toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{new Date(d.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
                {safeDonations.length === 0 && <div className="cr" style={{ color: 'var(--txt-3)' }}>No donations yet</div>}
              </div>
            </div>

            <div className="card">
              <div className="card-h">
                <div className="card-t"><Target size={18} /> Active Campaigns</div>
                <button className="card-a" onClick={() => setActiveTab('campaigns')}>Manage →</button>
              </div>
              <div className="card-b">
                {safeCampaigns.filter(c => c.status === 'approved' || c.status === 'active').slice(0, 3).map(c => (
                  <div key={c.id} className="cr">
                    <div className="ci">
                      <div className="cn">{c.title}</div>
                      <div className="cm">${parseFloat(c.raised || 0).toLocaleString()} / ${parseFloat(c.goal).toLocaleString()}</div>
                      <div className="pb"><div className="pf" style={{ width: `${Math.min(((c.raised || 0) / c.goal) * 100, 100)}%` }}></div></div>
                    </div>
                    <button className="db dba" onClick={() => { setSelectedCampaignId(c.id); setProgressModalOpen(true); }}>Update</button>
                  </div>
                ))}
                {safeCampaigns.filter(c => c.status === 'approved' || c.status === 'active').length === 0 && (
                  <div className="cr" style={{ color: 'var(--txt-3)' }}>No active campaigns</div>
                )}
              </div>
            </div>
          </div>

          {/* Campaigns Tab */}
          <div className={`ps ${activeTab === 'campaigns' ? 'active' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: 20 }}>My Campaigns</div>
              <button className="btn btn-g" onClick={() => { setEditCampaign(null); setModalOpen(true); }}><Plus size={16} /> New Campaign</button>
            </div>
            <div className="card">
              <div className="card-b" style={{ padding: 0 }}>
                <table className="ut">
                  <thead>
                    <tr>
                      <th>Campaign</th><th>Goal</th><th>Raised</th><th>Progress</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeCampaigns.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--txt-3)', padding: 24 }}>No campaigns yet</td></tr>
                    )}
                    {safeCampaigns.map(c => {
                      const percent = Math.min(((c.raised || 0) / c.goal) * 100, 100);
                      return (
                        <tr key={c.id}>
                          <td>
                            <strong>{c.title}</strong>
                            <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>Created {new Date(c.created_at).toLocaleDateString()}</div>
                          </td>
                          <td>${parseFloat(c.goal).toLocaleString()}</td>
                          <td>${parseFloat(c.raised || 0).toLocaleString()}</td>
                          <td>
                            <div className="pb" style={{ width: 100 }}><div className="pf" style={{ width: `${percent}%` }}></div></div>
                            {Math.round(percent)}%
                          </td>
                          <td><span className="badge ba">{c.status}</span></td>
                          <td>
                            <button className="db dba" onClick={() => { setSelectedCampaignId(c.id); setProgressModalOpen(true); }}>Progress</button>
                            <button className="db dbv" onClick={() => { setEditCampaign(c); setEditModalOpen(true); }}>Edit</button>
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

          {/* Donations Tab */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Heart size={18} /> Donations Received</div></div>
              <div className="card-b" style={{ padding: 0 }}>
                <table className="ut">
                  <thead>
                    <tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {safeDonations.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 24 }}>No donations yet</td></tr>}
                    {safeDonations.map(d => (
                      <tr key={d.id}>
                        <td>{d.donor_name || 'Anonymous'}</td>
                        <td>{d.campaign_title}</td>
                        <td>${parseFloat(d.amount || 0).toFixed(2)}</td>
                        <td>{new Date(d.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payouts Tab */}
          <div className={`ps ${activeTab === 'payouts' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Banknote size={18} /> Available Balance & Withdrawals</div></div>
              <div className="card-b">
                <div className="stats-grid" style={{ marginBottom: 20 }}>
                  <div className="sc">
                    <div className="sv">${Math.max(walletBalance - pendingPayoutSum, 0).toLocaleString()}</div>
                    <div className="sl">Ready to withdraw</div>
                  </div>
                  <div className="sc">
                    <div className="sv">${totalEarned.toLocaleString()}</div>
                    <div className="sl">Total earned (all time)</div>
                  </div>
                </div>
                <button className="btn btn-g" onClick={handleRequestPayout}>Request Withdrawal</button>
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

          {/* Wallet Tab */}
          <div className={`ps ${activeTab === 'wallet' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Wallet size={18} /> Creator Wallet</div></div>
              <div className="card-b">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span>Current balance</span><strong>${walletBalance.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span>Pending payouts</span><strong>${pendingPayoutSum.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                  <span>Available to withdraw</span><strong>${Math.max(walletBalance - pendingPayoutSum, 0).toLocaleString()}</strong>
                </div>
                <button className="btn btn-g" style={{ marginTop: 12 }} onClick={() => showToast('Transaction history coming soon')}>View Statement</button>
              </div>
            </div>
          </div>

          {/* Settings Tab */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}>
            <ProfileSettings userRole="creator" />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bnav">
        <div className="bnav-inner">
          {['overview', 'campaigns', 'donations', 'wallet'].map(tab => (
            <button key={tab} className={`bni ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              <div className="bni-icon">
                {tab === 'overview' && <LayoutDashboard size={20} />}
                {tab === 'campaigns' && <Target size={20} />}
                {tab === 'donations' && <Heart size={20} />}
                {tab === 'wallet' && <Wallet size={20} />}
              </div>
              <span className="bni-lbl">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* FAB Button */}
      <button className="fab" onClick={() => { setEditCampaign(null); setModalOpen(true); }}>
        <Plus size={24} color="#fff" />
      </button>

      {/* Progress Update Modal */}
      {progressModalOpen && (
        <div className="modal-bd" onClick={() => setProgressModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-t">Update Campaign Progress</div>
            <div className="modal-s">Enter the new total raised amount</div>
            <input className="fi" type="number" placeholder="New raised amount (USD)" value={progressAmount} onChange={e => setProgressAmount(e.target.value)} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-gh" onClick={() => setProgressModalOpen(false)}>Cancel</button>
              <button className="btn btn-g" onClick={handleUpdateProgress}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {modalOpen && (
        <CampaignModal
          campaign={null}
          onClose={() => { setModalOpen(false); loadData(); }}
        />
      )}

      {/* Edit Campaign Modal */}
      {editModalOpen && editCampaign && (
        <CampaignModal
          campaign={editCampaign}
          onClose={() => { setEditModalOpen(false); setEditCampaign(null); loadData(); }}
        />
      )}

      {/* Donations Modal */}
      {viewDonations && (
        <DonationsModal campaign={viewDonations} onClose={() => setViewDonations(null)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-bd" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0 }}>
            <ProfileSettings onClose={() => setShowSettings(false)} userRole="creator" />
          </div>
        </div>
      )}
    </div>
  );
}