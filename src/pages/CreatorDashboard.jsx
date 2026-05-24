import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { donationApi, campaignApi, walletApi } from '../services/api';
import CampaignModal from '../components/CampaignModal';
import DonationsModal from '../components/DonationsModal';
import {
  Heart,
  LayoutDashboard,
  Target,
  DollarSign,
  Wallet,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Users,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Award,
  Calendar,
  MessageCircle,
  Send,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Banknote,
  History,
  Download,
  RefreshCw,
  X,
  Menu
} from 'lucide-react';

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
    
    /* Dark Mode Support */
    body.dark-mode {
      --bg: #121212; --surface: #1E1E1E; --surface-2: #2A2A2A; --border: rgba(255,255,255,0.1);
      --txt: #EEEEEE; --txt-2: #AAAAAA; --txt-3: #777777;
    }
    
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
    .creator-name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .verified-badge { color: #378ADD; background: rgba(55,138,221,0.15); border-radius: 20px; padding: 2px 6px; display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; }
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
    
    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--txt);
    }
    
    .mobile-sidebar {
      position: fixed;
      top: 0;
      left: -280px;
      width: 280px;
      height: 100vh;
      background: var(--surface);
      z-index: 300;
      transition: left 0.3s ease;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      overflow-y: auto;
    }
    
    .mobile-sidebar.open {
      left: 0;
    }
    
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 299;
      display: none;
    }
    
    .mobile-overlay.open {
      display: block;
    }
    
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .topbar { display: none; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
      .mob-top { display: flex; height: 58px; background: var(--surface); align-items: center; padding: 0 16px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border); }
      .bnav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; height: 68px; background: var(--surface); border-top: 1px solid var(--border); z-index: 200; }
      .bnav-inner { display: flex; width: 100%; max-width: 500px; margin: 0 auto; }
      .bni { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: none; border: none; }
      .bni.active .bni-icon svg { stroke: var(--green); }
      .bni-lbl { font-size: 10px; font-weight: 600; color: var(--txt-3); }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
    }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .sc { background: var(--surface); border-radius: var(--r-lg); padding: 20px; box-shadow: var(--sh-sm); position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
    .sc:hover { transform: translateY(-2px); }
    .sc .si { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green-l); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .sc .si svg { stroke: var(--green-d); width: 18px; height: 18px; }
    .sv { font-family: var(--fd); font-size: 32px; line-height: 1; }
    .sl { font-size: 12px; color: var(--txt-2); margin-top: 4px; }
    .sd { font-size: 11px; font-weight: 700; margin-top: 8px; }
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
    .db { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: opacity var(--tr); margin-right: 4px; display: inline-flex; align-items: center; gap: 4px; }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .btn { padding: 10px 18px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .btn-g { background: var(--green); color: #fff; }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); }
    .modal-bd { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity .25s; }
    .modal-bd.open { opacity: 1; pointer-events: all; }
    .modal { background: var(--surface); border-radius: var(--r-xl); padding: 28px; width: 90%; max-width: 420px; }
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border-2); border-radius: var(--r-sm); margin-bottom: 16px; font-family: var(--fb); }
  `;
  document.head.appendChild(styleEl);
};

// Transaction History Component
function TransactionHistory({ transactions, loading }) {
  const [showAll, setShowAll] = useState(false);
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);
  
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-3)' }}>Loading transactions...</div>;
  }
  
  if (!transactions || transactions.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-3)' }}>No transactions yet</div>;
  }
  
  return (
    <div>
      {displayTransactions.map(tx => (
        <div key={tx.id} className="cr">
          <div className="ci">
            <div className="cn" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {tx.type === 'escrow_release' && <CheckCircle size={14} color="#1D9E75" />}
              {tx.type === 'withdrawal_out' && <Banknote size={14} color="#E24B4A" />}
              {tx.type === 'deposit' && <CreditCard size={14} color="#378ADD" />}
              <span>{tx.description || tx.type.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="cm">
              <Calendar size={10} />
              {new Date(tx.created_at).toLocaleDateString()}
            </div>
          </div>
          <div style={{ fontWeight: 700, color: tx.amount > 0 ? 'var(--green)' : 'var(--red)' }}>
            {tx.amount > 0 ? '+' : ''}{parseFloat(tx.amount).toFixed(2)}
          </div>
        </div>
      ))}
      {transactions.length > 5 && (
        <button className="card-a" onClick={() => setShowAll(!showAll)} style={{ marginTop: 12 }}>
          {showAll ? 'Show less' : `View all (${transactions.length})`}
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

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
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // All state initialized with safe defaults
  const [donations, setDonations] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    paypal_email: '',
    account_name: '',
    account_number: '',
    bank_name: '',
  });
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Auth check & initial data load
  useEffect(() => {
    if (!currentUser) { navigate('/'); return; }
    if (currentUser.role !== 'creator') { navigate('/'); return; }
    loadData();
    loadPaymentMethod();
    loadTransactions();
  }, [currentUser]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.mobile-sidebar') && !e.target.closest('.mobile-menu-btn')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const data = await walletApi.getTransactions();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.warn('Failed to fetch transactions:', err.message);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const loadData = async () => {
    setLoadingData(true);
    try {
      await loadMyCampaigns();

      // Donations
      let donRes = { donations: [] };
      try {
        const raw = await donationApi.getMyDonations();
        donRes = {
          donations: Array.isArray(raw) ? raw : Array.isArray(raw?.donations) ? raw.donations : [],
        };
      } catch (err) {
        console.warn('Failed to fetch donations:', err.message);
      }

      // Payout requests
      let payRes = { requests: [] };
      try {
        const raw = await donationApi.getMyPayoutRequests();
        payRes = {
          requests: Array.isArray(raw) ? raw : Array.isArray(raw?.requests) ? raw.requests : [],
        };
      } catch (err) {
        console.warn('Failed to fetch payout requests:', err.message);
      }

      // Wallet
      let walletRes = { balance: 0, total_earned: 0 };
      try {
        const raw = await donationApi.getCreatorWallet();
        walletRes = {
          balance: parseFloat(raw?.balance ?? 0),
          total_earned: parseFloat(raw?.total_earned ?? 0),
        };
      } catch (err) {
        console.warn('Failed to fetch wallet:', err.message);
      }

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
    if (!window.confirm('Delete this campaign permanently? This action cannot be undone.')) return;
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

  // Navigation helper
  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Safe derived values
  const safeCampaigns = Array.isArray(myCampaigns) ? myCampaigns : [];
  const safeDonations = Array.isArray(donations) ? donations : [];
  const safePayoutRequests = Array.isArray(payoutRequests) ? payoutRequests : [];

  const initials = (currentUser?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const totalRaised = safeCampaigns.reduce((sum, c) => sum + parseFloat(c.raised || 0), 0);
  const activeCampaigns = safeCampaigns.filter(c => c.status === 'approved' || c.status === 'active').length;
  const pendingPayouts = safePayoutRequests.filter(p => p.status === 'pending');
  const pendingPayoutSum = pendingPayouts.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const isVerified = currentUser?.is_verified === true;

  // Mobile menu items
  const mobileNavItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'campaigns', label: 'My Campaigns', icon: <Target size={18} />, badge: safeCampaigns.length },
    { id: 'donations', label: 'Donations', icon: <DollarSign size={18} /> },
    { id: 'payouts', label: 'Payouts', icon: <Banknote size={18} />, badge: pendingPayouts.length },
    { id: 'wallet', label: 'Wallet', icon: <Wallet size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="shell">
      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      
      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon">
              <Heart size={20} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div className="logo-text">HopeBridge</div>
              <div className="logo-sub">Creator Studio</div>
            </div>
          </div>
        </div>
        
        <div className="sb-creator">
          <div className="creator-av">{initials}</div>
          <div>
            <div className="creator-name">
              {currentUser?.name}
              {isVerified && (
                <span className="verified-badge">
                  <CheckCircle size={12} /> Verified
                </span>
              )}
            </div>
            <div className="creator-badge">Creator</div>
          </div>
        </div>
        
        <nav className="sb-nav">
          {mobileNavItems.map(item => (
            <button
              key={item.id}
              className={`nl ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              {item.icon}
              {item.label}
              {item.badge > 0 && <span className="nb">{item.badge}</span>}
            </button>
          ))}
          <button className="nl" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon">
              <Heart size={20} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div className="logo-text">HopeBridge</div>
              <div className="logo-sub">Creator Studio</div>
            </div>
          </div>
        </div>

        <div className="sb-creator">
          <div className="creator-av">{initials}</div>
          <div>
            <div className="creator-name">
              {currentUser?.name}
              {isVerified && <CheckCircle size={14} className="verified-badge" />}
            </div>
            <div className="creator-badge">Creator</div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="nav-sec">Workspace</div>
          {[
            { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'campaigns', label: 'My Campaigns', icon: <Target size={18} />, badge: safeCampaigns.length },
            { id: 'donations', label: 'Donations', icon: <DollarSign size={18} /> },
          ].map(({ id, label, icon, badge }) => (
            <button key={id} className={`nl ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              {icon}
              {label}
              {badge > 0 && <span className="nb">{badge}</span>}
            </button>
          ))}

          <div className="nav-sec">Finance</div>
          <button className={`nl ${activeTab === 'payouts' ? 'active' : ''}`} onClick={() => setActiveTab('payouts')}>
            <Banknote size={18} />
            Payouts
            {pendingPayouts.length > 0 && <span className="nb">{pendingPayouts.length}</span>}
          </button>
          <button className={`nl ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
            <Wallet size={18} />
            Wallet
          </button>

          <div className="nav-sec">Account</div>
          <button className={`nl ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} />
            Settings
          </button>
          <button className="nl" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </nav>

        <div className="sb-footer">
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
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
            <button className="tb-btn" onClick={handleLogout} style={{ background: 'var(--red-l)', borderColor: 'var(--red)' }}>
              <LogOut size={18} style={{ stroke: 'var(--red)' }} />
            </button>
            <div className="tb-btn">
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff' }}>{initials}</div>
            </div>
          </div>
        </div>

        <div className="mob-top">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div style={{ fontFamily: 'var(--fd)', fontSize: 18, flex: 1, textAlign: 'center' }}>HopeBridge</div>
          <div className="tb-actions">
            <button className="tb-btn" onClick={handleLogout} style={{ background: 'var(--red-l)', borderColor: 'var(--red)' }}>
              <LogOut size={18} style={{ stroke: 'var(--red)' }} />
            </button>
          </div>
        </div>

        <div className="page">
          {loadingData && (
            <div style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', borderRadius: 6, marginBottom: 12 }}>
              Loading your data...
            </div>
          )}

          {/* Overview Tab */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="sc" onClick={() => setActiveTab('campaigns')}>
                <div className="si"><TrendingUp size={18} /></div>
                <div className="sv">${totalRaised.toLocaleString()}</div>
                <div className="sl">Total raised</div>
                <div className="sd">Click to view →</div>
              </div>
              <div className="sc" onClick={() => setActiveTab('campaigns')}>
                <div className="si"><Target size={18} /></div>
                <div className="sv">{activeCampaigns}</div>
                <div className="sl">Active campaigns</div>
                <div className="sd">Click to view →</div>
              </div>
              <div className="sc" onClick={() => setActiveTab('donations')}>
                <div className="si"><Users size={18} /></div>
                <div className="sv">{safeDonations.length}</div>
                <div className="sl">Total donations</div>
                <div className="sd">Click to view →</div>
              </div>
              <div className="sc" onClick={() => setActiveTab('wallet')}>
                <div className="si"><Wallet size={18} /></div>
                <div className="sv">${walletBalance.toLocaleString()}</div>
                <div className="sl">Wallet balance</div>
                <div className="sd">Click to view →</div>
              </div>
            </div>

            <div className="card">
              <div className="card-h">
                <div className="card-t"><DollarSign size={18} /> Recent Donations</div>
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
                <button className="card-a" onClick={() => setActiveTab('campaigns')}>Manage <ArrowRight size={14} /></button>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: 20 }}>My Campaigns</div>
              <button className="btn btn-g" onClick={() => { setEditCampaign(null); setModalOpen(true); }}>
                <Plus size={16} /> New Campaign
              </button>
            </div>
            <div className="card">
              <div className="card-b" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="ut" style={{ minWidth: 600 }}>
                  <thead>
                    <tr>
                      <th>Campaign</th><th>Goal</th><th>Raised</th><th>Progress</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeCampaigns.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--txt-3)', padding: 24 }}>No campaigns yet</td></tr>
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
                          <td><span className={`badge ${c.status === 'approved' ? 'ba' : c.status === 'pending' ? 'bp' : 'br'}`}>{c.status}</span></td>
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

          {/* Donations Tab */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-b" style={{ padding: 0, overflowX: 'auto' }}>
                <table className="ut" style={{ minWidth: 500 }}>
                  <thead>
                    <tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {safeDonations.length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--txt-3)', padding: 24 }}>No donations yet</td></tr>
                    )}
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
                <button className="btn btn-g" onClick={handleRequestPayout}>
                  <Send size={16} /> Request Withdrawal
                </button>
                <hr style={{ margin: '20px 0', borderColor: 'var(--border)' }} />
                <strong>Recent payout requests</strong>
                {safePayoutRequests.length === 0 && (
                  <div style={{ padding: '10px 0', color: 'var(--txt-3)' }}>No payout requests yet</div>
                )}
                {safePayoutRequests.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                    <span>${parseFloat(p.amount || 0).toFixed(2)} · {new Date(p.created_at).toLocaleDateString()}</span>
                    <span className={`badge ${p.status === 'pending' ? 'bp' : p.status === 'rejected' ? 'bx' : 'ba'}`}>
                      {p.status === 'pending' && <Clock size={10} />}
                      {p.status === 'approved' && <CheckCircle size={10} />}
                      {p.status === 'rejected' && <AlertCircle size={10} />}
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wallet Tab with Transaction History */}
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
              </div>
            </div>

            <div className="card">
              <div className="card-h">
                <div className="card-t"><History size={18} /> Transaction History</div>
                <button className="card-a" onClick={() => loadTransactions()}>
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
              <div className="card-b">
                <TransactionHistory transactions={transactions} loading={transactionsLoading} />
              </div>
            </div>
          </div>

          {/* Settings Tab */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><User size={18} /> Profile Settings</div></div>
              <div className="card-b">
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-2)', display: 'block', marginBottom: 4 }}>Display Name</label>
                <input className="fi" type="text" defaultValue={currentUser?.name} />
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-2)', display: 'block', marginBottom: 4 }}>Email</label>
                <input className="fi" type="email" defaultValue={currentUser?.email} />
                <div className="verified-status" style={{ marginBottom: 16, padding: '8px 12px', background: isVerified ? 'var(--green-l)' : 'var(--amber-l)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isVerified ? <CheckCircle size={16} color="var(--green-d)" /> : <AlertCircle size={16} color="#854F0B" />}
                  <span style={{ fontSize: 13, color: isVerified ? 'var(--green-d)' : '#854F0B' }}>
                    {isVerified ? 'Your account is verified' : 'Your account is not yet verified. Contact support for verification.'}
                  </span>
                </div>
                <button className="btn btn-g" onClick={() => showToast('Profile update coming soon')}>Save Changes</button>
              </div>
            </div>

            <div className="card" style={{ marginTop: 20 }}>
              <div className="card-h"><div className="card-t"><CreditCard size={18} /> Payment Methods</div></div>
              <div className="card-b">
                <form onSubmit={savePaymentMethod}>
                  {[
                    { label: 'PayPal Email', key: 'paypal_email', type: 'email', placeholder: 'you@example.com' },
                    { label: 'Bank Account Name', key: 'account_name', type: 'text', placeholder: 'Account holder name' },
                    { label: 'Bank Account Number', key: 'account_number', type: 'text', placeholder: 'Account number' },
                    { label: 'Bank Name', key: 'bank_name', type: 'text', placeholder: 'Bank name' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-2)', display: 'block', marginBottom: 4 }}>{label}</label>
                      <input
                        className="fi"
                        type={type}
                        placeholder={placeholder}
                        value={paymentMethod[key] || ''}
                        onChange={e => setPaymentMethod(prev => ({ ...prev, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <button type="submit" className="btn btn-g" disabled={loadingPayment}>
                    {loadingPayment ? 'Saving...' : 'Save Payment Method'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bnav">
        <div className="bnav-inner">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
            { id: 'campaigns', label: 'Campaigns', icon: <Target size={20} /> },
            { id: 'donations', label: 'Donations', icon: <DollarSign size={20} /> },
            { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} /> },
          ].map(({ id, label, icon }) => (
            <button key={id} className={`bni ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              <div className="bni-icon">{icon}</div>
              <span className="bni-lbl">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Progress Update Modal */}
      <div className={`modal-bd ${progressModalOpen ? 'open' : ''}`} onClick={() => setProgressModalOpen(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="card-t" style={{ marginBottom: 12 }}>Update Campaign Progress</div>
          <input
            className="fi"
            type="number"
            placeholder="New raised amount (USD)"
            value={progressAmount}
            onChange={e => setProgressAmount(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-gh" onClick={() => setProgressModalOpen(false)}>Cancel</button>
            <button className="btn btn-g" onClick={handleUpdateProgress}>Update</button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CampaignModal
          campaign={editCampaign}
          onClose={() => { setModalOpen(false); setEditCampaign(null); loadData(); }}
        />
      )}

      {viewDonations && (
        <DonationsModal campaign={viewDonations} onClose={() => setViewDonations(null)} />
      )}
    </div>
  );
}