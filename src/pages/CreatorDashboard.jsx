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
      --primary: #e8531e;
      --primary-dark: #c4400f;
      --secondary: #27a96c;
      --dark: #1a1a2e;
      --green: #1D9E75; --green-d: #0F6E56; --green-dd: #085041; --green-l: #E1F5EE; --green-m: #9FE1CB;
      --red: #E24B4A; --red-l: #FCEBEB; --amber: #EF9F27; --amber-l: #FAEEDA;
      --blue: #378ADD; --blue-l: #E6F1FB;
      --bg: #F8F9FA; --surface: #FFFFFF; --surface-2: #F1F3F5;
      --border: rgba(0,0,0,0.08); --border-2: rgba(0,0,0,0.12);
      --txt: #212529; --txt-2: #6C757D; --txt-3: #ADB5BD;
      --sidebar-w: 260px; --topbar-h: 64px; --bottom-nav: 68px;
      --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px;
      --sh-sm: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02);
      --sh-md: 0 4px 12px rgba(0,0,0,0.08);
      --sh-lg: 0 12px 32px rgba(0,0,0,0.12);
      --fd: 'Instrument Serif', Georgia, serif; --fb: 'DM Sans', sans-serif;
      --tr: 0.2s ease;
    }
    body.dark-mode {
      --bg: #121212; --surface: #1E1E1E; --surface-2: #2A2A2A;
      --border: rgba(255,255,255,0.1); --txt: #EEEEEE; --txt-2: #AAAAAA; --txt-3: #777777;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { font-family: 'Open Sans', sans-serif; background: var(--bg); color: var(--txt); min-height: 100vh; overflow-x: hidden; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Raleway', sans-serif; font-weight: 700; }

    .shell { display: flex; min-height: 100vh; overflow-x: hidden; }
    .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 200; overflow-y: auto; }
    .main { flex: 1; margin-left: var(--sidebar-w); display: flex; flex-direction: column; min-height: 100vh; max-width: calc(100% - var(--sidebar-w)); }

    /* Topbar - Desktop Only */
    .topbar { 
      height: var(--topbar-h); 
      background: var(--surface); 
      border-bottom: 1px solid var(--border); 
      display: flex; 
      align-items: center; 
      padding: 0 28px; 
      gap: 16px; 
      position: sticky; 
      top: 0; 
      z-index: 100; 
    }

    /* Mobile Top */
    .mob-top { 
      display: none; 
      position: sticky; 
      top: 0; 
      z-index: 100; 
      background: var(--surface); 
      border-bottom: 1px solid var(--border); 
      align-items: center; 
      justify-content: space-between; 
      padding: 0 16px; 
      height: 58px; 
    }

    /* Modal Fix - No Blur */
    .modal-bd { 
      position: fixed; 
      inset: 0; 
      background: rgba(0,0,0,0.65); 
      z-index: 9999; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      backdrop-filter: none !important;
    }
    .modal { 
      background: var(--surface); 
      border-radius: var(--r-xl); 
      padding: 28px; 
      width: 90%; 
      max-width: 560px; 
      max-height: 90vh; 
      overflow-y: auto; 
      box-shadow: var(--sh-lg);
    }

    /* Other styles remain the same */
    .ps { display: none; }
    .ps.active { display: block; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 28px; }
    .qg { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 28px; }
    .card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh-sm); overflow: hidden; margin-bottom: 24px; border: 1px solid var(--border); }
    .ut { width: 100%; border-collapse: collapse; }
    .ut th, .ut td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
    .ut th { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--txt-3); background: var(--surface-2); }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; max-width: 100%; }
      .topbar { display: none; }
      .mob-top { display: flex; }
      .bnav { display: block; }
      .fab { display: flex; }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .qg { grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .ut { display: block; overflow-x: auto; white-space: nowrap; }
      .modal { width: 95%; padding: 20px; }
    }
  `;
  document.head.appendChild(styleEl);
};

// Keep all your components (TransactionHistory, WithdrawalModal, etc.)
// ... [All your helper components remain unchanged] ...

function TransactionHistory({ transactions, loading, onRefresh }) {
  const [showAll, setShowAll] = useState(false);
  const displayTransactions = showAll ? transactions : transactions.slice(0, 10);
  
  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-3)' }}>Loading transactions...</div>;
  if (!transactions || transactions.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-3)' }}>No transactions yet</div>;
  
  return (
    <div>
      <table className="ut">
        <thead>
          <tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {displayTransactions.map(tx => (
            <tr key={tx.id}>
              <td>{new Date(tx.created_at).toLocaleDateString()}</td>
              <td>{tx.description || tx.type.replace('_', ' ').toUpperCase()}</td>
              <td><span style={{ color: tx.amount > 0 ? 'var(--primary)' : 'var(--red)', fontWeight: 600 }}>
                {tx.amount > 0 ? '+' : ''}{toNumber(tx.amount).toFixed(2)}
              </span></td>
              <td><span className="badge ba">{tx.status || 'completed'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length > 10 && (
        <button className="card-a" onClick={() => setShowAll(!showAll)} style={{ marginTop: 12 }}>
          {showAll ? 'Show less' : `View all (${transactions.length})`} <ChevronRight size={12} />
        </button>
      )}
      <button className="card-a" onClick={onRefresh} style={{ marginTop: 8 }}>
        <RefreshCw size={12} /> Refresh
      </button>
    </div>
  );
}

// Withdrawal Modal (unchanged)
function WithdrawalModal({ isOpen, onClose, onSubmit, balance, savedPaymentMethod, showToast }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(savedPaymentMethod?.paypal_email ? 'paypal' : 
                                                      savedPaymentMethod?.account_number ? 'bank' : 'mobile_money');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { showToast('Enter a valid amount', true); return; }
    if (amt > balance) { showToast('Insufficient balance', true); return; }
    if (!details.trim()) { showToast('Payment details required', true); return; }
    setLoading(true);
    try {
      await onSubmit(amt, paymentMethod, details);
      setAmount(''); setDetails('');
      onClose();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bd" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">Request Withdrawal</div>
        <div className="modal-s">Available balance: <strong>${balance.toFixed(2)}</strong></div>
        <form onSubmit={handleSubmit}>
          <label className="fl">Amount (USD)</label>
          <input type="number" className="fi" value={amount} onChange={e => setAmount(e.target.value)} min="1" step="0.01" placeholder="Enter amount" required />
          
          <label className="fl">Payment Method</label>
          <select className="fi" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="bank">🏦 Bank Transfer</option>
            <option value="paypal">💳 PayPal</option>
            <option value="mobile_money">📱 Mobile Money</option>
          </select>

          <label className="fl">Payment Details</label>
          <textarea className="fi" rows="3" value={details} onChange={e => setDetails(e.target.value)} 
            placeholder={paymentMethod === 'bank' ? 'Account name, number, bank name' : 
                        paymentMethod === 'paypal' ? 'PayPal email' : 'Phone number & network'} required />
          
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>
              {loading ? 'Submitting...' : 'Request Withdrawal'}
            </button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function CreatorDashboard() {
  injectStyles();

  const { currentUser, myCampaigns, loadMyCampaigns, deleteCampaign, logout, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');

  // ... keep all your other states (donations, walletBalance, etc.) ...

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);

  // Your existing useEffects remain the same...

  const handleUpdateProgress = async () => {
    const newRaised = parseFloat(progressAmount);
    if (isNaN(newRaised) || newRaised <= 0) { 
      showToast('Enter a valid amount', true); 
      return; 
    }
    try {
      await donationApi.updateCampaignProgress(selectedCampaignId, { raised: newRaised });
      showToast('Progress updated');
      setProgressModalOpen(false);
      setProgressAmount('');
      await loadData();
    } catch (err) { 
      showToast(err.message, true); 
    }
  };

  const handleRequestPayout = async (amount, paymentMethod, details) => {
    await donationApi.requestPayout({ amount, payment_method: paymentMethod, payment_details: details });
    showToast(`Withdrawal request of $${amount} submitted`);
    await loadData();
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // ... rest of your logic (safeCampaigns, totalRaised, etc.) remains the same ...

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Your sidebar content - unchanged */}
        {/* ... keep as is ... */}
      </aside>

      {/* Main Content */}
      <div className="main">
        {/* Desktop Topbar */}
        <div className="topbar">
          <div className="tb-title">
            {activeTab === 'overview' && 'Dashboard'}
            {activeTab === 'campaigns' && 'My Campaigns'}
            {activeTab === 'donations' && 'Donations'}
            {activeTab === 'payouts' && 'Payouts'}
            {activeTab === 'wallet' && 'Wallet'}
          </div>
          <div className="tb-actions">
            {/* Notification and Profile - unchanged */}
          </div>
        </div>

        {/* Mobile Topbar */}
        <div className="mob-top">
          <div className="mob-logo">HopeBridge</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Notification + Profile buttons */}
          </div>
        </div>

        <div className="page">
          {/* All your tab contents (overview, campaigns, donations, etc.) remain unchanged */}
          {/* ... paste all your tab content here ... */}
        </div>
      </div>

      {/* Bottom Nav & FAB - unchanged */}
      {/* ... keep as is ... */}

      {/* Modals */}
      {progressModalOpen && (
        <div className="modal-bd" onClick={() => setProgressModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-t">Update Campaign Progress</div>
            <input 
              className="fi" 
              type="number" 
              placeholder="New raised amount (USD)" 
              value={progressAmount} 
              onChange={e => setProgressAmount(e.target.value)} 
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-gh" onClick={() => setProgressModalOpen(false)}>Cancel</button>
              <button className="btn btn-g" onClick={handleUpdateProgress}>Update</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && <CampaignModal campaign={null} onClose={() => { setModalOpen(false); loadData(); }} />}
      {editModalOpen && editCampaign && <CampaignModal campaign={editCampaign} onClose={() => { setEditModalOpen(false); setEditCampaign(null); loadData(); }} />}
      
      {showSettings && (
        <div className="modal-bd" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', padding: 0 }}>
            <ProfileSettings onClose={() => setShowSettings(false)} userRole="creator" />
          </div>
        </div>
      )}

      <WithdrawalModal 
        isOpen={showWithdrawalModal} 
        onClose={() => setShowWithdrawalModal(false)} 
        onSubmit={handleRequestPayout} 
        balance={walletBalance - pendingPayoutSum}
        savedPaymentMethod={paymentMethod}
        showToast={showToast}
      />
    </div>
  );
}