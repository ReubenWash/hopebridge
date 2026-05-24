import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { adminApi, campaignApi } from '../services/api';
import NotificationBell from '../components/NotificationBell';
import {
  Heart, LayoutDashboard, Users, DollarSign, Settings, LogOut,
  Bell, Target, CreditCard, Plus, CheckCircle, Clock, FileText,
  ArrowRight, Zap, Shield, Calendar, Send, Eye, EyeOff,
  Banknote, History, X, Gift, Receipt, Lock, Unlock,
  Mail as MailIcon, Trash2, RefreshCw, Image,
  Menu, Home, TrendingUp, AlertCircle, Award, BarChart3,
  Megaphone, MessageCircle, UserCheck, Wallet, HelpCircle,
  Copy, Check, Download, Upload, Filter, Search, Edit, UserPlus
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────
const safeGet = async (fn, fallback) => { try { return await fn(); } catch { return fallback; } };
const toNum = (v, f = 0) => { const n = parseFloat(v); return isNaN(n) ? f : n; };

// ── Styles ────────────────────────────────────────
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    :root {
      --green: #1D9E75; --green-d: #0F6E56; --green-dd: #085041; --green-l: #E1F5EE; --green-m: #9FE1CB;
      --red: #E24B4A; --red-l: #FCEBEB; --amber: #EF9F27; --amber-l: #FAEEDA; --blue: #378ADD; --blue-l: #E6F1FB;
      --bg: #EEF1F5; --surface: #FFFFFF; --surface-2: #F6F8FA; --border: rgba(0,0,0,0.07);
      --txt: #111318; --txt-2: #5A6272; --txt-3: #9AA3B2;
      --sidebar-w: 260px; --topbar-h: 64px; --bottom-nav: 70px;
      --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px;
      --fd: 'Inter', system-ui; --fb: 'Inter', system-ui; --tr: 0.2s ease;
    }
    body.dark-mode {
      --bg: #0f0f1a; --surface: #1a1a2e; --surface-2: #252540; --border: rgba(255,255,255,0.08);
      --txt: #EEEEEE; --txt-2: #AAAAAA; --txt-3: #777777;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { font-family: var(--fb); background: var(--bg); color: var(--txt); min-height: 100vh; }
    
    /* Layout */
    .shell { display: flex; min-height: 100vh; }
    .sidebar {
      width: var(--sidebar-w);
      background: var(--surface);
      border-right: 1px solid var(--border);
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      z-index: 200;
      overflow-y: auto;
    }
    .main { flex: 1; margin-left: var(--sidebar-w); display: flex; flex-direction: column; min-height: 100vh; }
    
    /* Sidebar Components */
    .sb-logo { padding: 24px 20px; border-bottom: 1px solid var(--border); }
    .logo-mark { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--green); display: flex; align-items: center; justify-content: center; }
    .logo-text { font-size: 18px; font-weight: 700; color: var(--txt); }
    .logo-sub { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: var(--txt-3); }
    .sb-admin { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
    .admin-av { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--green), var(--green-d)); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; color: #fff; }
    .admin-name-s { font-size: 14px; font-weight: 600; color: var(--txt); }
    .admin-role { font-size: 11px; color: var(--txt-3); margin-top: 2px; }
    .sb-nav { flex: 1; padding: 12px; }
    .nav-sec { font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--txt-3); padding: 8px 12px; }
    .nl {
      display: flex; align-items: center; gap: 12px; padding: 10px 12px;
      border-radius: var(--r-md); cursor: pointer; border: none;
      background: none; width: 100%; text-align: left;
      color: var(--txt-2); font-size: 13px; font-weight: 500;
      transition: all 0.2s;
    }
    .nl:hover { background: var(--bg); color: var(--txt); }
    .nl.active { background: var(--green-l); color: var(--green-d); font-weight: 600; }
    .nl svg { flex-shrink: 0; }
    .nb { margin-left: auto; font-size: 10px; font-weight: 700; background: var(--red); color: #fff; padding: 2px 7px; border-radius: 20px; }
    .nb.am { background: var(--amber); }
    .sb-footer { padding: 16px; border-top: 1px solid var(--border); }
    
    /* Top Bar */
    .topbar {
      height: var(--topbar-h);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .tb-title { font-size: 20px; font-weight: 600; color: var(--txt); }
    .tb-actions { display: flex; align-items: center; gap: 12px; }
    .tb-btn {
      width: 38px; height: 38px; border-radius: var(--r-sm);
      background: var(--surface-2); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background 0.2s;
    }
    .tb-btn:hover { background: var(--bg); }
    
    /* Page Content */
    .page { padding: 28px; }
    .ps { display: none; }
    .ps.active { display: block; }
    
    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .sc {
      background: var(--surface);
      border-radius: var(--r-lg);
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid var(--border);
    }
    .sc:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .si { width: 40px; height: 40px; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
    .si-g { background: var(--green-l); color: var(--green-d); }
    .si-b { background: var(--blue-l); color: var(--blue); }
    .si-a { background: var(--amber-l); color: #854F0B; }
    .si-r { background: var(--red-l); color: var(--red); }
    .sv { font-size: 28px; font-weight: 700; color: var(--txt); line-height: 1.2; }
    .sl { font-size: 12px; color: var(--txt-2); margin-top: 4px; }
    .sd { font-size: 11px; font-weight: 600; margin-top: 8px; color: var(--green); }
    
    /* Quick Actions Grid */
    .qg { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; margin-bottom: 28px; }
    .qb {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .qb:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .qi { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--surface-2); display: flex; align-items: center; justify-content: center; }
    .ql { font-size: 10px; font-weight: 600; color: var(--txt-2); text-align: center; }
    
    /* Cards */
    .card { background: var(--surface); border-radius: var(--r-lg); border: 1px solid var(--border); overflow: hidden; margin-bottom: 24px; }
    .card-h { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); }
    .card-t { font-size: 15px; font-weight: 600; color: var(--txt); display: flex; align-items: center; gap: 8px; }
    .card-a { font-size: 12px; font-weight: 600; color: var(--green); background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .card-b { padding: 16px 20px; }
    
    /* Tables */
    .ut { width: 100%; border-collapse: collapse; }
    .ut th { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--txt-3); text-align: left; padding: 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .ut td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 13px; }
    .ut tr:hover td { background: var(--surface-2); }
    
    /* Badges */
    .badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }
    .ba { background: var(--green-l); color: var(--green-d); }
    .bp { background: var(--amber-l); color: #854F0B; }
    .br { background: var(--blue-l); color: #185FA5; }
    .bx { background: var(--red-l); color: var(--red); }
    
    /* Buttons */
    .db { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .btn { padding: 8px 16px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; }
    .btn-g { background: var(--green); color: #fff; }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); }
    
    /* Forms */
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--r-sm); background: var(--surface-2); color: var(--txt); font-size: 13px; margin-bottom: 12px; }
    .fl { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--txt-2); margin-bottom: 6px; display: block; }
    
    /* Modals */
    .modal-bd { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s; backdrop-filter: blur(4px); }
    .modal-bd.open { opacity: 1; pointer-events: all; }
    .modal { background: var(--surface); border-radius: var(--r-xl); padding: 28px; width: 90%; max-width: 450px; transform: translateY(20px); transition: transform 0.25s; }
    .modal-bd.open .modal { transform: translateY(0); }
    .modal-t { font-size: 20px; font-weight: 700; color: var(--txt); margin-bottom: 8px; }
    .modal-s { font-size: 13px; color: var(--txt-2); margin-bottom: 20px; }
    
    /* Mobile Components */
    .mobile-bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); z-index: 200; padding: 8px 16px; padding-bottom: env(safe-area-inset-bottom, 8px); }
    .mobile-bottom-nav-inner { display: flex; justify-content: space-around; align-items: center; max-width: 500px; margin: 0 auto; }
    .mobile-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; padding: 8px; border-radius: var(--r-md); transition: all 0.2s; color: var(--txt-3); font-size: 10px; font-weight: 600; position: relative; }
    .mobile-nav-item.active { color: var(--green); background: var(--green-l); }
    .mobile-nav-item svg { width: 22px; height: 22px; }
    .mobile-nav-badge { position: absolute; top: 2px; right: 5px; background: var(--red); color: #fff; font-size: 9px; border-radius: 50%; min-width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
    
    .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 8px; color: var(--txt); }
    .mob-top { display: none; height: 58px; background: var(--surface); border-bottom: 1px solid var(--border); align-items: center; justify-content: space-between; padding: 0 16px; position: sticky; top: 0; z-index: 100; }
    .mob-logo { font-size: 18px; font-weight: 700; color: var(--txt); }
    
    .mobile-sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 998; display: none; }
    .mobile-sidebar-overlay.open { display: block; }
    .mobile-sidebar-menu { position: fixed; top: 0; left: -280px; width: 280px; height: 100vh; background: var(--surface); z-index: 999; transition: left 0.3s ease; overflow-y: auto; display: flex; flex-direction: column; }
    .mobile-sidebar-menu.open { left: 0; }
    .mobile-sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border); }
    .mobile-sidebar-user { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .mobile-sidebar-nav { flex: 1; padding: 12px 0; }
    .mobile-nav-link { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 20px; background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--txt-2); transition: background 0.2s; text-align: left; }
    .mobile-nav-link:hover { background: var(--bg); color: var(--txt); }
    .mobile-nav-link.active { background: var(--green-l); color: var(--green-d); font-weight: 600; }
    
    /* Responsive */
    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .qg { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .topbar { display: none; }
      .mobile-bottom-nav { display: block; }
      .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
      .mob-top { display: flex; }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .qg { grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .card-h { flex-direction: column; gap: 8px; align-items: flex-start; }
      .ut { display: block; overflow-x: auto; white-space: nowrap; }
    }
    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: 1fr; }
      .qg { grid-template-columns: repeat(2, 1fr); }
    }
  `;
  document.head.appendChild(styleEl);
};

// ── Toggle Component ────────────────────────────────
const Toggle = ({ checked, onChange, danger = false, disabled = false }) => (
  <label className={`toggle ${danger ? 'danger' : ''}`} style={{ opacity: disabled ? 0.5 : 1 }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} />
    <span className="toggle-slider" />
  </label>
);

// ── Change Password Modal ──────────────────────────
const ChangePasswordModal = ({ isOpen, onClose, onSave, showToast }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirm) { showToast('Passwords do not match', true); return; }
    if (newPassword.length < 6) { showToast('Min 6 characters', true); return; }
    setLoading(true);
    try {
      await onSave({ oldPassword, newPassword });
      showToast('Password changed');
      setOldPassword(''); setNewPassword(''); setConfirm('');
      onClose();
    } catch (err) { showToast(err.message, true); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-bd open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">Change Password</div>
        <div className="modal-s">Enter your current password and a new one</div>
        <form onSubmit={handleSubmit}>
          <label className="fl">Current Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showOld ? 'text' : 'password'} className="fi" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowOld(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)' }}>
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <label className="fl">New Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showNew ? 'text' : 'password'} className="fi" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowNew(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)' }}>
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <label className="fl">Confirm New Password</label>
          <input type="password" className="fi" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>{loading ? 'Changing…' : 'Change Password'}</button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Delete User Modal ──────────────────────────────
const DeleteUserModal = ({ isOpen, onClose, onConfirm, userName, showToast }) => {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') { showToast('Type "DELETE" to confirm', true); return; }
    setLoading(true);
    try { await onConfirm(); onClose(); } catch (err) { showToast(err.message, true); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-bd open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#dc2626' }}>Delete User</h3>
        <p style={{ marginBottom: '20px', color: 'var(--txt-2)', lineHeight: '1.5' }}>Permanently delete <strong>{userName}</strong>? All their data will be removed and cannot be undone.</p>
        <label className="fl">Type "DELETE" to confirm</label>
        <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="DELETE" className="fi" style={{ marginBottom: '20px' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleConfirm} disabled={loading} className="btn" style={{ background: '#dc2626', color: '#fff' }}>{loading ? 'Deleting...' : 'Permanently Delete'}</button>
          <button onClick={onClose} className="btn btn-gh">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ── Add User Modal ─────────────────────────────────
const AddUserModal = ({ isOpen, onClose, onSubmit, userData, setUserData, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-bd open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">Add New User</div>
        <div className="modal-s">Create a new user account</div>
        <form onSubmit={onSubmit}>
          <label className="fl">Full Name *</label>
          <input type="text" value={userData.name} onChange={e => setUserData(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required className="fi" />
          <label className="fl">Email *</label>
          <input type="email" value={userData.email} onChange={e => setUserData(p => ({ ...p, email: e.target.value }))} placeholder="user@example.com" required className="fi" />
          <label className="fl">Password *</label>
          <input type="password" value={userData.password} onChange={e => setUserData(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" required minLength={6} className="fi" />
          <label className="fl">Role</label>
          <select value={userData.role} onChange={e => setUserData(p => ({ ...p, role: e.target.value }))} className="fi">
            <option value="donor">Donor</option>
            <option value="creator">Creator</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', cursor: 'pointer' }}>
            <input type="checkbox" checked={userData.is_verified} onChange={e => setUserData(p => ({ ...p, is_verified: e.target.checked }))} />
            <span style={{ fontSize: '13px' }}>Mark as verified (skip email verification)</span>
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} className="btn btn-g">{loading ? 'Adding...' : 'Add User'}</button>
            <button type="button" onClick={onClose} className="btn btn-gh">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main AdminDashboard ───────────────────────────
export default function AdminDashboard() {
  injectStyles();

  const { currentUser, logout, showToast, loading: sessionLoading } = useApp();
  const navigate = useNavigate();

  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dataLoading, setDataLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('hb_darkmode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('security');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState({ open: false, userId: null, userName: '' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'donor', is_verified: true });
  const [addingUser, setAddingUser] = useState(false);
  const [newDonationAlert, setNewDonationAlert] = useState(null);
  const [lastDonationCheck, setLastDonationCheck] = useState(Date.now());

  // Data state
  const [stats, setStats] = useState({ total_raised: 0, total_campaigns: 0, pending_campaigns: 0, total_users: 0 });
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [completionRequests, setCompletionRequests] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [feeSettings, setFeeSettings] = useState({ percentage: 0, fixed_amount: 0, min_fee: 0, withdrawal_fee: 0, minimum_withdrawal: 10 });
  const [notifHistory, setNotifHistory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [content, setContent] = useState({ hero_title: 'Together We Can', hero_subtitle: 'Support causes you care about.', hero_badge: 'HopeBridge', impact_title: 'Our Impact', impact_subtitle: 'Every donation counts', impact_stats: { raised: '$0', campaigns: '0', donors: '0' }, social_links: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' } });
  const [themeSettings, setThemeSettings] = useState({ '--primary': '#e8531e', '--primary-dark': '#c4400f', '--secondary': '#27a96c', '--dark': '#1a1a2e' });
  const [integrationKeys, setIntegrationKeys] = useState({ smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '', recaptcha_site_key: '', recaptcha_secret_key: '' });
  const [socialLinks, setSocialLinks] = useState({ facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' });
  const [maintenanceMode, setMaintenanceMode] = useState({ enabled: false, message: '' });
  const [verificationEnabled, setVerificationEnabled] = useState(true);
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(false);
  const [pushNotifEnabled, setPushNotifEnabled] = useState(true);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);
  const [togglingVerification, setTogglingVerification] = useState(false);
  const [togglingRecaptcha, setTogglingRecaptcha] = useState(false);

  // Dark mode
  useEffect(() => { document.body.classList.toggle('dark-mode', darkMode); localStorage.setItem('hb_darkmode', darkMode); }, [darkMode]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Auth check
  useEffect(() => {
    if (sessionLoading) return;
    if (!currentUser) { showToast('Please log in', true); navigate('/'); return; }
    if (currentUser.role !== 'admin') { showToast('Access denied', true); navigate('/'); return; }
    setAuthChecked(true);
  }, [sessionLoading, currentUser]);

  // Real-time donation polling
  useEffect(() => {
    if (!authChecked) return;
    const interval = setInterval(async () => {
      try {
        const res = await adminApi.getDonations();
        const latest = res.donations?.[0];
        if (latest && new Date(latest.created_at).getTime() > lastDonationCheck) {
          setNewDonationAlert(latest);
          showToast(`💝 New $${latest.amount} donation from ${latest.donor_name || 'Anonymous'}`);
          setLastDonationCheck(Date.now());
        }
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, [authChecked, lastDonationCheck]);

  useEffect(() => {
    if (newDonationAlert) { const t = setTimeout(() => setNewDonationAlert(null), 5000); return () => clearTimeout(t); }
  }, [newDonationAlert]);

  // Fetch all data
  const fetchAll = async () => {
    setDataLoading(true);
    try {
      const [s, c, u, don, dep, wd, compl, cont] = await Promise.all([
        safeGet(() => adminApi.getStats(), { stats: {} }),
        safeGet(() => adminApi.getCampaigns(), { campaigns: [] }),
        safeGet(() => adminApi.getUsers(), { users: [] }),
        safeGet(() => adminApi.getDonations(), { donations: [] }),
        safeGet(() => adminApi.getDepositRequests?.(), { requests: [] }),
        safeGet(() => adminApi.getWithdrawalRequests?.(), { withdrawals: [] }),
        safeGet(() => adminApi.getCompletionRequests?.(), { campaigns: [] }),
        safeGet(() => adminApi.getContent(), { content: null }),
      ]);
      const ps = { ...(s.stats || {}) };
      ['total_raised', 'total_campaigns', 'pending_campaigns', 'total_users'].forEach(k => { if (ps[k] !== undefined) ps[k] = toNum(ps[k]); });
      setStats(ps);
      setCampaigns((c.campaigns || []).map(x => ({ ...x, goal: toNum(x.goal), raised: toNum(x.raised) })));
      setUsers((u.users || []).map(x => ({ ...x, wallet_balance: toNum(x.wallet_balance) })));
      setDonations((don.donations || []).map(x => ({ ...x, amount: toNum(x.amount) })));
      setDepositRequests((dep.requests || []).map(x => ({ ...x, amount: toNum(x.amount) })));
      setWithdrawalRequests((wd.withdrawals || []).map(x => ({ ...x, amount: toNum(x.amount) })));
      setCompletionRequests(compl.campaigns || []);
      if (cont?.content) setContent(prev => ({ ...prev, ...cont.content, social_links: { ...prev.social_links, ...(cont.content.social_links || {}) } }));
    } catch (err) { console.error(err); showToast('Failed to load data', true); }
    finally { setDataLoading(false); }
  };

  const fetchExtras = async () => {
    const [payRes, feeRes, notifRes, auditRes, sett] = await Promise.all([
      safeGet(() => adminApi.getPayouts?.(), { payouts: [] }),
      safeGet(() => adminApi.getFeeSettings?.(), { percentage: 0, fixed_amount: 0, min_fee: 0, withdrawal_fee: 0, minimum_withdrawal: 10 }),
      safeGet(() => adminApi.getNotificationHistory?.(), { notifications: [] }),
      safeGet(() => adminApi.getAuditLogs?.(), { logs: [] }),
      safeGet(() => adminApi.getSettings(), { settings: null }),
    ]);
    setPayouts(payRes.payouts || []);
    setFeeSettings(feeRes);
    setNotifHistory(notifRes.notifications || []);
    setAuditLogs(auditRes.logs || []);
    if (sett?.settings?.keys) {
      const k = sett.settings.keys;
      setMaintenanceMode({ enabled: k.maintenance_mode === 'true', message: k.maintenance_message || '' });
      setRecaptchaEnabled(k.recaptcha_enabled === 'true');
      setIntegrationKeys(prev => ({ ...prev, ...k }));
    }
    try {
      const verRes = await adminApi.getVerificationSetting?.();
      if (verRes) setVerificationEnabled(verRes.enabled !== false);
    } catch {}
  };

  useEffect(() => { if (authChecked) { fetchAll(); fetchExtras(); } }, [authChecked]);

  // Handlers
  const handleToggleMaintenance = async val => {
    setTogglingMaintenance(true);
    try { await adminApi.saveSettings({ keys: { maintenance_mode: val ? 'true' : 'false' } }); setMaintenanceMode(p => ({ ...p, enabled: val })); showToast(`Maintenance ${val ? 'enabled' : 'disabled'}`); }
    catch (err) { showToast(err.message, true); } finally { setTogglingMaintenance(false); }
  };

  const handleToggleVerification = async val => {
    setTogglingVerification(true);
    try { await adminApi.updateVerificationSetting?.({ enabled: val }); setVerificationEnabled(val); showToast(`Email verification ${val ? 'enabled' : 'disabled'}`); }
    catch (err) { showToast(err.message, true); } finally { setTogglingVerification(false); }
  };

  const handleToggleRecaptcha = async val => {
    setTogglingRecaptcha(true);
    try { await adminApi.saveSettings({ keys: { recaptcha_enabled: val ? 'true' : 'false' } }); setRecaptchaEnabled(val); showToast(`reCAPTCHA ${val ? 'enabled' : 'disabled'}`); }
    catch (err) { showToast(err.message, true); } finally { setTogglingRecaptcha(false); }
  };

  const handleApproveCampaign = async id => { try { await adminApi.updateCampaign(id, { status: 'approved' }); showToast('Campaign approved'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectCampaign = async id => { try { await adminApi.updateCampaign(id, { status: 'rejected' }); showToast('Campaign rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleDeleteCampaign = async id => { if (!window.confirm('Delete permanently?')) return; try { await campaignApi.delete(id); showToast('Deleted'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleToggleUser = async id => { try { await adminApi.toggleUser(id); showToast('User updated'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleVerifyUser = async id => { try { await adminApi.verifyUser?.(id); showToast('User verified'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleUnverifyUser = async id => { try { await adminApi.unverifyUser?.(id); showToast('User unverified'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleDeleteUser = async id => { try { await adminApi.deleteUser?.(id); showToast('User deleted'); fetchAll(); } catch (err) { throw err; } };
  const handleApproveDeposit = async (id, amount) => { try { await adminApi.updateDepositRequest?.(id, { status: 'approved' }); showToast('Deposit approved'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectDeposit = async id => { try { await adminApi.updateDepositRequest?.(id, { status: 'rejected' }); showToast('Deposit rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleProvideInstructions = async (id, inst) => { try { await adminApi.updateDepositRequest?.(id, { admin_instructions: inst, status: 'instructions_sent' }); showToast('Instructions sent'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleApproveWithdrawal = async id => { try { await adminApi.approveWithdrawal(id); showToast('Withdrawal approved'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectWithdrawal = async id => { const r = prompt('Reason:'); if (!r) return; try { await adminApi.rejectWithdrawal(id, r); showToast('Withdrawal rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleReleaseEscrow = async id => { try { await adminApi.releaseCampaignEscrow(id); showToast('Escrow released'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRefundEscrow = async id => { try { await adminApi.refundCampaignEscrow(id); showToast('Escrow refunded'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleSaveContent = async c => { try { await adminApi.saveContent(c); setContent(c); showToast('Content updated'); } catch (err) { showToast(err.message, true); } };
  const handleSaveSettings = async () => { try { await adminApi.saveSettings({ theme: themeSettings, keys: integrationKeys }); showToast('Settings saved'); } catch (err) { showToast(err.message, true); } };
  const handleSaveFees = async data => { try { await adminApi.updateFeeSettings?.(data); setFeeSettings(data); showToast('Fee settings saved'); } catch (err) { showToast(err.message, true); } };
  const handleMarkPayoutPaid = async id => { try { await adminApi.markPayoutAsPaid?.(id); showToast('Marked as paid'); fetchExtras(); } catch (err) { showToast(err.message, true); } };
  const handleSaveNotifSettings = async data => { try { await adminApi.updateNotificationSettings?.(data); setPushNotifEnabled(data.enabled); showToast('Saved'); } catch (err) { showToast(err.message, true); } };
  const handleSendPushNotif = async data => { try { await adminApi.sendPushNotification?.(data); showToast('Notification sent'); fetchExtras(); } catch (err) { showToast(err.message, true); } };
  const handleChangePassword = async data => { await adminApi.changePassword?.(data); };
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) { showToast('Fill all required fields', true); return; }
    if (newUser.password.length < 6) { showToast('Password must be at least 6 characters', true); return; }
    setAddingUser(true);
    try {
      await adminApi.addUser({ name: newUser.name, email: newUser.email, password: newUser.password, role: newUser.role, is_verified: newUser.is_verified });
      showToast(`${newUser.name} added successfully`);
      setShowAddUserModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'donor', is_verified: true });
      fetchAll();
    } catch (err) { showToast(err.message || 'Failed to add user', true); } finally { setAddingUser(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (sessionLoading || !authChecked) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading admin panel…</div>;

  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'approved').length;
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending' || c.status === 'review').length;
  const donorsCount = users.filter(u => u.role === 'donor').length;
  const creatorsCount = users.filter(u => u.role === 'creator').length;
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending').length;
  const pendingCompletions = completionRequests.length;

  // Quick actions
  const quickActions = [
    { id: 'campaigns', label: 'Campaigns', icon: <Target size={18} />, color: '#e8531e' },
    { id: 'users', label: 'Users', icon: <Users size={18} />, color: '#378ADD' },
    { id: 'deposits', label: 'Deposits', icon: <CreditCard size={18} />, color: '#1D9E75' },
    { id: 'withdrawals', label: 'Withdrawals', icon: <Banknote size={18} />, color: '#f59e0b' },
    { id: 'payouts', label: 'Payouts', icon: <Receipt size={18} />, color: '#8b5cf6' },
    { id: 'completions', label: 'Complete', icon: <CheckCircle size={18} />, color: '#10b981' },
    { id: 'fees', label: 'Fees', icon: <DollarSign size={18} />, color: '#ef4444' },
    { id: 'notifications', label: 'Push', icon: <Bell size={18} />, color: '#e8531e' },
    { id: 'audit-logs', label: 'Audit', icon: <History size={18} />, color: '#6b7280' },
    { id: 'email_templates', label: 'Email', icon: <MailIcon size={18} />, color: '#378ADD' },
    { id: 'massmail', label: 'Mass Mail', icon: <Send size={18} />, color: '#1D9E75' },
    { id: 'content', label: 'Content', icon: <FileText size={18} />, color: '#8b5cf6' },
    { id: 'maintenance', label: 'Maintenance', icon: <Settings size={18} />, color: '#f59e0b' },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, color: '#1a1a2e' },
  ];

  // Mobile bottom navigation items
  const mobileNavItems = [
    { id: 'overview', label: 'Home', icon: <Home size={20} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Target size={20} />, badge: pendingCampaigns },
    { id: 'deposits', label: 'Deposits', icon: <CreditCard size={20} /> },
    { id: 'withdrawals', label: 'Withdraw', icon: <Banknote size={20} />, badge: pendingWithdrawals },
    { id: 'notifications', label: 'Alerts', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Sidebar navigation
  const sidebarNavItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Target size={18} />, badge: pendingCampaigns },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'donations', label: 'Donations', icon: <DollarSign size={18} /> },
    { id: 'deposits', label: 'Deposits', icon: <CreditCard size={18} /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <Banknote size={18} />, badge: pendingWithdrawals },
    { id: 'payouts', label: 'Payouts', icon: <Receipt size={18} /> },
    { id: 'fees', label: 'Fee Settings', icon: <DollarSign size={18} /> },
    { id: 'completions', label: 'Completions', icon: <CheckCircle size={18} />, badge: pendingCompletions },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'audit-logs', label: 'Audit Logs', icon: <History size={18} /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Settings size={18} /> },
    { id: 'email_templates', label: 'Email Templates', icon: <MailIcon size={18} /> },
    { id: 'massmail', label: 'Mass Mail', icon: <Send size={18} /> },
    { id: 'content', label: 'Content', icon: <FileText size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="shell">
      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      
      {/* Mobile Sidebar Menu */}
      <div className={`mobile-sidebar-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <div className="logo-mark">
            <div className="logo-icon"><Heart size={20} color="#fff" /></div>
            <div><div className="logo-text">HopeBridge</div><div className="logo-sub">Admin</div></div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        <div className="mobile-sidebar-user">
          <div className="admin-av">SA</div>
          <div><div className="admin-name-s">System Admin</div><div className="admin-role">Super Administrator</div></div>
        </div>
        <div className="mobile-sidebar-nav">
          {sidebarNavItems.map(item => (
            <button key={item.id} className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}>
              {item.icon} {item.label} {item.badge > 0 && <span className="nb">{item.badge}</span>}
            </button>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', margin: '12px 20px' }} />
          <button className="mobile-nav-link" onClick={() => setDarkMode(!darkMode)}>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>
          <button className="mobile-nav-link" style={{ color: 'var(--red)' }} onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon"><Heart size={20} color="#fff" /></div>
            <div><div className="logo-text">HopeBridge</div><div className="logo-sub">Admin Console</div></div>
          </div>
        </div>
        <div className="sb-admin">
          <div className="admin-av">SA</div>
          <div><div className="admin-name-s">System Admin</div><div className="admin-role">Super Administrator</div></div>
        </div>
        <nav className="sb-nav">
          <div className="nav-sec">MAIN</div>
          {sidebarNavItems.slice(0, 3).map(item => (
            <button key={item.id} className={`nl ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label} {item.badge > 0 && <span className={`nb ${item.id === 'withdrawals' ? 'am' : ''}`}>{item.badge}</span>}
            </button>
          ))}
          <div className="nav-sec">FINANCE</div>
          {sidebarNavItems.slice(3, 7).map(item => (
            <button key={item.id} className={`nl ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label} {item.badge > 0 && <span className={`nb ${item.id === 'withdrawals' ? 'am' : ''}`}>{item.badge}</span>}
            </button>
          ))}
          <div className="nav-sec">OPERATIONS</div>
          {sidebarNavItems.slice(7, 10).map(item => (
            <button key={item.id} className={`nl ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label} {item.badge > 0 && <span className={`nb ${item.id === 'withdrawals' ? 'am' : ''}`}>{item.badge}</span>}
            </button>
          ))}
          <div className="nav-sec">ADMIN</div>
          {sidebarNavItems.slice(10).map(item => (
            <button key={item.id} className={`nl ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label} {item.badge > 0 && <span className={`nb ${item.id === 'withdrawals' ? 'am' : ''}`}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="sb-footer">
          <button className="nl" onClick={() => setDarkMode(!darkMode)}>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        <div className="topbar">
          <div className="tb-title">{activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
          <div className="tb-actions">
            <NotificationBell showToast={showToast} />
            <button className="tb-btn" onClick={() => setDarkMode(!darkMode)}>{darkMode ? '🌙' : '☀️'}</button>
            <div className="tb-btn"><div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, fontSize: 12, color: '#fff' }}>SA</div></div>
          </div>
        </div>

        <div className="mob-top">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button>
          <div className="mob-logo">HopeBridge</div>
          <div className="tb-actions">
            <NotificationBell showToast={showToast} />
            <button className="tb-btn" onClick={() => setDarkMode(!darkMode)}>{darkMode ? '🌙' : '☀️'}</button>
          </div>
        </div>

        <div className="page">
          {dataLoading && <div style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>Loading data…</div>}

          {/* ========== OVERVIEW TAB ========== */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            {/* Hero Section */}
            <div className="ov-hero" style={{
              background: 'linear-gradient(130deg, var(--green-dd) 0%, var(--green) 55%, var(--accent) 100%)',
              borderRadius: 'var(--r-xl)', padding: '28px 32px', marginBottom: '24px', color: '#fff'
            }}>
              <div className="hero-row" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div className="hero-g" style={{ fontSize: 13, opacity: 0.65 }}>Good morning, Administrator</div>
                  <div className="hero-t" style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>HopeBridge<br /><em>Admin Console</em></div>
                  <div className="hero-s" style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>{pendingCampaigns} campaigns awaiting review</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Platform Status</div>
                  <div style={{ fontSize: 14, fontWeight: 700, background: maintenanceMode.enabled ? 'rgba(239,159,39,0.4)' : 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {maintenanceMode.enabled ? <><Settings size={12} /> Maintenance</> : <><CheckCircle size={12} /> Live</>}
                  </div>
                </div>
              </div>
              <div className="hero-stats" style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
                <div className="hst" style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 'var(--r-md)', padding: '12px 20px' }}>
                  <div className="hst-v" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{donorsCount}</div>
                  <div className="hst-l" style={{ fontSize: 11, opacity: 0.6 }}>Donors</div>
                </div>
                <div className="hst"><div className="hst-v">{creatorsCount}</div><div className="hst-l">Creators</div></div>
                <div className="hst"><div className="hst-v">${(totalRaised / 1000).toFixed(0)}k</div><div className="hst-l">Raised</div></div>
                <div className="hst"><div className="hst-v">{campaigns.length}</div><div className="hst-l">Campaigns</div></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="sc" onClick={() => setActiveTab('users')}><div className="si si-g"><Users size={18} /></div><div className="sv">{users.length}</div><div className="sl">Total Users</div><div className="sd">Click to manage →</div></div>
              <div className="sc" onClick={() => setActiveTab('campaigns')}><div className="si si-b"><Target size={18} /></div><div className="sv">{activeCampaigns}</div><div className="sl">Active Campaigns</div><div className="sd">Click to view →</div></div>
              <div className="sc" onClick={() => setActiveTab('donations')}><div className="si si-a"><DollarSign size={18} /></div><div className="sv">${(totalRaised / 1000).toFixed(0)}k</div><div className="sl">Total Raised</div><div className="sd">Click to view →</div></div>
              <div className="sc" onClick={() => setActiveTab('completions')}><div className="si si-r"><Clock size={18} /></div><div className="sv">{pendingCompletions}</div><div className="sl">Pending Completions</div><div className="sd">Click to review →</div></div>
            </div>

            {/* Quick Actions */}
            <div className="sh"><div className="sht"><Zap size={18} /> Quick Actions</div></div>
            <div className="qg">
              {quickActions.map(action => (
                <button key={action.id} className="qb" onClick={() => setActiveTab(action.id)}>
                  <div className="qi" style={{ background: `${action.color}15`, color: action.color }}>{action.icon}</div>
                  <span className="ql">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Toggles */}
            <div className="sh"><div className="sht"><Settings size={18} /> Quick Toggles</div></div>
            <div className="qt-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Maintenance Mode', sub: maintenanceMode.enabled ? 'Enabled' : 'Disabled', on: maintenanceMode.enabled, onChange: handleToggleMaintenance, danger: true },
                { label: 'Email Verification', sub: verificationEnabled ? 'Required' : 'Skipped', on: verificationEnabled, onChange: handleToggleVerification },
                { label: 'reCAPTCHA', sub: recaptchaEnabled ? 'Active' : 'Inactive', on: recaptchaEnabled, onChange: handleToggleRecaptcha },
                { label: 'Dark Mode', sub: darkMode ? 'Dark' : 'Light', on: darkMode, onChange: setDarkMode },
              ].map(({ label, sub, on, onChange, danger }) => (
                <div key={label} className="qt-card" style={{ background: 'var(--surface)', borderRadius: 'var(--r-lg)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div><div className="qt-label" style={{ fontWeight: 600 }}>{label}</div><div className="qt-sub" style={{ fontSize: 11, color: 'var(--txt-3)' }}>{sub}</div></div>
                  <Toggle checked={on} onChange={onChange} danger={danger} />
                </div>
              ))}
            </div>

            {/* Pending Approvals & Queues */}
            <div className="three-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div className="card">
                <div className="card-h"><div className="card-t"><Target size={18} /> Pending Approvals</div><button className="card-a" onClick={() => setActiveTab('campaigns')}>View all <ArrowRight size={14} /></button></div>
                <div className="card-b">
                  {campaigns.filter(c => c.status === 'pending').slice(0, 3).map(c => (
                    <div key={c.id} className="cr" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <div className="ci"><div className="cn">{c.title}</div><div className="cm">Goal: ${c.goal.toLocaleString()} · {c.creator_name}</div><div className="pb"><div className="pf" style={{ width: `${Math.min((c.raised / c.goal) * 100, 100)}%` }} /></div></div>
                      <span className="badge bp">pending</span>
                      <button className="db dba" onClick={() => handleApproveCampaign(c.id)}><CheckCircle size={12} /> Approve</button>
                    </div>
                  ))}
                  {!pendingCampaigns && <div style={{ color: 'var(--txt-3)', fontSize: 13, textAlign: 'center', padding: 20 }}>No pending campaigns</div>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card"><div className="card-h"><div className="card-t"><CheckCircle size={18} /> Completions</div><button className="card-a" onClick={() => setActiveTab('completions')}>Manage <ArrowRight size={14} /></button></div>
                  <div className="card-b">{completionRequests.slice(0, 2).map(req => (
                    <div key={req.id} className="di" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="uav ava" style={{ width: 32, height: 32, background: 'var(--amber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{req.title?.charAt(0) || 'C'}</div>
                      <div className="di-info"><div className="di-user">{req.title}</div><div className="di-amt"><Calendar size={10} /> {new Date(req.completion_requested_at).toLocaleDateString()}</div></div>
                      <button className="db dba" onClick={() => setActiveTab('completions')}>Review</button>
                    </div>
                  ))}</div>
                </div>
                <div className="card"><div className="card-h"><div className="card-t"><Clock size={18} /> Withdrawal Queue</div><button className="card-a" onClick={() => setActiveTab('withdrawals')}>Manage <ArrowRight size={14} /></button></div>
                  <div className="card-b">{withdrawalRequests.filter(w => w.status === 'pending').slice(0, 2).map(req => (
                    <div key={req.id} className="di" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="uav ava" style={{ width: 32, height: 32, background: 'var(--amber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{req.name?.[0] || 'U'}</div>
                      <div className="di-info"><div className="di-user">{req.name}</div><div className="di-amt"><DollarSign size={10} /> ${req.amount.toFixed(2)}</div></div>
                      <div className="di-acts"><button className="db dba" onClick={() => handleApproveWithdrawal(req.id)}><CheckCircle size={12} /></button><button className="db dbr" onClick={() => handleRejectWithdrawal(req.id)}><X size={12} /></button></div>
                    </div>
                  ))}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== CAMPAIGNS TAB ========== */}
          <div className={`ps ${activeTab === 'campaigns' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Target size={18} /> Campaign Management</div><button className="btn btn-g" onClick={() => alert('Create campaign feature coming soon')}><Plus size={16} /> New Campaign</button></div>
            <div className="card"><div className="card-b" style={{ padding: 0, overflowX: 'auto' }}>
              <table className="ut" style={{ minWidth: 700 }}>
                <thead><tr><th>Campaign</th><th>Goal</th><th>Raised</th><th>Progress</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{campaigns.map(c => {
                  const percent = Math.min((c.raised / c.goal) * 100, 100);
                  return (<tr key={c.id}>
                    <td><strong>{c.title}</strong><br /><small style={{ color: 'var(--txt-3)' }}>{c.creator_name}</small></td>
                    <td>${c.goal.toLocaleString()}</td>
                    <td>${c.raised.toLocaleString()}</td>
                    <td><div className="pb" style={{ width: 80, height: 4, background: 'var(--bg)', borderRadius: 2 }}><div className="pf" style={{ width: `${percent}%`, height: 4, background: 'var(--green)', borderRadius: 2 }} /></div>{Math.round(percent)}%</td>
                    <td><span className={`badge ${c.status === 'approved' ? 'ba' : c.status === 'pending' ? 'bp' : 'br'}`}>{c.status}</span></td>
                    <td>{c.status === 'pending' && <><button className="db dba" onClick={() => handleApproveCampaign(c.id)}><CheckCircle size={12} /> Approve</button><button className="db dbr" onClick={() => handleRejectCampaign(c.id)}><X size={12} /> Reject</button></>}
                      <button className="db dbr" onClick={() => handleDeleteCampaign(c.id)}><Trash2 size={12} /> Delete</button></td>
                  </tr>);
                })}</tbody>
              </table>
            </div></div>
          </div>

          {/* ========== USERS TAB ========== */}
          <div className={`ps ${activeTab === 'users' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Users size={18} /> User Management</div><button className="btn btn-g" onClick={() => setShowAddUserModal(true)}><UserPlus size={16} /> Add User</button></div>
            <div className="card"><div className="card-b" style={{ padding: 0, overflowX: 'auto' }}>
              <table className="ut" style={{ minWidth: 700 }}>
                <thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Wallet</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{users.map(u => (
                  <tr key={u.id}>
                    <td><div className="uc" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="uav avg" style={{ width: 32, height: 32, background: 'var(--grad1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{u.name?.charAt(0)}</div><div><strong>{u.name}</strong><br /><small>{u.email}</small></div></div></td>
                    <td><span className="badge br">{u.role}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td><strong>${(u.wallet_balance || 0).toFixed(2)}</strong></td>
                    <td><span className={`badge ${u.is_active ? 'ba' : 'bx'}`}>{u.is_active ? 'Active' : 'Suspended'}</span></td>
                    <td><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}><button className="db dbv" onClick={() => handleToggleUser(u.id)}>{u.is_active ? <Lock size={12} /> : <Unlock size={12} />} {u.is_active ? 'Suspend' : 'Restore'}</button>{!u.is_verified && u.role !== 'admin' && <button className="db dba" onClick={() => handleVerifyUser(u.id)}><CheckCircle size={12} /> Verify</button>}{u.role !== 'admin' && <button className="db dbr" onClick={() => setDeleteUserModal({ open: true, userId: u.id, userName: u.name })}><Trash2 size={12} /> Delete</button>}</div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div></div>
          </div>

          {/* ========== DONATIONS TAB ========== */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><DollarSign size={18} /> All Donations</div></div>
            <div className="card"><div className="card-b" style={{ padding: 0, overflowX: 'auto' }}>
              <table className="ut" style={{ minWidth: 600 }}>
                <thead><tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Monthly</th><th>Date</th></tr></thead>
                <tbody>{donations.map(d => (<tr key={d.id}><td>{d.donor_name || 'Anonymous'}</td><td>{d.campaign_title}</td><td><strong>${d.amount.toLocaleString()}</strong></td><td>{d.is_monthly ? '✅' : '—'}</td><td>{new Date(d.created_at).toLocaleDateString()}</td></tr>))}</tbody>
              </table>
            </div></div>
          </div>

          {/* ========== DEPOSITS TAB ========== */}
          <div className={`ps ${activeTab === 'deposits' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><CreditCard size={18} /> Deposit Requests</div></div>
            <div className="card"><div className="card-b">
              {depositRequests.map(req => (
                <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
                  <div><strong>{req.name}</strong> ({req.email})</div>
                  <div>Amount: <strong>${toNum(req.amount).toFixed(2)}</strong> · Status: <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span></div>
                  {req.status === 'pending' && <div style={{ marginTop: 12 }}><button className="db dba" onClick={() => handleApproveDeposit(req.id, req.amount)}><CheckCircle size={12} /> Approve</button><button className="db dbr" onClick={() => handleRejectDeposit(req.id)}><X size={12} /> Reject</button></div>}
                </div>
              ))}
              {depositRequests.length === 0 && <div style={{ textAlign: 'center', padding: 20, color: 'var(--txt-3)' }}>No deposit requests</div>}
            </div></div>
          </div>

          {/* ========== WITHDRAWALS TAB ========== */}
          <div className={`ps ${activeTab === 'withdrawals' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Banknote size={18} /> Withdrawal Requests</div></div>
            <div className="card"><div className="card-b">
              {withdrawalRequests.map(req => (
                <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
                  <div><strong>{req.name}</strong> ({req.email})</div>
                  <div>Amount: <strong>${toNum(req.amount).toFixed(2)}</strong> · Method: {req.payment_method}</div>
                  <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span>
                  {req.status === 'pending' && <div style={{ marginTop: 12 }}><button className="db dba" onClick={() => handleApproveWithdrawal(req.id)}><CheckCircle size={12} /> Approve</button><button className="db dbr" onClick={() => handleRejectWithdrawal(req.id)}><X size={12} /> Reject</button></div>}
                </div>
              ))}
              {withdrawalRequests.length === 0 && <div style={{ textAlign: 'center', padding: 20, color: 'var(--txt-3)' }}>No withdrawal requests</div>}
            </div></div>
          </div>

          {/* ========== OTHER TABS (simplified placeholders) ========== */}
          <div className={`ps ${activeTab === 'payouts' ? 'active' : ''}`}><div className="card"><div className="card-b">Payouts management coming soon</div></div></div>
          <div className={`ps ${activeTab === 'fees' ? 'active' : ''}`}><div className="card"><div className="card-b">Fee settings coming soon</div></div></div>
          <div className={`ps ${activeTab === 'completions' ? 'active' : ''}`}><div className="card"><div className="card-b">Campaign completions coming soon</div></div></div>
          <div className={`ps ${activeTab === 'notifications' ? 'active' : ''}`}><div className="card"><div className="card-b">Push notifications coming soon</div></div></div>
          <div className={`ps ${activeTab === 'audit-logs' ? 'active' : ''}`}><div className="card"><div className="card-b">Audit logs coming soon</div></div></div>
          <div className={`ps ${activeTab === 'maintenance' ? 'active' : ''}`}><div className="card"><div className="card-b">Maintenance settings coming soon</div></div></div>
          <div className={`ps ${activeTab === 'email_templates' ? 'active' : ''}`}><div className="card"><div className="card-b">Email templates coming soon</div></div></div>
          <div className={`ps ${activeTab === 'massmail' ? 'active' : ''}`}><div className="card"><div className="card-b">Mass mail coming soon</div></div></div>
          <div className={`ps ${activeTab === 'content' ? 'active' : ''}`}><div className="card"><div className="card-b">Content editor coming soon</div></div></div>
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}><div className="card"><div className="card-b">System settings coming soon</div></div></div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          {mobileNavItems.map(item => (
            <button key={item.id} className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              {item.icon}
              <span>{item.label}</span>
              {item.badge > 0 && <span className="mobile-nav-badge">{item.badge > 9 ? '9+' : item.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} onSave={handleChangePassword} showToast={showToast} />
      <DeleteUserModal isOpen={deleteUserModal.open} onClose={() => setDeleteUserModal({ open: false, userId: null, userName: '' })} onConfirm={() => handleDeleteUser(deleteUserModal.userId)} userName={deleteUserModal.userName} showToast={showToast} />
      <AddUserModal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} onSubmit={handleAddUserSubmit} userData={newUser} setUserData={setNewUser} loading={addingUser} />
    </div>
  );
}