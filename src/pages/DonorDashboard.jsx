import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { walletApi, campaignApi, donationApi } from '../services/api';
import CauseCard from '../components/CauseCard';

// ---------- Helper Functions ----------
const toNumber = (val, fallback = 0) => {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
};

const statusColor = (s) => ({
  pending: '#f59e0b',
  instructions_sent: '#3b82f6',
  awaiting_proof: '#8b5cf6',
  approved: '#10b981',
  rejected: '#ef4444',
}[s] || '#6b7280');

const statusLabel = (s) => ({
  pending: 'Pending',
  instructions_sent: 'Instructions Sent ✉',
  awaiting_proof: 'Proof Uploaded',
  approved: 'Approved ✓',
  rejected: 'Rejected',
}[s] || s);

// ---------- Global Style Injection (once) ----------
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = `
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
    .sb-user { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
    .user-av { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--green), var(--green-d)); display: flex; align-items: center; justify-content: center; font-weight: 600; color: #fff; }
    .user-name { font-weight: 600; font-size: 14px; }
    .user-badge { font-size: 11px; color: var(--txt-3); background: var(--green-l); padding: 2px 8px; border-radius: 20px; display: inline-block; margin-top: 4px; }
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
    .sc { background: var(--surface); border-radius: var(--r-lg); padding: 20px; box-shadow: var(--sh-sm); cursor: pointer; transition: transform 0.2s; }
    .sc:hover { transform: translateY(-2px); }
    .sc .si { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green-l); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .sc .si svg { stroke: var(--green-d); width: 18px; height: 18px; }
    .sv { font-family: var(--fd); font-size: 32px; line-height: 1; }
    .sl { font-size: 12px; color: var(--txt-2); margin-top: 4px; }
    .sd { font-size: 11px; font-weight: 700; margin-top: 8px; color: var(--green); }
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
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border-2); border-radius: var(--r-sm); margin-bottom: 16px; font-family: var(--fb); }
    .fl { font-size: 12px; font-weight: 700; color: var(--txt-2); letter-spacing: .05em; text-transform: uppercase; margin-bottom: 6px; display: block; }
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

// ---------- Main Component ----------
export default function DonorDashboard() {
  injectStyles();

  const { currentUser, logout, showToast, walletBalance, refreshWallet, loadCampaigns } = useApp();
  const navigate = useNavigate();

  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingData, setLoadingData] = useState(true);

  // Data state
  const [donations, setDonations] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);

  // Deposit form
  const [depositAmount, setDepositAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofUploading, setProofUploading] = useState(false);
  const proofInputRef = useRef();

  // Withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Polling refs
  const depositPollInterval = useRef(null);
  const walletRefreshInterval = useRef(null);

  // Auth guard
  useEffect(() => {
    if (!currentUser) navigate('/');
    else if (currentUser.role !== 'donor') navigate('/');
  }, [currentUser, navigate]);

  // Load initial data
  const loadData = async () => {
    setLoadingData(true);
    try {
      const [donRes, depositRes, withdrawRes, txRes, campaignsRes] = await Promise.all([
        donationApi.getMyDonations().catch(() => ({ donations: [] })),
        walletApi.getMyDepositRequests().catch(() => ({ requests: [] })),
        walletApi.getMyWithdrawals().catch(() => ({ withdrawals: [] })),
        walletApi.getTransactions().catch(() => ({ transactions: [] })),
        campaignApi.getAll({ status: 'approved' }).catch(() => ({ campaigns: [] })),
      ]);
      setDonations(donRes.donations || []);
      setDepositRequests(depositRes.requests || []);
      setWithdrawals(withdrawRes.withdrawals || []);
      setTransactions(txRes.transactions || []);
      setApprovedCampaigns(campaignsRes.campaigns || []);
      const total = (donRes.donations || []).reduce((s, d) => s + toNumber(d.amount), 0);
      setTotalDonated(total);
    } catch (err) {
      console.error('Data load error:', err);
      showToast('Error loading dashboard data', true);
    } finally {
      setLoadingData(false);
    }
  };

  // Poll pending deposit request (every 3 seconds)
  useEffect(() => {
    const pending = depositRequests.find(r => ['pending', 'instructions_sent', 'awaiting_proof'].includes(r.status));
    if (!pending) {
      if (depositPollInterval.current) clearInterval(depositPollInterval.current);
      return;
    }

    let lastStatus = pending.status;
    depositPollInterval.current = setInterval(async () => {
      try {
        const res = await walletApi.getDepositRequestById(pending.id);
        const updated = res.request;
        if (updated.status !== lastStatus) {
          if (updated.status === 'instructions_sent') {
            showToast(`Payment instructions for deposit #${pending.id} are now available.`);
          } else if (updated.status === 'approved') {
            showToast(`Deposit #${pending.id} approved! Wallet credited.`);
            refreshWallet();
            loadData();
          } else if (updated.status === 'rejected') {
            showToast(`Deposit #${pending.id} rejected.`, true);
          }
          lastStatus = updated.status;
          setDepositRequests(prev => prev.map(r => r.id === pending.id ? updated : r));
        }
        if (updated.status === 'approved' || updated.status === 'rejected') {
          clearInterval(depositPollInterval.current);
        }
      } catch (err) {
        console.warn('Deposit polling error:', err);
      }
    }, 3000);

    return () => clearInterval(depositPollInterval.current);
  }, [depositRequests, refreshWallet, showToast]);

  // Poll withdrawal requests (every 5 seconds)
  useEffect(() => {
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
    if (pendingWithdrawals.length === 0) return;

    const withdrawalInterval = setInterval(async () => {
      try {
        const res = await walletApi.getMyWithdrawals();
        const newWithdrawals = res.withdrawals || [];
        newWithdrawals.forEach(w => {
          const old = withdrawals.find(ow => ow.id === w.id);
          if (old && old.status !== w.status) {
            if (w.status === 'approved') showToast(`Withdrawal #${w.id} approved!`);
            if (w.status === 'rejected') showToast(`Withdrawal #${w.id} rejected.`, true);
          }
        });
        setWithdrawals(newWithdrawals);
      } catch (err) { console.warn(err); }
    }, 5000);
    return () => clearInterval(withdrawalInterval);
  }, [withdrawals, showToast]);

  // Periodic wallet refresh (every 10 seconds)
  useEffect(() => {
    walletRefreshInterval.current = setInterval(() => {
      refreshWallet();
      loadData();
    }, 10000);
    return () => clearInterval(walletRefreshInterval.current);
  }, [refreshWallet]);

  // Initial load on mount
  useEffect(() => {
    if (currentUser) loadData();
  }, [currentUser]);

  // ----- Handlers -----
  const handleRequestDeposit = async (e) => {
    e.preventDefault();
    const amt = toNumber(depositAmount);
    if (amt < 1) { showToast('Amount must be at least $1', true); return; }
    setDepositLoading(true);
    try {
      const res = await walletApi.requestDeposit({ amount: amt });
      showToast(res.message);
      setDepositAmount('');
      await loadData();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setDepositLoading(false);
    }
  };

  const handleUploadProof = async () => {
    const pending = depositRequests.find(r => ['pending', 'instructions_sent'].includes(r.status));
    if (!pending || !proofFile) return;
    setProofUploading(true);
    try {
      const fd = new FormData();
      fd.append('proof', proofFile);
      const res = await walletApi.uploadProof(pending.id, fd);
      showToast(res.message);
      setProofFile(null);
      await loadData();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setProofUploading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amt = toNumber(withdrawAmount);
    if (amt < 1) { showToast('Amount must be at least $1', true); return; }
    if (amt > walletBalance) { showToast('Insufficient balance', true); return; }
    if (!withdrawDetails.trim()) { showToast('Payment details required', true); return; }
    setWithdrawLoading(true);
    try {
      const res = await walletApi.requestWithdrawal({
        amount: amt,
        payment_method: withdrawMethod,
        payment_details: withdrawDetails,
      });
      showToast(res.message);
      setWithdrawAmount('');
      setWithdrawDetails('');
      refreshWallet();
      await loadData();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBrowseCampaigns = () => {
    window.location.href = '/#causes';
  };

  const handleDonateNow = (campaignId) => {
    window.location.href = '/#donate';
  };

  const initials = (currentUser?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const pendingDeposit = depositRequests.find(r => ['pending', 'instructions_sent', 'awaiting_proof'].includes(r.status));

  // ----- Render -----
  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon"><svg viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg></div>
            <div><div className="logo-text">HopeBridge</div><div className="logo-sub">Donor Portal</div></div>
          </div>
        </div>
        <div className="sb-user">
          <div className="user-av">{initials}</div>
          <div>
            <div className="user-name">{currentUser?.name}</div>
            <div className="user-badge">Donor</div>
          </div>
        </div>
        <nav className="sb-nav">
          <div className="nav-sec">Main</div>
          <button className={`nl ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </button>
          <button className={`nl ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>
            My Donations
          </button>
          <div className="nav-sec">Finance</div>
          <button className={`nl ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
            <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Wallet
            {depositRequests.some(r => ['pending', 'instructions_sent'].includes(r.status)) && <span className="nb">!</span>}
          </button>
          <div className="nav-sec">Account</div>
          <button className={`nl ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
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
            {activeTab === 'donations' && 'My Donations'}
            {activeTab === 'wallet' && 'Wallet'}
            {activeTab === 'settings' && 'Settings'}
          </div>
          <div className="tb-actions">
            <div className="tb-btn" onClick={() => showToast('Notifications coming soon')}>
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

          {/* ========== OVERVIEW TAB ========== */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="sc" onClick={() => setActiveTab('wallet')}>
                <div className="si"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
                <div className="sv">${walletBalance.toLocaleString()}</div>
                <div className="sl">Wallet Balance</div>
                <div className="sd">Click to manage →</div>
              </div>
              <div className="sc" onClick={() => setActiveTab('donations')}>
                <div className="si"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg></div>
                <div className="sv">${totalDonated.toLocaleString()}</div>
                <div className="sl">Total Donated</div>
                <div className="sd">Click to view →</div>
              </div>
              <div className="sc" onClick={() => setActiveTab('donations')}>
                <div className="si"><svg viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg></div>
                <div className="sv">{donations.length}</div>
                <div className="sl">Donations Made</div>
                <div className="sd">Click to view →</div>
              </div>
              <div className="sc" onClick={handleBrowseCampaigns}>
                <div className="si"><svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg></div>
                <div className="sv">{approvedCampaigns.length}</div>
                <div className="sl">Active Campaigns</div>
                <div className="sd">Click to browse →</div>
              </div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t">Recent Donations</div><button className="card-a" onClick={() => setActiveTab('donations')}>View all →</button></div>
              <div className="card-b">
                {donations.slice(0, 5).map(d => (
                  <div key={d.id} className="cr">
                    <div className="ci">
                      <div className="cn">{d.campaign_title || `Campaign #${d.campaign_id}`}</div>
                      <div className="cm">{new Date(d.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="badge ba">+${toNumber(d.amount).toFixed(2)}</div>
                  </div>
                ))}
                {donations.length === 0 && <div className="cr">No donations yet</div>}
              </div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t">Support a Campaign</div><button className="card-a" onClick={handleBrowseCampaigns}>Browse all →</button></div>
              <div className="card-b">
                {approvedCampaigns.slice(0, 3).map(c => (
                  <div key={c.id} className="cr">
                    <div className="ci">
                      <div className="cn">{c.title}</div>
                      <div className="cm">${toNumber(c.raised).toLocaleString()} raised of ${toNumber(c.goal).toLocaleString()}</div>
                      <div className="pb"><div className="pf" style={{ width: `${(toNumber(c.raised) / toNumber(c.goal)) * 100}%` }}></div></div>
                    </div>
                    <button className="db dba" onClick={handleBrowseCampaigns}>Donate</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========== DONATIONS TAB ========== */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t">All Donations</div></div>
              <div className="card-b" style={{ padding: 0 }}>
                <table className="ut">
                  <thead>
                    <tr><th>Campaign</th><th>Amount</th><th>Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.id}>
                        <td>{d.campaign_title || `Campaign #${d.campaign_id}`}</td>
                        <td>${toNumber(d.amount).toFixed(2)}</td>
                        <td>{new Date(d.created_at).toLocaleDateString()}</td>
                        <td><span className="badge ba">{d.escrow_status || 'held'}</span></td>
                      </tr>
                    ))}
                    {donations.length === 0 && <tr><td colSpan="4">No donations yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ========== WALLET TAB ========== */}
          <div className={`ps ${activeTab === 'wallet' ? 'active' : ''}`}>
            {/* Deposit Section */}
            <div className="card">
              <div className="card-h"><div className="card-t">Deposit Funds</div></div>
              <div className="card-b">
                {pendingDeposit ? (
                  <div>
                    <div style={{ background: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div><strong>Pending Deposit #{pendingDeposit.id}</strong> – ${pendingDeposit.amount}</div>
                      <div>Status: <span style={{ color: statusColor(pendingDeposit.status) }}>{statusLabel(pendingDeposit.status)}</span></div>
                      {pendingDeposit.admin_instructions && (
                        <div style={{ marginTop: 12, background: '#dbeafe', padding: 12, borderRadius: 8 }}>
                          <strong>Instructions:</strong><br/>{pendingDeposit.admin_instructions}
                        </div>
                      )}
                    </div>
                    {(pendingDeposit.status === 'pending' || pendingDeposit.status === 'instructions_sent') && !pendingDeposit.proof_image_url && (
                      <>
                        <input type="file" ref={proofInputRef} accept="image/*" style={{ display: 'none' }} onChange={e => setProofFile(e.target.files[0])} />
                        {proofFile ? (
                          <div><span>📄 {proofFile.name}</span> <button className="db dbr" onClick={() => setProofFile(null)}>Remove</button></div>
                        ) : (
                          <button className="db dba" onClick={() => proofInputRef.current?.click()}>Select Proof Image</button>
                        )}
                        {proofFile && (
                          <button className="btn btn-g" onClick={handleUploadProof} disabled={proofUploading} style={{ marginTop: 12 }}>{proofUploading ? 'Uploading...' : 'Upload Proof'}</button>
                        )}
                      </>
                    )}
                    {pendingDeposit.status === 'awaiting_proof' && <div>✅ Proof submitted, waiting for admin verification.</div>}
                  </div>
                ) : (
                  <form onSubmit={handleRequestDeposit}>
                    <label className="fl">Amount (USD)</label>
                    <input type="number" min="1" step="0.01" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} required className="fi" placeholder="Min $1" />
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      {[20, 50, 100, 200, 500].map(a => (
                        <button key={a} type="button" onClick={() => setDepositAmount(a)} style={{ padding: '6px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6 }}>${a}</button>
                      ))}
                    </div>
                    <button type="submit" className="btn btn-g" disabled={depositLoading}>{depositLoading ? 'Submitting...' : 'Request Deposit'}</button>
                  </form>
                )}
              </div>
            </div>

            {/* Withdraw Section */}
            <div className="card">
              <div className="card-h"><div className="card-t">Withdraw Funds</div></div>
              <div className="card-b">
                <div style={{ marginBottom: 12, background: '#fef9c3', padding: 12, borderRadius: 8 }}>Available: <strong>${walletBalance.toFixed(2)}</strong></div>
                <form onSubmit={handleWithdraw}>
                  <label className="fl">Amount (USD)</label>
                  <input type="number" min="1" step="0.01" max={walletBalance} value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} required className="fi" />
                  <label className="fl">Payment Method</label>
                  <select className="fi" value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value)}>
                    <option value="bank">Bank Transfer</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="paypal">PayPal</option>
                  </select>
                  <label className="fl">Payment Details</label>
                  <textarea className="fi" rows="2" placeholder={withdrawMethod === 'bank' ? 'Account name, number, bank name' : withdrawMethod === 'mobile_money' ? 'Phone number & network' : 'PayPal email'} value={withdrawDetails} onChange={e => setWithdrawDetails(e.target.value)} required />
                  <button type="submit" className="btn btn-g" disabled={withdrawLoading}>{withdrawLoading ? 'Submitting...' : 'Request Withdrawal'}</button>
                </form>
              </div>
            </div>

            {/* Transaction History */}
            <div className="card">
              <div className="card-h"><div className="card-t">Transaction History</div></div>
              <div className="card-b">
                {transactions.length === 0 ? (
                  <div>No transactions yet</div>
                ) : (
                  <table className="ut">
                    <thead>
                      <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 10).map(tx => (
                        <tr key={tx.id}>
                          <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                          <td>{tx.description || tx.type}</td>
                          <td style={{ color: tx.amount > 0 ? 'var(--green)' : 'var(--red)' }}>{tx.amount > 0 ? '+' : ''}{toNumber(tx.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* ========== SETTINGS TAB ========== */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t">Profile Settings</div></div>
              <div className="card-b">
                <label className="fl">Display Name</label>
                <input className="fi" type="text" defaultValue={currentUser?.name} />
                <label className="fl">Email</label>
                <input className="fi" type="email" defaultValue={currentUser?.email} />
                <button className="btn btn-g" onClick={() => showToast('Profile update coming soon')}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bnav">
        <div className="bnav-inner">
          {['overview', 'donations', 'wallet'].map(tab => (
            <button key={tab} className={`bni ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              <div className="bni-icon">
                {tab === 'overview' && <svg width="20" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
                {tab === 'donations' && <svg width="20" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>}
                {tab === 'wallet' && <svg width="20" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
              </div>
              <span className="bni-lbl">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Floating Action Button (for quick deposit) */}
      <button className="fab" onClick={() => setActiveTab('wallet')}>
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  );
}