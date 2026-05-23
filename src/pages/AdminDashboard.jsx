import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { adminApi, campaignApi } from '../services/api';
import {
  Heart, LayoutDashboard, Users, DollarSign, Settings, LogOut,
  Bell, Target, CreditCard, Plus, CheckCircle, Clock, FileText,
  ArrowRight, Zap, Shield, Calendar, Send, Eye, EyeOff,
  Banknote, History, X, Gift, Receipt, Lock, Unlock,
  Mail as MailIcon, Pause, Play, Trash2, RefreshCw, Image,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────
const safeGet = async (fn, fallback) => { try { return await fn(); } catch { return fallback; } };
const toNum   = (v, f = 0) => { const n = parseFloat(v); return isNaN(n) ? f : n; };

// ── Styles ────────────────────────────────────────
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const el = document.createElement('style');
  el.textContent = `
    :root{--green:#1D9E75;--green-d:#0F6E56;--green-dd:#085041;--green-l:#E1F5EE;--green-m:#9FE1CB;--accent:#5DCAA5;
      --red:#E24B4A;--red-l:#FCEBEB;--amber:#EF9F27;--amber-l:#FAEEDA;--blue:#378ADD;--blue-l:#E6F1FB;
      --bg:#EEF1F5;--surface:#FFFFFF;--surface-2:#F6F8FA;--border:rgba(0,0,0,0.07);--border-2:rgba(0,0,0,0.13);
      --txt:#111318;--txt-2:#5A6272;--txt-3:#9AA3B2;
      --sidebar-w:240px;--topbar-h:64px;--bottom-nav:68px;
      --r-sm:10px;--r-md:14px;--r-lg:20px;--r-xl:26px;
      --sh-sm:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.04);
      --sh-md:0 4px 16px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.04);
      --sh-lg:0 12px 40px rgba(0,0,0,0.13);
      --fd:'Instrument Serif',Georgia,serif;--fb:'DM Sans',sans-serif;--tr:0.18s ease}
    body.dark-mode{--bg:#121212;--surface:#1E1E1E;--surface-2:#2A2A2A;--border:rgba(255,255,255,0.1);--txt:#EEEEEE;--txt-2:#AAAAAA;--txt-3:#777777}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
    body{font-family:var(--fb);background:var(--bg);color:var(--txt);min-height:100vh;overflow-x:hidden;transition:background var(--tr),color var(--tr)}
    .shell{display:flex;min-height:100vh}
    .sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:200;overflow-y:auto}
    .sb-logo{padding:22px 20px 14px;border-bottom:1px solid var(--border)}
    .logo-mark{display:flex;align-items:center;gap:10px}
    .logo-icon{width:36px;height:36px;border-radius:var(--r-sm);background:var(--green);display:flex;align-items:center;justify-content:center}
    .logo-text{font-family:var(--fd);font-size:19px;color:var(--txt)}
    .logo-sub{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--txt-3)}
    .sb-admin{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
    .admin-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--green),var(--green-d));display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;color:#fff;flex-shrink:0}
    .admin-name-s{font-size:13px;font-weight:600;color:var(--txt)}
    .admin-role{font-size:11px;color:var(--txt-3);margin-top:1px}
    .sb-nav{flex:1;padding:10px}
    .nav-sec{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txt-3);padding:10px 10px 4px}
    .nl{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--r-sm);cursor:pointer;border:none;background:none;width:100%;text-align:left;color:var(--txt-2);font-size:13.5px;font-weight:500;font-family:var(--fb);transition:background var(--tr),color var(--tr)}
    .nl:hover{background:var(--bg);color:var(--txt)}
    .nl.active{background:var(--green-l);color:var(--green-d);font-weight:600}
    .nl svg{flex-shrink:0}
    .nb{margin-left:auto;font-size:10px;font-weight:700;background:var(--red);color:#fff;padding:2px 7px;border-radius:20px}
    .nb.am{background:var(--amber)}
    .sb-footer{padding:12px 10px;border-top:1px solid var(--border)}
    .main{flex:1;margin-left:var(--sidebar-w);display:flex;flex-direction:column;min-height:100vh}
    .topbar{height:var(--topbar-h);background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 28px;gap:16px;position:sticky;top:0;z-index:100}
    .tb-title{font-family:var(--fd);font-size:22px;color:var(--txt);flex:1}
    .tb-actions{display:flex;align-items:center;gap:10px}
    .tb-btn{width:38px;height:38px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:background var(--tr)}
    .tb-btn:hover{background:var(--bg)}
    .ndot{position:absolute;top:7px;right:7px;width:7px;height:7px;background:var(--red);border-radius:50%;border:1.5px solid var(--surface)}
    .page{padding:28px}
    .ps{display:none}.ps.active{display:block}
    .ov-hero{background:linear-gradient(130deg,var(--green-dd) 0%,var(--green) 55%,var(--accent) 100%);border-radius:var(--r-xl);padding:28px 32px;margin-bottom:24px;position:relative;overflow:hidden;color:#fff}
    .ov-hero::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.06)}
    .hero-row{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:1}
    .hero-g{font-size:13px;color:rgba(255,255,255,0.65);font-weight:500;margin-bottom:4px}
    .hero-t{font-family:var(--fd);font-size:30px;color:#fff;line-height:1.1}
    .hero-s{font-size:13px;color:rgba(255,255,255,0.7);margin-top:6px}
    .hero-stats{display:flex;gap:12px;position:relative;z-index:1;margin-top:24px;flex-wrap:wrap}
    .hst{background:rgba(255,255,255,0.13);border:1px solid rgba(255,255,255,0.18);border-radius:var(--r-md);padding:12px 20px;min-width:90px}
    .hst-v{font-family:var(--fd);font-size:26px;color:#fff;line-height:1}
    .hst-l{font-size:11px;color:rgba(255,255,255,0.6);font-weight:600;margin-top:3px;letter-spacing:.04em}
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
    .sc{background:var(--surface);border-radius:var(--r-lg);padding:20px;box-shadow:var(--sh-sm);position:relative;overflow:hidden}
    .sc::after{content:'';position:absolute;bottom:-22px;right:-22px;width:80px;height:80px;border-radius:50%;background:var(--green-l);opacity:.6}
    .si{width:36px;height:36px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
    .si-g{background:var(--green-l);color:var(--green-d)}.si-b{background:var(--blue-l);color:var(--blue)}.si-a{background:var(--amber-l);color:#854F0B}.si-r{background:var(--red-l);color:var(--red)}
    .sv{font-family:var(--fd);font-size:32px;color:var(--txt);line-height:1;position:relative;z-index:1}
    .sl{font-size:12px;color:var(--txt-2);font-weight:500;margin-top:4px;position:relative;z-index:1}
    .three-col{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:24px}
    .card{background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--sh-sm);overflow:hidden}
    .card-h{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid var(--border)}
    .card-t{font-family:var(--fd);font-size:17px;color:var(--txt);display:flex;align-items:center;gap:8px}
    .card-a{font-size:12px;font-weight:600;color:var(--green);cursor:pointer;border:none;background:none;font-family:var(--fb);display:flex;align-items:center;gap:4px}
    .card-b{padding:16px 20px}
    .cr{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
    .cr:last-child{border-bottom:none}
    .ci{flex:1;min-width:0}
    .cn{font-size:13.5px;font-weight:600;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .cm{font-size:11px;color:var(--txt-3);margin-top:2px}
    .pb{height:4px;background:var(--bg);border-radius:2px;margin-top:5px;overflow:hidden}
    .pf{height:100%;background:var(--green);border-radius:2px;transition:width .9s ease}
    .badge{font-size:10px;font-weight:700;padding:4px 9px;border-radius:20px;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
    .bp{background:var(--amber-l);color:#854F0B}.ba{background:var(--green-l);color:var(--green-d)}.br{background:var(--blue-l);color:#185FA5}.bx{background:var(--red-l);color:var(--red)}
    /* Quick actions */
    .qg{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
    .qb{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px 8px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:transform var(--tr),box-shadow var(--tr);font-family:var(--fb)}
    .qb:hover{transform:translateY(-2px);box-shadow:var(--sh-md)}.qb:active{transform:scale(0.96)}
    .qi{width:40px;height:40px;border-radius:var(--r-sm);background:var(--green-l);display:flex;align-items:center;justify-content:center;color:var(--green-d)}
    .qb.qx .qi{background:var(--red-l);color:var(--red)}.qb.qx .ql{color:var(--red)}
    .ql{font-size:11px;font-weight:600;color:var(--txt-2);text-align:center;line-height:1.3}
    /* Toggles */
    .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--border)}
    .toggle-row:last-child{border-bottom:none}
    .toggle-info strong{font-size:14px;font-weight:600;color:var(--txt);display:block}
    .toggle-info p{font-size:12px;color:var(--txt-2);margin-top:3px}
    .toggle{position:relative;width:48px;height:26px;flex-shrink:0}
    .toggle input{opacity:0;width:0;height:0}
    .toggle-slider{position:absolute;inset:0;background:#ccc;border-radius:26px;cursor:pointer;transition:.3s}
    .toggle-slider:before{content:'';position:absolute;height:20px;width:20px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.3s;box-shadow:0 1px 3px rgba(0,0,0,0.2)}
    .toggle input:checked+.toggle-slider{background:var(--green)}
    .toggle input:checked+.toggle-slider:before{transform:translateX(22px)}
    .toggle.danger input:checked+.toggle-slider{background:var(--red)}
    /* Quick toggle cards */
    .qt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
    .qt-card{background:var(--surface);border-radius:var(--r-lg);padding:16px 18px;box-shadow:var(--sh-sm);display:flex;align-items:center;justify-content:space-between;gap:12px}
    .qt-label{font-size:13px;font-weight:600;color:var(--txt)}
    .qt-sub{font-size:11px;color:var(--txt-3);margin-top:2px}
    .qt-icon{width:36px;height:36px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .status-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700}
    .status-pill.on{background:var(--green-l);color:var(--green-d)}.status-pill.off{background:var(--red-l);color:var(--red)}
    .status-dot{width:6px;height:6px;border-radius:50%;background:currentColor}
    /* Email templates */
    .tpl-list{display:flex;flex-direction:column;gap:8px}
    .tpl-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;transition:all var(--tr);background:var(--surface)}
    .tpl-item:hover,.tpl-item.active{border-color:var(--green);background:var(--green-l)}
    .tpl-icon{width:36px;height:36px;border-radius:var(--r-sm);background:var(--green-l);display:flex;align-items:center;justify-content:center;color:var(--green-d);flex-shrink:0}
    .tpl-name{font-size:13px;font-weight:600;color:var(--txt)}
    .tpl-desc{font-size:11px;color:var(--txt-3);margin-top:2px}
    .tpl-editor{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px}
    .tpl-preview{background:#fff;border:1px solid var(--border);border-radius:var(--r-md);padding:20px;margin-top:16px;font-size:13px;line-height:1.7;max-height:300px;overflow-y:auto}
    /* Table */
    .ut{width:100%;border-collapse:collapse}
    .ut th{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--txt-3);text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);background:var(--surface-2)}
    .ut td{font-size:13px;padding:13px 12px;border-bottom:1px solid var(--border);vertical-align:middle}
    .ut tr:last-child td{border-bottom:none}.ut tr:hover td{background:var(--surface-2)}
    .uav{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
    .avg{background:linear-gradient(135deg,var(--green),var(--green-d))}.ava{background:linear-gradient(135deg,var(--amber),#854F0B)}
    .uc{display:flex;align-items:center;gap:10px}
    .sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
    .sht{font-family:var(--fd);font-size:20px;color:var(--txt);display:flex;align-items:center;gap:8px}
    .di{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
    .di:last-child{border-bottom:none}
    .di-info{flex:1}
    .di-user{font-size:13px;font-weight:600;color:var(--txt)}
    .di-amt{font-size:12px;color:var(--txt-2);margin-top:2px;display:flex;align-items:center;gap:4px}
    .di-acts{display:flex;gap:6px}
    /* Buttons */
    .db{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:none;font-family:var(--fb);transition:opacity var(--tr);display:inline-flex;align-items:center;gap:4px}
    .dba{background:var(--green-l);color:var(--green-d)}.dba:hover{background:var(--green-m)}
    .dbr{background:var(--red-l);color:var(--red)}.dbv{background:var(--blue-l);color:#185FA5}.dbp{background:var(--amber-l);color:#854F0B}
    .modal-bd{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}
    .modal-bd.open{opacity:1;pointer-events:all}
    .modal{background:var(--surface);border-radius:var(--r-xl);padding:28px;width:90%;max-width:550px;box-shadow:var(--sh-lg);transform:translateY(20px);transition:transform .25s}
    .modal-bd.open .modal{transform:translateY(0)}
    .modal-t{font-family:var(--fd);font-size:22px;color:var(--txt);margin-bottom:6px}
    .modal-s{font-size:13px;color:var(--txt-2);margin-bottom:20px}
    .fl{font-size:12px;font-weight:700;color:var(--txt-2);letter-spacing:.05em;text-transform:uppercase;margin-bottom:6px;display:block}
    .fi{width:100%;background:var(--surface-2);border:1px solid var(--border-2);border-radius:var(--r-sm);padding:11px 14px;font-size:14px;color:var(--txt);font-family:var(--fb);outline:none;transition:border-color var(--tr);margin-bottom:14px}
    .fi:focus{border-color:var(--green)}
    textarea.fi{resize:vertical;min-height:80px}
    .btn{padding:11px 22px;border-radius:var(--r-sm);font-size:14px;font-weight:600;cursor:pointer;border:none;font-family:var(--fb);transition:opacity var(--tr),transform var(--tr);display:inline-flex;align-items:center;gap:8px}
    .btn:active{transform:scale(0.97)}
    .btn-g{background:var(--green);color:#fff}.btn-g:hover{background:var(--green-d)}
    .btn-gh{background:var(--surface-2);color:var(--txt-2);border:1px solid var(--border-2)}.btn-gh:hover{background:var(--bg)}
    .btn-r{background:var(--red);color:#fff}
    .settings-tabs{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:10px;flex-wrap:wrap}
    .role-tab{background:none;border:none;padding:6px 14px;border-radius:20px;cursor:pointer;font-size:13px;font-weight:600;color:var(--txt-2);font-family:var(--fb)}
    .role-tab.active{background:var(--green-l);color:var(--green-d)}
    .mob-top{display:none;height:58px;background:var(--surface);border-bottom:1px solid var(--border);align-items:center;padding:0 16px;gap:12px;position:sticky;top:0;z-index:100}
    .mob-logo{font-family:var(--fd);font-size:20px;color:var(--txt);flex:1}
    .bnav{display:none;position:fixed;bottom:0;left:0;right:0;height:var(--bottom-nav);background:var(--surface);border-top:1px solid var(--border);z-index:200}
    .bnav-inner{display:flex;justify-content:space-between;align-items:center;height:100%;padding:0 12px}
    .bni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border:none;background:none;font-family:var(--fb)}
    .bni.active svg{stroke:var(--green)}.bni.active .bni-lbl{color:var(--green);font-weight:700}
    .bni-lbl{font-size:10px;font-weight:600;color:var(--txt-3)}
    @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.qg{grid-template-columns:repeat(4,1fr)}.three-col{grid-template-columns:1fr}.qt-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:768px){
      .sidebar{display:none}.main{margin-left:0}.topbar{display:none}
      .mob-top{display:flex}.bnav{display:flex}
      .page{padding:16px;padding-bottom:calc(var(--bottom-nav) + 70px)}
      .stats-grid{grid-template-columns:1fr 1fr;gap:10px}.qg{grid-template-columns:repeat(3,1fr);gap:8px}
      .ov-hero{padding:20px}.hero-t{font-size:22px}.qt-grid{grid-template-columns:1fr 1fr}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    .ps.active>*{animation:fadeUp .35s ease both}
  `;
  document.head.appendChild(el);
};

