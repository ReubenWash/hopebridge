import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { walletApi, campaignApi, donationApi } from '../services/api';
import DonationForm from '../components/DonationForm';
import ProfileSettings from '../components/ProfileSettings';
import {
  Heart, LayoutDashboard, DollarSign, Wallet, Settings, LogOut,
  Bell, TrendingUp, Users, CreditCard, Plus, CheckCircle, Clock,
  AlertCircle, FileText, ArrowRight, ChevronRight, Star, Zap,
  Shield, Award, Calendar, MessageCircle, Send, Eye, EyeOff,
  MapPin, Phone, Mail, User, Building, Banknote, History, Download,
  RefreshCw, X, Menu, Gift, PiggyBank, Landmark, Smartphone, Upload,
  Image, Copy, ExternalLink, Sun, Moon, Target
} from 'lucide-react';

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
  instructions_sent: 'Instructions Sent',
  awaiting_proof: 'Proof Uploaded',
  approved: 'Approved',
  rejected: 'Rejected',
}[s] || s);

// ---------- Professional Escrow Card Component ----------
function DepositStatusCard({ deposit, onUploadProof, proofFile, setProofFile, proofUploading, showToast }) {
  const getStep = () => {
    if (deposit.status === 'pending') return 1;
    if (deposit.status === 'instructions_sent') return 2;
    if (deposit.status === 'awaiting_proof') return 3;
    if (deposit.status === 'approved') return 4;
    if (deposit.status === 'rejected') return 5;
    return 1;
  };
  const currentStep = getStep();

  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (deposit.created_at) {
      const expiry = new Date(deposit.created_at).getTime() + 30 * 60 * 1000; // 30 min
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [deposit.created_at]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setProofFile(file);
  };

  return (
    <div className="escrow-card">
      <div className="escrow-header">
        <div className="escrow-title">
          <Wallet size={22} />
          <h3>Deposit Request #{deposit.id}</h3>
        </div>
        <span className={`escrow-status ${deposit.status}`}>
          {statusLabel(deposit.status)}
        </span>
      </div>

      <div className="escrow-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span>Request</span>
        </div>
        <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`} />
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span>Instructions</span>
        </div>
        <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`} />
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span>Upload Proof</span>
        </div>
        <div className={`step-line ${currentStep >= 4 ? 'active' : ''}`} />
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-circle">4</div>
          <span>Verify</span>
        </div>
      </div>

      <div className="escrow-details">
        <div className="detail-row">
          <span>Amount requested</span>
          <strong>${deposit.amount.toFixed(2)}</strong>
        </div>

        {deposit.admin_instructions && (
          <div className="instructions-box">
            <strong>📄 Payment Instructions</strong>
            <p>{deposit.admin_instructions}</p>
          </div>
        )}

        {(deposit.status === 'instructions_sent' || deposit.status === 'pending') && !deposit.proof_image_url && (
          <div className="upload-section">
            <label className="upload-btn">
              <Upload size={16} /> Select Proof
              <input type="file" accept="image/*" onChange={handleFileSelect} hidden />
            </label>
            {proofFile && (
              <button className="btn-primary" onClick={onUploadProof} disabled={proofUploading}>
                {proofUploading ? 'Uploading...' : 'Submit Proof'}
              </button>
            )}
          </div>
        )}

        {deposit.proof_image_url && (
          <div className="proof-preview">
            <img src={deposit.proof_image_url} alt="Proof" />
          </div>
        )}

        {deposit.status === 'awaiting_proof' && (
          <div className="info-message">
            <Clock size={16} /> Proof received – admin will verify soon.
          </div>
        )}

        {deposit.status === 'approved' && (
          <div className="success-message">
            <CheckCircle size={16} /> Deposit approved – wallet credited.
          </div>
        )}

        {deposit.status === 'rejected' && (
          <div className="error-message">
            <X size={16} /> Deposit rejected. Contact support for details.
          </div>
        )}
      </div>

      {deposit.status !== 'approved' && deposit.status !== 'rejected' && (
        <div className="escrow-timer">
          <Clock size={14} />
          Session expires in: <span>{timeLeft !== null ? formatTime(timeLeft) : 'calculating...'}</span>
          <span className="helper-text">This page updates automatically when admin provides instructions.</span>
        </div>
      )}
    </div>
  );
}

