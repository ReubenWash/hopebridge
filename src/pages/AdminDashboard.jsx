import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { adminApi, campaignApi } from '../services/api';
import {
  Heart, LayoutDashboard, Users, DollarSign, Settings, LogOut,
  Bell, Target, CreditCard, Plus, CheckCircle, Clock, FileText,
  ArrowRight, Zap, Shield, Calendar, Send, Eye, EyeOff,
  Banknote, History, X, Receipt, Lock, Unlock,
  Mail as MailIcon, Trash2, RefreshCw, Image,
  Edit, Wallet, TrendingUp, TrendingDown, UserCheck,
  AlertCircle, ChevronDown, Menu,
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
    .shell{display:flex;min-height:100vh;overflow-x:hidden}
    .sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:200;overflow-y:auto;transition:left 0.3s ease;}
    .sidebar.mobile-closed{left:-260px;}
    @media (max-width: 768px) { .sidebar { left: -260px; } .sidebar.mobile-open { left: 0; } }
    .sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:150;display:none;}
    .sidebar-overlay.open{display:block;}
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
    .nb{margin-left:auto;font-size:10px;font-weight:700;background:var(--red);color:#fff;padding:2px 7px;border-radius:20px;min-width:18px;text-align:center}
    .nb.am{background:var(--amber)}.nb.gr{background:var(--green)}
    .sb-footer{padding:12px 10px;border-top:1px solid var(--border)}
    .main{flex:1;margin-left:var(--sidebar-w);display:flex;flex-direction:column;min-height:100vh;max-width:calc(100% - var(--sidebar-w));overflow-x:hidden}
    .topbar{height:var(--topbar-h);background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 28px;gap:16px;position:sticky;top:0;z-index:100}
    .tb-title{font-family:var(--fd);font-size:22px;color:var(--txt);flex:1}
    .tb-actions{display:flex;align-items:center;gap:10px}
    .tb-btn{width:38px;height:38px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:background var(--tr)}
    .tb-btn:hover{background:var(--bg)}
    .notif-panel{position:absolute;top:calc(100% + 8px);right:0;width:340px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--sh-lg);z-index:999;max-height:480px;overflow-y:auto}
    .notif-header{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
    .notif-title{font-weight:700;font-size:14px;color:var(--txt)}
    .notif-item{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border);transition:background var(--tr)}
    .notif-item:hover{background:var(--surface-2)}
    .notif-item.unread{background:var(--green-l)}
    .notif-dot{width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:5px}
    .notif-text{font-size:13px;color:var(--txt);line-height:1.4}
    .notif-time{font-size:11px;color:var(--txt-3);margin-top:3px}
    .notif-badge{position:absolute;top:-4px;right:-4px;width:16px;height:16px;background:var(--red);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;border:1.5px solid var(--surface)}
    .page{padding:28px;overflow-x:hidden;max-width:100%}
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
    .sc{background:var(--surface);border-radius:var(--r-lg);padding:20px;box-shadow:var(--sh-sm);position:relative;overflow:hidden;cursor:pointer}
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
    .pf{height:100%;background:var(--green);border-radius:2px}
    .badge{font-size:10px;font-weight:700;padding:4px 9px;border-radius:20px;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
    .bp{background:var(--amber-l);color:#854F0B}.ba{background:var(--green-l);color:var(--green-d)}.br{background:var(--blue-l);color:#185FA5}.bx{background:var(--red-l);color:var(--red)}
    .qg{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
    .qb{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px 8px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:transform var(--tr),box-shadow var(--tr);font-family:var(--fb)}
    .qb:hover{transform:translateY(-2px);box-shadow:var(--sh-md)}.qb:active{transform:scale(0.96)}
    .qi{width:40px;height:40px;border-radius:var(--r-sm);background:var(--green-l);display:flex;align-items:center;justify-content:center;color:var(--green-d)}
    .qb.qx .qi{background:var(--red-l);color:var(--red)}.qb.qx .ql{color:var(--red)}
    .ql{font-size:11px;font-weight:600;color:var(--txt-2);text-align:center;line-height:1.3}
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
    .qt-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
    .qt-card{background:var(--surface);border-radius:var(--r-lg);padding:16px 18px;box-shadow:var(--sh-sm);display:flex;align-items:center;justify-content:space-between;gap:12px}
    .qt-label{font-size:13px;font-weight:600;color:var(--txt)}
    .qt-sub{font-size:11px;color:var(--txt-3);margin-top:2px}
    .status-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700}
    .status-pill.on{background:var(--green-l);color:var(--green-d)}.status-pill.off{background:var(--red-l);color:var(--red)}
    .status-dot{width:6px;height:6px;border-radius:50%;background:currentColor}
    .tpl-list{display:flex;flex-direction:column;gap:8px}
    .tpl-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;transition:all var(--tr);background:var(--surface)}
    .tpl-item:hover,.tpl-item.active{border-color:var(--green);background:var(--green-l)}
    .tpl-icon{width:36px;height:36px;border-radius:var(--r-sm);background:var(--green-l);display:flex;align-items:center;justify-content:center;color:var(--green-d);flex-shrink:0}
    .tpl-name{font-size:13px;font-weight:600;color:var(--txt)}
    .tpl-desc{font-size:11px;color:var(--txt-3);margin-top:2px}
    .tpl-editor{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px}
    .tpl-preview{background:#fff;border:1px solid var(--border);border-radius:var(--r-md);padding:20px;margin-top:16px;font-size:13px;line-height:1.7;max-height:300px;overflow-y:auto}
    .ut-wrapper{overflow-x:auto;width:100%;-webkit-overflow-scrolling:touch;}
    .ut{width:100%;border-collapse:collapse;min-width:800px;}
    .ut th{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--txt-3);text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);background:var(--surface-2)}
    .ut td{font-size:13px;padding:13px 12px;border-bottom:1px solid var(--border);vertical-align:middle}
    .ut tr:last-child td{border-bottom:none}.ut tr:hover td{background:var(--surface-2)}
    .uav{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
    .avg{background:linear-gradient(135deg,var(--green),var(--green-d))}.ava{background:linear-gradient(135deg,var(--amber),#854F0B)}
    .uc{display:flex;align-items:center;gap:10px}
    .sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
    .sht{font-family:var(--fd);font-size:20px;color:var(--txt);display:flex;align-items:center;gap:8px}
    .di{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer}
    .di:last-child{border-bottom:none}
    .di-info{flex:1}
    .di-user{font-size:13px;font-weight:600;color:var(--txt)}
    .di-amt{font-size:12px;color:var(--txt-2);margin-top:2px;display:flex;align-items:center;gap:4px}
    .di-acts{display:flex;gap:6px}
    .db{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:none;font-family:var(--fb);transition:opacity var(--tr);display:inline-flex;align-items:center;gap:4px}
    .dba{background:var(--green-l);color:var(--green-d)}.dba:hover{background:var(--green-m)}
    .dbr{background:var(--red-l);color:var(--red)}.dbv{background:var(--blue-l);color:#185FA5}.dbp{background:var(--amber-l);color:#854F0B}
    .hb-modal-bd{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
    .hb-modal{background:var(--surface);border-radius:var(--r-xl);padding:28px;width:90%;max-width:560px;box-shadow:var(--sh-lg);max-height:90vh;overflow-y:auto;position:relative;z-index:9999}
    .hb-modal-t{font-family:var(--fd);font-size:22px;color:var(--txt);margin-bottom:6px}
    .hb-modal-s{font-size:13px;color:var(--txt-2);margin-bottom:20px}
    .hb-modal-bd,.hb-modal,.hb-modal *{animation:none!important}
    .fl{font-size:12px;font-weight:700;color:var(--txt-2);letter-spacing:.05em;text-transform:uppercase;margin-bottom:6px;display:block}
    .fi{width:100%;background:var(--surface-2);border:1px solid var(--border-2);border-radius:var(--r-sm);padding:11px 14px;font-size:14px;color:var(--txt);font-family:var(--fb);outline:none;transition:border-color var(--tr);margin-bottom:14px}
    .fi:focus{border-color:var(--green)}
    textarea.fi{resize:vertical;min-height:80px}
    .btn{padding:11px 22px;border-radius:var(--r-sm);font-size:14px;font-weight:600;cursor:pointer;border:none;font-family:var(--fb);transition:opacity var(--tr),transform var(--tr);display:inline-flex;align-items:center;gap:8px}
    .btn:active{transform:scale(0.97)}
    .btn-g{background:var(--green);color:#fff}.btn-g:hover{background:var(--green-d)}
    .btn-gh{background:var(--surface-2);color:var(--txt-2);border:1px solid var(--border-2)}.btn-gh:hover{background:var(--bg)}
    .btn-r{background:var(--red);color:#fff}
    .btn-a{background:var(--amber);color:#fff}
    .settings-tabs{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:10px;flex-wrap:wrap}
    .role-tab{background:none;border:none;padding:6px 14px;border-radius:20px;cursor:pointer;font-size:13px;font-weight:600;color:var(--txt-2);font-family:var(--fb)}
    .role-tab.active{background:var(--green-l);color:var(--green-d)}
    .proof-img{max-width:100%;border-radius:var(--r-md);border:1px solid var(--border);cursor:zoom-in}
    .proof-img-full{position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:10001;display:flex;align-items:center;justify-content:center;cursor:zoom-out}
    .proof-img-full img{max-width:90vw;max-height:90vh;object-fit:contain;border-radius:var(--r-md)}
    .mob-top{display:none;height:58px;background:var(--surface);border-bottom:1px solid var(--border);align-items:center;justify-content:space-between;padding:0 16px;gap:12px;position:sticky;top:0;z-index:100}
    .mob-logo{font-family:var(--fd);font-size:20px;color:var(--txt);flex:1}
    .bnav{display:none;position:fixed;bottom:0;left:0;right:0;height:var(--bottom-nav);background:var(--surface);border-top:1px solid var(--border);z-index:200}
    .bnav-inner{display:flex;justify-content:space-around;align-items:center;height:100%;padding:0 4px}
    .bni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border:none;background:none;font-family:var(--fb);padding:8px 4px;min-width:0}
    .bni.active svg{color:var(--green)}.bni.active .bni-lbl{color:var(--green);font-weight:700}
    .bni-lbl{font-size:10px;font-weight:600;color:var(--txt-3);white-space:nowrap}
    .mobile-menu-btn{display:none;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px;cursor:pointer;}
    @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.qg{grid-template-columns:repeat(4,1fr)}.three-col{grid-template-columns:1fr}.qt-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:768px){
      .sidebar{left:-260px;}.sidebar.mobile-open{left:0;}
      .main{margin-left:0;max-width:100%}.topbar{display:none}
      .mob-top{display:flex}.bnav{display:block}
      .page{padding:16px;padding-bottom:calc(var(--bottom-nav) + 70px)}
      .stats-grid{grid-template-columns:1fr 1fr;gap:10px}.qg{grid-template-columns:repeat(3,1fr);gap:8px}
      .ov-hero{padding:20px}.hero-t{font-size:22px}.qt-grid{grid-template-columns:1fr 1fr}
      .notif-panel{width:calc(100vw - 32px);right:-60px}
      .bnav-inner{justify-content:space-around}
      .bni-lbl{font-size:9px}
      .mobile-menu-btn{display:block;}
      .ut-wrapper{overflow-x:auto;width:100%;}
      .ut{min-width:600px;}
    }
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    .ps.active>*{animation:fadeUp .35s ease both}
    body, .shell, .main, .page, .card, .qg, .stats-grid, .qt-grid, .three-col {
      overflow-x: hidden;
      max-width: 100%;
    }
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

// ── Proof Image Viewer ────────────────────────────
function ProofImageViewer({ url }) {
  const [fullscreen, setFullscreen] = useState(false);
  if (!url || url === 'undefined' || url.includes('/undefined')) {
    return <div style={{ color: 'var(--txt-3)', fontSize: 13 }}>No proof image uploaded yet.</div>;
  }
  return (
    <>
      <div style={{ marginTop: 8 }}>
        <img src={url} alt="Payment proof" className="proof-img" style={{ maxWidth: '100%', maxHeight: 200 }} onClick={() => setFullscreen(true)} />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="db dbv"><Image size={12} /> Open in new tab</a>
          <button className="db dba" onClick={() => setFullscreen(true)}><Eye size={12} /> View full size</button>
        </div>
      </div>
      {fullscreen && (
        <div className="proof-img-full" onClick={() => setFullscreen(false)}>
          <img src={url} alt="Payment proof full" />
        </div>
      )}
    </>
  );
}

// ── Notification Panel ────────────────────────────
function NotificationPanel({ notifications, onMarkRead, onClearAll, onClose }) {
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <div className="notif-panel">
      <div className="notif-header">
        <span className="notif-title">Notifications {unreadCount > 0 && <span className="nb" style={{ marginLeft: 6 }}>{unreadCount}</span>}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && <button className="db dba" style={{ fontSize: 10 }} onClick={onMarkRead}>Mark all read</button>}
          {notifications.length > 0 && <button className="db dbr" style={{ fontSize: 10 }} onClick={onClearAll}>Clear all</button>}
        </div>
      </div>
      {notifications.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--txt-3)', fontSize: 13 }}>No notifications</div>
      )}
      {notifications.map(n => (
        <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
          <div className="notif-dot" style={{ background: n.type === 'error' ? 'var(--red)' : n.type === 'warning' ? 'var(--amber)' : 'var(--green)' }} />
          <div>
            <div className="notif-text">{n.message}</div>
            <div className="notif-time">{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Change Password Modal ─────────────────────────
function ChangePasswordModal({ isOpen, onClose, onSave, showToast }) {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [conf, setConf] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPw !== conf) { showToast('Passwords do not match', true); return; }
    if (newPw.length < 6) { showToast('Min 6 characters', true); return; }
    setLoading(true);
    try { await onSave({ oldPassword: oldPw, newPassword: newPw }); showToast('Password changed'); setOldPw(''); setNewPw(''); setConf(''); onClose(); }
    catch (err) { showToast(err.message, true); }
    finally { setLoading(false); }
  };

  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t">Change Password</div>
        <div className="hb-modal-s">Update your admin account password</div>
        <form onSubmit={handleSubmit}>
          <label className="fl">Current Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showOld ? 'text' : 'password'} className="fi" value={oldPw} onChange={e => setOldPw(e.target.value)} required style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowOld(p => !p)} style={{ position: 'absolute', right: 12, top: '45%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)' }}>
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <label className="fl">New Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showNew ? 'text' : 'password'} className="fi" value={newPw} onChange={e => setNewPw(e.target.value)} required style={{ paddingRight: 40 }} />
            <button type="button" onClick={() => setShowNew(p => !p)} style={{ position: 'absolute', right: 12, top: '45%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-3)' }}>
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <label className="fl">Confirm New Password</label>
          <input type="password" className="fi" value={conf} onChange={e => setConf(e.target.value)} required />
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>{loading ? 'Changing…' : <><Lock size={14} /> Change Password</>}</button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete User Modal ─────────────────────────────
function DeleteUserModal({ isOpen, onClose, onConfirm, userName, showToast }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleConfirm = async () => {
    if (text !== 'DELETE') { showToast('Type "DELETE" to confirm', true); return; }
    setLoading(true);
    try { await onConfirm(); onClose(); } catch (err) { showToast(err.message, true); } finally { setLoading(false); }
  };
  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t" style={{ color: 'var(--red)' }}>Delete User</div>
        <div className="hb-modal-s">Permanently delete <strong>{userName}</strong>? All their data, campaigns, and wallet balance will be removed.</div>
        <label className="fl">Type "DELETE" to confirm</label>
        <input type="text" className="fi" value={text} onChange={e => setText(e.target.value)} placeholder="DELETE" />
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-r" onClick={handleConfirm} disabled={loading}>{loading ? 'Deleting…' : 'Permanently Delete'}</button>
          <button className="btn btn-gh" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit User Modal ─────────────────────────
function UserModal({ isOpen, onClose, onSubmit, userData, setUserData, loading, editMode = false }) {
  if (!isOpen) return null;
  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t">{editMode ? 'Edit User' : 'Add New User'}</div>
        <div className="hb-modal-s">{editMode ? 'Update user information' : 'Create a new user account'}</div>
        <form onSubmit={onSubmit}>
          <label className="fl">Full Name *</label>
          <input type="text" className="fi" value={userData.name} onChange={e => setUserData(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required />
          <label className="fl">Email *</label>
          <input type="email" className="fi" value={userData.email} onChange={e => setUserData(p => ({ ...p, email: e.target.value }))} placeholder="user@example.com" required />
          {!editMode && (
            <>
              <label className="fl">Password *</label>
              <input type="password" className="fi" value={userData.password || ''} onChange={e => setUserData(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" required minLength={6} />
            </>
          )}
          <label className="fl">Role</label>
          <select className="fi" value={userData.role} onChange={e => setUserData(p => ({ ...p, role: e.target.value }))}>
            <option value="donor">Donor</option>
            <option value="creator">Creator</option>
            <option value="admin">Admin</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={userData.is_verified || false} onChange={e => setUserData(p => ({ ...p, is_verified: e.target.checked }))} />
            Mark as verified (skip email verification)
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>{loading ? (editMode ? 'Saving…' : 'Adding…') : (editMode ? 'Save Changes' : 'Add User')}</button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Campaign Modal ───────────────────────────
function EditCampaignModal({ isOpen, onClose, campaign, onSave, showToast }) {
  const [data, setData] = useState({ title: '', description: '', goal: '', category: 'General', status: 'pending' });
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (campaign) setData({ title: campaign.title || '', description: campaign.description || '', goal: campaign.goal || '', category: campaign.category || 'General', status: campaign.status || 'pending' }); }, [campaign]);
  if (!isOpen || !campaign) return null;
  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(campaign.id, data); showToast('Campaign updated'); onClose(); }
    catch (err) { showToast(err.message, true); }
    finally { setSaving(false); }
  };
  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t">Edit Campaign</div>
        <form onSubmit={handleSave}>
          <label className="fl">Title</label>
          <input type="text" className="fi" value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} required />
          <label className="fl">Description</label>
          <textarea className="fi" rows="3" value={data.description} onChange={e => setData(p => ({ ...p, description: e.target.value }))} />
          <label className="fl">Goal ($)</label>
          <input type="number" className="fi" value={data.goal} onChange={e => setData(p => ({ ...p, goal: e.target.value }))} min="10" required />
          <label className="fl">Category</label>
          <select className="fi" value={data.category} onChange={e => setData(p => ({ ...p, category: e.target.value }))}>
            {['General','Education','Health','Environment','Community','Emergency','Animals','Arts'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="fl">Status</label>
          <select className="fi" value={data.status} onChange={e => setData(p => ({ ...p, status: e.target.value }))}>
            {['pending','approved','rejected','completed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-g" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Create Campaign Modal with Image Upload ───────
function CreateCampaignModal({ isOpen, onClose, onSave, showToast }) {
  const [data, setData] = useState({ 
    title: '', description: '', goal: '', category: 'General',
    image: null, image_preview: null
  });
  const [saving, setSaving] = useState(false);
  
  if (!isOpen) return null;
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(p => ({ ...p, image: file, image_preview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = async e => {
    e.preventDefault();
    if (!data.title || !data.goal) {
      showToast('Title and goal are required', true); 
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('goal', data.goal);
      formData.append('category', data.category);
      if (data.image) {
        formData.append('image', data.image);
      }
      await onSave(formData);
      showToast('Campaign created');
      onClose();
      setData({ title: '', description: '', goal: '', category: 'General', image: null, image_preview: null });
    } catch (err) { 
      showToast(err.message, true); 
    } finally { 
      setSaving(false); 
    }
  };
  
  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t">Create Campaign</div>
        <div className="hb-modal-s">Admin-created campaign with image</div>
        <form onSubmit={handleSave}>
          <label className="fl">Campaign Title *</label>
          <input type="text" className="fi" value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} required />
          
          <label className="fl">Description</label>
          <textarea className="fi" rows="3" value={data.description} onChange={e => setData(p => ({ ...p, description: e.target.value }))} />
          
          <label className="fl">Goal ($) *</label>
          <input type="number" className="fi" value={data.goal} onChange={e => setData(p => ({ ...p, goal: e.target.value }))} min="10" required />
          
          <label className="fl">Category</label>
          <select className="fi" value={data.category} onChange={e => setData(p => ({ ...p, category: e.target.value }))}>
            {['General','Education','Health','Environment','Community','Emergency','Animals','Arts'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <label className="fl">Campaign Image</label>
          <input type="file" className="fi" accept="image/*" onChange={handleImageChange} style={{ padding: '8px' }} />
          {data.image_preview && (
            <div style={{ marginTop: 8, marginBottom: 16 }}>
              <img src={data.image_preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} />
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-g" disabled={saving}>{saving ? 'Creating…' : 'Create Campaign'}</button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Wallet Adjustment Modal ───────────────────────
function WalletAdjustModal({ isOpen, onClose, user, onSave, showToast }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('add');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  if (!isOpen || !user) return null;
  const handleSave = async e => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { showToast('Enter a valid amount', true); return; }
    setLoading(true);
    try { 
      const backendType = type === 'add' ? 'credit' : 'debit';
      await onSave(user.id, { amount: amt, type: backendType, reason }); 
      showToast(`Wallet ${type === 'add' ? 'credited' : 'debited'} $${amt}`); 
      setAmount(''); 
      setReason(''); 
      onClose(); 
    }
    catch (err) { showToast(err.message, true); }
    finally { setLoading(false); }
  };
  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t">Adjust Wallet Balance</div>
        <div className="hb-modal-s">User: <strong>{user.name}</strong> · Current balance: <strong>${(user.wallet_balance || 0).toFixed(2)}</strong></div>
        <form onSubmit={handleSave}>
          <label className="fl">Action</label>
          <select className="fi" value={type} onChange={e => setType(e.target.value)}>
            <option value="add">Add / Credit Balance</option>
            <option value="remove">Remove / Debit Balance</option>
          </select>
          <label className="fl">Amount ($) *</label>
          <input type="number" className="fi" value={amount} onChange={e => setAmount(e.target.value)} min="0.01" step="0.01" placeholder="0.00" required />
          <label className="fl">Reason (optional)</label>
          <input type="text" className="fi" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Manual adjustment, refund, bonus" />
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className={`btn ${type === 'add' ? 'btn-g' : 'btn-r'}`} disabled={loading}>
              {loading ? 'Processing…' : type === 'add' ? <><TrendingUp size={14} /> Credit Wallet</> : <><TrendingDown size={14} /> Debit Wallet</>}
            </button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Campaign Progress Modal (updated with real donations + adjustment) ──
function CampaignProgressModal({ isOpen, onClose, campaign, onSave, showToast }) {
  const [raised, setRaised] = useState('');
  const [loading, setLoading] = useState(false);
  const [realTotal, setRealTotal] = useState(0);
  const [manualAdjustment, setManualAdjustment] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  useEffect(() => { 
    if (campaign) {
      setRaised(campaign.raised?.toString() || '0');
      // Fetch real donations sum and current manual adjustment from backend
      const fetchDetails = async () => {
        setLoadingDetails(true);
        try {
          const token = localStorage.getItem('hb_token');
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/campaigns/${campaign.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.campaign) {
            // Fetch real donations sum separately
            const donationsRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/donations/campaign/${campaign.id}`);
            const donationsData = await donationsRes.json();
            const real = donationsData.total || 0;
            setRealTotal(real);
            setManualAdjustment(data.campaign.manual_adjustment || 0);
          }
        } catch (err) {
          console.error('Failed to fetch campaign details', err);
        } finally {
          setLoadingDetails(false);
        }
      };
      fetchDetails();
    }
  }, [campaign]);
  
  if (!isOpen || !campaign) return null;
  
  const handleSave = async e => {
    e.preventDefault();
    const amt = parseFloat(raised);
    if (isNaN(amt) || amt < 0) { showToast('Enter a valid amount', true); return; }
    setLoading(true);
    try { await onSave(campaign.id, amt); showToast('Progress updated'); onClose(); }
    catch (err) { showToast(err.message, true); }
    finally { setLoading(false); }
  };
  
  const pct = Math.min((parseFloat(raised) / campaign.goal) * 100, 100);
  
  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t">Update Campaign Progress</div>
        <div className="hb-modal-s"><strong>{campaign.title}</strong> · Goal: ${toNum(campaign.goal).toLocaleString()}</div>
        {loadingDetails ? (
          <div style={{ textAlign: 'center', padding: '10px' }}>Loading donation details...</div>
        ) : (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--r-md)' }}>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Real donations: <strong>${realTotal.toLocaleString()}</strong></div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Manual adjustment: <strong>${manualAdjustment.toLocaleString()}</strong></div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Current displayed total: <strong>${(realTotal + manualAdjustment).toLocaleString()}</strong></div>
          </div>
        )}
        <form onSubmit={handleSave}>
          <label className="fl">New Raised Amount ($)</label>
          <input type="number" className="fi" value={raised} onChange={e => setRaised(e.target.value)} min="0" step="0.01" required />
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--txt-2)', marginBottom: 6 }}>
              <span>Progress</span><span>{pct.toFixed(1)}%</span>
            </div>
            <div className="pb"><div className="pf" style={{ width: `${pct}%` }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>{loading ? 'Saving…' : <><TrendingUp size={14} /> Update Progress</>}</button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Deposit Details Modal ─────────────────────────
function DepositDetailsModal({ isOpen, onClose, deposit }) {
  if (!isOpen || !deposit) return null;
  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t">Deposit Request Details</div>
        <div className="hb-modal-s">Request ID: #{deposit.id}</div>
        <div style={{ marginBottom: 12 }}><strong>User:</strong> {deposit.name} ({deposit.email})</div>
        <div style={{ marginBottom: 12 }}><strong>Amount:</strong> ${toNum(deposit.amount).toFixed(2)}</div>
        <div style={{ marginBottom: 12 }}><strong>Status:</strong> <span className={`badge ${deposit.status === 'approved' ? 'ba' : deposit.status === 'rejected' ? 'bx' : 'bp'}`}>{deposit.status}</span></div>
        {deposit.payment_method && <div style={{ marginBottom: 12 }}><strong>Payment Method:</strong> {deposit.payment_method}</div>}
        {deposit.payment_details && <div style={{ marginBottom: 12 }}><strong>Payment Details:</strong> {deposit.payment_details}</div>}
        {deposit.admin_instructions && <div style={{ marginBottom: 12 }}><strong>Instructions Sent:</strong> <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, background: 'var(--surface-2)', padding: 8, borderRadius: 6 }}>{deposit.admin_instructions}</pre></div>}
        {deposit.admin_notes && <div style={{ marginBottom: 12 }}><strong>Admin Notes:</strong> {deposit.admin_notes}</div>}
        {deposit.proof_image_url && (
          <div><strong>Proof Image:</strong><ProofImageViewer url={deposit.proof_image_url} /></div>
        )}
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button className="btn btn-gh" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Withdrawal Details Modal ──────────────────────
function WithdrawalDetailsModal({ isOpen, onClose, withdrawal }) {
  if (!isOpen || !withdrawal) return null;
  return (
    <div className="hb-modal-bd" onClick={onClose}>
      <div className="hb-modal" onClick={e => e.stopPropagation()}>
        <div className="hb-modal-t">Withdrawal Request Details</div>
        <div className="hb-modal-s">Request ID: #{withdrawal.id}</div>
        <div style={{ marginBottom: 12 }}><strong>User:</strong> {withdrawal.name} ({withdrawal.email})</div>
        <div style={{ marginBottom: 12 }}><strong>Amount:</strong> ${toNum(withdrawal.amount).toFixed(2)}</div>
        <div style={{ marginBottom: 12 }}><strong>Status:</strong> <span className={`badge ${withdrawal.status === 'approved' ? 'ba' : withdrawal.status === 'paid' ? 'ba' : withdrawal.status === 'rejected' ? 'bx' : 'bp'}`}>{withdrawal.status}</span></div>
        {withdrawal.payment_method && <div style={{ marginBottom: 12 }}><strong>Payment Method:</strong> {withdrawal.payment_method}</div>}
        {withdrawal.payment_details && <div style={{ marginBottom: 12 }}><strong>Payment Details:</strong> {withdrawal.payment_details}</div>}
        {withdrawal.admin_note && <div style={{ marginBottom: 12 }}><strong>Admin Note:</strong> {withdrawal.admin_note}</div>}
        {withdrawal.transaction_id && <div style={{ marginBottom: 12 }}><strong>Transaction ID:</strong> {withdrawal.transaction_id}</div>}
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button className="btn btn-gh" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Email Templates ───────────────────────────────
const EMAIL_TEMPLATES = [
  { id: 'verification', name: 'Email Verification', desc: 'Sent when users register', subjectKey: 'verification_subject', bodyKey: 'verification_body', defaultSubject: 'Your HopeBridge Verification Code', defaultBody: 'Hi {{name}},\n\nYour verification code is:\n\n{{code}}\n\nExpires in 15 minutes.' },
  { id: 'welcome', name: 'Welcome Email', desc: 'Sent after registration', subjectKey: 'welcome_subject', bodyKey: 'welcome_body', defaultSubject: 'Welcome to HopeBridge, {{name}}!', defaultBody: 'Hi {{name}},\n\nWelcome to HopeBridge as a {{role}}.\n\nStart making an impact today.' },
  { id: 'donation', name: 'Donation Confirmation', desc: 'Sent to donors after donating', subjectKey: 'donation_subject', bodyKey: 'donation_body', defaultSubject: 'Thank you for your donation of ${{amount}}!', defaultBody: 'Dear {{donor_name}},\n\nThank you for donating ${{amount}} to {{campaign_title}}.' },
  { id: 'campaign_approved', name: 'Campaign Approved', desc: 'Sent to creators on approval', subjectKey: 'campaign_approved_subject', bodyKey: 'campaign_approved_body', defaultSubject: 'Your campaign "{{title}}" is approved!', defaultBody: 'Dear {{creator_name}},\n\nYour campaign "{{title}}" is now live.' },
  { id: 'campaign_rejected', name: 'Campaign Rejected', desc: 'Sent to creators on rejection', subjectKey: 'campaign_rejected_subject', bodyKey: 'campaign_rejected_body', defaultSubject: 'Update on your campaign "{{title}}"', defaultBody: 'Dear {{creator_name}},\n\nYour campaign "{{title}}" did not meet our guidelines.' },
  { id: 'withdrawal', name: 'Withdrawal Status', desc: 'Sent on withdrawal approve/reject', subjectKey: 'withdrawal_subject', bodyKey: 'withdrawal_body', defaultSubject: 'Your withdrawal of ${{amount}} has been {{status}}', defaultBody: 'Dear {{name}},\n\nYour withdrawal of ${{amount}} has been {{status}}.\n\n{{admin_note}}' },
];

function EmailTemplateEditor({ showToast }) {
  const [selected, setSelected] = useState(EMAIL_TEMPLATES[0]);
  const [templates, setTemplates] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    safeGet(() => adminApi.getSettings(), { settings: null }).then(res => {
      if (res?.settings?.email_templates) setTemplates(res.settings.email_templates);
    });
  }, []);

  const getVal = (key, def) => (templates[key] !== undefined ? templates[key] : def);
  const update = (key, val) => setTemplates(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try { await adminApi.saveSettings({ email_templates: templates }); showToast('Template saved'); }
    catch (err) { showToast(err.message, true); }
    finally { setSaving(false); }
  };

  const preview = getVal(selected.bodyKey, selected.defaultBody)
    .replace(/\{\{name\}\}/g, 'John Doe').replace(/\{\{code\}\}/g, '847291').replace(/\{\{amount\}\}/g, '50.00')
    .replace(/\{\{donor_name\}\}/g, 'John Doe').replace(/\{\{campaign_title\}\}/g, 'Help Build a School')
    .replace(/\{\{title\}\}/g, 'Help Build a School').replace(/\{\{creator_name\}\}/g, 'Jane Creator')
    .replace(/\{\{role\}\}/g, 'donor').replace(/\{\{status\}\}/g, 'approved').replace(/\{\{admin_note\}\}/g, 'Funds sent within 2 business days.');

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
          <button className="btn btn-gh" style={{ fontSize: 12 }} onClick={() => setShowPreview(p => !p)}>{showPreview ? 'Hide Preview' : 'Show Preview'}</button>
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
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all_donors');
  const [campaignId, setCampaignId] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    safeGet(() => adminApi.getCampaigns({ status: 'approved' }), { campaigns: [] }).then(r => setCampaigns(r.campaigns || []));
  }, []);

  const handleSend = async e => {
    e.preventDefault();
    if (!subject || !message) { showToast('Fill subject and message', true); return; }
    setSending(true);
    try {
      await adminApi.sendMassMail({ subject, message, recipient_type: recipientType, campaign_id: recipientType === 'campaign_donors' ? campaignId : null });
      showToast('Emails sent!'); setSubject(''); setMessage('');
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

// ── ContentEditor (UPDATED to show all impact stats) ──
function ContentEditor({ content, onSave, showToast }) {
  const [local, setLocal] = useState(content);
  const [saving, setSaving] = useState(false);
  useEffect(() => setLocal(content), [content]);

  const upd = (f, v) => setLocal(p => ({ ...p, [f]: v }));
  const updStat = (s, v) => setLocal(p => ({
    ...p,
    impact_stats: { ...p.impact_stats, [s]: v }
  }));
  const updSocial = (pl, v) => setLocal(p => ({
    ...p,
    social_links: { ...p.social_links, [pl]: v }
  }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(local);
      showToast('Content updated');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h5 style={{ marginBottom: 12, color: 'var(--txt)' }}>Hero Section</h5>
      <label className="fl">Badge Text</label>
      <input type="text" className="fi" value={local.hero_badge || ''} onChange={e => upd('hero_badge', e.target.value)} />
      <label className="fl">Hero Title</label>
      <input type="text" className="fi" value={local.hero_title || ''} onChange={e => upd('hero_title', e.target.value)} />
      <label className="fl">Hero Subtitle</label>
      <textarea className="fi" rows="2" value={local.hero_subtitle || ''} onChange={e => upd('hero_subtitle', e.target.value)} />

      <h5 style={{ margin: '20px 0 12px', color: 'var(--txt)' }}>Impact Stats (shown on homepage)</h5>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="fl">Active Projects</label>
          <input type="text" className="fi" value={local.impact_stats?.active_projects || ''} onChange={e => updStat('active_projects', e.target.value)} placeholder="e.g., 24" />
        </div>
        <div>
          <label className="fl">Funds Raised</label>
          <input type="text" className="fi" value={local.impact_stats?.funds_raised || ''} onChange={e => updStat('funds_raised', e.target.value)} placeholder="e.g., $124,000" />
        </div>
        <div>
          <label className="fl">Transparency</label>
          <input type="text" className="fi" value={local.impact_stats?.transparency || ''} onChange={e => updStat('transparency', e.target.value)} placeholder="e.g., 100%" />
        </div>
        <div>
          <label className="fl">Program Efficiency</label>
          <input type="text" className="fi" value={local.impact_stats?.program_efficiency || ''} onChange={e => updStat('program_efficiency', e.target.value)} placeholder="e.g., 89%" />
        </div>
        <div>
          <label className="fl">Lives Impacted</label>
          <input type="text" className="fi" value={local.impact_stats?.lives_impacted || ''} onChange={e => updStat('lives_impacted', e.target.value)} placeholder="e.g., 14K+" />
        </div>
        <div>
          <label className="fl">Projects Funded</label>
          <input type="text" className="fi" value={local.impact_stats?.projects_funded || ''} onChange={e => updStat('projects_funded', e.target.value)} placeholder="e.g., 120+" />
        </div>
      </div>

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
  const [local, setLocal] = useState(fees);
  const [saving, setSaving] = useState(false);
  useEffect(() => setLocal(fees), [fees]);
  const upd = (k, v) => setLocal(p => ({ ...p, [k]: v }));
  const handleSave = async () => {
    setSaving(true);
    try { await onSave(local); showToast('Fee settings saved'); } catch (err) { showToast(err.message, true); } finally { setSaving(false); }
  };
  return (
    <div>
      <div style={{ padding: 16, background: 'var(--blue-l)', borderRadius: 'var(--r-md)', marginBottom: 20, fontSize: 13, color: '#185FA5' }}>
        These fees apply to wallet transactions. Set to 0 to disable.
      </div>
      {[
        ['percentage', 'Platform Fee (%)', 'Percentage taken from each donation'],
        ['fixed_amount', 'Fixed Fee per Transaction ($)', ''],
        ['min_fee', 'Minimum Fee ($)', ''],
        ['max_fee', 'Maximum Fee ($)', 'Leave empty for no maximum'],
        ['withdrawal_fee', 'Withdrawal Fee ($)', ''],
        ['minimum_deposit', 'Minimum Deposit Amount ($)', 'Users cannot deposit below this amount'],
        ['maximum_deposit', 'Maximum Deposit Amount ($)', 'Leave empty for no maximum'],
        ['minimum_withdrawal', 'Minimum Withdrawal Amount ($)', 'Users cannot withdraw below this amount'],
        ['maximum_withdrawal', 'Maximum Withdrawal Amount ($)', 'Leave empty for no maximum'],
      ].map(([k, label, hint]) => (
        <div key={k} style={{ marginBottom: 16 }}>
          <label className="fl">{label}</label>
          <input type="number" className="fi" step="0.01" min="0" value={local[k] ?? ''} onChange={e => upd(k, e.target.value ? parseFloat(e.target.value) : null)} placeholder={hint.includes('no max') ? 'No limit' : '0'} />
          {hint && !hint.includes('no max') && <p style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: -10, marginBottom: 8 }}>{hint}</p>}
        </div>
      ))}
      <button className="btn btn-g" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Fee Settings'}</button>
    </div>
  );
}

// ── DepositRequestsManager (with click to view details) ──
function DepositRequestsManager({ requests, onApprove, onReject, onProvideInstructions, showToast, onSelect }) {
  const [instructions, setInstructions] = useState({});
  if (!requests.length) return <div style={{ color: 'var(--txt-3)' }}>No deposit requests.</div>;
  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => onSelect(req)}>
            <div style={{ marginBottom: 4 }}><strong>{req.userName || req.name}</strong> ({req.email})</div>
            <div style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 8 }}>
              Amount: <strong>$${toNum(req.amount).toFixed(2)}</strong> ·{' '}
              <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span>
            </div>
          </div>
          {req.admin_instructions && (
            <div style={{ fontSize: 12, background: 'var(--blue-l)', padding: 10, borderRadius: 8, marginBottom: 8, color: '#185FA5' }}>
              <strong>Instructions sent:</strong> {req.admin_instructions}
            </div>
          )}
          {req.status === 'pending' && (
            <div>
              <textarea placeholder="Payment instructions (bank details, mobile money, etc.)..." rows="2" className="fi" value={instructions[req.id] || ''} onChange={e => setInstructions(p => ({ ...p, [req.id]: e.target.value }))} />
              <button className="db dba" onClick={() => { if (!instructions[req.id]?.trim()) { showToast('Enter instructions', true); return; } onProvideInstructions(req.id, instructions[req.id]); setInstructions(p => ({ ...p, [req.id]: '' })); }}>
                <Send size={12} /> Send Instructions
              </button>
            </div>
          )}
          {req.status === 'instructions_sent' && <div style={{ color: 'var(--blue)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> Waiting for payment proof…</div>}
          {req.status === 'awaiting_proof' && (
            <div>
              <ProofImageViewer url={req.proof_image_url} />
              {req.proof_image_url && req.proof_image_url !== 'undefined' && (
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button className="db dba" onClick={() => onApprove(req.id, req.amount)}><CheckCircle size={12} /> Approve & Credit</button>
                  <button className="db dbr" onClick={() => onReject(req.id)}><X size={12} /> Reject</button>
                </div>
              )}
            </div>
          )}
          {req.status === 'approved' && <span style={{ color: 'var(--green)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} /> Credited to wallet</span>}
          {req.status === 'rejected' && <span style={{ color: 'var(--red)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><X size={12} /> Rejected</span>}
        </div>
      ))}
    </div>
  );
}

// ── WithdrawalRequestsManager (with click to view details) ──
function WithdrawalRequestsManager({ requests, onApprove, onReject, onSelect }) {
  if (!requests.length) return <div style={{ color: 'var(--txt-3)' }}>No withdrawal requests.</div>;
  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => onSelect(req)}>
            <div style={{ marginBottom: 4 }}><strong>{req.name}</strong> ({req.email})</div>
            <div style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 4 }}>Amount: <strong>$${toNum(req.amount).toFixed(2)}</strong> · {req.payment_method}</div>
            <div style={{ fontSize: 12, color: 'var(--txt-3)', marginBottom: 8 }}>{req.payment_details}</div>
            <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span>
          </div>
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
            <Calendar size={10} /> {new Date(req.completion_requested_at).toLocaleString()}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="db dba" disabled={processingId === req.id} onClick={async () => { if (!window.confirm('Release escrow?')) return; setProcessingId(req.id); try { await onRelease(req.id); } finally { setProcessingId(null); } }}>
              {processingId === req.id ? 'Processing…' : <><CheckCircle size={12} /> Release Escrow</>}
            </button>
            <button className="db dbr" disabled={processingId === req.id} onClick={async () => { if (!window.confirm('Refund all donors?')) return; setProcessingId(req.id); try { await onRefund(req.id); } finally { setProcessingId(null); } }}>
              {processingId === req.id ? 'Processing…' : <><RefreshCw size={12} /> Refund Donors</>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PayoutsManager ────────────────────────────────
function PayoutsManager({ payouts, onMarkPaid }) {
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
      <div className="ut-wrapper">
        <table className="ut">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><strong>{p.user_name}</strong><br /><small style={{ color: 'var(--txt-3)' }}>{p.user_email}</small></td>
                <td><strong>$${toNum(p.amount).toFixed(2)}</strong></td>
                <td>{p.payment_method}<br /><small>{p.payment_details?.substring(0, 30)}</small></td>
                <td><span className={`badge ${p.status === 'paid' ? 'ba' : p.status === 'approved' ? 'bp' : 'bx'}`}>{p.status}</span></td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>{p.status === 'approved' && <button className="db dba" onClick={() => onMarkPaid(p.id)}><CheckCircle size={12} /> Mark Paid</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── NotificationManager (without Firebase config) ──
function NotificationManager({ settings, onSave, onSend, history, showToast }) {
  const [local, setLocal] = useState(settings);
  const [notif, setNotif] = useState({ title: '', body: '', target_type: 'all' });
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => setLocal(settings), [settings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try { await onSave(local); showToast('Settings saved'); }
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
        <div className="toggle-info"><strong>Push Notifications Enabled</strong><p>Enable/disable all push notifications</p></div>
        <Toggle checked={local.enabled} onChange={val => setLocal(p => ({ ...p, enabled: val }))} />
      </div>
      <button className="btn btn-g" onClick={handleSaveSettings} disabled={saving} style={{ marginTop: 16, marginBottom: 24 }}>{saving ? 'Saving…' : 'Save Settings'}</button>

      <hr style={{ margin: '4px 0 20px', borderColor: 'var(--border)' }} />
      <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Send Push Notification</div>

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
          <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Notification History</div>
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
  const actions = [...new Set(logs.map(l => l.action))];
  const filtered = filter ? logs.filter(l => l.action === filter) : logs;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className={`db ${!filter ? 'dba' : 'dbv'}`} onClick={() => setFilter('')}>All</button>
        {actions.map(a => <button key={a} className={`db ${filter === a ? 'dba' : 'dbv'}`} onClick={() => setFilter(a)}>{a.replace(/_/g, ' ')}</button>)}
      </div>
      <div className="ut-wrapper">
        <table className="ut">
          <thead>
            <tr>
              <th>Admin</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
              <th>Time</th>
            </tr>
          </thead>
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
    </div>
  );
}

// ── Main AdminDashboard ───────────────────────────
export default function AdminDashboard() {
  injectStyles();

  const { currentUser, logout, showToast, loading: sessionLoading } = useApp();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const mobileNotifRef = useRef(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dataLoading, setDataLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('hb_darkmode') === 'true');
  const [settingsTab, setSettingsTab] = useState('security');
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showMobileNotifPanel, setShowMobileNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState({ open: false, userId: null, userName: '' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState({ open: false, user: null });
  const [editCampaignModal, setEditCampaignModal] = useState({ open: false, campaign: null });
  const [createCampaignModal, setCreateCampaignModal] = useState(false);
  const [walletModal, setWalletModal] = useState({ open: false, user: null });
  const [progressModal, setProgressModal] = useState({ open: false, campaign: null });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'donor', is_verified: true });
  const [editUser, setEditUser] = useState({ name: '', email: '', role: 'donor', is_verified: false });
  const [addingUser, setAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(false);

  // Firebase config state (moved to Settings)
  const [firebaseServerKey, setFirebaseServerKey] = useState('');
  const [firebaseSenderId, setFirebaseSenderId] = useState('');
  const [savingFirebase, setSavingFirebase] = useState(false);

  const [themeSettings, setThemeSettings] = useState({ '--primary': '#e8531e', '--primary-dark': '#c4400f', '--secondary': '#27a96c', '--dark': '#1a1a2e' });
  const [integrationKeys, setIntegrationKeys] = useState({ smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '', recaptcha_site_key: '', recaptcha_secret_key: '' });
  const [socialLinks, setSocialLinks] = useState({ facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' });
  const [maintenanceMode, setMaintenanceMode] = useState({ enabled: false, message: '' });
  const [verificationEnabled, setVerificationEnabled] = useState(true);
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(false);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);
  const [togglingVerification, setTogglingVerification] = useState(false);
  const [togglingRecaptcha, setTogglingRecaptcha] = useState(false);

  // Guest donations state
  const [guestDonations, setGuestDonations] = useState([]);
  const [guestDonationFilter, setGuestDonationFilter] = useState('all');
  const [sendingInstructions, setSendingInstructions] = useState({});

  // Payment instructions state
  const [paymentInstructions, setPaymentInstructions] = useState({});
  const [loadingInstructions, setLoadingInstructions] = useState(false);
  const [savingInstructions, setSavingInstructions] = useState(false);

  // Deposit/Withdrawal details modal
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [completionRequests, setCompletionRequests] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [feeSettings, setFeeSettings] = useState({ percentage: 0, fixed_amount: 0, min_fee: 0, withdrawal_fee: 0, minimum_withdrawal: 10, minimum_deposit: 1 });
  const [notifHistory, setNotifHistory] = useState([]);
  const [notifSettings, setNotifSettings] = useState({ enabled: true });
  const [auditLogs, setAuditLogs] = useState([]);
  const [content, setContent] = useState({ hero_title: 'Together We Can', hero_subtitle: 'Support causes you care about.', hero_badge: 'HopeBridge', impact_title: 'Our Impact', impact_subtitle: 'Every donation counts', impact_stats: { raised: '$0', campaigns: '0', donors: '0' }, social_links: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' } });
  const [lastDonationCheck, setLastDonationCheck] = useState(Date.now());

  useEffect(() => {
    const handler = e => { 
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifPanel(false);
      if (mobileNotifRef.current && !mobileNotifRef.current.contains(e.target)) setShowMobileNotifPanel(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    // Close sidebar when clicking overlay
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
      const closeSidebar = () => setMobileSidebarOpen(false);
      overlay.addEventListener('click', closeSidebar);
      return () => overlay.removeEventListener('click', closeSidebar);
    }
  }, []);

  const addNotif = (message, type = 'info') => {
    setNotifications(prev => [{ id: Date.now(), message, type, time: new Date().toLocaleTimeString(), read: false }, ...prev].slice(0, 50));
  };

  useEffect(() => { document.body.classList.toggle('dark-mode', darkMode); localStorage.setItem('hb_darkmode', darkMode); }, [darkMode]);

  useEffect(() => {
    if (sessionLoading) return;
    if (!currentUser) { showToast('Please log in', true); navigate('/'); return; }
    if (currentUser.role !== 'admin') { showToast('Access denied', true); navigate('/'); return; }
    setAuthChecked(true);
  }, [sessionLoading, currentUser]);

  useEffect(() => {
    if (!authChecked) return;
    const interval = setInterval(async () => {
      try {
        const res = await adminApi.getDonations();
        const latest = res.donations?.[0];
        if (latest && new Date(latest.created_at).getTime() > lastDonationCheck) {
          addNotif(`💝 New $${latest.amount} donation from ${latest.donor_name || 'Anonymous'} to "${latest.campaign_title}"`, 'info');
          setLastDonationCheck(Date.now());
        }
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, [authChecked, lastDonationCheck]);

  const fetchAll = async () => {
    setDataLoading(true);
    try {
      const [c, u, don, dep, wd, compl, cont] = await Promise.all([
        safeGet(() => adminApi.getCampaigns(), { campaigns: [] }),
        safeGet(() => adminApi.getUsers(), { users: [] }),
        safeGet(() => adminApi.getDonations(), { donations: [] }),
        safeGet(() => adminApi.getDepositRequests?.(), { requests: [] }),
        safeGet(() => adminApi.getWithdrawalRequests?.(), { withdrawals: [] }),
        safeGet(() => adminApi.getCompletionRequests?.(), { campaigns: [] }),
        safeGet(() => adminApi.getContent(), { content: null }),
      ]);
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
    const [payRes, feeRes, notifRes, auditRes, sett, notifSett] = await Promise.all([
      safeGet(() => adminApi.getPayouts?.(), { payouts: [] }),
      safeGet(() => adminApi.getFeeSettings?.(), { percentage: 0, fixed_amount: 0, min_fee: 0, withdrawal_fee: 0, minimum_withdrawal: 10, minimum_deposit: 1 }),
      safeGet(() => adminApi.getNotificationHistory?.(), { notifications: [] }),
      safeGet(() => adminApi.getAuditLogs?.(), { logs: [] }),
      safeGet(() => adminApi.getSettings(), { settings: null }),
      safeGet(() => adminApi.getNotificationSettings?.(), { enabled: true }),
    ]);
    setPayouts(payRes.payouts || []);
    setFeeSettings(feeRes);
    setNotifHistory(notifRes.notifications || []);
    setAuditLogs(auditRes.logs || []);
    setNotifSettings(notifSett);
    if (sett?.settings?.keys) {
      const k = sett.settings.keys;
      setMaintenanceMode({ enabled: k.maintenance_mode === 'true', message: k.maintenance_message || '' });
      setRecaptchaEnabled(k.recaptcha_enabled === 'true');
      setIntegrationKeys(prev => ({ ...prev, ...k }));
      // Load existing Firebase settings
      setFirebaseServerKey(k.firebase_server_key || '');
      setFirebaseSenderId(k.firebase_sender_id || '');
    }
    try { const v = await adminApi.getVerificationSetting?.(); if (v) setVerificationEnabled(v.enabled !== false); } catch {}
  };

  const fetchGuestDonations = async () => {
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/guest-donations/admin/guest-donations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setGuestDonations(data.requests || []);
    } catch (err) {
      console.error('Failed to fetch guest donations:', err);
    }
  };

  const fetchPaymentInstructions = async () => {
    setLoadingInstructions(true);
    try {
      const res = await adminApi.getPaymentInstructions();
      setPaymentInstructions(res.instructions);
    } catch (err) {
      console.error('Failed to fetch payment instructions:', err);
      showToast(err.message, true);
    } finally {
      setLoadingInstructions(false);
    }
  };

  const savePaymentInstructions = async () => {
    setSavingInstructions(true);
    try {
      await adminApi.updatePaymentInstructions({ instructions: paymentInstructions });
      showToast('Payment instructions saved successfully');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSavingInstructions(false);
    }
  };

  const saveFirebaseConfig = async () => {
    setSavingFirebase(true);
    try {
      await adminApi.updateNotificationSettings({
        enabled: notifSettings.enabled,
        server_key: firebaseServerKey,
        sender_id: firebaseSenderId
      });
      showToast('Firebase configuration saved');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSavingFirebase(false);
    }
  };

  useEffect(() => { 
    if (authChecked) { 
      fetchAll(); 
      fetchExtras();
      fetchGuestDonations();
      fetchPaymentInstructions();
    } 
  }, [authChecked]);

  const handleToggleMaintenance = async val => { setTogglingMaintenance(true); try { await adminApi.saveSettings({ keys: { maintenance_mode: val ? 'true' : 'false' } }); setMaintenanceMode(p => ({ ...p, enabled: val })); showToast(`Maintenance ${val ? 'enabled' : 'disabled'}`); addNotif(`Maintenance mode ${val ? 'enabled' : 'disabled'}`, 'warning'); } catch (err) { showToast(err.message, true); } finally { setTogglingMaintenance(false); } };
  const handleToggleVerification = async val => { setTogglingVerification(true); try { await adminApi.updateVerificationSetting?.({ enabled: val }); setVerificationEnabled(val); showToast(`Email verification ${val ? 'enabled' : 'disabled'}`); } catch (err) { showToast(err.message, true); } finally { setTogglingVerification(false); } };
  const handleToggleRecaptcha = async val => { setTogglingRecaptcha(true); try { await adminApi.saveSettings({ keys: { recaptcha_enabled: val ? 'true' : 'false' } }); setRecaptchaEnabled(val); showToast(`reCAPTCHA ${val ? 'enabled' : 'disabled'}`); } catch (err) { showToast(err.message, true); } finally { setTogglingRecaptcha(false); } };

  const handleApproveCampaign = async id => { try { await adminApi.updateCampaign(id, { status: 'approved' }); showToast('Campaign approved'); addNotif('Campaign approved'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectCampaign = async id => { try { await adminApi.updateCampaign(id, { status: 'rejected' }); showToast('Campaign rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleDeleteCampaign = async id => { if (!window.confirm('Delete permanently?')) return; try { await campaignApi.delete(id); showToast('Deleted'); fetchAll(); } catch (err) { showToast(err.message, true); } };

  const handleEditCampaignSave = async (id, data) => {
    await adminApi.updateCampaign(id, data);
    fetchAll();
  };

  const handleCreateCampaignSave = async (data) => {
    await adminApi.createCampaign?.(data);
    fetchAll();
  };

  const handleUpdateProgress = async (campaignId, raised) => {
    try { await adminApi.updateCampaignProgress?.(campaignId, { raised }); showToast('Progress updated'); fetchAll(); }
    catch { await fetch(`/api/campaigns/${campaignId}/progress`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('hb_token')}` }, body: JSON.stringify({ raised }) }); fetchAll(); }
  };

  const handleToggleUser = async id => { try { await adminApi.toggleUser(id); showToast('User updated'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleVerifyUser = async id => { try { await adminApi.verifyUser?.(id); showToast('User verified'); addNotif('User manually verified', 'info'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleDeleteUser = async id => { try { await adminApi.deleteUser?.(id); showToast('User deleted'); fetchAll(); } catch (err) { throw err; } };

  const handleAddUserSubmit = async e => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) { showToast('Fill all required fields', true); return; }
    if (newUser.password.length < 6) { showToast('Password min 6 characters', true); return; }
    setAddingUser(true);
    try { await adminApi.addUser?.(newUser); showToast(`${newUser.name} added`); addNotif(`New user added: ${newUser.name}`); setShowAddUserModal(false); setNewUser({ name: '', email: '', password: '', role: 'donor', is_verified: true }); fetchAll(); }
    catch (err) { showToast(err.message, true); } finally { setAddingUser(false); }
  };

  const handleEditUserSubmit = async e => {
    e.preventDefault();
    if (!editUserModal.user) return;
    setEditingUser(true);
    try { await adminApi.updateUser?.(editUserModal.user.id, editUser); showToast('User updated'); setEditUserModal({ open: false, user: null }); fetchAll(); }
    catch (err) { showToast(err.message, true); } finally { setEditingUser(false); }
  };

  const handleWalletAdjust = async (userId, { amount, type, reason }) => {
    await adminApi.adjustWallet?.(userId, { amount, type, reason });
    addNotif(`Wallet ${type === 'credit' ? 'credited' : 'debited'} $${amount} for user`);
    fetchAll();
  };

  const handleApproveDeposit = async (id, amount) => { try { await adminApi.updateDepositRequest?.(id, { status: 'approved' }); showToast('Deposit approved'); addNotif(`Deposit of $${amount} approved`); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectDeposit = async id => { try { await adminApi.updateDepositRequest?.(id, { status: 'rejected' }); showToast('Deposit rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleProvideInstructions = async (id, inst) => { try { await adminApi.updateDepositRequest?.(id, { admin_instructions: inst, status: 'instructions_sent' }); showToast('Instructions sent'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleApproveWithdrawal = async id => { try { await adminApi.approveWithdrawal(id); showToast('Withdrawal approved'); addNotif('Withdrawal approved'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRejectWithdrawal = async id => { const r = prompt('Reason:'); if (!r) return; try { await adminApi.rejectWithdrawal(id, r); showToast('Withdrawal rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleReleaseEscrow = async id => { try { await adminApi.releaseCampaignEscrow(id); showToast('Escrow released'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleRefundEscrow = async id => { try { await adminApi.refundCampaignEscrow(id); showToast('Escrow refunded'); fetchAll(); } catch (err) { showToast(err.message, true); } };
  const handleSaveContent = async c => { try { await adminApi.saveContent(c); setContent(c); showToast('Content updated'); } catch (err) { showToast(err.message, true); } };
  const handleSaveSettings = async () => { try { await adminApi.saveSettings({ theme: themeSettings, keys: integrationKeys }); showToast('Settings saved'); } catch (err) { showToast(err.message, true); } };
  const handleSaveFees = async data => { try { await adminApi.updateFeeSettings?.(data); setFeeSettings(data); showToast('Fee settings saved'); } catch (err) { showToast(err.message, true); } };
  const handleMarkPayoutPaid = async id => { try { await adminApi.markPayoutAsPaid?.(id); showToast('Marked as paid'); fetchExtras(); } catch (err) { showToast(err.message, true); } };
  const handleSaveNotifSettings = async data => { try { await adminApi.updateNotificationSettings?.(data); setNotifSettings(data); showToast('Saved'); } catch (err) { showToast(err.message, true); } };
  const handleSendPushNotif = async data => { try { await adminApi.sendPushNotification?.(data); showToast('Notification sent'); addNotif(`Push sent: "${data.title}"`); fetchExtras(); } catch (err) { showToast(err.message, true); } };
  const handleChangePassword = async data => { await adminApi.changePassword?.(data); };
  const handleLogout = () => { logout(); navigate('/'); };

  // Guest donation handlers
  const handleSendInstructions = async (id, instructions, paymentMethod) => {
    setSendingInstructions(prev => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/guest-donations/admin/send-instructions/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ instructions, payment_method: paymentMethod })
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Payment instructions sent to guest');
        fetchGuestDonations();
        addNotif(`Payment instructions sent for guest donation #${id}`, 'info');
      } else {
        showToast(data.error, true);
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSendingInstructions(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleApproveGuestDonation = async (id) => {
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/guest-donations/admin/approve/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Donation approved and credited to campaign');
        addNotif(`Guest donation #${id} approved and credited`, 'success');
        fetchGuestDonations();
        fetchAll();
      } else {
        showToast(data.error, true);
      }
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleRejectGuestDonation = async (id) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/guest-donations/admin/reject/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Donation rejected');
        addNotif(`Guest donation #${id} rejected`, 'warning');
        fetchGuestDonations();
      } else {
        showToast(data.error, true);
      }
    } catch (err) {
      showToast(err.message, true);
    }
  };

  if (sessionLoading || !authChecked) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading admin panel…</div>;

  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'approved').length;
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending' || c.status === 'review').length;
  const donorsCount = users.filter(u => u.role === 'donor').length;
  const creatorsCount = users.filter(u => u.role === 'creator').length;
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending').length;
  const pendingCompletions = completionRequests.length;
  const pendingDeposits = depositRequests.filter(d => d.status === 'pending' || d.status === 'awaiting_proof').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const tabLabel = t => ({ email_templates: 'Email Templates', notifications: 'Notifications', 'audit-logs': 'Audit Logs', fees: 'Fee Settings', payouts: 'Payouts', guest_donations: 'Guest Donations' }[t] || (t.charAt(0).toUpperCase() + t.slice(1)));

  const SideNavBtn = ({ id, label, icon, badge, badgeClass = '' }) => (
    <button className={`nl ${activeTab === id ? 'active' : ''}`} onClick={() => { setActiveTab(id); setMobileSidebarOpen(false); }}>
      {icon}{label}{badge > 0 && <span className={`nb ${badgeClass}`}>{badge}</span>}
    </button>
  );

  return (
    <div className="shell">
      {/* Sidebar with mobile toggle */}
      <div id="sidebarOverlay" className={`sidebar-overlay ${mobileSidebarOpen ? 'open' : ''}`}></div>
      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : 'mobile-closed'}`}>
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
          <SideNavBtn id="overview" label="Dashboard" icon={<LayoutDashboard size={18} />} />
          <SideNavBtn id="campaigns" label="Campaigns" icon={<Target size={18} />} badge={pendingCampaigns} />
          <SideNavBtn id="users" label="Users" icon={<Users size={18} />} />
          <div className="nav-sec">Finance</div>
          <SideNavBtn id="donations" label="Donations" icon={<DollarSign size={18} />} />
          <SideNavBtn id="deposits" label="Deposits" icon={<CreditCard size={18} />} badge={pendingDeposits} badgeClass="am" />
          <SideNavBtn id="withdrawals" label="Withdrawals" icon={<Banknote size={18} />} badge={pendingWithdrawals} badgeClass="am" />
          <SideNavBtn id="payouts" label="Payouts" icon={<Receipt size={18} />} />
          <SideNavBtn id="fees" label="Fee Settings" icon={<Settings size={18} />} />
          <div className="nav-sec">Operations</div>
          <SideNavBtn id="completions" label="Completions" icon={<CheckCircle size={18} />} badge={pendingCompletions} badgeClass="am" />
          <SideNavBtn id="notifications" label="Notifications" icon={<Bell size={18} />} />
          <SideNavBtn id="audit-logs" label="Audit Logs" icon={<History size={18} />} />
          <SideNavBtn id="maintenance" label="Maintenance" icon={<AlertCircle size={18} />} />
          <SideNavBtn id="guest_donations" label="Guest Donations" icon={<Users size={18} />} badge={guestDonations.filter(g => g.payment_status === 'pending_verification').length} badgeClass="am" />
          <div className="nav-sec">Admin</div>
          <SideNavBtn id="email_templates" label="Email Templates" icon={<MailIcon size={18} />} />
          <SideNavBtn id="massmail" label="Mass Mail" icon={<Send size={18} />} />
          <SideNavBtn id="content" label="Content" icon={<FileText size={18} />} />
          <SideNavBtn id="settings" label="Settings" icon={<Settings size={18} />} />
          <button className="nl" onClick={() => setDarkMode(d => !d)} style={{ marginTop: 8 }}>
            <Settings size={18} />{darkMode ? 'Light Mode' : 'Dark Mode'}
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
          <div className="tb-title">{tabLabel(activeTab)}</div>
          <div className="tb-actions">
            <div ref={notifRef} style={{ position: 'relative' }}>
              <div className="tb-btn" onClick={() => setShowNotifPanel(p => !p)}>
                <Bell size={18} />
                {unreadNotifs > 0 && <div className="notif-badge">{unreadNotifs > 9 ? '9+' : unreadNotifs}</div>}
              </div>
              {showNotifPanel && (
                <NotificationPanel
                  notifications={notifications}
                  onMarkRead={() => setNotifications(p => p.map(n => ({ ...n, read: true })))}
                  onClearAll={() => setNotifications([])}
                  onClose={() => setShowNotifPanel(false)}
                />
              )}
            </div>
            <div className="tb-btn" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>SA</div>
            </div>
          </div>
        </div>
        
        {/* Mobile header */}
        <div className="mob-top">
          <div className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(true)}>
            <Menu size={20} />
          </div>
          <div className="mob-logo">HopeBridge</div>
          <div ref={mobileNotifRef} style={{ position: 'relative' }}>
            <div className="tb-btn" onClick={() => setShowMobileNotifPanel(p => !p)} style={{ width: 38, height: 38 }}>
              <Bell size={18} />
              {unreadNotifs > 0 && <div className="notif-badge">{unreadNotifs > 9 ? '9+' : unreadNotifs}</div>}
            </div>
            {showMobileNotifPanel && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 320, zIndex: 1000 }}>
                <NotificationPanel
                  notifications={notifications}
                  onMarkRead={() => setNotifications(p => p.map(n => ({ ...n, read: true })))}
                  onClearAll={() => setNotifications([])}
                  onClose={() => setShowMobileNotifPanel(false)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="page">
          {dataLoading && <div style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>Loading data…</div>}

          {/* Overview Section */}
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
                    {maintenanceMode.enabled ? <><AlertCircle size={12} /> Maintenance</> : <><CheckCircle size={12} /> Live</>}
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
              <div className="sc" onClick={() => setActiveTab('users')}><div className="si si-g"><Users size={18} /></div><div className="sv">{users.length}</div><div className="sl">Total Users</div></div>
              <div className="sc" onClick={() => setActiveTab('campaigns')}><div className="si si-b"><Target size={18} /></div><div className="sv">{activeCampaigns}</div><div className="sl">Active Campaigns</div></div>
              <div className="sc" onClick={() => setActiveTab('donations')}><div className="si si-a"><DollarSign size={18} /></div><div className="sv">${(totalRaised / 1000).toFixed(0)}k</div><div className="sl">Total Raised</div></div>
              <div className="sc" onClick={() => setActiveTab('completions')}><div className="si si-r"><Clock size={18} /></div><div className="sv">{pendingCompletions}</div><div className="sl">Pending Completions</div></div>
            </div>

            {/* Quick Toggles */}
            <div className="sh" style={{ marginBottom: 12 }}><div className="sht"><Settings size={18} /> Quick Toggles</div></div>
            <div className="qt-grid">
              {[
                { label: 'Maintenance Mode', sub: maintenanceMode.enabled ? 'Enabled' : 'Disabled', on: maintenanceMode.enabled, onChange: handleToggleMaintenance, danger: true, disabled: togglingMaintenance },
                { label: 'Email Verification', sub: verificationEnabled ? 'Required' : 'Skipped', on: verificationEnabled, onChange: handleToggleVerification, disabled: togglingVerification },
                { label: 'reCAPTCHA', sub: recaptchaEnabled ? 'Active' : 'Inactive', on: recaptchaEnabled, onChange: handleToggleRecaptcha, disabled: togglingRecaptcha },
                { label: 'Dark Mode', sub: darkMode ? 'Dark' : 'Light', on: darkMode, onChange: setDarkMode },
              ].map(({ label, sub, on, onChange, danger, disabled }) => (
                <div key={label} className="qt-card">
                  <div>
                    <div className="qt-label">{label}</div>
                    <div className="qt-sub"><span className={`status-pill ${on ? 'on' : 'off'}`}><span className="status-dot" />{sub}</span></div>
                  </div>
                  <Toggle checked={on} onChange={onChange} danger={danger} disabled={disabled} />
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="sh" style={{ marginBottom: 12 }}><div className="sht"><Zap size={18} /> Quick Actions</div></div>
            <div className="qg">
              {[
                { id: 'campaigns', label: 'Campaigns', icon: <Target size={18} /> },
                { id: 'users', label: 'Users', icon: <Users size={18} /> },
                { id: 'deposits', label: 'Deposits', icon: <CreditCard size={18} /> },
                { id: 'withdrawals', label: 'Withdrawals', icon: <Banknote size={18} /> },
                { id: 'payouts', label: 'Payouts', icon: <Receipt size={18} /> },
                { id: 'completions', label: 'Completions', icon: <CheckCircle size={18} /> },
                { id: 'fees', label: 'Fees', icon: <Settings size={18} /> },
                { id: 'notifications', label: 'Push', icon: <Bell size={18} /> },
                { id: 'audit-logs', label: 'Audit', icon: <History size={18} /> },
                { id: 'email_templates', label: 'Email', icon: <MailIcon size={18} /> },
                { id: 'massmail', label: 'Mass Mail', icon: <Send size={18} /> },
                { id: 'content', label: 'Content', icon: <FileText size={18} /> },
                { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
                { id: 'maintenance', label: 'Maintenance', icon: <AlertCircle size={18} /> },
                { id: 'guest_donations', label: 'Guest Donations', icon: <Users size={18} /> },
                { id: 'logout', label: 'Sign Out', icon: <LogOut size={18} />, danger: true },
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
                      <div key={req.id} className="di" onClick={() => setSelectedWithdrawal(req)}>
                        <div className="uav ava" style={{ width: 32, height: 32, fontSize: 11 }}>{req.name?.[0] || 'U'}</div>
                        <div className="di-info"><div className="di-user">{req.name}</div><div className="di-amt">${req.amount.toFixed(2)}</div></div>
                        <div className="di-acts" onClick={e => e.stopPropagation()}>
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

          {/* Campaigns Section */}
          <div className={`ps ${activeTab === 'campaigns' ? 'active' : ''}`}>
            <div className="sh">
              <div className="sht"><Target size={18} /> Campaign Management</div>
              <button className="btn btn-g" onClick={() => setCreateCampaignModal(true)}><Plus size={16} /> Create Campaign</button>
            </div>
            <div className="card">
              <div className="card-b" style={{ padding: 0 }}>
                <div className="ut-wrapper">
                  <table className="ut">
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: 20 }}>Campaign</th>
                        <th>Goal</th>
                        <th>Raised</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th style={{ paddingRight: 20 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(c => (
                        <tr key={c.id}>
                          <td style={{ paddingLeft: 20 }}>
                            <div style={{ fontWeight: 600 }}>{c.title}</div>
                            <small style={{ color: 'var(--txt-3)' }}>{c.creator_name}</small>
                          </td>
                          <td>${c.goal.toLocaleString()}</td>
                          <td>${c.raised.toLocaleString()}</td>
                          <td>
                            <div className="pb" style={{ width: 80 }}>
                              <div className="pf" style={{ width: `${Math.min((c.raised / c.goal) * 100, 100)}%` }} />
                            </div>
                            {Math.round((c.raised / c.goal) * 100)}%
                          </td>
                          <td>
                            <span className={`badge ${c.status === 'approved' ? 'ba' : c.status === 'pending' ? 'bp' : 'br'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td style={{ paddingRight: 20 }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {c.status === 'pending' && (
                                <button className="db dba" onClick={() => handleApproveCampaign(c.id)}>
                                  <CheckCircle size={12} /> Approve
                                </button>
                              )}
                              <button className="db dbv" onClick={() => setEditCampaignModal({ open: true, campaign: c })}>
                                <Edit size={12} /> Edit
                              </button>
                              <button className="db dbp" onClick={() => setProgressModal({ open: true, campaign: c })}>
                                <TrendingUp size={12} /> Progress
                              </button>
                              <button 
                                className="db dbr" 
                                onClick={() => { 
                                  if (window.confirm(`Delete "${c.title}" permanently?`)) {
                                    handleDeleteCampaign(c.id);
                                  } 
                                }}
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Users Section */}
          <div className={`ps ${activeTab === 'users' ? 'active' : ''}`}>
            <div className="sh">
              <div className="sht"><Users size={18} /> User Management</div>
              <button className="btn btn-g" onClick={() => setShowAddUserModal(true)}><Plus size={16} /> Add User</button>
            </div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}>
              <div className="ut-wrapper">
                <table className="ut">
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: 20 }}>User</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Wallet</th>
                      <th>Status</th>
                      <th style={{ paddingRight: 20 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td style={{ paddingLeft: 20 }}>
                          <div className="uc">
                            <div className="uav avg">{u.name?.charAt(0)}</div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{u.name}</div>
                              <small style={{ color: 'var(--txt-3)' }}>{u.email}</small>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge br">{u.role}</span></td>
                        <td style={{ color: 'var(--txt-2)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                        <td><div style={{ fontWeight: 600 }}>${(u.wallet_balance || 0).toFixed(2)}</div></td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <span className={`badge ${u.is_active ? 'ba' : 'bx'}`}>{u.is_active ? 'Active' : 'Suspended'}</span>
                            {u.is_verified && <span className="badge" style={{ background: 'var(--blue-l)', color: '#185FA5' }}>Verified</span>}
                          </div>
                        </td>
                        <td style={{ paddingRight: 20 }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <button className="db dbv" onClick={() => { setEditUser({ name: u.name, email: u.email, role: u.role, is_verified: u.is_verified }); setEditUserModal({ open: true, user: u }); }}>
                              <Edit size={12} /> Edit
                            </button>
                            <button className="db dbv" onClick={() => handleToggleUser(u.id)}>
                              {u.is_active ? <Lock size={12} /> : <Unlock size={12} />} {u.is_active ? 'Suspend' : 'Restore'}
                            </button>
                            {!u.is_verified && u.role !== 'admin' && (
                              <button className="db dba" onClick={() => handleVerifyUser(u.id)}>
                                <UserCheck size={12} /> Verify
                              </button>
                            )}
                            <button className="db dbp" onClick={() => setWalletModal({ open: true, user: u })}>
                              <Wallet size={12} /> Wallet
                            </button>
                            {u.role !== 'admin' && (
                              <button className="db dbr" onClick={() => setDeleteUserModal({ open: true, userId: u.id, userName: u.name })}>
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div></div>
          </div>

          {/* Donations Section */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><DollarSign size={18} /> All Donations</div></div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}>
              <div className="ut-wrapper">
                <table className="ut">
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Campaign</th>
                      <th>Amount</th>
                      <th>Monthly</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.id}>
                        <td>{d.donor_name || 'Anonymous'}</td>
                        <td>{d.campaign_title}</td>
                        <td>${d.amount.toLocaleString()}</td>
                        <td>{d.is_monthly ? '✅' : '—'}</td>
                        <td>{new Date(d.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div></div>
          </div>

          {/* Deposits Section */}
          <div className={`ps ${activeTab === 'deposits' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><CreditCard size={18} /> Deposit Requests</div></div>
            <div className="card"><div className="card-b">
              <DepositRequestsManager 
                requests={depositRequests} 
                onApprove={handleApproveDeposit} 
                onReject={handleRejectDeposit} 
                onProvideInstructions={handleProvideInstructions} 
                showToast={showToast} 
                onSelect={(deposit) => setSelectedDeposit(deposit)}
              />
            </div></div>
          </div>

          {/* Withdrawals Section */}
          <div className={`ps ${activeTab === 'withdrawals' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Banknote size={18} /> Withdrawal Requests</div></div>
            <div className="card"><div className="card-b">
              <WithdrawalRequestsManager 
                requests={withdrawalRequests} 
                onApprove={handleApproveWithdrawal} 
                onReject={handleRejectWithdrawal}
                onSelect={(withdrawal) => setSelectedWithdrawal(withdrawal)}
              />
            </div></div>
          </div>

          {/* Completions Section */}
          <div className={`ps ${activeTab === 'completions' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><CheckCircle size={18} /> Campaign Completions</div></div>
            <div className="card"><div className="card-b"><CompletionRequestsManager requests={completionRequests} onRelease={handleReleaseEscrow} onRefund={handleRefundEscrow} /></div></div>
          </div>

          {/* Payouts Section */}
          <div className={`ps ${activeTab === 'payouts' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Receipt size={18} /> Payout Reconciliation</div></div>
            <div className="card"><div className="card-b"><PayoutsManager payouts={payouts} onMarkPaid={handleMarkPayoutPaid} /></div></div>
          </div>

          {/* Fee Settings Section */}
          <div className={`ps ${activeTab === 'fees' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Settings size={18} /> Transaction Fee & Deposit/Withdrawal Limits</div></div>
            <div className="card"><div className="card-b"><FeeSettings fees={feeSettings} onSave={handleSaveFees} showToast={showToast} /></div></div>
          </div>

          {/* Notifications Section */}
          <div className={`ps ${activeTab === 'notifications' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Bell size={18} /> Push Notifications</div></div>
            <div className="card"><div className="card-b">
              <NotificationManager settings={notifSettings} onSave={handleSaveNotifSettings} onSend={handleSendPushNotif} history={notifHistory} showToast={showToast} />
            </div></div>
          </div>

          {/* Audit Logs Section */}
          <div className={`ps ${activeTab === 'audit-logs' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><History size={18} /> Audit Logs</div></div>
            <div className="card"><div className="card-b"><AuditLogs logs={auditLogs} /></div></div>
          </div>

          {/* Email Templates Section */}
          <div className={`ps ${activeTab === 'email_templates' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><MailIcon size={18} /> Email Templates</div><div style={{ fontSize: 13, color: 'var(--txt-3)' }}>Customise every transactional email</div></div>
            <div className="card"><div className="card-b"><EmailTemplateEditor showToast={showToast} /></div></div>
          </div>

          {/* Mass Mail Section */}
          <div className={`ps ${activeTab === 'massmail' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><Send size={18} /> Broadcast Email</div></div><div className="card-b"><MassMailForm showToast={showToast} /></div></div>
          </div>

          {/* Content Section */}
          <div className={`ps ${activeTab === 'content' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><FileText size={18} /> Platform Content</div></div><div className="card-b"><ContentEditor content={content} onSave={handleSaveContent} showToast={showToast} /></div></div>
          </div>

          {/* Maintenance Section */}
          <div className={`ps ${activeTab === 'maintenance' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><AlertCircle size={18} /> Maintenance Mode</div></div>
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

          {/* Guest Donations Section */}
          <div className={`ps ${activeTab === 'guest_donations' ? 'active' : ''}`}>
            <div className="sh">
              <div className="sht"><Users size={18} /> Guest Donations</div>
              <button className="btn btn-gh" onClick={fetchGuestDonations} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {/* Auto-Instruction Templates Card */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-h">
                <div className="card-t"><Settings size={18} /> Auto‑Instruction Templates (sent after 5 minutes)</div>
              </div>
              <div className="card-b">
                {loadingInstructions ? (
                  <div style={{ padding: 20, textAlign: 'center' }}>Loading templates...</div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: 20 }}>
                      {Object.entries(paymentInstructions).map(([method, instruction]) => (
                        <div key={method}>
                          <label className="fl" style={{ textTransform: 'uppercase' }}>
                            {method.replace('_', ' ')}
                          </label>
                          <textarea
                            className="fi"
                            rows="4"
                            value={instruction}
                            onChange={(e) => setPaymentInstructions(prev => ({ ...prev, [method]: e.target.value }))}
                            placeholder={`Enter instructions for ${method}`}
                            style={{ fontFamily: 'monospace', fontSize: 12 }}
                          />
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-g" onClick={savePaymentInstructions} disabled={savingInstructions}>
                      {savingInstructions ? 'Saving...' : 'Save All Templates'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-b">
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'pending_instructions', label: 'Pending Instructions' },
                    { key: 'instructions_sent', label: 'Instructions Sent' },
                    { key: 'pending_verification', label: 'Pending Verification' },
                    { key: 'approved', label: 'Approved' },
                    { key: 'rejected', label: 'Rejected' }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      className={`db ${guestDonationFilter === filter.key ? 'dba' : 'dbv'}`}
                      onClick={() => setGuestDonationFilter(filter.key)}
                      style={{ fontSize: 12 }}
                    >
                      {filter.label}
                      {filter.key !== 'all' && (
                        <span style={{ marginLeft: 6, background: 'rgba(0,0,0,0.1)', padding: '0 6px', borderRadius: 10 }}>
                          {guestDonations.filter(g => g.payment_status === filter.key).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                
                {guestDonations.filter(g => guestDonationFilter === 'all' || g.payment_status === guestDonationFilter).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, color: 'var(--txt-3)' }}>
                    <Users size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
                    <div style={{ fontSize: 16, marginBottom: 8 }}>No Guest Donations Yet</div>
                    <div style={{ fontSize: 13 }}>When guests donate, they will appear here for you to manage.</div>
                  </div>
                ) : (
                  guestDonations.filter(g => guestDonationFilter === 'all' || g.payment_status === guestDonationFilter).map(g => (
                    <div key={g.id} style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>
                            #{g.id} - {g.guest_name || 'Anonymous'}
                            {g.guest_name && <span style={{ fontWeight: 'normal', color: 'var(--txt-2)' }}> ({g.guest_email})</span>}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--txt-2)', marginTop: 4 }}>
                            Campaign: <strong>{g.campaign_title}</strong>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--txt-2)' }}>
                            Amount: <strong style={{ color: 'var(--green)' }}>${parseFloat(g.amount).toFixed(2)}</strong>
                          </div>
                          {g.message && (
                            <div style={{ fontSize: 12, color: 'var(--txt-3)', fontStyle: 'italic', marginTop: 6, background: 'var(--surface-2)', padding: 8, borderRadius: 8 }}>
                              "{g.message}"
                            </div>
                          )}
                          <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 6 }}>
                            Requested: {new Date(g.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className={`badge ${g.payment_status === 'approved' ? 'ba' : g.payment_status === 'rejected' ? 'bx' : g.payment_status === 'pending_verification' ? 'bp' : 'br'}`}>
                            {g.payment_status?.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {g.payment_status === 'pending_instructions' && (
                        <div style={{ marginTop: 16, background: 'var(--surface-2)', padding: 16, borderRadius: 12 }}>
                          <label className="fl" style={{ marginBottom: 8 }}>Payment Instructions</label>
                          <textarea
                            id={`instructions-${g.id}`}
                            className="fi"
                            rows="4"
                            placeholder="Enter payment instructions (bank details, mobile money number, account details, etc.)"
                            style={{ marginBottom: 12 }}
                          />
                          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            <select id={`method-${g.id}`} className="fi" style={{ width: 'auto', minWidth: 150 }}>
                              <option value="bank_transfer">🏦 Bank Transfer</option>
                              <option value="mobile_money">📱 Mobile Money</option>
                              <option value="cash">💵 Cash</option>
                              <option value="paypal">💳 PayPal</option>
                              <option value="crypto">₿ Crypto</option>
                              <option value="other">📝 Other</option>
                            </select>
                            <button 
                              className="btn btn-g" 
                              onClick={() => {
                                const instructions = document.getElementById(`instructions-${g.id}`).value;
                                const method = document.getElementById(`method-${g.id}`).value;
                                if (!instructions.trim()) {
                                  showToast('Please enter payment instructions', true);
                                  return;
                                }
                                handleSendInstructions(g.id, instructions, method);
                              }}
                              disabled={sendingInstructions[g.id]}
                              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                              {sendingInstructions[g.id] ? (
                                <>Sending...</>
                              ) : (
                                <><Send size={14} /> Send Instructions</>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {g.payment_status === 'instructions_sent' && g.admin_instructions && (
                        <div style={{ marginTop: 12, padding: 12, background: 'var(--blue-l)', borderRadius: 10, fontSize: 13 }}>
                          <strong style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <MailIcon size={14} /> Instructions Sent:
                          </strong>
                          <div style={{ whiteSpace: 'pre-line', color: 'var(--txt-2)' }}>
                            {g.admin_instructions}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 8 }}>
                            Payment Method: {g.payment_method?.replace(/_/g, ' ').toUpperCase()}
                          </div>
                        </div>
                      )}
                      
                      {g.payment_status === 'pending_verification' && g.proof_image_url && (
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>Payment Proof:</div>
                          <ProofImageViewer url={g.proof_image_url} />
                          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <button className="btn btn-g" onClick={() => handleApproveGuestDonation(g.id)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <CheckCircle size={14} /> Approve & Credit Campaign
                            </button>
                            <button className="btn btn-r" onClick={() => handleRejectGuestDonation(g.id)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {g.payment_status === 'approved' && (
                        <div style={{ marginTop: 12, padding: 12, background: 'var(--green-l)', borderRadius: 10, fontSize: 13, color: 'var(--green-d)' }}>
                          <CheckCircle size={14} style={{ display: 'inline', marginRight: 6 }} />
                          Donation approved and credited to campaign
                          {g.donation_id && <span style={{ marginLeft: 8 }}>(Donation ID: #{g.donation_id})</span>}
                        </div>
                      )}
                      
                      {g.payment_status === 'rejected' && g.admin_notes && (
                        <div style={{ marginTop: 12, padding: 12, background: 'var(--red-l)', borderRadius: 10, fontSize: 13, color: 'var(--red)' }}>
                          <X size={14} style={{ display: 'inline', marginRight: 6 }} />
                          Rejected: {g.admin_notes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><Settings size={18} /> System Settings</div></div><div className="card-b">
              <div className="settings-tabs">
                {['security', 'theme', 'keys', 'social', 'firebase'].map(t => (
                  <button key={t} className={`role-tab ${settingsTab === t ? 'active' : ''}`} onClick={() => setSettingsTab(t)}>
                    {t === 'security' ? 'Security' : t === 'theme' ? 'Theme' : t === 'keys' ? 'SMTP Keys' : t === 'social' ? 'Social Links' : 'Firebase'}
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

              {settingsTab === 'firebase' && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>Firebase Push Notification Configuration</div>
                  <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
                    <div style={{ fontSize: 13, marginBottom: 12 }}>Configure Firebase Cloud Messaging for push notifications.</div>
                    <label className="fl">FCM Server Key</label>
                    <input type="password" className="fi" value={firebaseServerKey} onChange={e => setFirebaseServerKey(e.target.value)} placeholder="AAAA...your Firebase Server Key" />
                    <div style={{ fontSize: 12, color: 'var(--txt-3)', marginTop: -8, marginBottom: 12 }}>
                      Get from Firebase Console → Project Settings → Cloud Messaging → Server Key
                    </div>
                    <label className="fl">FCM Sender ID</label>
                    <input type="text" className="fi" value={firebaseSenderId} onChange={e => setFirebaseSenderId(e.target.value)} placeholder="Your Firebase Sender ID" />
                    <button className="btn btn-g" onClick={saveFirebaseConfig} disabled={savingFirebase}>
                      {savingFirebase ? 'Saving...' : 'Save Firebase Configuration'}
                    </button>
                  </div>
                </div>
              )}
            </div></div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation (removed Alerts) */}
      <nav className="bnav">
        <div className="bnav-inner">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Home' },
            { id: 'campaigns', icon: <Target size={20} />, label: 'Campaigns' },
            { id: 'deposits', icon: <CreditCard size={20} />, label: 'Deposits' },
            { id: 'withdrawals', icon: <Banknote size={20} />, label: 'Withdrawals' },
            { id: 'guest_donations', icon: <Users size={20} />, label: 'Guest' },
            { id: 'notifications', icon: <Bell size={20} />, label: 'Push' },
            { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
          ].map(({ id, icon, label }) => (
            <button key={id} className={`bni ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              <div className="bni-icon" style={{ color: activeTab === id ? 'var(--green)' : 'var(--txt-3)' }}>{icon}</div>
              <span className="bni-lbl">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* All Modals */}
      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} onSave={handleChangePassword} showToast={showToast} />
      <DeleteUserModal isOpen={deleteUserModal.open} onClose={() => setDeleteUserModal({ open: false, userId: null, userName: '' })} onConfirm={() => handleDeleteUser(deleteUserModal.userId)} userName={deleteUserModal.userName} showToast={showToast} />
      <UserModal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} onSubmit={handleAddUserSubmit} userData={newUser} setUserData={setNewUser} loading={addingUser} />
      <UserModal isOpen={editUserModal.open} onClose={() => setEditUserModal({ open: false, user: null })} onSubmit={handleEditUserSubmit} userData={editUser} setUserData={setEditUser} loading={editingUser} editMode />
      <EditCampaignModal isOpen={editCampaignModal.open} onClose={() => setEditCampaignModal({ open: false, campaign: null })} campaign={editCampaignModal.campaign} onSave={handleEditCampaignSave} showToast={showToast} />
      <CreateCampaignModal isOpen={createCampaignModal} onClose={() => setCreateCampaignModal(false)} onSave={handleCreateCampaignSave} showToast={showToast} />
      <WalletAdjustModal isOpen={walletModal.open} onClose={() => setWalletModal({ open: false, user: null })} user={walletModal.user} onSave={handleWalletAdjust} showToast={showToast} />
      <CampaignProgressModal isOpen={progressModal.open} onClose={() => setProgressModal({ open: false, campaign: null })} campaign={progressModal.campaign} onSave={handleUpdateProgress} showToast={showToast} />
      
      {/* Deposit & Withdrawal Details Modals */}
      <DepositDetailsModal isOpen={!!selectedDeposit} onClose={() => setSelectedDeposit(null)} deposit={selectedDeposit} />
      <WithdrawalDetailsModal isOpen={!!selectedWithdrawal} onClose={() => setSelectedWithdrawal(null)} withdrawal={selectedWithdrawal} />
    </div>
      
  );
}