// ── Toggle ────────────────────────────────────────
function Toggle({ checked, onChange, danger = false, disabled = false }) {
  return (
    <label className={`toggle ${danger ? 'danger' : ''}`} style={{ opacity: disabled ? 0.5 : 1 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} />
      <span className="toggle-slider" />
    </label>
  );
}

// ── Change Password Modal ─────────────────────────
function ChangePasswordModal({ isOpen, onClose, onSave, showToast }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [showOld, setShowOld]         = useState(false);
  const [showNew, setShowNew]         = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirm) { showToast('Passwords do not match', true); return; }
    if (newPassword.length < 6)  { showToast('Min 6 characters', true); return; }
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
            <button type="button" onClick={() => setShowOld(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-60%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)' }}>
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <label className="fl">New Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showNew ? 'text' : 'password'} className="fi" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowNew(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-60%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)' }}>
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
}

function DeleteUserModal({ isOpen, onClose, onConfirm, userName, showToast }) {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') { 
      showToast('Type "DELETE" to confirm', true); 
      return; 
    }
    setLoading(true);
    try { 
      await onConfirm(); 
      onClose(); 
    } catch (err) { 
      showToast(err.message, true); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '28px',
          width: '90%',
          maxWidth: '450px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '22px', marginBottom: '8px', color: '#dc2626' }}>Delete User</h3>
        <p style={{ marginBottom: '20px', color: '#6b7280', lineHeight: '1.5' }}>
          Permanently delete <strong>{userName}</strong>? All their data will be removed and cannot be undone.
        </p>
        <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', display: 'block', color: '#6b7280' }}>
          Type "DELETE" to confirm
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder="DELETE"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Deleting...' : 'Permanently Delete'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
// ── Add User Modal ────────────────────────────────
function AddUserModal({ isOpen, onClose, onSubmit, userData, setUserData, loading }) {
  if (!isOpen) return null;
  return (
    <div className="modal-bd open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">Add New User</div>
        <div className="modal-s">Create a new user account</div>
        <form onSubmit={onSubmit}>
          <label className="fl">Full Name *</label>
          <input type="text" className="fi" value={userData.name} onChange={e => setUserData(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required />
          <label className="fl">Email *</label>
          <input type="email" className="fi" value={userData.email} onChange={e => setUserData(p => ({ ...p, email: e.target.value }))} placeholder="user@example.com" required />
          <label className="fl">Password *</label>
          <input type="password" className="fi" value={userData.password} onChange={e => setUserData(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" required minLength={6} />
          <label className="fl">Role</label>
          <select className="fi" value={userData.role} onChange={e => setUserData(p => ({ ...p, role: e.target.value }))}>
            <option value="donor">Donor</option>
            <option value="creator">Creator</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 20 }}>
            <input type="checkbox" checked={userData.is_verified} onChange={e => setUserData(p => ({ ...p, is_verified: e.target.checked }))} />
            Mark as verified (skip email verification)
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>{loading ? 'Adding…' : 'Add User'}</button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Email Templates ───────────────────────────────
const EMAIL_TEMPLATES = [
  { id: 'verification',      name: 'Email Verification',   desc: 'Sent when users register',                subjectKey: 'verification_subject',      bodyKey: 'verification_body',      defaultSubject: 'Your HopeBridge Verification Code',           defaultBody: 'Hi {{name}},\n\nYour verification code is:\n\n{{code}}\n\nExpires in 15 minutes.' },
  { id: 'welcome',           name: 'Welcome Email',         desc: 'Sent after registration',                 subjectKey: 'welcome_subject',           bodyKey: 'welcome_body',           defaultSubject: 'Welcome to HopeBridge, {{name}}!',            defaultBody: 'Hi {{name}},\n\nWelcome to HopeBridge as a {{role}}.\n\nStart making an impact today.' },
  { id: 'donation',          name: 'Donation Confirmation', desc: 'Sent to donors after donating',           subjectKey: 'donation_subject',          bodyKey: 'donation_body',          defaultSubject: 'Thank you for your donation of ${{amount}}!', defaultBody: 'Dear {{donor_name}},\n\nThank you for donating ${{amount}} to {{campaign_title}}.' },
  { id: 'campaign_approved', name: 'Campaign Approved',     desc: 'Sent to creators on approval',            subjectKey: 'campaign_approved_subject', bodyKey: 'campaign_approved_body', defaultSubject: 'Your campaign "{{title}}" is approved!',       defaultBody: 'Dear {{creator_name}},\n\nYour campaign "{{title}}" is now live.' },
  { id: 'campaign_rejected', name: 'Campaign Rejected',     desc: 'Sent to creators on rejection',           subjectKey: 'campaign_rejected_subject', bodyKey: 'campaign_rejected_body', defaultSubject: 'Update on your campaign "{{title}}"',          defaultBody: 'Dear {{creator_name}},\n\nYour campaign "{{title}}" did not meet our guidelines.' },
  { id: 'withdrawal',        name: 'Withdrawal Status',     desc: 'Sent on withdrawal approve/reject',       subjectKey: 'withdrawal_subject',        bodyKey: 'withdrawal_body',        defaultSubject: 'Your withdrawal of ${{amount}} has been {{status}}', defaultBody: 'Dear {{name}},\n\nYour withdrawal of ${{amount}} has been {{status}}.\n\n{{admin_note}}' },
];

function EmailTemplateEditor({ showToast }) {
  const [selected,    setSelected]    = useState(EMAIL_TEMPLATES[0]);
  const [templates,   setTemplates]   = useState({});
  const [saving,      setSaving]      = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    safeGet(() => adminApi.getSettings(), { settings: null }).then(res => {
      if (res?.settings?.email_templates) setTemplates(res.settings.email_templates);
    });
  }, []);

  const getVal = (key, def) => (templates[key] !== undefined ? templates[key] : def);
  const update  = (key, val) => setTemplates(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try { await adminApi.saveSettings({ email_templates: templates }); showToast('Template saved'); }
    catch (err) { showToast(err.message, true); }
    finally { setSaving(false); }
  };

  const preview = getVal(selected.bodyKey, selected.defaultBody)
    .replace(/\{\{name\}\}/g,          'John Doe')
    .replace(/\{\{code\}\}/g,          '847291')
    .replace(/\{\{amount\}\}/g,        '50.00')
    .replace(/\{\{donor_name\}\}/g,    'John Doe')
    .replace(/\{\{campaign_title\}\}/g,'Help Build a School')
    .replace(/\{\{title\}\}/g,         'Help Build a School')
    .replace(/\{\{creator_name\}\}/g,  'Jane Creator')
    .replace(/\{\{role\}\}/g,          'donor')
    .replace(/\{\{status\}\}/g,        'approved')
    .replace(/\{\{admin_note\}\}/g,    'Funds sent within 2 business days.');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-3)', textTransform: 'uppercase', marginBottom: 10 }}>Templates</div>
        <div className="tpl-list">
          {EMAIL_TEMPLATES.map(tpl => (
            <div key={tpl.id} className={`tpl-item ${selected.id === tpl.id ? 'active' : ''}`} onClick={() => setSelected(tpl)}>
              <div className="tpl-icon"><MailIcon size={18} /></div>
              <div><div className="tpl-name">{tpl.name}</div><div className="tpl-desc">{tpl.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--txt)' }}>{selected.name}</div>
            <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: 2 }}>Variables: {'{{name}}'} {'{{code}}'} {'{{amount}}'} {'{{title}}'}</div>
          </div>
          <button className="btn btn-gh" style={{ fontSize: 12 }} onClick={() => setShowPreview(p => !p)}>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
        <div className="tpl-editor">
          <label className="fl">Subject Line</label>
          <input type="text" className="fi" value={getVal(selected.subjectKey, selected.defaultSubject)} onChange={e => update(selected.subjectKey, e.target.value)} />
          <label className="fl">Email Body</label>
          <textarea className="fi" rows={10} value={getVal(selected.bodyKey, selected.defaultBody)} onChange={e => update(selected.bodyKey, e.target.value)} style={{ fontFamily: 'monospace', fontSize: 13 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-g" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Template'}</button>
            <button className="btn btn-gh" onClick={() => { update(selected.subjectKey, selected.defaultSubject); update(selected.bodyKey, selected.defaultBody); showToast('Reset to default'); }}>Reset</button>
          </div>
        </div>
        {showPreview && (
          <div className="tpl-preview">
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, color: 'var(--txt-3)' }}>Preview</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Subject: {getVal(selected.subjectKey, selected.defaultSubject)}</div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 12 }} />
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--txt-2)' }}>{preview}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MassMailForm ──────────────────────────────────
function MassMailForm({ showToast }) {
  const [subject,       setSubject]       = useState('');
  const [message,       setMessage]       = useState('');
  const [recipientType, setRecipientType] = useState('all_donors');
  const [campaignId,    setCampaignId]    = useState('');
  const [campaigns,     setCampaigns]     = useState([]);
  const [sending,       setSending]       = useState(false);

  useEffect(() => {
    safeGet(() => adminApi.getCampaigns({ status: 'approved' }), { campaigns: [] })
      .then(r => setCampaigns(r.campaigns || []));
  }, []);

  const handleSend = async e => {
    e.preventDefault();
    if (!subject || !message) { showToast('Fill subject and message', true); return; }
    setSending(true);
    try {
      await adminApi.sendMassMail({ subject, message, recipient_type: recipientType, campaign_id: recipientType === 'campaign_donors' ? campaignId : null });
      showToast('Emails sent!');
      setSubject(''); setMessage('');
    } catch (err) { showToast(err.message, true); }
    finally { setSending(false); }
  };

  return (
    <form onSubmit={handleSend}>
      <label className="fl">Recipient Group</label>
      <select className="fi" value={recipientType} onChange={e => setRecipientType(e.target.value)}>
        <option value="all_donors">All donors</option>
        <option value="all_creators">All creators</option>
        <option value="all_users">All users</option>
        <option value="campaign_donors">Specific campaign donors</option>
      </select>
      {recipientType === 'campaign_donors' && (
        <>
          <label className="fl">Campaign</label>
          <select className="fi" value={campaignId} onChange={e => setCampaignId(e.target.value)} required>
            <option value="">-- Select campaign --</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </>
      )}
      <label className="fl">Subject</label>
      <input type="text" className="fi" value={subject} onChange={e => setSubject(e.target.value)} required />
      <label className="fl">Message</label>
      <textarea className="fi" rows="6" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Write your email content here..." />
      <button className="btn btn-g" disabled={sending}>{sending ? 'Sending…' : <><Send size={14} /> Send Emails</>}</button>
    </form>
  );
}

// ── ContentEditor ─────────────────────────────────
function ContentEditor({ content, onSave, showToast }) {
  const [local,  setLocal]  = useState(content);
  const [saving, setSaving] = useState(false);
  useEffect(() => setLocal(content), [content]);
  const upd       = (f, v) => setLocal(p => ({ ...p, [f]: v }));
  const updStat   = (s, v) => setLocal(p => ({ ...p, impact_stats: { ...p.impact_stats, [s]: v } }));
  const updSocial = (pl, v) => setLocal(p => ({ ...p, social_links: { ...p.social_links, [pl]: v } }));
  const handleSave = async () => {
    setSaving(true);
    try { await onSave(local); showToast('Content updated'); }
    catch (err) { showToast(err.message, true); }
    finally { setSaving(false); }
  };
  return (
    <div>
      <h5 style={{ marginBottom: 12, color: 'var(--txt)' }}>Hero Section</h5>
      <label className="fl">Badge Text</label><input type="text" className="fi" value={local.hero_badge || ''} onChange={e => upd('hero_badge', e.target.value)} />
      <label className="fl">Hero Title</label><input type="text" className="fi" value={local.hero_title || ''} onChange={e => upd('hero_title', e.target.value)} />
      <label className="fl">Hero Subtitle</label><textarea className="fi" rows="2" value={local.hero_subtitle || ''} onChange={e => upd('hero_subtitle', e.target.value)} />
      <h5 style={{ margin: '20px 0 12px', color: 'var(--txt)' }}>Impact Stats</h5>
      <label className="fl">Total Raised</label><input type="text" className="fi" value={local.impact_stats?.raised || '$0'} onChange={e => updStat('raised', e.target.value)} />
      <label className="fl">Campaigns</label><input type="text" className="fi" value={local.impact_stats?.campaigns || '0'} onChange={e => updStat('campaigns', e.target.value)} />
      <label className="fl">Donors</label><input type="text" className="fi" value={local.impact_stats?.donors || '0'} onChange={e => updStat('donors', e.target.value)} />
      <h5 style={{ margin: '20px 0 12px', color: 'var(--txt)' }}>Social Links</h5>
      {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(p => (
        <div key={p}>
          <label className="fl">{p.charAt(0).toUpperCase() + p.slice(1)}</label>
          <input type="text" className="fi" value={local.social_links?.[p] || ''} onChange={e => updSocial(p, e.target.value)} placeholder={`https://${p}.com/...`} />
        </div>
      ))}
      <button className="btn btn-g" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Content'}</button>
    </div>
  );
}

// ── FeeSettings ───────────────────────────────────
function FeeSettings({ fees, onSave, showToast }) {
  const [local,  setLocal]  = useState(fees);
  const [saving, setSaving] = useState(false);
  useEffect(() => setLocal(fees), [fees]);
  const upd = (k, v) => setLocal(p => ({ ...p, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try { await onSave(local); showToast('Fee settings saved'); }
    catch (err) { showToast(err.message, true); }
    finally { setSaving(false); }
  };
  return (
    <div>
      {[
        ['percentage',         'Platform Fee (%)',               'number', '0',     'Percentage taken from each donation'],
        ['fixed_amount',       'Fixed Fee per Transaction ($)',   'number', '0',     ''],
        ['min_fee',            'Minimum Fee ($)',                 'number', '0',     ''],
        ['withdrawal_fee',     'Withdrawal Fee ($)',              'number', '0',     ''],
        ['minimum_withdrawal', 'Minimum Withdrawal Amount ($)',   'number', '10',    ''],
      ].map(([k, label, type, ph, hint]) => (
        <div key={k} style={{ marginBottom: 16 }}>
          <label className="fl">{label}</label>
          <input type={type} className="fi" step="0.5" min="0" value={local[k] || 0} onChange={e => upd(k, parseFloat(e.target.value))} placeholder={ph} />
          {hint && <p style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: -10, marginBottom: 8 }}>{hint}</p>}
        </div>
      ))}
      <button className="btn btn-g" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Fee Settings'}</button>
    </div>
  );
}

// ── DepositRequestsManager ────────────────────────
function DepositRequestsManager({ requests, onApprove, onReject, onProvideInstructions, showToast }) {
  const [instructions, setInstructions] = useState({});
  if (!requests.length) return <div style={{ color: 'var(--txt-3)' }}>No deposit requests.</div>;
  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ marginBottom: 4 }}><strong>{req.userName || req.name}</strong> ({req.email})</div>
          <div style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 8 }}>
            Amount: <strong>${toNum(req.amount).toFixed(2)}</strong> ·{' '}
            <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span>
          </div>
          {req.status === 'pending' && (
            <div>
              <textarea placeholder="Payment instructions..." rows="2" className="fi" value={instructions[req.id] || ''} onChange={e => setInstructions(p => ({ ...p, [req.id]: e.target.value }))} />
              <button className="db dba" onClick={() => { if (!instructions[req.id]?.trim()) { showToast('Enter instructions', true); return; } onProvideInstructions(req.id, instructions[req.id]); setInstructions(p => ({ ...p, [req.id]: '' })); }}>
                <Send size={12} /> Send Instructions
              </button>
            </div>
          )}
          {req.status === 'instructions_sent' && <div style={{ color: 'var(--blue)', fontSize: 13 }}><Clock size={12} /> Waiting for payment proof…</div>}
          {req.status === 'awaiting_proof' && req.proof_image_url && (
            <div>
              <a href={req.proof_image_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', fontSize: 13 }}><Image size={12} /> View Proof</a>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <button className="db dba" onClick={() => onApprove(req.id, req.amount)}><CheckCircle size={12} /> Approve</button>
                <button className="db dbr" onClick={() => onReject(req.id)}><X size={12} /> Reject</button>
              </div>
            </div>
          )}
          {req.status === 'approved' && <span style={{ color: 'var(--green)', fontSize: 13 }}><CheckCircle size={12} /> Credited</span>}
          {req.status === 'rejected' && <span style={{ color: 'var(--red)', fontSize: 13 }}><X size={12} /> Rejected</span>}
        </div>
      ))}
    </div>
  );
}