// ---------- Styles (injectStyles) ----------
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', 'donor-dashboard-styles');
  styleEl.textContent = `
    /* RESET & BASE */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #F8F9FA;
      color: #212529;
      line-height: 1.5;
    }
    h1, h2, h3, h4, h5, h6 { font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700; }
    
    /* CSS VARIABLES */
    :root {
      --primary: #e8531e;
      --primary-dark: #c4400f;
      --primary-light: #f47c50;
      --secondary: #27a96c;
      --dark: #1a1a2e;
      --text: #444;
      --text-light: #777;
      --bg-light: #f8f9fa;
      --green: #1D9E75; --green-d: #0F6E56; --green-l: #E1F5EE;
      --red: #E24B4A; --red-l: #FCEBEB;
      --amber: #EF9F27; --amber-l: #FAEEDA;
      --blue: #378ADD; --blue-l: #E6F1FB;
      --bg: #F8F9FA;
      --surface: #FFFFFF;
      --surface-2: #F1F3F5;
      --border: rgba(0,0,0,0.08);
      --border-2: rgba(0,0,0,0.12);
      --txt: #212529;
      --txt-2: #6C757D;
      --txt-3: #ADB5BD;
      --sidebar-w: 260px;
      --topbar-h: 64px;
      --bottom-nav: 68px;
      --r-sm: 8px;
      --r-md: 12px;
      --r-lg: 16px;
      --r-xl: 24px;
      --sh-sm: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02);
      --sh-md: 0 4px 12px rgba(0,0,0,0.08);
      --sh-lg: 0 12px 32px rgba(0,0,0,0.12);
      --tr: 0.2s ease;
    }
    body.dark-mode {
      --bg: #121212;
      --surface: #1E1E1E;
      --surface-2: #2A2A2A;
      --border: rgba(255,255,255,0.1);
      --txt: #EEEEEE;
      --txt-2: #AAAAAA;
      --txt-3: #777777;
    }
    
    /* SHELL */
    .shell { display: flex; min-height: 100vh; background: var(--bg); }
    .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 200; overflow-y: auto; }
    .sb-logo { padding: 22px 20px 14px; border-bottom: 1px solid var(--border); }
    .logo-mark { display: flex; align-items: center; gap: 10px; }
    .logo-icon { width: 36px; height: 36px; border-radius: var(--r-sm); background: var(--primary); display: flex; align-items: center; justify-content: center; }
    .logo-text { font-family: 'Raleway', sans-serif; font-size: 1.3rem; font-weight: 900; color: var(--primary); }
    .logo-sub { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--txt-3); }
    .sb-user { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
    .user-av { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); display: flex; align-items: center; justify-content: center; font-weight: 600; color: #fff; }
    .user-name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px; color: var(--txt); }
    .verified-badge { color: var(--blue); }
    .user-badge { font-size: 10px; color: var(--txt-3); background: var(--green-l); padding: 2px 8px; border-radius: 20px; display: inline-block; margin-top: 4px; }
    .sb-nav { flex: 1; padding: 10px; }
    .nav-sec { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--txt-3); padding: 10px 10px 4px; }
    .nl { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--r-sm); cursor: pointer; border: none; background: none; width: 100%; text-align: left; color: var(--txt-2); font-size: 13px; font-weight: 600; transition: all var(--tr); }
    .nl:hover { background: var(--bg); color: var(--txt); }
    .nl.active { background: rgba(232,83,30,0.1); color: var(--primary); }
    .nl svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.8; fill: none; }
    .sb-footer { padding: 12px 10px; border-top: 1px solid var(--border); }
    .main { flex: 1; margin-left: var(--sidebar-w); min-height: 100vh; background: var(--bg); }
    .topbar { height: var(--topbar-h); background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 28px; gap: 16px; position: sticky; top: 0; z-index: 100; }
    .tb-title { font-family: 'Raleway', sans-serif; font-size: 1.5rem; font-weight: 700; flex: 1; color: var(--txt); }
    .tb-actions { display: flex; gap: 10px; }
    .tb-btn { width: 38px; height: 38px; border-radius: var(--r-sm); background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: background var(--tr); }
    .tb-btn svg { width: 18px; height: 18px; stroke: var(--txt-2); }
    .notification-badge { position: absolute; top: -4px; right: -4px; background: var(--red); color: white; font-size: 9px; font-weight: 700; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--surface); }
    .page { padding: 28px; }
    .ps { display: none; }
    .ps.active { display: block; }
    
    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 28px; }
    .sc { background: var(--surface); border-radius: var(--r-lg); padding: 22px 18px; box-shadow: var(--sh-sm); cursor: pointer; transition: all 0.25s ease; border: 1px solid var(--border); }
    .sc:hover { transform: translateY(-3px); box-shadow: var(--sh-md); border-color: var(--primary); }
    .sc .si { width: 44px; height: 44px; border-radius: var(--r-md); background: rgba(232,83,30,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
    .sc .si svg { stroke: var(--primary); width: 22px; height: 22px; }
    .sv { font-family: 'Raleway', sans-serif; font-size: 32px; line-height: 1.1; font-weight: 800; margin-bottom: 4px; color: var(--txt); }
    .sl { font-size: 13px; color: var(--txt-2); font-weight: 500; }
    .sd { font-size: 11px; font-weight: 600; margin-top: 10px; color: var(--primary); opacity: 0.7; }
    
    /* Quick Actions Grid */
    .qg { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 28px; }
    .qb { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); padding: 16px 8px 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
    .qb:hover { transform: translateY(-2px); box-shadow: var(--sh-md); border-color: var(--primary); }
    .qi { width: 40px; height: 40px; border-radius: var(--r-sm); background: rgba(232,83,30,0.1); display: flex; align-items: center; justify-content: center; color: var(--primary); }
    .ql { font-size: 11px; font-weight: 600; color: var(--txt-2); text-align: center; line-height: 1.3; }
    .qb.qx .qi { background: var(--red-l); color: var(--red); }
    .qb.qx .ql { color: var(--red); }
    
    /* Cards */
    .card { background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--sh-sm); overflow: hidden; margin-bottom: 24px; border: 1px solid var(--border); }
    .card-h { display: flex; justify-content: space-between; padding: 18px 20px 14px; border-bottom: 1px solid var(--border); }
    .card-t { font-family: 'Raleway', sans-serif; font-size: 1rem; font-weight: 700; display: flex; align-items: center; gap: 8px; color: var(--txt); }
    .card-a { font-size: 12px; font-weight: 600; color: var(--primary); background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
    .card-b { padding: 16px 20px; }
    .badge { font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; }
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
    .ut th { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--txt-3); text-align: left; padding: 12px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
    .ut td { padding: 14px 12px; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--txt); }
    .db { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: opacity var(--tr); display: inline-flex; align-items: center; gap: 4px; }
    .dba { background: var(--green-l); color: var(--green-d); }
    .dbr { background: var(--red-l); color: var(--red); }
    .dbv { background: var(--blue-l); color: #185FA5; }
    .btn { padding: 10px 18px; border-radius: var(--r-sm); font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: 'Raleway', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.8rem; }
    .btn-g { background: var(--primary); color: #fff; }
    .btn-gh { background: var(--surface-2); border: 1px solid var(--border); color: var(--txt-2); }
    .fi { width: 100%; padding: 10px 12px; border: 1px solid var(--border-2); border-radius: var(--r-sm); margin-bottom: 16px; font-family: 'Open Sans', sans-serif; background: var(--surface); color: var(--txt); }
    .fl { font-size: 12px; font-weight: 700; color: var(--txt-2); letter-spacing: .05em; text-transform: uppercase; margin-bottom: 6px; display: block; }
    .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: rgba(17,19,24,0.93); color: #fff; padding: 10px 24px; border-radius: 40px; font-size: 13px; z-index: 9999; opacity: 0; transition: opacity .2s; pointer-events: none; }
    .toast.show { opacity: 1; }
    
    /* Modal - No Blur */
    .hb-modal-bd { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 9998; display: flex; align-items: center; justify-content: center; backdrop-filter: none; }
    .hb-modal { background: var(--surface); border-radius: var(--r-xl); padding: 28px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative; z-index: 9999; }
    .hb-modal-t { font-family: 'Raleway', sans-serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 6px; color: var(--txt); }
    .hb-modal-s { font-size: 13px; color: var(--txt-2); margin-bottom: 20px; }
    
    /* Notifications */
    .notification-panel { position: absolute; top: 50px; right: 28px; width: 320px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); box-shadow: var(--sh-lg); z-index: 1000; max-height: 400px; overflow-y: auto; }
    .notification-header { padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
    .notification-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background var(--tr); }
    .notification-item:hover { background: var(--surface-2); }
    .notification-item.unread { background: var(--green-l); }
    .notification-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); flex-shrink: 0; margin-top: 4px; }
    .notification-text { font-size: 13px; line-height: 1.4; color: var(--txt); }
    .notification-time { font-size: 11px; color: var(--txt-3); margin-top: 4px; }
    .notification-empty { padding: 32px; text-align: center; color: var(--txt-3); }
    
    /* Mobile */
    .mob-top, .bnav { display: none; }
    .mob-top { position: sticky; top: 0; z-index: 100; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 58px; }
    .mob-logo { font-family: 'Raleway', sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--primary); }
    .bnav { position: fixed; bottom: 0; left: 0; right: 0; height: var(--bottom-nav); background: var(--surface); border-top: 1px solid var(--border); z-index: 200; }
    .bnav-inner { display: flex; justify-content: space-around; align-items: center; height: 100%; }
    .bni { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: none; border: none; cursor: pointer; padding: 8px 0; color: var(--txt-3); font-size: 10px; font-weight: 600; }
    .bni.active { color: var(--primary); }
    
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; }
      .topbar { display: none; }
      .mob-top { display: flex; }
      .bnav { display: block; }
      .page { padding: 16px; padding-bottom: 90px; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
      .qg { grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .sc { padding: 16px; }
      .sv { font-size: 26px; }
      .card-b { padding: 12px 16px; }
      .notification-panel { width: calc(100vw - 32px); right: 16px; left: 16px; top: 60px; }
    }
    /* FIX: Hide mobile top bar on desktop */
.mob-top, .bnav { display: none !important; }
@media (min-width: 769px) {
  .mob-top, .bnav { display: none !important; }
}
@media (max-width: 768px) {
  .topbar { display: none !important; }
  .mob-top { display: flex !important; }
  .bnav { display: block !important; }
}

/* ========== PROFESSIONAL ESCROW CARD STYLES ========== */
.escrow-card {
  background: var(--surface);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border: 1px solid var(--border);
  overflow: hidden;
  margin-bottom: 24px;
}
.escrow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}
.escrow-title { display: flex; align-items: center; gap: 12px; }
.escrow-title h3 { margin: 0; font-size: 1.2rem; }
.escrow-status {
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
.escrow-status.pending { background: #fef3c7; color: #92400e; }
.escrow-status.instructions_sent { background: #dbeafe; color: #1e40af; }
.escrow-status.awaiting_proof { background: #fef3c7; color: #b45309; }
.escrow-status.approved { background: #d1fae5; color: #065f46; }
.escrow-status.rejected { background: #fee2e2; color: #991b1b; }

.escrow-steps {
  display: flex;
  align-items: center;
  padding: 24px 24px 16px;
  gap: 8px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  font-size: 12px;
  color: var(--txt-3);
}
.step.active { color: var(--primary); }
.step-circle {
  width: 32px;
  height: 32px;
  background: var(--surface-2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.step.active .step-circle {
  background: var(--primary);
  color: white;
}
.step-line {
  flex: 1;
  height: 2px;
  background: var(--border);
}
.step-line.active { background: var(--primary); }

.escrow-details { padding: 0 24px 20px; }
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.instructions-box {
  background: #fefce8;
  border-left: 4px solid #eab308;
  padding: 16px;
  border-radius: 12px;
  margin: 16px 0;
}
.upload-section {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.upload-btn {
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
}
.proof-preview {
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  max-width: 200px;
}
.info-message, .success-message, .error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  margin-top: 16px;
}
.info-message { background: #e0f2fe; color: #0369a1; }
.success-message { background: #d1fae5; color: #065f46; }
.error-message { background: #fee2e2; color: #991b1b; }
.escrow-timer {
  padding: 12px 24px;
  background: #f1f5f9;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  border-top: 1px solid var(--border);
}
.helper-text {
  font-size: 11px;
  color: var(--txt-3);
  margin-left: auto;
}
  `;
  document.head.appendChild(styleEl);
  console.log('✅ Donor dashboard styles injected');
};

