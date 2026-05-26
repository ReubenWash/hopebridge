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

// ── Styles (unchanged but extended for gallery reorder) ──
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
    .sb-logo { padding: 22px 20px 14px; border-bottom: 1px solid var(--border); }
    .logo-mark { display: flex; align-items: center; gap: 10px; }
    .logo-icon { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--primary); display: flex; align-items: center; justify-content: center; }
    .logo-text { font-family: 'Raleway', sans-serif; font-size: 1.3rem; font-weight: 900; color: var(--primary); }
    .logo-sub { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--txt-3); }
    .sb-creator { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
    .creator-av { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); display: flex; align-items: center; justify-content: center; font-weight: 600; color: #fff; }
    .creator-name { font-weight: 600; font-size: 14px; color: var(--txt); }
    .creator-badge { font-size: 11px; color: var(--txt-3); background: var(--green-l); padding: 2px 8px; border-radius: 20px; display: inline-block; margin-top: 4px; }
    .sb-nav { flex: 1; padding: 10px; }
    .nav-sec { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--txt-3); padding: 10px 10px 4px; }
    .nl { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--r-sm); cursor: pointer; border: none; background: none; width: 100%; text-align: left; color: var(--txt-2); font-size: 13.5px; font-weight: 600; transition: all var(--tr); }
    .nl:hover { background: var(--bg); color: var(--txt); }
    .nl.active { background: rgba(232,83,30,0.1); color: var(--primary); }
    .nl svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.8; fill: none; }
    .nb { margin-left: auto; font-size: 10px; font-weight: 700; background: var(--red); color: #fff; padding: 2px 7px; border-radius: 20px; min-width: 18px; text-align: center; }
    .sb-footer { padding: 12px 10px; border-top: 1px solid var(--border); }
    .main { flex: 1; margin-left: var(--sidebar-w); display: flex; flex-direction: column; min-height: 100vh; max-width: calc(100% - var(--sidebar-w)); overflow-x: hidden; }
    .topbar { height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 16px; position: sticky; top: 0; z-index: 100; }
    .tb-title { font-family: 'Raleway', sans-serif; font-size: 1.5rem; font-weight: 700; flex: 1; color: var(--txt); }
    .tb-actions { display: flex; gap: 10px; position: relative; }
    .tb-btn { width: 38px; height: 38px; border-radius: var(--r-sm); background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background var(--tr); position: relative; }
    .notif-badge { position: absolute; top: -4px; right: -4px; background: var(--red); color: white; font-size: 9px; font-weight: 700; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--surface); }
    .page { padding: 28px; max-width: 100%; overflow-x: hidden; }
    .ps { display: none; }
    .ps.active { display: block; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 28px; }
    .sc { background: var(--surface); border-radius: var(--r-lg); padding: 22px 18px; box-shadow: var(--sh-sm); cursor: pointer; transition: all 0.25s ease; border: 1px solid var(--border); }
    .sc:hover { transform: translateY(-3px); box-shadow: var(--sh-md); border-color: var(--primary); }
    .sc .si { width: 44px; height: 44px; border-radius: var(--r-md); background: rgba(232,83,30,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
    .sc .si svg { stroke: var(--primary); width: 22px; height: 22px; }
    .sv { font-family: 'Raleway', sans-serif; font-size: 32px; line-height: 1.1; font-weight: 800; margin-bottom: 4px; color: var(--txt); }
    .sl { font-size: 13px; color: var(--txt-2); font-weight: 500; }
    
    .qg { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 28px; }
    .qb { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); padding: 16px 8px 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
    .qb:hover { transform: translateY(-2px); box-shadow: var(--sh-md); border-color: var(--primary); }
    .qi { width: 40px; height: 40px; border-radius: var(--r-sm); background: rgba(232,83,30,0.1); display: flex; align-items: center; justify-content: center; color: var(--primary); }
    .ql { font-size: 11px; font-weight: 600; color: var(--txt-2); text-align: center; line-height: 1.3; }
    .qb.qx .qi { background: var(--red-l); color: var(--red); }
    .qb.qx .ql { color: var(--red); }
    
    .card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh-sm); overflow: hidden; margin-bottom: 24px; border: 1px solid var(--border); }
    .card-h { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
    .card-t { font-family: 'Raleway', sans-serif; font-size: 1rem; font-weight: 700; display: flex; align-items: center; gap: 8px; color: var(--txt); }
    .card-a { font-size: 12px; font-weight: 600; color: var(--primary); background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .card-b { padding: 16px 20px; }
    .badge { font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
    .ba { background: var(--green-l); color: var(--green-d); }
    .bp { background: var(--amber-l); color: #854F0B; }
    .br { background: var(--blue-l); color: #185FA5; }
    .bx { background: var(--red-l); color: var(--red); }
    .cr { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .cr:last-child { border-bottom: none; }
    .ci { flex: 1; min-width: 0; }
    .cn { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--txt); }
    .cm { font-size: 11px; color: var(--txt-3); margin-top: 2px; display: flex; align-items: center; gap: 4px; }
    .pb { height: 4px; background: var(--bg); border-radius: 2px; margin-top: 6px; overflow: hidden; }
    .pf { height: 100%; background: var(--primary); border-radius: 2px; }
    .ut { width: 100%; border-collapse: collapse; }
    .ut th { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--txt-3); text-align: left; padding: 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); white-space: nowrap; }
    .ut td { padding: 14px 12px; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--txt); }
    .ut-wrap { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .db { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all var(--tr); }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .dbp { background: var(--amber-l); color: #854F0B; }
    .btn { padding: 10px 18px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: 'Raleway', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.8rem; transition: all var(--tr); }
    .btn-g { background: var(--primary); color: #fff; }
    .btn-g:hover { background: var(--primary-dark); transform: translateY(-1px); }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); color: var(--txt-2); }
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border-2); border-radius: var(--r-sm); margin-bottom: 16px; font-family: 'Open Sans', sans-serif; background: var(--surface); color: var(--txt); }
    .fl { font-size: 12px; font-weight: 700; color: var(--txt-2); letter-spacing: .05em; text-transform: uppercase; margin-bottom: 6px; display: block; }

    /* Modals (creator-specific) */
    .cr-modal-bd {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: none !important;
    }
    .cr-modal {
      background: var(--surface);
      border-radius: var(--r-xl);
      padding: 28px;
      width: 90%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .cr-modal-t { font-family: 'Raleway', sans-serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 6px; color: var(--txt); }
    .cr-modal-s { font-size: 13px; color: var(--txt-2); margin-bottom: 20px; }

    /* Gallery Manager Styles */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
      margin: 20px 0;
    }
    .gallery-item {
      position: relative;
      background: var(--surface-2);
      border-radius: var(--r-md);
      overflow: hidden;
      border: 1px solid var(--border);
      transition: all var(--tr);
    }
    .gallery-item img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      display: block;
    }
    .gallery-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      display: flex;
      justify-content: space-between;
      padding: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .gallery-item:hover .gallery-actions {
      opacity: 1;
    }
    .gallery-action-btn {
      background: rgba(255,255,255,0.9);
      border: none;
      border-radius: 20px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all var(--tr);
    }
    .gallery-action-btn:hover {
      background: white;
      transform: scale(1.05);
    }
    .gallery-reorder-buttons {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      gap: 6px;
      background: rgba(0,0,0,0.5);
      border-radius: 20px;
      padding: 4px;
    }
    .reorder-btn {
      background: rgba(255,255,255,0.9);
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--tr);
    }
    .reorder-btn:hover {
      background: white;
      transform: scale(1.1);
    }
    .upload-area {
      border: 2px dashed var(--border);
      border-radius: var(--r-lg);
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all var(--tr);
      margin-bottom: 20px;
    }
    .upload-area:hover {
      border-color: var(--primary);
      background: rgba(232,83,30,0.05);
    }
    .file-list {
      margin-top: 12px;
      font-size: 13px;
      color: var(--txt-2);
    }

    /* Notifications Panel */
    .notif-panel { position: absolute; top: 50px; right: 0; width: 340px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); box-shadow: var(--sh-lg); z-index: 1000; max-height: 480px; overflow-y: auto; }
    .notif-header { padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
    .notif-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background var(--tr); }
    .notif-item:hover { background: var(--surface-2); }
    .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); flex-shrink: 0; margin-top: 4px; }
    .notif-text { font-size: 13px; color: var(--txt); line-height: 1.4; }
    .notif-time { font-size: 11px; color: var(--txt-3); margin-top: 3px; }

    /* Mobile */
    .mob-top, .bnav, .fab { display: none !important; }
    @media (min-width: 769px) {
      .mob-top, .bnav, .fab { display: none !important; }
    }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; max-width: 100%; }
      .topbar { display: none !important; }
      .mob-top { display: flex !important; position: sticky; top: 0; z-index: 100; background: var(--surface); border-bottom: 1px solid var(--border); align-items: center; justify-content: space-between; padding: 0 16px; height: 58px; }
      .mob-logo { font-family: 'Raleway', sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--primary); }
      .bnav { display: block !important; position: fixed; bottom: 0; left: 0; right: 0; height: 68px; background: var(--surface); border-top: 1px solid var(--border); z-index: 200; }
      .bnav-inner { display: flex; justify-content: space-around; align-items: center; height: 100%; }
      .bni { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: none; border: none; cursor: pointer; color: var(--txt-3); font-size: 10px; font-weight: 600; transition: color var(--tr); }
      .bni.active { color: var(--primary); }
      .bni svg { width: 20px; height: 20px; stroke: currentColor; }
      .fab { display: flex !important; position: fixed; bottom: 80px; right: 16px; width: 56px; height: 56px; border-radius: 50%; background: var(--primary); border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer; z-index: 150; align-items: center; justify-content: center; transition: transform var(--tr); }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .qg { grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .sc { padding: 16px; }
      .sv { font-size: 26px; }
      .card-b { padding: 12px 16px; }
      .ut-wrap { width: 100%; }
      .ut th { white-space: nowrap; font-size: 10px; padding: 10px 8px; }
      .ut td { white-space: normal; word-break: break-word; font-size: 12px; padding: 10px 8px; }
      .notif-panel { width: calc(100vw - 32px); right: 0; left: auto; top: 60px; }
    }
  `;
  document.head.appendChild(styleEl);
};

// ── TransactionHistory (unchanged) ──
function TransactionHistory({ transactions, loading, onRefresh }) {
  const [showAll, setShowAll] = useState(false);
  const displayTransactions = showAll ? transactions : transactions.slice(0, 10);
  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-3)' }}>Loading transactions...</div>;
  if (!transactions || transactions.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-3)' }}>No transactions yet</div>;
  return (
    <div>
      <div className="ut-wrap">
        <table className="ut">
          <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {displayTransactions.map(tx => (
              <tr key={tx.id}>
                <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                <td>{tx.description || tx.type.replace('_', ' ').toUpperCase()}</td>
                <td><span style={{ color: tx.amount > 0 ? 'var(--primary)' : 'var(--red)', fontWeight: 600 }}>{tx.amount > 0 ? '+' : ''}{toNumber(tx.amount).toFixed(2)}</span></td>
                <td><span className="badge ba">{tx.status || 'completed'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length > 10 && (
        <button className="card-a" onClick={() => setShowAll(!showAll)} style={{ marginTop: 12 }}>
          {showAll ? 'Show less' : `View all (${transactions.length})`}<ChevronRight size={12} />
        </button>
      )}
      <button className="card-a" onClick={onRefresh} style={{ marginTop: 8 }}><RefreshCw size={12} /> Refresh</button>
    </div>
  );
}

// ── WithdrawalModal (unchanged) ──
function WithdrawalModal({ isOpen, onClose, onSubmit, balance, savedPaymentMethod, showToast }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(
    savedPaymentMethod?.paypal_email ? 'paypal' : savedPaymentMethod?.account_number ? 'bank' : 'mobile_money'
  );
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
      setAmount(''); setDetails(''); onClose();
    } catch (err) { showToast(err.message, true); }
    finally { setLoading(false); }
  };
  return (
    <div className="cr-modal-bd" onClick={onClose}>
      <div className="cr-modal" onClick={e => e.stopPropagation()}>
        <div className="cr-modal-t">Request Withdrawal</div>
        <div className="cr-modal-s">Available balance: <strong>${balance.toFixed(2)}</strong></div>
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
            placeholder={paymentMethod === 'bank' ? 'Account name, number, bank name' : paymentMethod === 'paypal' ? 'PayPal email' : 'Phone number & network'} required />
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>{loading ? 'Submitting...' : 'Request Withdrawal'}</button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main CreatorDashboard ──
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

  // ── Gallery Management State ──
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryCampaign, setGalleryCampaign] = useState(null); // stores campaign object (id, title)
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

  const loadData = async () => {
    setLoadingData(true);
    try {
      await loadMyCampaigns();
      let donRes = { donations: [] };
      try { const raw = await donationApi.getMyDonations(); donRes = { donations: Array.isArray(raw) ? raw : raw?.donations || [] }; } catch {}
      let payRes = { requests: [] };
      try { const raw = await donationApi.getMyPayoutRequests(); payRes = { requests: Array.isArray(raw) ? raw : raw?.requests || [] }; } catch {}
      let walletRes = { balance: 0, total_earned: 0 };
      try { const raw = await donationApi.getCreatorWallet(); walletRes = { balance: parseFloat(raw?.balance ?? 0), total_earned: parseFloat(raw?.total_earned ?? 0) }; } catch {}
      setDonations(donRes.donations); setPayoutRequests(payRes.requests);
      setWalletBalance(walletRes.balance); setTotalEarned(walletRes.total_earned);
    } catch (err) { showToast('Error loading data', true); }
    finally { setLoadingData(false); }
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

  // ── Gallery Management Functions ──
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
        // data.campaign.gallery_images should be an array of objects with id, image_url, etc.
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
        // refresh gallery
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
      {/* Sidebar (unchanged) */}
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
          {loadingData && <div style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', borderRadius: 6, marginBottom: 12 }}>Loading your data...</div>}

          {/* Overview Tab */}
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

          {/* Campaigns Tab */}
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
                      

                      {safeCampaigns.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>No campaigns yet</td></tr>}
                      
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

          {/* Donations Tab */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Heart size={18} /> Donations Received</div></div>
              <div className="card-b" style={{ padding: 0 }}>
                <div className="ut-wrap">
                  <table className="ut">
                    <thead><tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Date</th></tr></thead>
                    <tbody>
                      {safeDonations.map(d => (
                        <tr key={d.id}><td>{d.donor_name || 'Anonymous'}</td><td>{d.campaign_title}</td><td>${parseFloat(d.amount || 0).toFixed(2)}</td><td>{new Date(d.created_at).toLocaleDateString()}</td></tr>
                      ))}
                      


                     {safeDonations.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 24 }}>No donations yet</td></tr>}
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Payouts Tab */}
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

          {/* Wallet Tab */}
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

          {/* Settings Tab */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}><ProfileSettings userRole="creator" /></div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
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

      {/* ── Gallery Management Modal ── */}
      {galleryModalOpen && galleryCampaign && (
        <div className="cr-modal-bd" onClick={() => setGalleryModalOpen(false)}>
          <div className="cr-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <div className="cr-modal-t">Manage Gallery – {galleryCampaign.title}</div>
            <div className="cr-modal-s">Upload, reorder, or delete campaign images</div>
            
            {/* Upload Area */}
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