// ── WithdrawalRequestsManager ─────────────────────
function WithdrawalRequestsManager({ requests, onApprove, onReject }) {
  if (!requests.length) return <div style={{ color: 'var(--txt-3)' }}>No withdrawal requests.</div>;
  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ marginBottom: 4 }}><strong>{req.name}</strong> ({req.email})</div>
          <div style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 4 }}>Amount: <strong>${toNum(req.amount).toFixed(2)}</strong> · {req.payment_method}</div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', marginBottom: 8 }}>{req.payment_details}</div>
          <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span>
          {req.status === 'pending' && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button className="db dba" onClick={() => onApprove(req.id)}><CheckCircle size={12} /> Approve</button>
              <button className="db dbr" onClick={() => onReject(req.id)}><X size={12} /> Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── CompletionRequestsManager ─────────────────────
function CompletionRequestsManager({ requests, onRelease, onRefund }) {
  const [processingId, setProcessingId] = useState(null);
  if (!requests.length) return <div style={{ color: 'var(--txt-3)' }}>No completion requests.</div>;
  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{req.title}</div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={10} /> Requested {new Date(req.completion_requested_at).toLocaleString()}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="db dba" disabled={processingId === req.id} onClick={async () => {
              if (!window.confirm('Release escrow? Cannot be undone.')) return;
              setProcessingId(req.id); try { await onRelease(req.id); } finally { setProcessingId(null); }
            }}>{processingId === req.id ? 'Processing…' : <><CheckCircle size={12} /> Release Escrow</>}</button>
            <button className="db dbr" disabled={processingId === req.id} onClick={async () => {
              if (!window.confirm('Refund all donors?')) return;
              setProcessingId(req.id); try { await onRefund(req.id); } finally { setProcessingId(null); }
            }}>{processingId === req.id ? 'Processing…' : <><RefreshCw size={12} /> Refund Donors</>}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PayoutsManager ────────────────────────────────
function PayoutsManager({ payouts, onMarkPaid, showToast }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? payouts : payouts.filter(p => p.status === filter);
  if (!payouts.length) return <div style={{ color: 'var(--txt-3)' }}>No payout records.</div>;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'paid', 'rejected'].map(s => (
          <button key={s} className={`db ${filter === s ? 'dba' : 'dbv'}`} onClick={() => setFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>
      <table className="ut">
        <thead><tr><th>User</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id}>
              <td><strong>{p.user_name}</strong><br /><small style={{ color: 'var(--txt-3)' }}>{p.user_email}</small></td>
              <td><strong>${toNum(p.amount).toFixed(2)}</strong></td>
              <td>{p.payment_method}<br /><small>{p.payment_details?.substring(0, 30)}</small></td>
              <td><span className={`badge ${p.status === 'paid' ? 'ba' : p.status === 'approved' ? 'bp' : 'bx'}`}>{p.status}</span></td>
              <td>{new Date(p.created_at).toLocaleDateString()}</td>
              <td>{p.status === 'approved' && <button className="db dba" onClick={() => onMarkPaid(p.id)}><CheckCircle size={12} /> Mark Paid</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── NotificationManager ───────────────────────────
function NotificationManager({ settings, onSave, onSend, history, showToast }) {
  const [local,    setLocal]    = useState(settings);
  const [notif,    setNotif]    = useState({ title: '', body: '', target_type: 'all' });
  const [sending,  setSending]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  useEffect(() => setLocal(settings), [settings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try { await onSave(local); showToast('Notification settings saved'); }
    catch (err) { showToast(err.message, true); }
    finally { setSaving(false); }
  };

  const handleSend = async () => {
    if (!notif.title || !notif.body) { showToast('Fill title and body', true); return; }
    setSending(true);
    try { await onSend(notif); showToast('Notification sent'); setNotif({ title: '', body: '', target_type: 'all' }); }
    catch (err) { showToast(err.message, true); }
    finally { setSending(false); }
  };

  return (
    <div>
      <div className="toggle-row">
        <div className="toggle-info"><strong>Push Notifications</strong><p>Enable/disable push notifications to users</p></div>
        <Toggle checked={local.enabled} onChange={val => setLocal(p => ({ ...p, enabled: val }))} />
      </div>
      <button className="btn btn-g" onClick={handleSaveSettings} disabled={saving} style={{ marginTop: 16, marginBottom: 24 }}>{saving ? 'Saving…' : 'Save Settings'}</button>
      <hr style={{ margin: '4px 0 20px', borderColor: 'var(--border)' }} />
      <label className="fl">Target Audience</label>
      <select className="fi" value={notif.target_type} onChange={e => setNotif(p => ({ ...p, target_type: e.target.value }))}>
        <option value="all">All Users</option>
        <option value="donors">Donors Only</option>
        <option value="creators">Creators Only</option>
      </select>
      <label className="fl">Title</label>
      <input type="text" className="fi" value={notif.title} onChange={e => setNotif(p => ({ ...p, title: e.target.value }))} placeholder="Notification title" />
      <label className="fl">Body</label>
      <textarea className="fi" rows="3" value={notif.body} onChange={e => setNotif(p => ({ ...p, body: e.target.value }))} placeholder="Notification message" />
      <button className="btn btn-g" onClick={handleSend} disabled={sending}>{sending ? 'Sending…' : <><Send size={14} /> Send Push Notification</>}</button>
      {history.length > 0 && (
        <div style={{ marginTop: 24, maxHeight: 300, overflowY: 'auto' }}>
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>History</div>
          {history.slice(0, 10).map((h, i) => (
            <div key={h.id || i} style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
              <div><strong>{h.title}</strong></div>
              <div style={{ fontSize: 12, color: 'var(--txt-2)' }}>{h.body}</div>
              <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 4 }}>{h.target_type} · {new Date(h.sent_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AuditLogs ─────────────────────────────────────
function AuditLogs({ logs }) {
  const [filter, setFilter] = useState('');
  if (!logs.length) return <div style={{ color: 'var(--txt-3)' }}>No audit logs yet.</div>;
  const actions  = [...new Set(logs.map(l => l.action))];
  const filtered = filter ? logs.filter(l => l.action === filter) : logs;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className={`db ${!filter ? 'dba' : 'dbv'}`} onClick={() => setFilter('')}>All</button>
        {actions.map(a => <button key={a} className={`db ${filter === a ? 'dba' : 'dbv'}`} onClick={() => setFilter(a)}>{a.replace(/_/g, ' ')}</button>)}
      </div>
      <table className="ut">
        <thead><tr><th>Admin</th><th>Action</th><th>Entity</th><th>Details</th><th>Time</th></tr></thead>
        <tbody>
          {filtered.map(log => (
            <tr key={log.id}>
              <td>{log.admin_name || 'System'}</td>
              <td><span className="badge br">{log.action}</span></td>
              <td>{log.entity_type} #{log.entity_id}</td>
              <td><small style={{ color: 'var(--txt-3)' }}>{log.details ? JSON.stringify(log.details).substring(0, 50) : '-'}</small></td>
              <td><small>{new Date(log.created_at).toLocaleString()}</small></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main AdminDashboard ───────────────────────────
export default function AdminDashboard() {
  injectStyles();

  const { currentUser, logout, showToast, loading: sessionLoading } = useApp();
  const navigate = useNavigate();

  const [authChecked,         setAuthChecked]         = useState(false);
  const [activeTab,           setActiveTab]           = useState('overview');
  const [dataLoading,         setDataLoading]         = useState(false);
  const [darkMode,            setDarkMode]            = useState(localStorage.getItem('hb_darkmode') === 'true');
  const [settingsTab,         setSettingsTab]         = useState('security');
  const [showChangePassword,  setShowChangePassword]  = useState(false);
  const [deleteUserModal,     setDeleteUserModal]     = useState({ open: false, userId: null, userName: '' });
  const [showAddUserModal,    setShowAddUserModal]    = useState(false);
  const [newUser,             setNewUser]             = useState({ name: '', email: '', password: '', role: 'donor', is_verified: true });
  const [addingUser,          setAddingUser]          = useState(false);
  const [newDonationAlert,    setNewDonationAlert]    = useState(null);
  const [lastDonationCheck,   setLastDonationCheck]   = useState(Date.now());

  // Settings
  const [themeSettings,    setThemeSettings]    = useState({ '--primary': '#e8531e', '--primary-dark': '#c4400f', '--secondary': '#27a96c', '--dark': '#1a1a2e' });
  const [integrationKeys,  setIntegrationKeys]  = useState({ smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '', recaptcha_site_key: '', recaptcha_secret_key: '' });
  const [socialLinks,      setSocialLinks]      = useState({ facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' });

  // Toggles
  const [maintenanceMode,       setMaintenanceMode]       = useState({ enabled: false, message: '' });
  const [verificationEnabled,   setVerificationEnabled]   = useState(true);
  const [recaptchaEnabled,      setRecaptchaEnabled]      = useState(false);
  const [pushNotifEnabled,      setPushNotifEnabled]      = useState(true);
  const [togglingMaintenance,   setTogglingMaintenance]   = useState(false);
  const [togglingVerification,  setTogglingVerification]  = useState(false);
  const [togglingRecaptcha,     setTogglingRecaptcha]     = useState(false);

  // Data
  const [stats,               setStats]               = useState({ total_raised: 0, total_campaigns: 0, pending_campaigns: 0, total_users: 0 });
  const [campaigns,           setCampaigns]           = useState([]);
  const [users,               setUsers]               = useState([]);
  const [donations,           setDonations]           = useState([]);
  const [depositRequests,     setDepositRequests]     = useState([]);
  const [withdrawalRequests,  setWithdrawalRequests]  = useState([]);
  const [completionRequests,  setCompletionRequests]  = useState([]);
  const [payouts,             setPayouts]             = useState([]);
  const [feeSettings,         setFeeSettings]         = useState({ percentage: 0, fixed_amount: 0, min_fee: 0, withdrawal_fee: 0, minimum_withdrawal: 10 });
  const [notifHistory,        setNotifHistory]        = useState([]);
  const [auditLogs,           setAuditLogs]           = useState([]);
  const [content,             setContent]             = useState({ hero_title: 'Together We Can', hero_subtitle: 'Support causes you care about.', hero_badge: 'HopeBridge', impact_title: 'Our Impact', impact_subtitle: 'Every donation counts', impact_stats: { raised: '$0', campaigns: '0', donors: '0' }, social_links: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' } });

  // Dark mode
  useEffect(() => { document.body.classList.toggle('dark-mode', darkMode); localStorage.setItem('hb_darkmode', darkMode); }, [darkMode]);

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
        safeGet(() => adminApi.getStats(),                    { stats: {} }),
        safeGet(() => adminApi.getCampaigns(),                { campaigns: [] }),
        safeGet(() => adminApi.getUsers(),                    { users: [] }),
        safeGet(() => adminApi.getDonations(),                { donations: [] }),
        safeGet(() => adminApi.getDepositRequests?.(),        { requests: [] }),
        safeGet(() => adminApi.getWithdrawalRequests?.(),     { withdrawals: [] }),
        safeGet(() => adminApi.getCompletionRequests?.(),     { campaigns: [] }),
        safeGet(() => adminApi.getContent(),                  { content: null }),
      ]);
      const ps = { ...(s.stats || {}) };
      ['total_raised','total_campaigns','pending_campaigns','total_users'].forEach(k => { if (ps[k] !== undefined) ps[k] = toNum(ps[k]); });
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
      safeGet(() => adminApi.getPayouts?.(),            { payouts: [] }),
      safeGet(() => adminApi.getFeeSettings?.(),        { percentage: 0, fixed_amount: 0, min_fee: 0, withdrawal_fee: 0, minimum_withdrawal: 10 }),
      safeGet(() => adminApi.getNotificationHistory?.(), { notifications: [] }),
      safeGet(() => adminApi.getAuditLogs?.(),          { logs: [] }),
      safeGet(() => adminApi.getSettings(),             { settings: null }),
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

  // Toggle handlers
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

  // CRUD handlers
  const handleApproveCampaign = async id => { try { await adminApi.updateCampaign(id, { status: 'approved' }); showToast('Campaign approved'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectCampaign  = async id => { try { await adminApi.updateCampaign(id, { status: 'rejected' }); showToast('Campaign rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleDeleteCampaign  = async id => { if (!window.confirm('Delete permanently?')) return; try { await campaignApi.delete(id); showToast('Deleted'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleToggleUser      = async id => { try { await adminApi.toggleUser(id); showToast('User updated'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleVerifyUser      = async id => { try { await adminApi.verifyUser?.(id); showToast('User verified'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleUnverifyUser    = async id => { try { await adminApi.unverifyUser?.(id); showToast('User unverified'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleDeleteUser      = async id => { try { await adminApi.deleteUser?.(id); showToast('User deleted'); fetchAll(); } catch (err) { throw err; } };
  const handleApproveDeposit  = async (id, amount) => { try { await adminApi.updateDepositRequest?.(id, { status: 'approved' }); showToast('Deposit approved'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectDeposit   = async id => { try { await adminApi.updateDepositRequest?.(id, { status: 'rejected' }); showToast('Deposit rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleProvideInstructions = async (id, inst) => { try { await adminApi.updateDepositRequest?.(id, { admin_instructions: inst, status: 'instructions_sent' }); showToast('Instructions sent'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleApproveWithdrawal   = async id => { try { await adminApi.approveWithdrawal(id); showToast('Withdrawal approved'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectWithdrawal    = async id => { const r = prompt('Reason:'); if (!r) return; try { await adminApi.rejectWithdrawal(id, r); showToast('Withdrawal rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleReleaseEscrow       = async id => { try { await adminApi.releaseCampaignEscrow(id); showToast('Escrow released'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRefundEscrow        = async id => { try { await adminApi.refundCampaignEscrow(id); showToast('Escrow refunded'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleSaveContent         = async c => { try { await adminApi.saveContent(c); setContent(c); showToast('Content updated'); } catch (err) { showToast(err.message, true); } };
  const handleSaveSettings        = async () => { try { await adminApi.saveSettings({ theme: themeSettings, keys: integrationKeys }); showToast('Settings saved'); } catch (err) { showToast(err.message, true); } };
  const handleSaveFees            = async data => { try { await adminApi.updateFeeSettings?.(data); setFeeSettings(data); showToast('Fee settings saved'); } catch (err) { showToast(err.message, true); } };
  const handleMarkPayoutPaid      = async id => { try { await adminApi.markPayoutAsPaid?.(id); showToast('Marked as paid'); fetchExtras(); } catch (err) { showToast(err.message, true); } };
  const handleSaveNotifSettings   = async data => { try { await adminApi.updateNotificationSettings?.(data); setPushNotifEnabled(data.enabled); showToast('Saved'); } catch (err) { showToast(err.message, true); } };
  const handleSendPushNotif       = async data => { try { await adminApi.sendPushNotification?.(data); showToast('Notification sent'); fetchExtras(); } catch (err) { showToast(err.message, true); } };
  const handleChangePassword      = async data => { await adminApi.changePassword?.(data); };
  const handleAddUserSubmit       = async e => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) { showToast('Fill all required fields', true); return; }
    setAddingUser(true);
    try { await adminApi.addUser?.(newUser); showToast(`${newUser.name} added`); setShowAddUserModal(false); setNewUser({ name: '', email: '', password: '', role: 'donor', is_verified: true }); fetchAll(); }
    catch (err) { showToast(err.message, true); } finally { setAddingUser(false); }
  };
  const handleLogout = () => { logout(); navigate('/'); };

  if (sessionLoading || !authChecked) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading admin panel…</div>;

  // Derived
  const totalRaised        = campaigns.reduce((s, c) => s + c.raised, 0);
  const activeCampaigns    = campaigns.filter(c => c.status === 'active' || c.status === 'approved').length;
  const pendingCampaigns   = campaigns.filter(c => c.status === 'pending' || c.status === 'review').length;
  const donorsCount        = users.filter(u => u.role === 'donor').length;
  const creatorsCount      = users.filter(u => u.role === 'creator').length;
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending').length;
  const pendingCompletions = completionRequests.length;

  const tabLabel = t => ({
    email_templates: 'Email Templates', notifications: 'Notifications',
    'audit-logs': 'Audit Logs', fees: 'Fee Settings', payouts: 'Payouts',
  }[t] || (t.charAt(0).toUpperCase() + t.slice(1)));

  const SideNavBtn = ({ id, label, icon, badge, badgeClass = '' }) => (
    <button className={`nl ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
      {icon}{label}
      {badge > 0 && <span className={`nb ${badgeClass}`}>{badge}</span>}
    </button>
  );

  return (
    <div className="shell">
      {/* ── Sidebar ── */}
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
          <div className="nav-sec">Main</div>
          <SideNavBtn id="overview"   label="Dashboard"   icon={<LayoutDashboard size={18} />} />
          <SideNavBtn id="campaigns"  label="Campaigns"   icon={<Target size={18} />} badge={pendingCampaigns} />
          <SideNavBtn id="users"      label="Users"       icon={<Users size={18} />} />
          <div className="nav-sec">Finance</div>
          <SideNavBtn id="donations"   label="Donations"    icon={<DollarSign size={18} />} />
          <SideNavBtn id="deposits"    label="Deposits"     icon={<CreditCard size={18} />} />
          <SideNavBtn id="withdrawals" label="Withdrawals"  icon={<Banknote size={18} />} badge={pendingWithdrawals} badgeClass="am" />
          <SideNavBtn id="payouts"     label="Payouts"      icon={<Receipt size={18} />} />
          <SideNavBtn id="fees"        label="Fee Settings" icon={<DollarSign size={18} />} />
          <div className="nav-sec">Operations</div>
          <SideNavBtn id="completions"    label="Completions"    icon={<CheckCircle size={18} />} badge={pendingCompletions} badgeClass="am" />
          <SideNavBtn id="notifications"  label="Notifications"  icon={<Bell size={18} />} />
          <SideNavBtn id="audit-logs"     label="Audit Logs"     icon={<History size={18} />} />
          <SideNavBtn id="maintenance"    label="Maintenance"    icon={<Settings size={18} />} />
          <div className="nav-sec">Admin</div>
          <SideNavBtn id="email_templates" label="Email Templates" icon={<MailIcon size={18} />} />
          <SideNavBtn id="massmail"        label="Mass Mail"        icon={<Send size={18} />} />
          <SideNavBtn id="content"         label="Content"          icon={<FileText size={18} />} />
          <SideNavBtn id="settings"        label="Settings"         icon={<Settings size={18} />} />
          <button className="nl" onClick={() => setDarkMode(d => !d)} style={{ marginTop: 8 }}>
            {darkMode ? <Gift size={18} /> : <Gift size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
        <div className="sb-footer">
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main">
        <div className="topbar">
          <div className="tb-title">{tabLabel(activeTab)}</div>
          <div className="tb-actions">
            <div className="tb-btn" style={{ position: 'relative' }}>
              <Bell size={18} />
              {newDonationAlert && <div className="ndot" style={{ background: 'var(--green)' }} />}
            </div>
            <div className="tb-btn" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>SA</div>
            </div>
          </div>
        </div>
        <div className="mob-top"><div className="mob-logo">HopeBridge</div></div>

        <div className="page">
          {dataLoading && <div style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>Loading data…</div>}

          {/* ── Overview ── */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="ov-hero">
              <div className="hero-row">
                <div>
                  <div className="hero-g">Good morning, Administrator</div>
                  <div className="hero-t">HopeBridge<br /><em>Admin Console</em></div>
                  <div className="hero-s">{pendingCampaigns} campaigns awaiting review</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Platform Status</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: maintenanceMode.enabled ? 'rgba(239,159,39,0.4)' : 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {maintenanceMode.enabled ? <><Settings size={12} /> Maintenance</> : <><CheckCircle size={12} /> Live</>}
                  </div>
                </div>
              </div>
              <div className="hero-stats">
                <div className="hst"><div className="hst-v">{donorsCount}</div><div className="hst-l">Donors</div></div>
                <div className="hst"><div className="hst-v">{creatorsCount}</div><div className="hst-l">Creators</div></div>
                <div className="hst"><div className="hst-v">${(totalRaised / 1000).toFixed(0)}k</div><div className="hst-l">Raised</div></div>
                <div className="hst"><div className="hst-v">{campaigns.length}</div><div className="hst-l">Campaigns</div></div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="sc"><div className="si si-g"><Users size={18} /></div><div className="sv">{users.length}</div><div className="sl">Total Users</div></div>
              <div className="sc"><div className="si si-b"><Target size={18} /></div><div className="sv">{activeCampaigns}</div><div className="sl">Active Campaigns</div></div>
              <div className="sc"><div className="si si-a"><DollarSign size={18} /></div><div className="sv">${(totalRaised / 1000).toFixed(0)}k</div><div className="sl">Total Raised</div></div>
              <div className="sc"><div className="si si-r"><Clock size={18} /></div><div className="sv">{pendingCompletions}</div><div className="sl">Pending Completions</div></div>
            </div>

            {/* Quick Toggles */}
            <div className="sh" style={{ marginBottom: 12 }}><div className="sht"><Settings size={18} /> Quick Toggles</div></div>
            <div className="qt-grid">
              {[
                { label: 'Maintenance Mode', sub: maintenanceMode.enabled ? 'Enabled' : 'Disabled', on: maintenanceMode.enabled, icon: <Settings size={18} />, iconBg: maintenanceMode.enabled ? 'var(--amber-l)' : 'var(--surface-2)', iconColor: maintenanceMode.enabled ? '#854F0B' : 'var(--txt-3)', onChange: handleToggleMaintenance, danger: true, disabled: togglingMaintenance },
                { label: 'Email Verification', sub: verificationEnabled ? 'Required' : 'Skipped', on: verificationEnabled, icon: <MailIcon size={18} />, iconBg: verificationEnabled ? 'var(--green-l)' : 'var(--surface-2)', iconColor: verificationEnabled ? 'var(--green-d)' : 'var(--txt-3)', onChange: handleToggleVerification, disabled: togglingVerification },
                { label: 'reCAPTCHA', sub: recaptchaEnabled ? 'Active' : 'Inactive', on: recaptchaEnabled, icon: <Shield size={18} />, iconBg: recaptchaEnabled ? 'var(--blue-l)' : 'var(--surface-2)', iconColor: recaptchaEnabled ? '#185FA5' : 'var(--txt-3)', onChange: handleToggleRecaptcha, disabled: togglingRecaptcha },
                { label: 'Dark Mode', sub: darkMode ? 'Dark' : 'Light', on: darkMode, icon: <Settings size={18} />, iconBg: 'var(--surface-2)', iconColor: 'var(--txt-3)', onChange: setDarkMode },
              ].map(({ label, sub, on, icon, iconBg, iconColor, onChange, danger, disabled }) => (
                <div key={label} className="qt-card">
                  <div>
                    <div className="qt-label">{label}</div>
                    <div className="qt-sub"><span className={`status-pill ${on ? 'on' : 'off'}`}><span className="status-dot" />{sub}</span></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="qt-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
                    <Toggle checked={on} onChange={onChange} danger={danger} disabled={disabled} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="sh" style={{ marginBottom: 12 }}><div className="sht"><Zap size={18} /> Quick Actions</div></div>
            <div className="qg">
              {[
                { id: 'campaigns',       label: 'Campaigns',    icon: <Target size={18} /> },
                { id: 'users',           label: 'Users',        icon: <Users size={18} /> },
                { id: 'deposits',        label: 'Deposits',     icon: <CreditCard size={18} /> },
                { id: 'withdrawals',     label: 'Withdrawals',  icon: <Banknote size={18} /> },
                { id: 'payouts',         label: 'Payouts',      icon: <Receipt size={18} /> },
                { id: 'completions',     label: 'Completions',  icon: <CheckCircle size={18} /> },
                { id: 'fees',            label: 'Fees',         icon: <DollarSign size={18} /> },
                { id: 'notifications',   label: 'Push',         icon: <Bell size={18} /> },
                { id: 'audit-logs',      label: 'Audit',        icon: <History size={18} /> },
                { id: 'email_templates', label: 'Email',        icon: <MailIcon size={18} /> },
                { id: 'massmail',        label: 'Mass Mail',    icon: <Send size={18} /> },
                { id: 'content',         label: 'Content',      icon: <FileText size={18} /> },
                { id: 'settings',        label: 'Settings',     icon: <Settings size={18} /> },
                { id: 'maintenance',     label: 'Maintenance',  icon: <Settings size={18} /> },
                { id: 'logout',          label: 'Sign Out',     icon: <LogOut size={18} />, danger: true },
              ].map(({ id, label, icon, danger }) => (
                <button key={id} className={`qb ${danger ? 'qx' : ''}`} onClick={() => id === 'logout' ? handleLogout() : setActiveTab(id)}>
                  <div className="qi">{icon}</div>
                  <span className="ql">{label}</span>
                </button>
              ))}
            </div>

            <div className="three-col">
              <div className="card">
                <div className="card-h"><div className="card-t"><Target size={18} /> Pending Approvals</div><button className="card-a" onClick={() => setActiveTab('campaigns')}>View all <ArrowRight size={14} /></button></div>
                <div className="card-b">
                  {campaigns.filter(c => c.status === 'pending').slice(0, 3).map(c => (
                    <div key={c.id} className="cr">
                      <div className="ci"><div className="cn">{c.title}</div><div className="cm">Goal: ${c.goal.toLocaleString()} · {c.creator_name}</div><div className="pb"><div className="pf" style={{ width: `${Math.min((c.raised / c.goal) * 100, 100)}%` }} /></div></div>
                      <span className="badge bp">pending</span>
                      <button className="db dba" onClick={() => handleApproveCampaign(c.id)}><CheckCircle size={12} /> Approve</button>
                    </div>
                  ))}
                  {!pendingCampaigns && <div style={{ color: 'var(--txt-3)', fontSize: 13 }}>No pending campaigns</div>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card">
                  <div className="card-h"><div className="card-t"><CheckCircle size={18} /> Completions</div><button className="card-a" onClick={() => setActiveTab('completions')}>Manage <ArrowRight size={14} /></button></div>
                  <div className="card-b">
                    {completionRequests.slice(0, 2).map(req => (
                      <div key={req.id} className="di">
                        <div className="uav ava" style={{ width: 32, height: 32, fontSize: 11 }}>{req.title?.charAt(0) || 'C'}</div>
                        <div className="di-info"><div className="di-user">{req.title}</div><div className="di-amt"><Calendar size={10} /> {new Date(req.completion_requested_at).toLocaleDateString()}</div></div>
                        <button className="db dba" onClick={() => setActiveTab('completions')}>Review</button>
                      </div>
                    ))}
                    {!pendingCompletions && <div style={{ color: 'var(--txt-3)', fontSize: 13 }}>No requests</div>}
                  </div>
                </div>
                <div className="card">
                  <div className="card-h"><div className="card-t"><Clock size={18} /> Withdrawal Queue</div><button className="card-a" onClick={() => setActiveTab('withdrawals')}>Manage <ArrowRight size={14} /></button></div>
                  <div className="card-b">
                    {withdrawalRequests.filter(w => w.status === 'pending').slice(0, 2).map(req => (
                      <div key={req.id} className="di">
                        <div className="uav ava" style={{ width: 32, height: 32, fontSize: 11 }}>{req.name?.[0] || 'U'}</div>
                        <div className="di-info"><div className="di-user">{req.name}</div><div className="di-amt"><DollarSign size={10} /> ${req.amount.toFixed(2)}</div></div>
                        <div className="di-acts">
                          <button className="db dba" onClick={() => handleApproveWithdrawal(req.id)}><CheckCircle size={12} /></button>
                          <button className="db dbr" onClick={() => handleRejectWithdrawal(req.id)}><X size={12} /></button>
                        </div>
                      </div>
                    ))}
                    {!pendingWithdrawals && <div style={{ color: 'var(--txt-3)', fontSize: 13 }}>No pending withdrawals</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Campaigns ── */}
          <div className={`ps ${activeTab === 'campaigns' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Target size={18} /> Campaign Management</div></div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}>
              <table className="ut">
                <thead><tr><th style={{ paddingLeft: 20 }}>Campaign</th><th>Goal</th><th>Raised</th><th>Progress</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
                <tbody>{campaigns.map(c => (
                  <tr key={c.id}>
                    <td style={{ paddingLeft: 20 }}><div style={{ fontWeight: 600 }}>{c.title}</div><small style={{ color: 'var(--txt-3)' }}>{c.creator_name}</small></td>
                    <td>${c.goal.toLocaleString()}</td>
                    <td>${c.raised.toLocaleString()}</td>
                    <td><div className="pb" style={{ width: 80 }}><div className="pf" style={{ width: `${Math.min((c.raised / c.goal) * 100, 100)}%` }} /></div>{Math.round((c.raised / c.goal) * 100)}%</td>
                    <td><span className={`badge ${c.status === 'approved' ? 'ba' : c.status === 'pending' ? 'bp' : 'br'}`}>{c.status}</span></td>
                    <td style={{ paddingRight: 20 }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {c.status === 'pending' && <><button className="db dba" onClick={() => handleApproveCampaign(c.id)}><CheckCircle size={12} /> Approve</button><button className="db dbr" onClick={() => handleRejectCampaign(c.id)}><X size={12} /> Reject</button></>}
                        <button className="db dbr" onClick={() => handleDeleteCampaign(c.id)}><Trash2 size={12} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div></div>
          </div>

          {/* ── Users ── */}
          <div className={`ps ${activeTab === 'users' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Users size={18} /> User Management</div><button className="btn btn-g" onClick={() => setShowAddUserModal(true)}><Plus size={16} /> Add User</button></div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}>
              <table className="ut">
                <thead><tr><th style={{ paddingLeft: 20 }}>User</th><th>Role</th><th>Joined</th><th>Wallet</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead>
                <tbody>{users.map(u => (
                  <tr key={u.id}>
                    <td style={{ paddingLeft: 20 }}><div className="uc"><div className="uav avg">{u.name?.charAt(0)}</div><div><div style={{ fontWeight: 600 }}>{u.name}</div><small style={{ color: 'var(--txt-3)' }}>{u.email}</small></div></div></td>
                    <td><span className="badge br">{u.role}</span></td>
                    <td style={{ color: 'var(--txt-2)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>${(u.wallet_balance || 0).toFixed(2)}</td>
                    <td><span className={`badge ${u.is_active ? 'ba' : 'bx'}`}>{u.is_active ? 'Active' : 'Suspended'}</span></td>
                    <td style={{ paddingRight: 20 }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <button className="db dbv" onClick={() => handleToggleUser(u.id)}>{u.is_active ? <Lock size={12} /> : <Unlock size={12} />} {u.is_active ? 'Suspend' : 'Restore'}</button>
                        {!u.is_verified && u.role !== 'admin' && <button className="db dba" onClick={() => handleVerifyUser(u.id)}><CheckCircle size={12} /> Verify</button>}
                        {u.role !== 'admin' && <button className="db dbr" onClick={() => setDeleteUserModal({ open: true, userId: u.id, userName: u.name })}><Trash2 size={12} /> Delete</button>}
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div></div>
          </div>

          {/* ── Donations ── */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><DollarSign size={18} /> All Donations</div></div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}>
              <table className="ut">
                <thead><tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Monthly</th><th>Date</th></tr></thead>
                <tbody>{donations.map(d => (
                  <tr key={d.id}><td>{d.donor_name || 'Anonymous'}</td><td>{d.campaign_title}</td><td>${d.amount.toLocaleString()}</td><td>{d.is_monthly ? '✅' : '—'}</td><td>{new Date(d.created_at).toLocaleDateString()}</td></tr>
                ))}</tbody>
              </table>
            </div></div>
          </div>

          {/* ── Deposits ── */}
          <div className={`ps ${activeTab === 'deposits' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><CreditCard size={18} /> Deposit Requests</div></div>
            <div className="card"><div className="card-b"><DepositRequestsManager requests={depositRequests} onApprove={handleApproveDeposit} onReject={handleRejectDeposit} onProvideInstructions={handleProvideInstructions} showToast={showToast} /></div></div>
          </div>

          {/* ── Withdrawals ── */}
          <div className={`ps ${activeTab === 'withdrawals' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Banknote size={18} /> Withdrawal Requests</div></div>
            <div className="card"><div className="card-b"><WithdrawalRequestsManager requests={withdrawalRequests} onApprove={handleApproveWithdrawal} onReject={handleRejectWithdrawal} /></div></div>
          </div>

          {/* ── Completions ── */}
          <div className={`ps ${activeTab === 'completions' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><CheckCircle size={18} /> Campaign Completions</div></div>
            <div className="card"><div className="card-b"><CompletionRequestsManager requests={completionRequests} onRelease={handleReleaseEscrow} onRefund={handleRefundEscrow} /></div></div>
          </div>

          {/* ── Payouts ── */}
          <div className={`ps ${activeTab === 'payouts' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Receipt size={18} /> Payout Reconciliation</div></div>
            <div className="card"><div className="card-b"><PayoutsManager payouts={payouts} onMarkPaid={handleMarkPayoutPaid} showToast={showToast} /></div></div>
          </div>

          {/* ── Fee Settings ── */}
          <div className={`ps ${activeTab === 'fees' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><DollarSign size={18} /> Transaction Fee Settings</div></div>
            <div className="card"><div className="card-b"><FeeSettings fees={feeSettings} onSave={handleSaveFees} showToast={showToast} /></div></div>
          </div>

          {/* ── Notifications ── */}
          <div className={`ps ${activeTab === 'notifications' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Bell size={18} /> Push Notifications</div></div>
            <div className="card"><div className="card-b"><NotificationManager settings={{ enabled: pushNotifEnabled }} onSave={handleSaveNotifSettings} onSend={handleSendPushNotif} history={notifHistory} showToast={showToast} /></div></div>
          </div>

          {/* ── Audit Logs ── */}
          <div className={`ps ${activeTab === 'audit-logs' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><History size={18} /> Audit Logs</div></div>
            <div className="card"><div className="card-b"><AuditLogs logs={auditLogs} /></div></div>
          </div>

          {/* ── Email Templates ── */}
          <div className={`ps ${activeTab === 'email_templates' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><MailIcon size={18} /> Email Templates</div><div style={{ fontSize: 13, color: 'var(--txt-3)' }}>Customise every transactional email</div></div>
            <div className="card"><div className="card-b"><EmailTemplateEditor showToast={showToast} /></div></div>
          </div>

          {/* ── Mass Mail ── */}
          <div className={`ps ${activeTab === 'massmail' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><Send size={18} /> Broadcast Email</div></div><div className="card-b"><MassMailForm showToast={showToast} /></div></div>
          </div>

          {/* ── Content ── */}
          <div className={`ps ${activeTab === 'content' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><FileText size={18} /> Platform Content</div></div><div className="card-b"><ContentEditor content={content} onSave={handleSaveContent} showToast={showToast} /></div></div>
          </div>

          {/* ── Maintenance ── */}
          <div className={`ps ${activeTab === 'maintenance' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Settings size={18} /> Maintenance Mode</div></div>
            <div className="card"><div className="card-b">
              <div className="toggle-row">
                <div className="toggle-info"><strong>Enable Maintenance Mode</strong><p>Only admins can access the site when enabled</p></div>
                <Toggle checked={maintenanceMode.enabled} onChange={handleToggleMaintenance} danger disabled={togglingMaintenance} />
              </div>
              {maintenanceMode.enabled && (
                <div style={{ marginTop: 20 }}>
                  <label className="fl">Message shown to users</label>
                  <textarea className="fi" rows="3" value={maintenanceMode.message} onChange={e => setMaintenanceMode(p => ({ ...p, message: e.target.value }))} placeholder="We're performing scheduled maintenance. Please check back soon!" />
                  <button className="btn btn-g" onClick={async () => { try { await adminApi.saveSettings({ keys: { maintenance_message: maintenanceMode.message } }); showToast('Message saved'); } catch (err) { showToast(err.message, true); } }}>Save Message</button>
                  <div style={{ marginTop: 16, padding: 14, background: 'var(--amber-l)', borderRadius: 'var(--r-md)', fontSize: 13, color: '#854F0B' }}>
                    <strong>Preview:</strong> "{maintenanceMode.message || 'We are currently under maintenance.'}"
                  </div>
                </div>
              )}
              {!maintenanceMode.enabled && (
                <div style={{ marginTop: 16, padding: 14, background: 'var(--green-l)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--green-d)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={14} /> Site is live — all users can access HopeBridge normally.
                </div>
              )}
            </div></div>
          </div>

          {/* ── Settings ── */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><Settings size={18} /> System Settings</div></div><div className="card-b">
              <div className="settings-tabs">
                {['security', 'theme', 'keys', 'social'].map(t => (
                  <button key={t} className={`role-tab ${settingsTab === t ? 'active' : ''}`} onClick={() => setSettingsTab(t)}>
                    {t === 'security' ? 'Security' : t === 'theme' ? 'Theme' : t === 'keys' ? 'Integration Keys' : 'Social Links'}
                  </button>
                ))}
              </div>

              {settingsTab === 'security' && (
                <div>
                  <div className="toggle-row">
                    <div className="toggle-info"><strong>Email Verification</strong><p>Require new users to verify their email</p></div>
                    <Toggle checked={verificationEnabled} onChange={handleToggleVerification} disabled={togglingVerification} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-info"><strong>reCAPTCHA Protection</strong><p>Google reCAPTCHA on login and registration</p></div>
                    <Toggle checked={recaptchaEnabled} onChange={handleToggleRecaptcha} disabled={togglingRecaptcha} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-info"><strong>Maintenance Mode</strong><p>Only admins can access the site</p></div>
                    <Toggle checked={maintenanceMode.enabled} onChange={handleToggleMaintenance} danger disabled={togglingMaintenance} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-info"><strong>Change Admin Password</strong><p>Update your account password</p></div>
                    <button className="btn btn-g" onClick={() => setShowChangePassword(true)}><Lock size={14} /> Change Password</button>
                  </div>
                  {recaptchaEnabled && (
                    <div style={{ marginTop: 24, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>reCAPTCHA Keys</div>
                      <label className="fl">Site Key</label>
                      <input type="text" className="fi" value={integrationKeys.recaptcha_site_key || ''} onChange={e => setIntegrationKeys(p => ({ ...p, recaptcha_site_key: e.target.value }))} placeholder="6LeIxAcT..." />
                      <label className="fl">Secret Key</label>
                      <input type="password" className="fi" value={integrationKeys.recaptcha_secret_key || ''} onChange={e => setIntegrationKeys(p => ({ ...p, recaptcha_secret_key: e.target.value }))} placeholder="6LeIxAcT..." />
                      <button className="btn btn-g" onClick={handleSaveSettings}>Save reCAPTCHA Keys</button>
                    </div>
                  )}
                </div>
              )}

              {settingsTab === 'theme' && (
                <div>
                  {Object.entries(themeSettings).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <label className="fl">{key}</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input type="color" value={value} onChange={e => setThemeSettings(p => ({ ...p, [key]: e.target.value }))} style={{ width: 50, height: 42, padding: 2, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }} />
                        <input type="text" className="fi" value={value} onChange={e => setThemeSettings(p => ({ ...p, [key]: e.target.value }))} style={{ marginBottom: 0 }} />
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-g" onClick={handleSaveSettings}>Save Theme</button>
                </div>
              )}

              {settingsTab === 'keys' && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>SMTP Settings</div>
                  {[['smtp_host','SMTP Host','smtp.sendgrid.net'],['smtp_port','SMTP Port','587'],['smtp_user','SMTP User','apikey'],['smtp_pass','SMTP Password','••••••••']].map(([k, label, ph]) => (
                    <div key={k}>
                      <label className="fl">{label}</label>
                      <input type={k === 'smtp_pass' ? 'password' : 'text'} className="fi" value={integrationKeys[k] || ''} onChange={e => setIntegrationKeys(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} />
                    </div>
                  ))}
                  <button className="btn btn-g" onClick={handleSaveSettings}>Save SMTP</button>
                </div>
              )}

              {settingsTab === 'social' && (
                <div>
                  {['facebook','twitter','instagram','youtube','linkedin'].map(p => (
                    <div key={p}>
                      <label className="fl">{p.charAt(0).toUpperCase() + p.slice(1)}</label>
                      <input type="text" className="fi" value={socialLinks[p] || ''} onChange={e => setSocialLinks(prev => ({ ...prev, [p]: e.target.value }))} placeholder={`https://${p}.com/...`} />
                    </div>
                  ))}
                  <button className="btn btn-g" onClick={async () => { try { await adminApi.saveContent({ ...content, social_links: socialLinks }); showToast('Social links saved'); } catch (err) { showToast(err.message, true); } }}>Save Social Links</button>
                </div>
              )}
            </div></div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="bnav">
        <div className="bnav-inner">
          {[
            { id: 'overview',     icon: <LayoutDashboard size={20} />, label: 'Home' },
            { id: 'campaigns',    icon: <Target size={20} />,          label: 'Campaigns' },
            { id: 'deposits',     icon: <CreditCard size={20} />,      label: 'Deposits' },
            { id: 'withdrawals',  icon: <Banknote size={20} />,        label: 'Withdrawals' },
            { id: 'notifications',icon: <Bell size={20} />,            label: 'Alerts' },
            { id: 'settings',     icon: <Settings size={20} />,        label: 'Settings' },
          ].map(({ id, icon, label }) => (
            <button key={id} className={`bni ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              <div className="bni-icon" style={{ color: activeTab === id ? 'var(--green)' : 'var(--txt-3)' }}>{icon}</div>
              <span className="bni-lbl">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Modals */}
      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} onSave={handleChangePassword} showToast={showToast} />
      <DeleteUserModal isOpen={deleteUserModal.open} onClose={() => setDeleteUserModal({ open: false, userId: null, userName: '' })} onConfirm={() => handleDeleteUser(deleteUserModal.userId)} userName={deleteUserModal.userName} showToast={showToast} />
      <AddUserModal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} onSubmit={handleAddUserSubmit} userData={newUser} setUserData={setNewUser} loading={addingUser} />
    </div>
  );
}