// ---------- Transaction History Component (unchanged) ----------
function TransactionHistory({ transactions, loading, onRefresh }) {
  const [showAll, setShowAll] = useState(false);
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);
  
  if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-3)' }}>Loading transactions...</div>;
  if (!transactions || transactions.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--txt-3)' }}>No transactions yet</div>;
  
  return (
    <div>
      {displayTransactions.map(tx => (
        <div key={tx.id} className="cr">
          <div className="ci">
            <div className="cn" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {tx.type === 'deposit' && <CreditCard size={14} color="#378ADD" />}
              {tx.type === 'donation_out' && <Heart size={14} color="#E24B4A" />}
              {tx.type === 'withdrawal_out' && <Banknote size={14} color="#f59e0b" />}
              {tx.type === 'escrow_refund' && <RefreshCw size={14} color="#1D9E75" />}
              <span>{tx.description || tx.type.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="cm"><Calendar size={10} /> {new Date(tx.created_at).toLocaleDateString()}</div>
          </div>
          <div style={{ fontWeight: 700, color: tx.amount > 0 ? 'var(--primary)' : 'var(--red)' }}>
            {tx.amount > 0 ? '+' : ''}{toNumber(tx.amount).toFixed(2)}
          </div>
        </div>
      ))}
      {transactions.length > 5 && (
        <button className="card-a" onClick={() => setShowAll(!showAll)} style={{ marginTop: 12 }}>
          {showAll ? 'Show less' : `View all (${transactions.length})`}
          <ChevronRight size={12} />
        </button>
      )}
      <button className="card-a" onClick={onRefresh} style={{ marginTop: 8 }}><RefreshCw size={12} /> Refresh</button>
    </div>
  );
}

// ---------- Main DonorDashboard ----------
export default function DonorDashboard() {
  injectStyles();
  const { currentUser, logout, showToast, walletBalance, refreshWallet } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loadingData, setLoadingData] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [donations, setDonations] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);

  const [depositAmount, setDepositAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofUploading, setProofUploading] = useState(false);
  const proofInputRef = useRef();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const depositPollInterval = useRef(null);
  const walletRefreshInterval = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!currentUser) navigate('/');
    else if (currentUser.role !== 'donor') navigate('/');
  }, [currentUser, navigate]);

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
      console.error(err);
      showToast('Error loading dashboard data', true);
    } finally {
      setLoadingData(false);
    }
  };

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const data = await walletApi.getTransactions();
      setTransactions(data.transactions || []);
    } catch (err) { console.warn(err); }
    finally { setTransactionsLoading(false); }
  };

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('hb_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) { console.error(err); }
  };

  const markNotificationRead = async (id) => {
    try {
      const token = localStorage.getItem('hb_token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadNotifications();
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('hb_token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadNotifications();
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const pending = depositRequests.find(r => ['pending', 'instructions_sent', 'awaiting_proof'].includes(r.status));
    if (!pending) {
      if (depositPollInterval.current) clearInterval(depositPollInterval.current);
      return;
    }
    let lastStatus = pending.status;
    if (depositPollInterval.current) clearInterval(depositPollInterval.current);
    depositPollInterval.current = setInterval(async () => {
      try {
        const res = await walletApi.getDepositRequestById(pending.id);
        const updated = res.request;
        if (updated && updated.status !== lastStatus) {
          if (updated.status === 'instructions_sent') showToast(`Payment instructions for deposit #${pending.id} are now available.`);
          else if (updated.status === 'approved') { showToast(`Deposit #${pending.id} approved! Wallet credited.`); refreshWallet(); loadData(); }
          else if (updated.status === 'rejected') showToast(`Deposit #${pending.id} rejected.`, true);
          lastStatus = updated.status;
          setDepositRequests(prev => prev.map(r => r.id === pending.id ? updated : r));
        }
        if (updated?.status === 'approved' || updated?.status === 'rejected') clearInterval(depositPollInterval.current);
      } catch (err) { console.warn(err); }
    }, 3000);
    return () => { if (depositPollInterval.current) clearInterval(depositPollInterval.current); };
  }, [depositRequests, refreshWallet, showToast, loadData]);

  useEffect(() => {
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
    if (pendingWithdrawals.length === 0) return;
    const interval = setInterval(async () => {
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
    return () => clearInterval(interval);
  }, [withdrawals, showToast]);

  useEffect(() => {
    if (walletRefreshInterval.current) clearInterval(walletRefreshInterval.current);
    walletRefreshInterval.current = setInterval(() => { refreshWallet(); loadData(); }, 10000);
    return () => { if (walletRefreshInterval.current) clearInterval(walletRefreshInterval.current); };
  }, [refreshWallet]);

  useEffect(() => {
    if (currentUser) { loadData(); loadTransactions(); loadNotifications(); }
  }, [currentUser]);

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
    } catch (err) { showToast(err.message, true); }
    finally { setDepositLoading(false); }
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
    } catch (err) { showToast(err.message, true); }
    finally { setProofUploading(false); }
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
    } catch (err) { showToast(err.message, true); }
    finally { setWithdrawLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const handleBrowseCampaigns = () => setActiveTab('donate');
  const initials = (currentUser?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const pendingDeposit = depositRequests.find(r => ['pending', 'instructions_sent', 'awaiting_proof'].includes(r.status));
  const isVerified = currentUser?.is_verified === true;

  const NotificationPanel = () => (
    <div className="notification-panel">
      <div className="notification-header">
        <span>Notifications</span>
        {unreadCount > 0 && <button className="db dba" style={{ fontSize: 10 }} onClick={markAllRead}>Mark all read</button>}
      </div>
      {notifications.length === 0 ? (
        <div className="notification-empty">No notifications</div>
      ) : (
        notifications.map(notif => (
          <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`} onClick={() => markNotificationRead(notif.id)}>
            <div className="notification-dot" style={{ background: notif.type === 'error' ? 'var(--red)' : notif.type === 'warning' ? 'var(--amber)' : 'var(--green)' }} />
            <div>
              <div className="notification-text">{notif.message}</div>
              <div className="notification-time">{new Date(notif.created_at).toLocaleTimeString()}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon"><Heart size={20} color="#fff" /></div>
            <div><div className="logo-text">HopeBridge</div><div className="logo-sub">Donor Portal</div></div>
          </div>
        </div>
        <div className="sb-user">
          <div className="user-av">{initials}</div>
          <div>
            <div className="user-name">{currentUser?.name}{isVerified && <CheckCircle size={14} className="verified-badge" />}</div>
            <div className="user-badge">Donor</div>
          </div>
        </div>
        <nav className="sb-nav">
          <div className="nav-sec">Main</div>
          <button className={`nl ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={18} /> Dashboard</button>
          <button className={`nl ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}><DollarSign size={18} /> My Donations</button>
          <button className={`nl ${activeTab === 'donate' ? 'active' : ''}`} onClick={() => setActiveTab('donate')}><Gift size={18} /> Donate Now</button>
          <div className="nav-sec">Finance</div>
          <button className={`nl ${activeTab === 'deposit' ? 'active' : ''}`} onClick={() => setActiveTab('deposit')}><Plus size={18} /> Deposit Funds</button>
          <button className={`nl ${activeTab === 'withdraw' ? 'active' : ''}`} onClick={() => setActiveTab('withdraw')}><Banknote size={18} /> Withdraw Funds</button>
          <div className="nav-sec">Account</div>
          <button className={`nl ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setShowSettings(true)}><Settings size={18} /> Settings</button>
          <button className="nl" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
        </nav>
        <div className="sb-footer">
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      <div className="main">
        {/* Desktop Topbar */}
        <div className="topbar">
          <div className="tb-title">
            {activeTab === 'overview' && 'Dashboard'}
            {activeTab === 'donations' && 'My Donations'}
            {activeTab === 'donate' && 'Make a Donation'}
            {activeTab === 'deposit' && 'Deposit Funds'}
            {activeTab === 'withdraw' && 'Withdraw Funds'}
            {activeTab === 'settings' && 'Settings'}
          </div>
          <div className="tb-actions">
            <div className="tb-btn" style={{ position: 'relative' }} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={18} />
              {unreadCount > 0 && <div className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>}
            </div>
            {showNotifications && <NotificationPanel />}
            <button className="tb-btn" onClick={handleLogout} style={{ background: 'var(--red-l)', borderColor: 'var(--red)' }}><LogOut size={18} style={{ stroke: 'var(--red)' }} /></button>
            <div className="tb-btn" onClick={() => setShowSettings(true)}><div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff' }}>{initials}</div></div>
          </div>
        </div>

        {/* Mobile Topbar */}
        <div className="mob-top">
          <div className="mob-logo">HopeBridge</div>
          <div className="tb-actions">
            <div className="tb-btn" style={{ position: 'relative' }} onClick={() => setShowNotifications(!showNotifications)}><Bell size={18} />{unreadCount > 0 && <div className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>}</div>
            {showNotifications && <NotificationPanel />}
            <button className="tb-btn" onClick={handleLogout} style={{ background: 'var(--red-l)', borderColor: 'var(--red)' }}><LogOut size={18} style={{ stroke: 'var(--red)' }} /></button>
            <div className="tb-btn" onClick={() => setShowSettings(true)}><div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 700, color: '#fff' }}>{initials}</div></div>
          </div>
        </div>

        <div className="page">
          {/* Overview Tab */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            {/* Quick Actions Grid */}
            <div className="qg">
              <button className="qb" onClick={() => setActiveTab('donate')}><div className="qi"><Heart size={20} /></div><span className="ql">Donate Now</span></button>
              <button className="qb" onClick={() => setActiveTab('deposit')}><div className="qi"><Plus size={20} /></div><span className="ql">Deposit Funds</span></button>
              <button className="qb" onClick={() => setActiveTab('withdraw')}><div className="qi"><Banknote size={20} /></div><span className="ql">Withdraw Funds</span></button>
              <button className="qb" onClick={() => setActiveTab('donations')}><div className="qi"><DollarSign size={20} /></div><span className="ql">My Donations</span></button>
              <button className="qb" onClick={() => setShowSettings(true)}><div className="qi"><Settings size={20} /></div><span className="ql">Settings</span></button>
              <button className="qb qx" onClick={handleLogout}><div className="qi"><LogOut size={20} /></div><span className="ql">Logout</span></button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="sc" onClick={() => setActiveTab('deposit')}><div className="si"><Wallet size={22} /></div><div className="sv">${walletBalance.toLocaleString()}</div><div className="sl">Wallet Balance</div><div className="sd">Click to deposit →</div></div>
              <div className="sc" onClick={() => setActiveTab('donations')}><div className="si"><DollarSign size={22} /></div><div className="sv">${totalDonated.toLocaleString()}</div><div className="sl">Total Donated</div><div className="sd">Click to view →</div></div>
              <div className="sc" onClick={() => setActiveTab('donations')}><div className="si"><Heart size={22} /></div><div className="sv">{donations.length}</div><div className="sl">Donations Made</div><div className="sd">Click to view →</div></div>
              <div className="sc" onClick={handleBrowseCampaigns}><div className="si"><Users size={22} /></div><div className="sv">{approvedCampaigns.length}</div><div className="sl">Active Campaigns</div><div className="sd">Click to donate →</div></div>
            </div>

            <div className="card">
              <div className="card-h"><div className="card-t"><History size={18} /> Recent Donations</div><button className="card-a" onClick={() => setActiveTab('donations')}>View all <ArrowRight size={14} /></button></div>
              <div className="card-b">
                {donations.slice(0, 5).map(d => (
                  <div key={d.id} className="cr">
                    <div className="ci"><div className="cn">{d.campaign_title || `Campaign #${d.campaign_id}`}</div><div className="cm"><Calendar size={10} /> {new Date(d.created_at).toLocaleDateString()}</div></div>
                    <div className="badge ba">+${toNumber(d.amount).toFixed(2)}</div>
                  </div>
                ))}
                {donations.length === 0 && <div className="cr">No donations yet</div>}
              </div>
            </div>

            <div className="card">
              <div className="card-h"><div className="card-t"><Target size={18} /> Support a Campaign</div><button className="card-a" onClick={handleBrowseCampaigns}>Browse all <ArrowRight size={14} /></button></div>
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

          {/* Donations Tab */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><DollarSign size={18} /> All Donations</div></div><div className="card-b" style={{ padding: 0 }}>
              <table className="ut"><thead><tr><th>Campaign</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>
                {donations.map(d => (
  <tr key={d.id}>
    <td>{d.campaign_title || `Campaign #${d.campaign_id}`}</td>
    <td>${toNumber(d.amount).toFixed(2)}</td>
    <td>{new Date(d.created_at).toLocaleDateString()}</td>
    <td><span className="badge ba">{d.escrow_status || 'held'}</span></td>
  </tr>
))}
                {donations.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No donations yet</td></tr>}
              </tbody></table>
            </div></div>
          </div>

          {/* Donate Tab */}
          <div className={`ps ${activeTab === 'donate' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><Gift size={18} /> Make a Donation</div></div><div className="card-b"><DonationForm /></div></div>
          </div>

          {/* Deposit Tab – Professional Escrow UI */}
          <div className={`ps ${activeTab === 'deposit' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Plus size={18} /> Deposit Funds</div></div>
              <div className="card-b">
                {pendingDeposit ? (
                  <DepositStatusCard
                    deposit={pendingDeposit}
                    onUploadProof={handleUploadProof}
                    proofFile={proofFile}
                    setProofFile={setProofFile}
                    proofUploading={proofUploading}
                    showToast={showToast}
                  />
                ) : (
                  <form onSubmit={handleRequestDeposit}>
                    <label className="fl">Amount (USD)</label>
                    <input type="number" min="1" step="0.01" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} required className="fi" placeholder="Min $1" />
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>{[20, 50, 100, 200, 500].map(a => <button key={a} type="button" onClick={() => setDepositAmount(a)} style={{ padding: '6px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6 }}>${a}</button>)}</div>
                    <button type="submit" className="btn btn-g" disabled={depositLoading}>{depositLoading ? 'Submitting...' : <><Send size={14} /> Request Deposit</>}</button>
                  </form>
                )}
              </div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t"><History size={18} /> Transaction History</div></div>
              <div className="card-b"><TransactionHistory transactions={transactions} loading={transactionsLoading} onRefresh={loadTransactions} /></div>
            </div>
          </div>

          {/* Withdraw Tab */}
          <div className={`ps ${activeTab === 'withdraw' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-h"><div className="card-t"><Banknote size={18} /> Withdraw Funds</div></div>
              <div className="card-b">
                <div style={{ marginBottom: 12, background: '#fef9c3', padding: 12, borderRadius: 8 }}>Available: <strong>${walletBalance.toFixed(2)}</strong></div>
                <form onSubmit={handleWithdraw}>
                  <label className="fl">Amount (USD)</label>
                  <input type="number" min="1" step="0.01" max={walletBalance} value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} required className="fi" />
                  <label className="fl">Payment Method</label>
                  <select className="fi" value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value)}>
                    <option value="bank"><Landmark size={14} /> Bank Transfer</option>
                    <option value="mobile_money"><Smartphone size={14} /> Mobile Money</option>
                    <option value="paypal"><CreditCard size={14} /> PayPal</option>
                  </select>
                  <label className="fl">Payment Details</label>
                  <textarea className="fi" rows="2" placeholder={withdrawMethod === 'bank' ? 'Account name, number, bank name' : withdrawMethod === 'mobile_money' ? 'Phone number & network' : 'PayPal email'} value={withdrawDetails} onChange={e => setWithdrawDetails(e.target.value)} required />
                  <button type="submit" className="btn btn-g" disabled={withdrawLoading}>{withdrawLoading ? 'Submitting...' : <><Send size={14} /> Request Withdrawal</>}</button>
                </form>
              </div>
            </div>
            <div className="card">
              <div className="card-h"><div className="card-t"><History size={18} /> Transaction History</div></div>
              <div className="card-b"><TransactionHistory transactions={transactions} loading={transactionsLoading} onRefresh={loadTransactions} /></div>
            </div>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="hb-modal-bd" onClick={() => setShowSettings(false)}>
              <div className="hb-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0 }}>
                <ProfileSettings onClose={() => setShowSettings(false)} userRole="donor" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bnav">
        <div className="bnav-inner">
          <button className={`bni ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={20} /><span>Home</span></button>
          <button className={`bni ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}><DollarSign size={20} /><span>Donations</span></button>
          <button className={`bni ${activeTab === 'donate' ? 'active' : ''}`} onClick={() => setActiveTab('donate')}><Gift size={20} /><span>Donate</span></button>
          <button className={`bni ${activeTab === 'deposit' ? 'active' : ''}`} onClick={() => setActiveTab('deposit')}><Plus size={20} /><span>Deposit</span></button>
          <button className={`bni ${activeTab === 'withdraw' ? 'active' : ''}`} onClick={() => setActiveTab('withdraw')}><Banknote size={20} /><span>Withdraw</span></button>
        </div>
      </nav>
    </div>
  );
}