import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { adminApi, campaignApi } from '../services/api';
import {
  Heart,
  LayoutDashboard,
  Users,
  DollarSign,
  Wallet,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  CreditCard,
  Plus,
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
  Menu,
  Gift,
  PiggyBank,
  Landmark,
  Smartphone,
  Upload,
  Image,
  Copy,
  ExternalLink,
  Target,
  Flag,
  Filter,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldAlert,
  Moon,
  Sun,
  Trophy,
  BarChart3,
  PieChart,
  LineChart,
  Receipt,
  FileCheck,
  FileWarning,
  PhoneCall,
  Mail as MailIcon,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Menu as MenuIcon,
  Pause,
  Play
} from 'lucide-react';

// ---------- Helper Functions ----------
const safeGet = async (apiCall, fallback) => {
  try { return await apiCall(); } catch { return fallback; }
};

const toNumber = (val, fallback = 0) => {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
};

// ---------- Style Injection ----------
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    :root {
      --green:#1D9E75;--green-d:#0F6E56;--green-dd:#085041;--green-l:#E1F5EE;--green-m:#9FE1CB;--accent:#5DCAA5;
      --red:#E24B4A;--red-l:#FCEBEB;--amber:#EF9F27;--amber-l:#FAEEDA;--blue:#378ADD;--blue-l:#E6F1FB;
      --bg:#EEF1F5;--surface:#FFFFFF;--surface-2:#F6F8FA;--border:rgba(0,0,0,0.07);--border-2:rgba(0,0,0,0.13);
      --txt:#111318;--txt-2:#5A6272;--txt-3:#9AA3B2;
      --sidebar-w:240px;--topbar-h:64px;--bottom-nav:68px;
      --r-sm:10px;--r-md:14px;--r-lg:20px;--r-xl:26px;
      --sh-sm:0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.04);
      --sh-md:0 4px 16px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.04);
      --sh-lg:0 12px 40px rgba(0,0,0,0.13);
      --fd:'Instrument Serif',Georgia,serif;--fb:'DM Sans',sans-serif;--tr:0.18s ease;
    }
    body.dark-mode {
      --bg:#121212;--surface:#1E1E1E;--surface-2:#2A2A2A;--border:rgba(255,255,255,0.1);
      --txt:#EEEEEE;--txt-2:#AAAAAA;--txt-3:#777777;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
    body{font-family:var(--fb);background:var(--bg);color:var(--txt);min-height:100vh;overflow-x:hidden;transition:background var(--tr),color var(--tr)}
    .shell{display:flex;min-height:100vh}
    .sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:200;overflow-y:auto}
    .sb-logo{padding:22px 20px 14px;border-bottom:1px solid var(--border)}
    .logo-mark{display:flex;align-items:center;gap:10px;text-decoration:none}
    .logo-icon{width:36px;height:36px;border-radius:var(--r-sm);background:var(--green);display:flex;align-items:center;justify-content:center}
    .logo-icon svg{width:20px;height:20px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .logo-text{font-family:var(--fd);font-size:19px;color:var(--txt)}
    .logo-sub{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--txt-3);margin-top:1px}
    .sb-admin{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
    .admin-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--green),var(--green-d));display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;color:#fff;flex-shrink:0}
    .admin-name-s{font-size:13px;font-weight:600;color:var(--txt)}
    .admin-role{font-size:11px;color:var(--txt-3);margin-top:1px}
    .sb-nav{flex:1;padding:10px}
    .nav-sec{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txt-3);padding:10px 10px 4px}
    .nl{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--r-sm);cursor:pointer;border:none;background:none;width:100%;text-align:left;color:var(--txt-2);font-size:13.5px;font-weight:500;font-family:var(--fb);transition:background var(--tr),color var(--tr);text-decoration:none;position:relative}
    .nl:hover{background:var(--bg);color:var(--txt)}
    .nl.active{background:var(--green-l);color:var(--green-d);font-weight:600}
    .nl.active svg{stroke:var(--green-d)}
    .nl svg{width:18px;height:18px;stroke:currentColor;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
    .nb{margin-left:auto;font-size:10px;font-weight:700;background:var(--red);color:#fff;padding:2px 7px;border-radius:20px}
    .nb.am{background:var(--amber)}
    .nb.gr{background:var(--green)}
    .sb-footer{padding:12px 10px;border-top:1px solid var(--border)}
    .main{flex:1;margin-left:var(--sidebar-w);display:flex;flex-direction:column;min-height:100vh}
    .topbar{height:var(--topbar-h);background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 28px;gap:16px;position:sticky;top:0;z-index:100}
    .tb-title{font-family:var(--fd);font-size:22px;color:var(--txt);flex:1}
    .tb-actions{display:flex;align-items:center;gap:10px}
    .tb-btn{width:38px;height:38px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:background var(--tr)}
    .tb-btn:hover{background:var(--bg)}
    .tb-btn svg{width:18px;height:18px;stroke:var(--txt-2);stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .ndot{position:absolute;top:7px;right:7px;width:7px;height:7px;background:var(--red);border-radius:50%;border:1.5px solid var(--surface)}
    .page{padding:28px}
    .ps{display:none}
    .ps.active{display:block}
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
    .si svg{width:18px;height:18px;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .si-g{background:var(--green-l)}.si-g svg{stroke:var(--green-d)}
    .si-b{background:var(--blue-l)}.si-b svg{stroke:var(--blue)}
    .si-a{background:var(--amber-l)}.si-a svg{stroke:#854F0B}
    .si-r{background:var(--red-l)}.si-r svg{stroke:var(--red)}
    .sv{font-family:var(--fd);font-size:32px;color:var(--txt);line-height:1;position:relative;z-index:1}
    .sl{font-size:12px;color:var(--txt-2);font-weight:500;margin-top:4px;position:relative;z-index:1}
    .sd{font-size:11px;font-weight:700;margin-top:8px;position:relative;z-index:1}
    .dup{color:var(--green)}.ddn{color:var(--red)}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
    .three-col{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:24px}
    .card{background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--sh-sm);overflow:hidden}
    .card-h{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid var(--border)}
    .card-t{font-family:var(--fd);font-size:17px;color:var(--txt);display:flex;align-items:center;gap:8px}
    .card-a{font-size:12px;font-weight:600;color:var(--green);cursor:pointer;border:none;background:none;font-family:var(--fb);display:flex;align-items:center;gap:4px}
    .card-b{padding:16px 20px}
    .cr{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:background var(--tr)}
    .cr:last-child{border-bottom:none}
    .cr:hover{background:var(--surface-2);margin:0 -20px;padding:10px 20px;border-radius:var(--r-sm)}
    .ct{width:40px;height:40px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    .ci{flex:1;min-width:0}
    .cn{font-size:13.5px;font-weight:600;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .cm{font-size:11px;color:var(--txt-3);margin-top:2px;display:flex;align-items:center;gap:4px}
    .pb{height:4px;background:var(--bg);border-radius:2px;margin-top:5px;overflow:hidden}
    .pf{height:100%;background:var(--green);border-radius:2px;transition:width .9s ease}
    .badge{font-size:10px;font-weight:700;padding:4px 9px;border-radius:20px;display:inline-flex;align-items:center;gap:4px}
    .bp{background:var(--amber-l);color:#854F0B}
    .ba{background:var(--green-l);color:var(--green-d)}
    .br{background:var(--blue-l);color:#185FA5}
    .bx{background:var(--red-l);color:var(--red)}
    .qg{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
    .qb{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px 8px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:transform var(--tr),box-shadow var(--tr);font-family:var(--fb)}
    .qb:hover{transform:translateY(-2px);box-shadow:var(--sh-md)}
    .qb:active{transform:scale(0.96)}
    .qi{width:40px;height:40px;border-radius:var(--r-sm);background:var(--green-l);display:flex;align-items:center;justify-content:center}
    .qi svg{width:20px;height:20px;stroke:var(--green-d);stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .qb.qx .qi{background:var(--red-l)}.qb.qx .qi svg{stroke:var(--red)}.qb.qx .ql{color:var(--red)}
    .qb.qa .qi{background:var(--amber-l)}.qb.qa .qi svg{stroke:#854F0B}
    .qb.qb2 .qi{background:var(--blue-l)}.qb.qb2 .qi svg{stroke:#185FA5}
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
    .qt-sub{font-size:11px;color:var(--txt-3);margin-top:2px;display:flex;align-items:center;gap:4px}
    .qt-icon{width:36px;height:36px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .qt-icon svg{width:18px;height:18px;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .tpl-list{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
    .tpl-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid var(--border);border-radius:var(--r-md);cursor:pointer;transition:all var(--tr);background:var(--surface)}
    .tpl-item:hover{border-color:var(--green);background:var(--green-l)}
    .tpl-item.active{border-color:var(--green);background:var(--green-l)}
    .tpl-icon{width:36px;height:36px;border-radius:var(--r-sm);background:var(--green-l);display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .tpl-icon svg{width:18px;height:18px;stroke:var(--green-d);stroke-width:1.8;fill:none}
    .tpl-name{font-size:13px;font-weight:600;color:var(--txt)}
    .tpl-desc{font-size:11px;color:var(--txt-3);margin-top:2px}
    .tpl-editor{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px}
    .tpl-preview{background:#fff;border:1px solid var(--border);border-radius:var(--r-md);padding:20px;margin-top:16px;font-size:13px;line-height:1.7;max-height:300px;overflow-y:auto}
    .di{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
    .di:last-child{border-bottom:none}
    .di-info{flex:1}
    .di-user{font-size:13px;font-weight:600;color:var(--txt)}
    .di-amt{font-size:12px;color:var(--txt-2);margin-top:2px}
    .di-acts{display:flex;gap:6px}
    .db{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:none;font-family:var(--fb);transition:opacity var(--tr);display:inline-flex;align-items:center;gap:4px}
    .dba{background:var(--green-l);color:var(--green-d)}
    .dba:hover{background:var(--green-m)}
    .dbr{background:var(--red-l);color:var(--red)}
    .dbr:hover{background:#F7C1C1}
    .dbv{background:var(--blue-l);color:#185FA5}
    .dbp{background:var(--amber-l);color:#854F0B}
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
    .btn-r{background:var(--red);color:#fff}.btn-r:hover{opacity:.85}
    .btn-a{background:var(--amber);color:#fff}.btn-a:hover{background:#854F0B}
    .mf{display:flex;gap:10px;margin-top:6px}
    .ut{width:100%;border-collapse:collapse}
    .ut th{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--txt-3);text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);background:var(--surface-2)}
    .ut td{font-size:13px;padding:13px 12px;border-bottom:1px solid var(--border);vertical-align:middle}
    .ut tr:last-child td{border-bottom:none}
    .ut tr:hover td{background:var(--surface-2)}
    .uav{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
    .avg{background:linear-gradient(135deg,var(--green),var(--green-d))}
    .avb{background:linear-gradient(135deg,#378ADD,#185FA5)}
    .ava{background:linear-gradient(135deg,var(--amber),#854F0B)}
    .avr{background:linear-gradient(135deg,var(--red),#A32D2D)}
    .uc{display:flex;align-items:center;gap:10px}
    .sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
    .sht{font-family:var(--fd);font-size:20px;color:var(--txt);display:flex;align-items:center;gap:8px}
    .status-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700}
    .status-pill.on{background:var(--green-l);color:var(--green-d)}
    .status-pill.off{background:var(--red-l);color:var(--red)}
    .status-dot{width:6px;height:6px;border-radius:50%;background:currentColor}
    .mob-top{display:none;height:58px;background:var(--surface);border-bottom:1px solid var(--border);align-items:center;padding:0 16px;gap:12px;position:sticky;top:0;z-index:100}
    .mob-logo{font-family:var(--fd);font-size:20px;color:var(--txt);flex:1}
    .bnav{display:none;position:fixed;bottom:0;left:0;right:0;height:var(--bottom-nav);background:var(--surface);border-top:1px solid var(--border);z-index:200;box-shadow:0 -4px 20px rgba(0,0,0,0.07)}
    .bnav-inner{display:flex;justify-content:space-between;align-items:center;height:100%;width:100%;padding:0 12px}
    .bni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border:none;background:none;font-family:var(--fb)}
    .bni.active .bni-icon svg{stroke:var(--green)}
    .bni.active .bni-lbl{color:var(--green);font-weight:700}
    .bni-icon svg{width:24px;height:24px;stroke:var(--txt-3);stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .bni-lbl{font-size:10px;font-weight:600;color:var(--txt-3)}
    .fab{display:none;position:fixed;right:18px;bottom:calc(var(--bottom-nav) + 14px);width:56px;height:56px;border-radius:50%;background:var(--green);border:none;cursor:pointer;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(29,158,117,0.5);z-index:150}
    .fab svg{width:24px;height:24px;stroke:#fff;stroke-width:2.2;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .settings-tabs{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:10px;flex-wrap:wrap}
    .role-tab{background:none;border:none;padding:6px 14px;border-radius:20px;cursor:pointer;font-size:13px;font-weight:600;color:var(--txt-2);font-family:var(--fb)}
    .role-tab.active{background:var(--green-l);color:var(--green-d)}
    @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.qg{grid-template-columns:repeat(4,1fr)}.three-col{grid-template-columns:1fr}.two-col{grid-template-columns:1fr}.qt-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:768px){
      .sidebar{display:none}.main{margin-left:0}.topbar{display:none}
      .mob-top{display:flex}.bnav{display:flex}
      .page{padding:16px;padding-bottom:calc(var(--bottom-nav) + 70px)}
      .stats-grid{grid-template-columns:1fr 1fr;gap:10px}.qg{grid-template-columns:repeat(3,1fr);gap:8px}
      .ov-hero{border-radius:var(--r-lg);padding:20px}.hero-t{font-size:22px}.hst-v{font-size:20px}
      .qt-grid{grid-template-columns:1fr 1fr}
    }
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    .ps.active>*{animation:fadeUp .35s ease both}
  `;
  document.head.appendChild(styleEl);
};

// ---------- Change Password Modal ----------
function ChangePasswordModal({ isOpen, onClose, onSave, showToast }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', true);
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', true);
      return;
    }
    setLoading(true);
    try {
      await onSave({ oldPassword, newPassword });
      showToast('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-bd open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">Change Password</div>
        <div className="modal-s">Enter your current password and new password</div>
        <form onSubmit={handleSubmit}>
          <label className="fl">Current Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showOldPass ? 'text' : 'password'}
              className="fi"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              required
              style={{ paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowOldPass(!showOldPass)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <label className="fl">New Password (min 6 characters)</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showNewPass ? 'text' : 'password'}
              className="fi"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              style={{ paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <label className="fl">Confirm New Password</label>
          <input
            type="password"
            className="fi"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Delete User Modal ----------
function DeleteUserModal({ isOpen, onClose, onConfirm, userName, showToast }) {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') {
      showToast('Please type "DELETE" to confirm', true);
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
    <div className="modal-bd open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t" style={{ color: 'var(--red)' }}>Delete User</div>
        <div className="modal-s">
          Are you sure you want to permanently delete <strong>{userName}</strong>?
          <br /><br />
          This action will delete all campaigns, donations, wallet data, and cannot be undone.
        </div>
        <label className="fl">Type "DELETE" to confirm</label>
        <input
          type="text"
          className="fi"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder="DELETE"
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn btn-r" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Permanently Delete'}
          </button>
          <button className="btn btn-gh" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Add User Modal ----------
function AddUserModal({ isOpen, onClose, onSubmit, userData, setUserData, loading }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-bd open" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">Add New User</div>
        <div className="modal-s">Create a new user account</div>
        <form onSubmit={onSubmit}>
          <label className="fl">Full Name *</label>
          <input
            type="text"
            className="fi"
            value={userData.name}
            onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="John Doe"
            required
          />
          
          <label className="fl">Email *</label>
          <input
            type="email"
            className="fi"
            value={userData.email}
            onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="user@example.com"
            required
          />
          
          <label className="fl">Password *</label>
          <input
            type="password"
            className="fi"
            value={userData.password}
            onChange={e => setUserData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Min 6 characters"
            required
            minLength={6}
          />
          
          <label className="fl">Role</label>
          <select
            className="fi"
            value={userData.role}
            onChange={e => setUserData(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="donor">Donor</option>
            <option value="creator">Creator</option>
          </select>
          
          <label className="fl" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={userData.is_verified}
              onChange={e => setUserData(prev => ({ ...prev, is_verified: e.target.checked }))}
            />
            Mark as verified (skip email verification)
          </label>
          
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="submit" className="btn btn-g" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </button>
            <button type="button" className="btn btn-gh" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Toggle Switch Component ----------
function Toggle({ checked, onChange, danger = false, disabled = false }) {
  return (
    <label className={`toggle ${danger ? 'danger' : ''}`} style={{ opacity: disabled ? 0.5 : 1 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} />
      <span className="toggle-slider" />
    </label>
  );
}

// ---------- Fee Settings Component ----------
function FeeSettings({ fees, onSave, showToast }) {
  const [localFees, setLocalFees] = useState(fees);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalFees(fees);
  }, [fees]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localFees);
      showToast('Fee settings saved');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label className="fl">Platform Fee Percentage (%)</label>
        <input type="number" className="fi" step="0.5" min="0" max="100" value={localFees.percentage || 0} onChange={e => setLocalFees(prev => ({ ...prev, percentage: parseFloat(e.target.value) }))} />
        <p style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 4 }}>Percentage taken from each donation</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="fl">Fixed Fee per Transaction ($)</label>
        <input type="number" className="fi" step="0.5" min="0" value={localFees.fixed_amount || 0} onChange={e => setLocalFees(prev => ({ ...prev, fixed_amount: parseFloat(e.target.value) }))} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="fl">Minimum Fee ($)</label>
        <input type="number" className="fi" step="0.5" min="0" value={localFees.min_fee || 0} onChange={e => setLocalFees(prev => ({ ...prev, min_fee: parseFloat(e.target.value) }))} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="fl">Maximum Fee ($)</label>
        <input type="number" className="fi" step="0.5" min="0" value={localFees.max_fee || ''} onChange={e => setLocalFees(prev => ({ ...prev, max_fee: e.target.value ? parseFloat(e.target.value) : null }))} placeholder="No limit" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="fl">Withdrawal Fee ($)</label>
        <input type="number" className="fi" step="0.5" min="0" value={localFees.withdrawal_fee || 0} onChange={e => setLocalFees(prev => ({ ...prev, withdrawal_fee: parseFloat(e.target.value) }))} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label className="fl">Minimum Withdrawal Amount ($)</label>
        <input type="number" className="fi" step="1" min="1" value={localFees.minimum_withdrawal || 10} onChange={e => setLocalFees(prev => ({ ...prev, minimum_withdrawal: parseFloat(e.target.value) }))} />
      </div>
      <button className="btn btn-g" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Fee Settings'}</button>
    </div>
  );
}

// ---------- Payouts Manager Component ----------
function PayoutsManager({ payouts, onMarkPaid, showToast }) {
  const [filter, setFilter] = useState('all');
  const filtered = payouts.filter(p => filter === 'all' || p.status === filter);
  
  if (payouts.length === 0) return <div style={{ color: 'var(--txt-3)', padding: '8px 0' }}>No payout records.</div>;
  
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'paid', 'rejected'].map(s => (
          <button key={s} className={`db ${filter === s ? 'dba' : 'dbv'}`} onClick={() => setFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>
      <div className="ut">
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
                <td>
                  {p.user_name}<br/>
                  <small style={{ fontSize: 11, color: 'var(--txt-3)' }}>{p.user_email}</small>
                </td>
                <td><strong>${toNumber(p.amount).toFixed(2)}</strong></td>
                <td>
                  {p.payment_method}<br/>
                  <small>{p.payment_details?.substring(0, 30)}</small>
                </td>
                <td>
                  <span className={`badge ${p.status === 'paid' ? 'ba' : p.status === 'approved' ? 'bp' : 'bx'}`}>
                    {p.status}
                  </span>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  {p.status === 'approved' && (
                    <button className="db dba" onClick={() => onMarkPaid(p.id)}>
                      <CheckCircle size={12} /> Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Notification Manager Component ----------
function NotificationManager({ settings, onSave, onSend, history, showToast }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [notification, setNotification] = useState({ title: '', body: '', target_type: 'all', target_user_id: '' });
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await onSave(localSettings);
      showToast('Notification settings saved');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!notification.title || !notification.body) {
      showToast('Please fill title and body', true);
      return;
    }
    setSending(true);
    try {
      await onSend(notification);
      showToast('Notification sent successfully');
      setNotification({ title: '', body: '', target_type: 'all', target_user_id: '' });
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="toggle-row">
        <div className="toggle-info">
          <strong>Push Notifications</strong>
          <p>Enable/disable push notifications to users</p>
        </div>
        <Toggle checked={localSettings.enabled} onChange={(val) => setLocalSettings(prev => ({ ...prev, enabled: val }))} />
      </div>
      <button className="btn btn-g" onClick={handleSaveSettings} disabled={saving} style={{ marginTop: 16, marginBottom: 24 }}>{saving ? 'Saving...' : 'Save Settings'}</button>
      
      <hr style={{ margin: '20px 0', borderColor: 'var(--border)' }} />
      
      <div style={{ marginBottom: 12 }}>
        <label className="fl">Target Audience</label>
        <select className="fi" value={notification.target_type} onChange={e => setNotification(prev => ({ ...prev, target_type: e.target.value }))}>
          <option value="all">All Users</option>
          <option value="donors">Donors Only</option>
          <option value="creators">Creators Only</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label className="fl">Title</label>
        <input type="text" className="fi" value={notification.title} onChange={e => setNotification(prev => ({ ...prev, title: e.target.value }))} placeholder="Notification title" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label className="fl">Body</label>
        <textarea className="fi" rows="3" value={notification.body} onChange={e => setNotification(prev => ({ ...prev, body: e.target.value }))} placeholder="Notification message" />
      </div>
      <button className="btn btn-g" onClick={handleSend} disabled={sending}>
        {sending ? 'Sending...' : <><Send size={14} /> Send Push Notification</>}
      </button>
      
      {history.length > 0 && (
        <>
          <hr style={{ margin: '24px 0', borderColor: 'var(--border)' }} />
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {history.slice(0, 10).map(h => (
              <div key={h.id} style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                <div><strong>{h.title}</strong></div>
                <div style={{ fontSize: 12, color: 'var(--txt-2)' }}>{h.body}</div>
                <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 4 }}>{h.target_type} · {new Date(h.sent_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Creator Verification Manager ----------
function CreatorVerificationManager({ verifications, onReview, showToast }) {
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  
  if (verifications.length === 0) return <div style={{ color: 'var(--txt-3)', padding: '8px 0' }}>No verification requests.</div>;
  
  return (
    <div>
      <div className="ut">
        <table className="ut">
          <thead>
            <tr><th>Creator</th><th>Documents</th><th>Submitted</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {verifications.map(v => (
              <tr key={v.id}>
                <td><strong>{v.name}</strong><br/><small>{v.email}</small></td>
                <td>
                  {v.id_document_url && <a href={v.id_document_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', marginRight: 8 }}><FileText size={12} /> ID</a>}
                  {v.proof_of_address_url && <a href={v.proof_of_address_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)' }}><MapPin size={12} /> Address</a>}
                </td>
                <td>{new Date(v.created_at).toLocaleDateString()}</td>
                <td><span className={`badge ${v.status === 'approved' ? 'ba' : v.status === 'pending' ? 'bp' : 'bx'}`}>{v.status}</span></td>
                <td><button className="db dba" onClick={() => { setSelected(v); setNotes(''); }}><Eye size={12} /> Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selected && (
        <div className="modal-bd open" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-t">Review Verification</div>
            <div className="modal-s">User: {selected.name} ({selected.email})</div>
            <div style={{ marginBottom: 12 }}>
              <strong>Documents:</strong>
              <ul style={{ marginTop: 8, marginLeft: 20 }}>
                {selected.id_document_url && <li><a href={selected.id_document_url} target="_blank" rel="noopener noreferrer">ID Document</a></li>}
                {selected.proof_of_address_url && <li><a href={selected.proof_of_address_url} target="_blank" rel="noopener noreferrer">Proof of Address</a></li>}
                {selected.business_registration_url && <li><a href={selected.business_registration_url} target="_blank" rel="noopener noreferrer">Business Registration</a></li>}
              </ul>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="fl">Notes (optional)</label>
              <textarea className="fi" rows="3" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add review notes..." />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-g" onClick={() => { onReview(selected.id, 'approved', notes); setSelected(null); }}><CheckCircle size={14} /> Approve</button>
              <button className="btn btn-r" onClick={() => { onReview(selected.id, 'rejected', notes); setSelected(null); }}><X size={14} /> Reject</button>
              <button className="btn btn-gh" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Donor Management Component ----------
function DonorManagement({ topDonors, subscriptions, analytics, onSubscriptionAction, showToast }) {
  const [activeDonorTab, setActiveDonorTab] = useState('top');
  
  return (
    <div>
      <div className="settings-tabs">
        <button className={`role-tab ${activeDonorTab === 'top' ? 'active' : ''}`} onClick={() => setActiveDonorTab('top')}>Top Donors</button>
        <button className={`role-tab ${activeDonorTab === 'recurring' ? 'active' : ''}`} onClick={() => setActiveDonorTab('recurring')}>Recurring Donations</button>
        <button className={`role-tab ${activeDonorTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveDonorTab('analytics')}>Analytics</button>
      </div>
      
      {activeDonorTab === 'top' && (
        <div>
          <div className="stats-grid" style={{ marginBottom: 16, gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div className="sc"><div className="sv">{topDonors.length}</div><div className="sl">Top Donors</div></div>
            <div className="sc"><div className="sv">${topDonors.reduce((s, d) => s + d.total_donated, 0).toLocaleString()}</div><div className="sl">Total from Top</div></div>
            <div className="sc"><div className="sv">{topDonors[0]?.name || '-'}</div><div className="sl">Top Donor</div></div>
          </div>
          <div className="ut">
            <table className="ut">
              <thead><tr><th>Donor</th><th>Total Donated</th><th>Donations</th><th>Last Donation</th></tr></thead>
              <tbody>
                {topDonors.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong><br/><small>{d.email}</small></td>
                    <td><strong>${d.total_donated.toLocaleString()}</strong></td>
                    <td>{d.donation_count}</td>
                    <td>{d.last_donation_date ? new Date(d.last_donation_date).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeDonorTab === 'recurring' && (
        <div>
          <div className="stats-grid" style={{ marginBottom: 16, gridTemplateColumns: 'repeat(2,1fr)' }}>
            <div className="sc"><div className="sv">{subscriptions.length}</div><div className="sl">Active Subscriptions</div></div>
            <div className="sc"><div className="sv">${subscriptions.reduce((s, sub) => s + sub.amount, 0).toLocaleString()}/mo</div><div className="sl">Monthly Recurring</div></div>
          </div>
          <div className="ut">
            <table className="ut">
              <thead><tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Frequency</th><th>Status</th><th>Actions</th></td></thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.donor_name}</td>
                    <td>{sub.campaign_title || 'General'}</td>
                    <td><strong>${sub.amount.toFixed(2)}</strong></td>
                    <td>{sub.frequency}</td>
                    <td><span className={`badge ${sub.status === 'active' ? 'ba' : sub.status === 'paused' ? 'bp' : 'bx'}`}>{sub.status}</span></td>
                    <td>
                      {sub.status === 'active' && <button className="db dbp" onClick={() => onSubscriptionAction(sub.id, 'paused')}><Pause size={12} /> Pause</button>}
                      {sub.status === 'paused' && <button className="db dba" onClick={() => onSubscriptionAction(sub.id, 'active')}><Play size={12} /> Resume</button>}
                      <button className="db dbr" onClick={() => onSubscriptionAction(sub.id, 'cancelled')}><X size={12} /> Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeDonorTab === 'analytics' && (
        <div>
          <div className="stats-grid">
            <div className="sc"><div className="sv">{analytics.total_donors || 0}</div><div className="sl">Total Donors</div></div>
            <div className="sc"><div className="sv">{analytics.new_donors_month || 0}</div><div className="sl">New Donors (Month)</div></div>
            <div className="sc"><div className="sv">{analytics.active_donors_week || 0}</div><div className="sl">Active (Week)</div></div>
            <div className="sc"><div className="sv">{analytics.retention?.returning_donors || 0}</div><div className="sl">Returning Donors</div></div>
          </div>
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-h"><div className="card-t">Donor Retention</div></div>
            <div className="card-b">
              <div>Total Donors: <strong>{analytics.retention?.total_donors || 0}</strong></div>
              <div>Returning Donors: <strong>{analytics.retention?.returning_donors || 0}</strong></div>
              <div>Active This Month: <strong>{analytics.retention?.active_this_month || 0}</strong></div>
              <div style={{ marginTop: 12, height: 8, background: 'var(--bg)', borderRadius: 4 }}>
                <div style={{ width: `${((analytics.retention?.returning_donors || 0) / (analytics.retention?.total_donors || 1)) * 100}%`, height: '100%', background: 'var(--green)', borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Audit Logs Component ----------
function AuditLogs({ logs, showToast }) {
  const [filter, setFilter] = useState('');
  if (logs.length === 0) return <div style={{ color: 'var(--txt-3)', padding: '8px 0' }}>No audit logs yet.</div>;
  
  const filtered = filter ? logs.filter(l => l.action === filter) : logs;
  const actions = [...new Set(logs.map(l => l.action))];
  
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className={`db ${!filter ? 'dba' : 'dbv'}`} onClick={() => setFilter('')}>All</button>
        {actions.map(a => (
          <button key={a} className={`db ${filter === a ? 'dba' : 'dbv'}`} onClick={() => setFilter(a)}>{a.replace(/_/g, ' ')}</button>
        ))}
      </div>
      <div className="ut">
        <table className="ut">
          <thead><tr><th>Admin</th><th>Action</th><th>Entity</th><th>Details</th><th>Time</th></td></thead>
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

// ---------- Email Template Editor ----------
const EMAIL_TEMPLATES = [
  { id: 'verification', name: 'Email Verification', desc: 'Sent when users register', subjectKey: 'verification_subject', bodyKey: 'verification_body', defaultSubject: 'Your HopeBridge Verification Code', defaultBody: 'Hi {{name}},\n\nThank you for registering. Your verification code is:\n\n{{code}}\n\nThis code expires in 15 minutes.' },
  { id: 'welcome', name: 'Welcome Email', desc: 'Sent after successful registration', subjectKey: 'welcome_subject', bodyKey: 'welcome_body', defaultSubject: 'Welcome to HopeBridge, {{name}}!', defaultBody: 'Hi {{name}},\n\nWelcome to HopeBridge! You joined as a {{role}}.\n\nStart making an impact today.' },
  { id: 'donation', name: 'Donation Confirmation', desc: 'Sent to donors after donating', subjectKey: 'donation_subject', bodyKey: 'donation_body', defaultSubject: 'Thank you for your donation of ${{amount}}!', defaultBody: 'Dear {{donor_name}},\n\nThank you for donating ${{amount}} to {{campaign_title}}.\n\nYour support makes a real difference.' },
  { id: 'campaign_approved', name: 'Campaign Approved', desc: 'Sent to creators when campaign is approved', subjectKey: 'campaign_approved_subject', bodyKey: 'campaign_approved_body', defaultSubject: 'Your campaign "{{title}}" has been approved!', defaultBody: 'Dear {{creator_name}},\n\nGreat news! Your campaign "{{title}}" is now live.\n\nShare it with your network to start raising funds.' },
  { id: 'campaign_rejected', name: 'Campaign Rejected', desc: 'Sent to creators when campaign is rejected', subjectKey: 'campaign_rejected_subject', bodyKey: 'campaign_rejected_body', defaultSubject: 'Update on your campaign "{{title}}"', defaultBody: 'Dear {{creator_name}},\n\nUnfortunately your campaign "{{title}}" did not meet our guidelines.\n\nPlease review our policy and feel free to resubmit.' },
  { id: 'withdrawal', name: 'Withdrawal Status', desc: 'Sent when withdrawal is approved/rejected', subjectKey: 'withdrawal_subject', bodyKey: 'withdrawal_body', defaultSubject: 'Your withdrawal of ${{amount}} has been {{status}}', defaultBody: 'Dear {{name}},\n\nYour withdrawal request of ${{amount}} has been {{status}}.\n\n{{admin_note}}' },
];

function EmailTemplateEditor({ showToast }) {
  const [selected, setSelected] = useState(EMAIL_TEMPLATES[0]);
  const [templates, setTemplates] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    safeGet(() => adminApi.getSettings(), { settings: null }).then(res => {
      if (res?.settings?.email_templates) {
        setTemplates(res.settings.email_templates);
      }
    });
  }, []);

  const getVal = (key, def) => templates[key] !== undefined ? templates[key] : def;
  const update = (key, val) => setTemplates(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.saveSettings({ email_templates: templates });
      showToast('Email template saved');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  const previewBody = getVal(selected.bodyKey, selected.defaultBody)
    .replace('{{name}}', 'John Doe')
    .replace('{{code}}', '847291')
    .replace('{{amount}}', '50.00')
    .replace('{{donor_name}}', 'John Doe')
    .replace('{{campaign_title}}', 'Help Build a School')
    .replace('{{title}}', 'Help Build a School')
    .replace('{{creator_name}}', 'Jane Creator')
    .replace('{{role}}', 'donor')
    .replace('{{status}}', 'approved')
    .replace('{{admin_note}}', 'Funds will be sent within 2 business days.');

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
          <div><div style={{ fontSize: 16, fontWeight: 700 }}>{selected.name}</div><div style={{ fontSize: 12, color: 'var(--txt-3)' }}>Variables: {'{{'} name {'}}'}, {'{{'} code {'}}'}, {'{{'} amount {'}}'}</div></div>
          <button className="btn btn-gh" style={{ fontSize: 12 }} onClick={() => setShowPreview(!showPreview)}>{showPreview ? 'Hide Preview' : 'Show Preview'}</button>
        </div>
        <div className="tpl-editor">
          <label className="fl">Subject Line</label>
          <input type="text" className="fi" value={getVal(selected.subjectKey, selected.defaultSubject)} onChange={e => update(selected.subjectKey, e.target.value)} placeholder={selected.defaultSubject} />
          <label className="fl">Email Body</label>
          <textarea className="fi" rows={10} value={getVal(selected.bodyKey, selected.defaultBody)} onChange={e => update(selected.bodyKey, e.target.value)} placeholder={selected.defaultBody} style={{ fontFamily: 'monospace', fontSize: 13 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-g" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Template'}</button>
            <button className="btn btn-gh" onClick={() => { update(selected.subjectKey, selected.defaultSubject); update(selected.bodyKey, selected.defaultBody); showToast('Reset to default'); }}>Reset to Default</button>
          </div>
        </div>
        {showPreview && (
          <div className="tpl-preview" style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Preview</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Subject: {getVal(selected.subjectKey, selected.defaultSubject)}</div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 12 }} />
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{previewBody}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- MassMailForm ----------
function MassMailForm({ onSend, showToast }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState('all_donors');
  const [campaignId, setCampaignId] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    safeGet(() => adminApi.getCampaigns({ status: 'approved' }), { campaigns: [] })
      .then(res => setCampaigns(res.campaigns || []));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !message) { showToast('Please fill subject and message', true); return; }
    setSending(true);
    try {
      await adminApi.sendMassMail({ subject, message, recipient_type: recipientType, campaign_id: recipientType === 'campaign_donors' ? campaignId : null });
      showToast('Emails sent successfully!');
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
        <option value="all_users">All registered users</option>
        <option value="campaign_donors">Donors of a specific campaign</option>
      </select>
      {recipientType === 'campaign_donors' && (<><label className="fl">Campaign</label><select className="fi" value={campaignId} onChange={e => setCampaignId(e.target.value)} required><option value="">-- Select campaign --</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></>)}
      <label className="fl">Subject</label><input type="text" className="fi" value={subject} onChange={e => setSubject(e.target.value)} required />
      <label className="fl">Message</label><textarea className="fi" rows="6" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Write your email content here..." />
      <button className="btn btn-g" disabled={sending}>{sending ? 'Sending...' : <><Send size={14} /> Send Emails</>}</button>
    </form>
  );
}

// ---------- ContentEditor ----------
function ContentEditor({ content, onSave, showToast }) {
  const [local, setLocal] = useState(content);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setLocal(content); }, [content]);
  const upd = (f, v) => setLocal(p => ({ ...p, [f]: v }));
  const updStat = (s, v) => setLocal(p => ({ ...p, impact_stats: { ...p.impact_stats, [s]: v } }));
  const updSocial = (pl, v) => setLocal(p => ({ ...p, social_links: { ...p.social_links, [pl]: v } }));
  const handleSave = async () => {
    setSaving(true);
    try { await onSave(local); showToast('Content updated'); } catch (err) { showToast(err.message, true); }
    finally { setSaving(false); }
  };
  return (
    <div>
      <h5 style={{ marginBottom: 12 }}>Hero Section</h5>
      <label className="fl">Badge Text</label><input type="text" className="fi" value={local.hero_badge || ''} onChange={e => upd('hero_badge', e.target.value)} />
      <label className="fl">Hero Title</label><input type="text" className="fi" value={local.hero_title || ''} onChange={e => upd('hero_title', e.target.value)} />
      <label className="fl">Hero Subtitle</label><textarea className="fi" rows="2" value={local.hero_subtitle || ''} onChange={e => upd('hero_subtitle', e.target.value)} />
      <h5 style={{ margin: '20px 0 12px' }}>Impact Section</h5>
      <label className="fl">Section Title</label><input type="text" className="fi" value={local.impact_title || ''} onChange={e => upd('impact_title', e.target.value)} />
      <label className="fl">Section Subtitle</label><input type="text" className="fi" value={local.impact_subtitle || ''} onChange={e => upd('impact_subtitle', e.target.value)} />
      <label className="fl">Stat – Total Raised</label><input type="text" className="fi" value={local.impact_stats?.raised || '$0'} onChange={e => updStat('raised', e.target.value)} />
      <label className="fl">Stat – Campaigns</label><input type="text" className="fi" value={local.impact_stats?.campaigns || '0'} onChange={e => updStat('campaigns', e.target.value)} />
      <label className="fl">Stat – Donors</label><input type="text" className="fi" value={local.impact_stats?.donors || '0'} onChange={e => updStat('donors', e.target.value)} />
      <h5 style={{ margin: '20px 0 12px' }}>Social Links</h5>
      {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(p => (<div key={p}><label className="fl">{p.charAt(0).toUpperCase() + p.slice(1)}</label><input type="text" className="fi" value={local.social_links?.[p] || ''} onChange={e => updSocial(p, e.target.value)} placeholder={`https://${p}.com/...`} /></div>))}
      <button className="btn btn-g" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Content'}</button>
    </div>
  );
}

// ---------- DepositRequestsManager ----------
function DepositRequestsManager({ requests, onApprove, onReject, onProvideInstructions, showToast }) {
  const [instructionsText, setInstructionsText] = useState({});
  if (requests.length === 0) return <div style={{ color: 'var(--txt-3)', padding: '8px 0' }}>No deposit requests.</div>;
  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ marginBottom: 4 }}><strong>{req.userName || req.name}</strong> ({req.email})</div>
          <div style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 8 }}>Amount: <strong>${toNumber(req.amount).toFixed(2)}</strong> · <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span></div>
          {req.status === 'pending' && (<div><textarea placeholder="Payment instructions..." rows="2" className="fi" value={instructionsText[req.id] || ''} onChange={e => setInstructionsText(p => ({ ...p, [req.id]: e.target.value }))} /><button className="db dba" onClick={() => { if (!instructionsText[req.id]?.trim()) { showToast('Enter instructions', true); return; } onProvideInstructions(req.id, instructionsText[req.id]); setInstructionsText(p => ({ ...p, [req.id]: '' })); }}>Send Instructions</button></div>)}
          {req.status === 'instructions_sent' && <div style={{ color: 'var(--blue)', fontSize: 13 }}><Clock size={12} /> Waiting for payment proof...</div>}
          {req.status === 'awaiting_proof' && req.proof_image_url && (<div><a href={req.proof_image_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', fontSize: 13 }}><Image size={12} /> View Proof</a><div style={{ marginTop: 8, display: 'flex', gap: 8 }}><button className="db dba" onClick={() => onApprove(req.id, req.amount)}><CheckCircle size={12} /> Approve & Credit</button><button className="db dbr" onClick={() => onReject(req.id)}><X size={12} /> Reject</button></div></div>)}
          {req.status === 'approved' && <span style={{ color: 'var(--green)' }}><CheckCircle size={12} /> Credited</span>}
          {req.status === 'rejected' && <span style={{ color: 'var(--red)' }}><X size={12} /> Rejected</span>}
        </div>
      ))}
    </div>
  );
}

// ---------- WithdrawalRequestsManager ----------
function WithdrawalRequestsManager({ requests, onApprove, onReject }) {
  if (requests.length === 0) return <div style={{ color: 'var(--txt-3)', padding: '8px 0' }}>No withdrawal requests.</div>;
  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ marginBottom: 4 }}><strong>{req.name}</strong> ({req.email})</div>
          <div style={{ fontSize: 13, color: 'var(--txt-2)', marginBottom: 4 }}>Amount: <strong>${toNumber(req.amount).toFixed(2)}</strong> · {req.payment_method}</div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', marginBottom: 8 }}>{req.payment_details}</div>
          <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span>
          {req.status === 'pending' && (<div style={{ marginTop: 10, display: 'flex', gap: 8 }}><button className="db dba" onClick={() => onApprove(req.id)}><CheckCircle size={12} /> Approve & Process</button><button className="db dbr" onClick={() => onReject(req.id)}><X size={12} /> Reject</button></div>)}
        </div>
      ))}
    </div>
  );
}

// ---------- CompletionRequestsManager ----------
function CompletionRequestsManager({ requests, onRelease, onRefund }) {
  const [processingId, setProcessingId] = useState(null);
  if (requests.length === 0) return <div style={{ color: 'var(--txt-3)', padding: '8px 0' }}>No pending completion requests.</div>;
  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{req.title}</div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', marginBottom: 10 }}><Calendar size={10} /> Requested {new Date(req.completion_requested_at).toLocaleString()}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="db dba" onClick={async () => { if (!window.confirm('Release escrow? Cannot be undone.')) return; setProcessingId(req.id); try { await onRelease(req.id); } finally { setProcessingId(null); } }} disabled={processingId === req.id}>{processingId === req.id ? 'Processing...' : <><CheckCircle size={12} /> Release Escrow</>}</button>
            <button className="db dbr" onClick={async () => { if (!window.confirm('Refund all donors?')) return; setProcessingId(req.id); try { await onRefund(req.id); } finally { setProcessingId(null); } }} disabled={processingId === req.id}>{processingId === req.id ? 'Processing...' : <><RefreshCw size={12} /> Refund Donors</>}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Main AdminDashboard ----------
export default function AdminDashboard() {
  injectStyles();

  const { currentUser, logout, showToast, loading: sessionLoading } = useApp();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dataLoading, setDataLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('hb_darkmode') === 'true');
  const [settingsTab, setSettingsTab] = useState('security');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState({ open: false, userId: null, userName: '' });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'donor', is_verified: true });
  const [addingUser, setAddingUser] = useState(false);
  
  // Real-time donation notification
  const [lastDonationCheck, setLastDonationCheck] = useState(Date.now());
  const [newDonationAlert, setNewDonationAlert] = useState(null);

  const [themeSettings, setThemeSettings] = useState({ '--primary': '#e8531e', '--primary-dark': '#c4400f', '--secondary': '#27a96c', '--dark': '#1a1a2e' });
  const [integrationKeys, setIntegrationKeys] = useState({ smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '', recaptcha_site_key: '', recaptcha_secret_key: '', maintenance_message: '' });
  const [socialLinks, setSocialLinks] = useState({ facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' });

  // Toggles
  const [maintenanceMode, setMaintenanceMode] = useState({ enabled: false, message: '' });
  const [verificationEnabled, setVerificationEnabled] = useState(true);
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);
  const [togglingVerification, setTogglingVerification] = useState(false);
  const [togglingRecaptcha, setTogglingRecaptcha] = useState(false);

  // New feature data states
  const [payouts, setPayouts] = useState([]);
  const [feeSettings, setFeeSettings] = useState({ percentage: 0, fixed_amount: 0, min_fee: 0, max_fee: null, withdrawal_fee: 0, minimum_withdrawal: 10 });
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [creatorVerifications, setCreatorVerifications] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [recurringSubscriptions, setRecurringSubscriptions] = useState([]);
  const [donorAnalytics, setDonorAnalytics] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);

  // Data
  const [stats, setStats] = useState({ total_raised: 0, total_campaigns: 0, pending_campaigns: 0, total_users: 0 });
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [completionRequests, setCompletionRequests] = useState([]);
  const [content, setContent] = useState({ 
    hero_title: 'Together We Can', 
    hero_subtitle: 'Support the causes you care about.', 
    hero_badge: 'HopeBridge', 
    impact_title: 'Our Impact', 
    impact_subtitle: 'Every donation counts', 
    impact_stats: { raised: '$0', campaigns: '0', donors: '0' }, 
    banner_image: '', 
    notification_message: '', 
    social_links: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' } 
  });

  // Apply dark mode
  useEffect(() => { 
    document.body.classList.toggle('dark-mode', darkMode); 
    localStorage.setItem('hb_darkmode', darkMode); 
  }, [darkMode]);

  // Auth check
  useEffect(() => {
    if (sessionLoading) return;
    if (!currentUser) { 
      showToast('Please log in first', true); 
      navigate('/'); 
      return; 
    }
    if (currentUser.role !== 'admin') { 
      showToast('Access denied', true); 
      navigate('/'); 
      return; 
    }
    setAuthChecked(true);
  }, [sessionLoading, currentUser]);

  // Real-time donation notifications (polling every 30 seconds)
  useEffect(() => {
    if (!authChecked) return;
    
    const interval = setInterval(async () => {
      try {
        const latestDonations = await adminApi.getDonations();
        const latest = latestDonations.donations?.[0];
        if (latest && new Date(latest.created_at).getTime() > lastDonationCheck) {
          setNewDonationAlert({
            id: latest.id,
            donor: latest.donor_name || 'Anonymous',
            amount: latest.amount,
            campaign: latest.campaign_title,
            timestamp: latest.created_at
          });
          showToast(`💝 New donation: $${latest.amount} from ${latest.donor_name || 'Anonymous'} to "${latest.campaign_title}"`);
          setLastDonationCheck(Date.now());
        }
      } catch (err) {
        console.error('Failed to check donations:', err);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [authChecked, lastDonationCheck]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (newDonationAlert) {
      const timer = setTimeout(() => setNewDonationAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [newDonationAlert]);

  // Fetch functions
  const fetchNewFeatures = async () => {
    try {
      const [payoutRes, feeRes, notifHistory, verifications, topDonorRes, subsRes, analyticsRes, auditRes] = await Promise.all([
        safeGet(() => adminApi.getPayouts?.(), { payouts: [] }),
        safeGet(() => adminApi.getFeeSettings?.(), { percentage: 0, fixed_amount: 0, min_fee: 0, max_fee: null, withdrawal_fee: 0, minimum_withdrawal: 10 }),
        safeGet(() => adminApi.getNotificationHistory?.(), { notifications: [] }),
        safeGet(() => adminApi.getCreatorVerifications?.(), { verifications: [] }),
        safeGet(() => adminApi.getTopDonors?.(), { donors: [] }),
        safeGet(() => adminApi.getRecurringDonations?.(), { subscriptions: [] }),
        safeGet(() => adminApi.getDonorAnalytics?.(), { total_donors: 0, new_donors_month: 0, active_donors_week: 0, retention: {} }),
        safeGet(() => adminApi.getAuditLogs?.(), { logs: [] }),
      ]);
      setPayouts(payoutRes.payouts || []);
      setFeeSettings(feeRes);
      setNotificationHistory(notifRes.notifications || []);
      setCreatorVerifications(verifications.verifications || []);
      setTopDonors(topDonorRes.donors || []);
      setRecurringSubscriptions(subsRes.subscriptions || []);
      setDonorAnalytics(analyticsRes);
      setAuditLogs(auditRes.logs || []);
    } catch (err) { console.error('Failed to fetch new features', err); }
  };

  const fetchToggles = async () => {
    try {
      const [verRes, sett, notifSettings] = await Promise.all([
        safeGet(() => adminApi.getVerificationSetting?.(), { enabled: true }),
        safeGet(() => adminApi.getSettings(), { settings: null }),
        safeGet(() => adminApi.getNotificationSettings?.(), { enabled: true }),
      ]);
      setVerificationEnabled(verRes.enabled !== false);
      setPushNotificationsEnabled(notifSettings.enabled !== false);
      if (sett?.settings?.keys) {
        const k = sett.settings.keys;
        setMaintenanceMode({ enabled: k.maintenance_mode === 'true', message: k.maintenance_message || '' });
        setRecaptchaEnabled(k.recaptcha_enabled === 'true');
        setIntegrationKeys(prev => ({ ...prev, ...k }));
      }
    } catch (err) { console.error('Failed to fetch toggles', err); }
  };

  const fetchAll = async () => {
    setDataLoading(true);
    try {
      const [s, c, u, don, dep, withdraw, compl, cont] = await Promise.all([
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
      ['total_raised','total_campaigns','pending_campaigns','total_users'].forEach(k => { if (ps[k] !== undefined) ps[k] = toNumber(ps[k]); });
      setStats(ps);
      setCampaigns((c.campaigns || []).map(x => ({ ...x, goal: toNumber(x.goal), raised: toNumber(x.raised) })));
      setUsers((u.users || []).map(x => ({ ...x, wallet_balance: toNumber(x.wallet_balance) })));
      setDonations((don.donations || []).map(x => ({ ...x, amount: toNumber(x.amount) })));
      setDepositRequests((dep.requests || []).map(x => ({ ...x, amount: toNumber(x.amount) })));
      setWithdrawalRequests((withdraw.withdrawals || []).map(x => ({ ...x, amount: toNumber(x.amount) })));
      setCompletionRequests(compl.campaigns || []);
      if (cont?.content) setContent(prev => ({ ...prev, ...cont.content, social_links: { ...prev.social_links, ...(cont.content.social_links || {}) } }));
    } catch (err) { console.error(err); showToast('Failed to load data', true); }
    finally { setDataLoading(false); }
  };

  useEffect(() => { if (authChecked) { fetchAll(); fetchToggles(); fetchNewFeatures(); } }, [authChecked]);

  // Toggle handlers
  const handleToggleMaintenance = async (val) => {
    setTogglingMaintenance(true);
    try { await adminApi.saveSettings({ keys: { maintenance_mode: val ? 'true' : 'false' } }); setMaintenanceMode(prev => ({ ...prev, enabled: val })); showToast(`Maintenance mode ${val ? 'enabled' : 'disabled'}`); } catch (err) { showToast(err.message, true); }
    finally { setTogglingMaintenance(false); }
  };

  const handleToggleVerification = async (val) => {
    setTogglingVerification(true);
    try { await adminApi.updateVerificationSetting?.({ enabled: val }); setVerificationEnabled(val); showToast(`Email verification ${val ? 'enabled' : 'disabled'}`); } catch (err) { showToast(err.message, true); }
    finally { setTogglingVerification(false); }
  };

  const handleToggleRecaptcha = async (val) => {
    setTogglingRecaptcha(true);
    try { await adminApi.saveSettings({ keys: { recaptcha_enabled: val ? 'true' : 'false' } }); setRecaptchaEnabled(val); showToast(`reCAPTCHA ${val ? 'enabled' : 'disabled'}`); } catch (err) { showToast(err.message, true); }
    finally { setTogglingRecaptcha(false); }
  };

  // New feature handlers
  const handleSaveFeeSettings = async (data) => {
    try { await adminApi.updateFeeSettings?.(data); setFeeSettings(data); showToast('Fee settings saved'); } catch (err) { showToast(err.message, true); }
  };

  const handleMarkPayoutPaid = async (id) => {
    try { await adminApi.markPayoutAsPaid?.(id, {}); showToast('Payout marked as paid'); fetchNewFeatures(); } catch (err) { showToast(err.message, true); }
  };

  const handleSaveNotificationSettings = async (data) => {
    try { await adminApi.updateNotificationSettings?.(data); setPushNotificationsEnabled(data.enabled); showToast('Notification settings saved'); } catch (err) { showToast(err.message, true); }
  };

  const handleSendPushNotification = async (data) => {
    try { await adminApi.sendPushNotification?.(data); showToast('Notification sent'); fetchNewFeatures(); } catch (err) { showToast(err.message, true); }
  };

  const handleReviewCreatorVerification = async (id, status, notes) => {
    try { await adminApi.reviewCreatorVerification?.(id, { status, notes }); showToast(`Verification ${status}`); fetchNewFeatures(); } catch (err) { showToast(err.message, true); }
  };

  const handleSubscriptionAction = async (id, status) => {
    try { await adminApi.updateSubscriptionStatus?.(id, status); showToast(`Subscription ${status}`); fetchNewFeatures(); } catch (err) { showToast(err.message, true); }
  };

  // User Management Handlers
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      showToast('Please fill all required fields', true);
      return;
    }
    setAddingUser(true);
    try {
      await adminApi.addUser(newUser);
      showToast(`User ${newUser.name} added successfully`);
      setShowAddUserModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'donor', is_verified: true });
      fetchAll();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setAddingUser(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await adminApi.verifyUser(userId);
      showToast('User verified successfully');
      fetchAll();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleUnverifyUser = async (userId) => {
    try {
      await adminApi.unverifyUser(userId);
      showToast('User unverified');
      fetchAll();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Password change handler
  const handleChangePassword = async (data) => {
    try {
      await adminApi.changePassword(data);
    } catch (err) {
      throw err;
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    try {
      await adminApi.deleteUser(userId);
      showToast('User deleted successfully');
      fetchAll();
    } catch (err) {
      throw err;
    }
  };

  // Campaign handlers
  const handleApproveCampaign = async (id) => { 
    try { await adminApi.updateCampaign(id, { status: 'approved' }); showToast('Campaign approved'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleRejectCampaign = async (id) => { 
    try { await adminApi.updateCampaign(id, { status: 'rejected' }); showToast('Campaign rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleDeleteCampaign = async (id) => { 
    if (!window.confirm('Delete this campaign permanently? This action cannot be undone.')) return; 
    try { await campaignApi.delete(id); showToast('Campaign deleted'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleToggleUser = async (id) => { 
    try { await adminApi.toggleUser(id); showToast('User status updated'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleApproveDeposit = async (id, amount) => { 
    try { await adminApi.updateDepositRequest?.(id, { status: 'approved' }); showToast(`Deposit approved`); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleRejectDeposit = async (id) => { 
    try { await adminApi.updateDepositRequest?.(id, { status: 'rejected' }); showToast('Deposit rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleProvideInstructions = async (id, instructions) => { 
    try { await adminApi.updateDepositRequest?.(id, { admin_instructions: instructions, status: 'instructions_sent' }); showToast('Instructions sent'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleApproveWithdrawal = async (id) => { 
    try { await adminApi.approveWithdrawal(id); showToast('Withdrawal approved'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleRejectWithdrawal = async (id) => { 
    const reason = prompt('Reason for rejection:'); 
    if (!reason) return; 
    try { await adminApi.rejectWithdrawal(id, reason); showToast('Withdrawal rejected'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleReleaseEscrow = async (id) => { 
    try { await adminApi.releaseCampaignEscrow(id); showToast('Escrow released'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleRefundEscrow = async (id) => { 
    try { await adminApi.refundCampaignEscrow(id); showToast('Escrow refunded'); fetchAll(); } catch (err) { showToast(err.message, true); } 
  };

  const handleSaveContent = async (c) => { 
    try { await adminApi.saveContent(c); setContent(c); showToast('Content updated'); } catch (err) { showToast(err.message, true); } 
  };

  const handleSaveSettings = async () => { 
    try { await adminApi.saveSettings({ theme: themeSettings, keys: integrationKeys }); showToast('Settings saved'); } catch (err) { showToast(err.message, true); } 
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (sessionLoading || !authChecked) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>Loading admin panel...</div>;

  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'approved').length;
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending' || c.status === 'review').length;
  const donorsCount = users.filter(u => u.role === 'donor').length;
  const creatorsCount = users.filter(u => u.role === 'creator').length;
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending').length;
  const pendingCompletions = completionRequests.length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Target size={18} />, badge: pendingCampaigns },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
  ];

  return (
    <div className="shell">
      {/* Sidebar */}
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
          {navItems.map(({ id, label, icon, badge }) => (
            <button key={id} className={`nl ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              {icon}
              {label}
              {badge > 0 && <span className="nb">{badge}</span>}
            </button>
          ))}
          
          <div className="nav-sec">Finance</div>
          {[
            { id: 'donations', label: 'Donations', icon: <DollarSign size={18} /> },
            { id: 'deposits', label: 'Deposits', icon: <CreditCard size={18} /> },
            { id: 'withdrawals', label: 'Withdrawals', icon: <Banknote size={18} />, badge: pendingWithdrawals, badgeClass: 'am' },
            { id: 'payouts', label: 'Payouts', icon: <Receipt size={18} /> }
          ].map(({ id, label, icon, badge, badgeClass }) => (
            <button key={id} className={`nl ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              {icon}
              {label}
              {badge > 0 && <span className={`nb ${badgeClass || ''}`}>{badge}</span>}
            </button>
          ))}
          
          <div className="nav-sec">Operations</div>
          {[
            { id: 'completions', label: 'Completions', icon: <CheckCircle size={18} /> },
            { id: 'creator-verifications', label: 'Verifications', icon: <Shield size={18} /> },
            { id: 'donor-management', label: 'Donors', icon: <Users size={18} /> },
            { id: 'maintenance', label: 'Maintenance', icon: <Settings size={18} /> }
          ].map(({ id, label, icon }) => (
            <button key={id} className={`nl ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              {icon}
              {label}
            </button>
          ))}
          
          <div className="nav-sec">Admin</div>
          {[
            { id: 'email_templates', label: 'Email Templates', icon: <MailIcon size={18} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
            { id: 'massmail', label: 'Mass Mail', icon: <Send size={18} /> },
            { id: 'content', label: 'Content', icon: <FileText size={18} /> },
            { id: 'fees', label: 'Fee Settings', icon: <DollarSign size={18} /> },
            { id: 'audit-logs', label: 'Audit Logs', icon: <History size={18} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
          ].map(({ id, label, icon }) => (
            <button key={id} className={`nl ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              {icon}
              {label}
            </button>
          ))}
          
          <button className="nl" onClick={() => setDarkMode(!darkMode)} style={{ marginTop: 8 }}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
        <div className="sb-footer">
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="tb-title">
            {activeTab === 'email_templates' ? 'Email Templates' : 
             activeTab === 'creator-verifications' ? 'Creator Verifications' : 
             activeTab === 'donor-management' ? 'Donor Management' : 
             activeTab === 'audit-logs' ? 'Audit Logs' : 
             activeTab === 'fees' ? 'Fee Settings' : 
             activeTab === 'notifications' ? 'Notifications' : 
             activeTab === 'payouts' ? 'Payouts' : 
             activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </div>
          <div className="tb-actions">
            <div className="tb-btn" onClick={() => showToast('Notifications')} style={{ position: 'relative' }}>
              <Bell size={18} />
              {newDonationAlert && <div className="ndot" style={{ background: '#27a96c' }} />}
            </div>
            <div className="tb-btn" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>SA</div>
            </div>
          </div>
        </div>
        
        <div className="mob-top">
          <div className="mob-logo">HopeBridge</div>
        </div>

        <div className="page">
          {dataLoading && <div style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>Loading data...</div>}

          {/* Overview Tab */}
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
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: maintenanceMode.enabled ? 'rgba(239,159,39,0.4)' : 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)' }}>
                    {maintenanceMode.enabled ? <Settings size={12} /> : <CheckCircle size={12} />}
                    {maintenanceMode.enabled ? ' Maintenance' : ' Live'}
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

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="sc"><div className="si si-g"><Users size={18} /></div><div className="sv">{users.length}</div><div className="sl">Total Users</div></div>
              <div className="sc"><div className="si si-b"><Target size={18} /></div><div className="sv">{activeCampaigns}</div><div className="sl">Active Campaigns</div></div>
              <div className="sc"><div className="si si-a"><DollarSign size={18} /></div><div className="sv">${(totalRaised / 1000).toFixed(0)}k</div><div className="sl">Total Raised</div></div>
              <div className="sc"><div className="si si-r"><Clock size={18} /></div><div className="sv">{pendingCompletions}</div><div className="sl">Pending Completions</div></div>
            </div>

            {/* Quick Toggles */}
            <div className="sh" style={{ marginBottom: 12 }}><div className="sht"><Settings size={18} /> Quick Toggles</div></div>
            <div className="qt-grid">
              <div className="qt-card">
                <div>
                  <div className="qt-label">Maintenance Mode</div>
                  <div className="qt-sub">
                    <span className={`status-pill ${maintenanceMode.enabled ? 'on' : 'off'}`}>
                      <span className="status-dot" />
                      {maintenanceMode.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="qt-icon" style={{ background: maintenanceMode.enabled ? 'var(--amber-l)' : 'var(--surface-2)' }}>
                    <Settings size={18} style={{ stroke: maintenanceMode.enabled ? '#854F0B' : 'var(--txt-3)' }} />
                  </div>
                  <Toggle checked={maintenanceMode.enabled} onChange={handleToggleMaintenance} danger disabled={togglingMaintenance} />
                </div>
              </div>

              <div className="qt-card">
                <div>
                  <div className="qt-label">Email Verification</div>
                  <div className="qt-sub">
                    <span className={`status-pill ${verificationEnabled ? 'on' : 'off'}`}>
                      <span className="status-dot" />
                      {verificationEnabled ? 'Required' : 'Skipped'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="qt-icon" style={{ background: verificationEnabled ? 'var(--green-l)' : 'var(--surface-2)' }}>
                    <MailIcon size={18} style={{ stroke: verificationEnabled ? 'var(--green-d)' : 'var(--txt-3)' }} />
                  </div>
                  <Toggle checked={verificationEnabled} onChange={handleToggleVerification} disabled={togglingVerification} />
                </div>
              </div>

              <div className="qt-card">
                <div>
                  <div className="qt-label">reCAPTCHA</div>
                  <div className="qt-sub">
                    <span className={`status-pill ${recaptchaEnabled ? 'on' : 'off'}`}>
                      <span className="status-dot" />
                      {recaptchaEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="qt-icon" style={{ background: recaptchaEnabled ? 'var(--blue-l)' : 'var(--surface-2)' }}>
                    <Shield size={18} style={{ stroke: recaptchaEnabled ? '#185FA5' : 'var(--txt-3)' }} />
                  </div>
                  <Toggle checked={recaptchaEnabled} onChange={handleToggleRecaptcha} disabled={togglingRecaptcha} />
                </div>
              </div>

              <div className="qt-card">
                <div>
                  <div className="qt-label">Dark Mode</div>
                  <div className="qt-sub">
                    <span className={`status-pill ${darkMode ? 'on' : 'off'}`}>
                      <span className="status-dot" />
                      {darkMode ? 'Dark' : 'Light'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="qt-icon" style={{ background: 'var(--surface-2)' }}>
                    {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                  <Toggle checked={darkMode} onChange={setDarkMode} />
                </div>
              </div>
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
                { id: 'fees', label: 'Fees', icon: <DollarSign size={18} /> },
                { id: 'notifications', label: 'Push', icon: <Bell size={18} /> },
                { id: 'creator-verifications', label: 'Verify', icon: <Shield size={18} /> },
                { id: 'donor-management', label: 'Donors', icon: <Users size={18} /> },
                { id: 'audit-logs', label: 'Audit', icon: <History size={18} /> },
                { id: 'email_templates', label: 'Email', icon: <MailIcon size={18} /> },
                { id: 'massmail', label: 'Mass Mail', icon: <Send size={18} /> },
                { id: 'content', label: 'Content', icon: <FileText size={18} /> },
                { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
                { id: 'logout', label: 'Sign Out', icon: <LogOut size={18} />, danger: true },
              ].map(({ id, label, icon, danger }) => (
                <button key={id} className={`qb ${danger ? 'qx' : ''}`} onClick={() => id === 'logout' ? handleLogout() : setActiveTab(id)}>
                  <div className="qi">{icon}</div>
                  <span className="ql">{label}</span>
                </button>
              ))}
            </div>

            {/* Pending Approvals & Queues */}
            <div className="three-col">
              <div className="card">
                <div className="card-h"><div className="card-t"><Flag size={18} /> Pending Approvals</div><button className="card-a" onClick={() => setActiveTab('campaigns')}>View all <ArrowRight size={14} /></button></div>
                <div className="card-b">
                  {campaigns.filter(c => c.status === 'pending').slice(0, 3).map(c => (
                    <div key={c.id} className="cr">
                      <div className="ct" style={{ background: 'var(--green-l)' }}><Target size={18} /></div>
                      <div className="ci">
                        <div className="cn">{c.title}</div>
                        <div className="cm">Goal: ${c.goal.toLocaleString()} · {c.creator_name}</div>
                        <div className="pb"><div className="pf" style={{ width: `${(c.raised / c.goal) * 100}%` }} /></div>
                      </div>
                      <span className="badge bp">pending</span>
                      <button className="db dba" onClick={() => handleApproveCampaign(c.id)}><CheckCircle size={12} /> Approve</button>
                    </div>
                  ))}
                  {pendingCampaigns === 0 && <div style={{ color: 'var(--txt-3)', fontSize: 13 }}>No pending campaigns</div>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card">
                  <div className="card-h"><div className="card-t"><CheckCircle size={18} /> Completion Requests</div><button className="card-a" onClick={() => setActiveTab('completions')}>Manage <ArrowRight size={14} /></button></div>
                  <div className="card-b">
                    {completionRequests.slice(0, 2).map(req => (
                      <div key={req.id} className="di">
                        <div className="uav ava" style={{ width: 32, height: 32, fontSize: 11 }}>{req.title?.charAt(0) || 'C'}</div>
                        <div className="di-info"><div className="di-user">{req.title}</div><div className="di-amt"><Calendar size={10} /> {new Date(req.completion_requested_at).toLocaleDateString()}</div></div>
                        <button className="db dba" onClick={() => setActiveTab('completions')}>Review</button>
                      </div>
                    ))}
                    {pendingCompletions === 0 && <div style={{ color: 'var(--txt-3)', fontSize: 13 }}>No completion requests</div>}
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
                          <button className="db dba" onClick={() => handleApproveWithdrawal(req.id)}><CheckCircle size={12} /> Approve</button>
                          <button className="db dbr" onClick={() => handleRejectWithdrawal(req.id)}><X size={12} /> Reject</button>
                        </div>
                      </div>
                    ))}
                    {pendingWithdrawals === 0 && <div style={{ color: 'var(--txt-3)', fontSize: 13 }}>No pending withdrawals</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Tab */}
          <div className={`ps ${activeTab === 'campaigns' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Target size={18} /> Campaign Management</div></div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}>
              <table className="ut">
                <thead>
                  <tr><th style={{ paddingLeft: 20 }}>Campaign</th><th>Goal</th><th>Raised</th><th>Progress</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id}>
                      <td style={{ paddingLeft: 20 }}><div style={{ fontWeight: 600 }}>{c.title}</div><div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{c.creator_name}</div></td>
                      <td>${c.goal.toLocaleString()}</td>
                      <td>${c.raised.toLocaleString()}</td>
                      <td><div className="pb" style={{ width: 80 }}><div className="pf" style={{ width: `${(c.raised / c.goal) * 100}%` }} /></div>{Math.round((c.raised / c.goal) * 100)}%</td>
                      <td><span className={`badge ${c.status === 'approved' ? 'ba' : c.status === 'pending' ? 'bp' : 'br'}`}>{c.status}</span></td>
                      <td style={{ paddingRight: 20 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {c.status === 'pending' && <><button className="db dba" onClick={() => handleApproveCampaign(c.id)}><CheckCircle size={12} /> Approve</button><button className="db dbr" onClick={() => handleRejectCampaign(c.id)}><X size={12} /> Reject</button></>}
                          <button className="db" style={{ background: 'var(--red-l)', color: 'var(--red)' }} onClick={() => handleDeleteCampaign(c.id)}><Trash2 size={12} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
          </div>

          {/* Users Tab */}
          <div className={`ps ${activeTab === 'users' ? 'active' : ''}`}>
            <div className="sh">
              <div className="sht"><Users size={18} /> User Management</div>
              <button className="btn btn-g" onClick={() => setShowAddUserModal(true)}>
                <Plus size={16} /> Add User
              </button>
            </div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}>
              <table className="ut">
                <thead>
                  <tr><th style={{ paddingLeft: 20 }}>User</th><th>Role</th><th>Joined</th><th>Wallet</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ paddingLeft: 20 }}>
                        <div className="uc">
                          <div className="uav avg">{u.name?.charAt(0)}</div>
                          <div><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{u.email}</div></div>
                        </div>
                       </td>
                       <td><span className="badge br">{u.role}</span></td>
                      <td style={{ color: 'var(--txt-2)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>${u.wallet_balance?.toFixed(2) || '0.00'}</td>
                      <td><span className={`badge ${u.is_active ? 'ba' : 'bx'}`}>{u.is_active ? 'Active' : 'Suspended'}</span></td>
                      <td style={{ paddingRight: 20 }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button className="db dbv" onClick={() => handleToggleUser(u.id)}>
                            {u.is_active ? <Lock size={12} /> : <Unlock size={12} />}
                            {u.is_active ? 'Suspend' : 'Restore'}
                          </button>
                          {!u.is_verified && u.role !== 'admin' && (
                            <button className="db dba" onClick={() => handleVerifyUser(u.id)}>
                              <CheckCircle size={12} /> Verify
                            </button>
                          )}
                          {u.is_verified && u.role !== 'admin' && (
                            <button className="db dbp" onClick={() => handleUnverifyUser(u.id)}>
                              <X size={12} /> Unverify
                            </button>
                          )}
                          {u.role !== 'admin' && (
                            <button className="db dbr" onClick={() => setDeleteUserModal({ open: true, userId: u.id, userName: u.name })}>
                              <Trash2 size={12} /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
          </div>

          {/* Donations Tab */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><DollarSign size={18} /> All Donations</div></div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}>
              <table className="ut">
                <thead><tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Monthly</th><th>Date</th></tr></thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.id}>
                      <td>{d.donor_name}</td>
                      <td>{d.campaign_title}</td>
                      <td>${d.amount.toLocaleString()}</td>
                      <td>{d.is_monthly ? '✅' : '—'}</td>
                      <td>{new Date(d.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
          </div>

          {/* Deposits Tab */}
          <div className={`ps ${activeTab === 'deposits' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><CreditCard size={18} /> Deposit Requests</div></div>
            <div className="card"><div className="card-b">
              <DepositRequestsManager 
                requests={depositRequests} 
                onApprove={handleApproveDeposit} 
                onReject={handleRejectDeposit} 
                onProvideInstructions={handleProvideInstructions} 
                showToast={showToast} 
              />
            </div></div>
          </div>

          {/* Withdrawals Tab */}
          <div className={`ps ${activeTab === 'withdrawals' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Banknote size={18} /> Withdrawal Requests</div></div>
            <div className="card"><div className="card-b">
              <WithdrawalRequestsManager 
                requests={withdrawalRequests} 
                onApprove={handleApproveWithdrawal} 
                onReject={handleRejectWithdrawal} 
              />
            </div></div>
          </div>

          {/* Completions Tab */}
          <div className={`ps ${activeTab === 'completions' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><CheckCircle size={18} /> Campaign Completion Requests</div></div>
            <div className="card"><div className="card-b">
              <CompletionRequestsManager 
                requests={completionRequests} 
                onRelease={handleReleaseEscrow} 
                onRefund={handleRefundEscrow} 
              />
            </div></div>
          </div>

          {/* Payouts Tab */}
          <div className={`ps ${activeTab === 'payouts' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Receipt size={18} /> Payout Reconciliation</div></div>
            <div className="card"><div className="card-b">
              <PayoutsManager payouts={payouts} onMarkPaid={handleMarkPayoutPaid} showToast={showToast} />
            </div></div>
          </div>

          {/* Fee Settings Tab */}
          <div className={`ps ${activeTab === 'fees' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><DollarSign size={18} /> Transaction Fee Settings</div></div>
            <div className="card"><div className="card-b">
              <FeeSettings fees={feeSettings} onSave={handleSaveFeeSettings} showToast={showToast} />
            </div></div>
          </div>

          {/* Notifications Tab */}
          <div className={`ps ${activeTab === 'notifications' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Bell size={18} /> Push Notifications</div></div>
            <div className="card"><div className="card-b">
              <NotificationManager 
                settings={{ enabled: pushNotificationsEnabled }} 
                onSave={handleSaveNotificationSettings} 
                onSend={handleSendPushNotification} 
                history={notificationHistory} 
                showToast={showToast} 
              />
            </div></div>
          </div>

          {/* Creator Verifications Tab */}
          <div className={`ps ${activeTab === 'creator-verifications' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Shield size={18} /> Creator Verification Requests</div></div>
            <div className="card"><div className="card-b">
              <CreatorVerificationManager 
                verifications={creatorVerifications} 
                onReview={handleReviewCreatorVerification} 
                showToast={showToast} 
              />
            </div></div>
          </div>

          {/* Donor Management Tab */}
          <div className={`ps ${activeTab === 'donor-management' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Users size={18} /> Donor Management</div></div>
            <div className="card"><div className="card-b">
              <DonorManagement 
                topDonors={topDonors} 
                subscriptions={recurringSubscriptions} 
                analytics={donorAnalytics} 
                onSubscriptionAction={handleSubscriptionAction} 
                showToast={showToast} 
              />
            </div></div>
          </div>

          {/* Audit Logs Tab */}
          <div className={`ps ${activeTab === 'audit-logs' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><History size={18} /> Audit Logs</div></div>
            <div className="card"><div className="card-b">
              <AuditLogs logs={auditLogs} showToast={showToast} />
            </div></div>
          </div>

          {/* Email Templates Tab */}
          <div className={`ps ${activeTab === 'email_templates' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><MailIcon size={18} /> Email Templates</div><div style={{ fontSize: 13, color: 'var(--txt-3)' }}>Customise every transactional email</div></div>
            <div className="card"><div className="card-b">
              <EmailTemplateEditor showToast={showToast} />
            </div></div>
          </div>

          {/* Mass Mail Tab */}
          <div className={`ps ${activeTab === 'massmail' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><Send size={18} /> Broadcast Email</div></div><div className="card-b">
              <MassMailForm onSend={() => {}} showToast={showToast} />
            </div></div>
          </div>

          {/* Content Tab */}
          <div className={`ps ${activeTab === 'content' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><FileText size={18} /> Platform Content</div></div><div className="card-b">
              <ContentEditor content={content} onSave={handleSaveContent} showToast={showToast} />
            </div></div>
          </div>

          {/* Settings Tab */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t"><Settings size={18} /> System Settings</div></div><div className="card-b">
              <div className="settings-tabs">
                {['security', 'theme', 'keys', 'social'].map(t => (
                  <button key={t} className={`role-tab ${settingsTab === t ? 'active' : ''}`} onClick={() => setSettingsTab(t)}>
                    {t === 'security' ? 'Security' : t === 'theme' ? 'Theme' : t === 'keys' ? 'Integration Keys' : 'Social Links'}
                  </button>
                ))}
              </div>

              {/* Security Tab */}
              {settingsTab === 'security' && (
                <div>
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <strong>Email Verification</strong>
                      <p>Require new users to verify their email before logging in</p>
                    </div>
                    <Toggle checked={verificationEnabled} onChange={handleToggleVerification} disabled={togglingVerification} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <strong>reCAPTCHA Protection</strong>
                      <p>Enable Google reCAPTCHA on login and registration forms</p>
                    </div>
                    <Toggle checked={recaptchaEnabled} onChange={handleToggleRecaptcha} disabled={togglingRecaptcha} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <strong>Maintenance Mode</strong>
                      <p>Only admins can access the site</p>
                    </div>
                    <Toggle checked={maintenanceMode.enabled} onChange={handleToggleMaintenance} danger disabled={togglingMaintenance} />
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <strong>Change Admin Password</strong>
                      <p>Update your account password</p>
                    </div>
                    <button className="btn btn-g" onClick={() => setShowChangePassword(true)}>
                      <Lock size={14} /> Change Password
                    </button>
                  </div>
                  {maintenanceMode.enabled && (
                    <div style={{ marginTop: 20 }}>
                      <label className="fl">Maintenance Message</label>
                      <textarea className="fi" rows="3" value={maintenanceMode.message} onChange={e => setMaintenanceMode(prev => ({ ...prev, message: e.target.value }))} placeholder="We're under maintenance. Please check back soon!" />
                      <button className="btn btn-g" onClick={async () => { try { await adminApi.saveSettings({ keys: { maintenance_message: maintenanceMode.message } }); showToast('Message saved'); } catch (err) { showToast(err.message, true); } }}>Save Message</button>
                      <div style={{ marginTop: 12, padding: 12, background: 'var(--amber-l)', borderRadius: 8, fontSize: 12, color: '#854F0B' }}>
                        Preview: "{maintenanceMode.message || 'We are currently under maintenance.'}"
                      </div>
                    </div>
                  )}
                  {recaptchaEnabled && (
                    <div style={{ marginTop: 24, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>reCAPTCHA Keys</div>
                      <label className="fl">Site Key</label>
                      <input type="text" className="fi" value={integrationKeys.recaptcha_site_key || ''} onChange={e => setIntegrationKeys(prev => ({ ...prev, recaptcha_site_key: e.target.value }))} placeholder="6LeIxAcT..." />
                      <label className="fl">Secret Key</label>
                      <input type="password" className="fi" value={integrationKeys.recaptcha_secret_key || ''} onChange={e => setIntegrationKeys(prev => ({ ...prev, recaptcha_secret_key: e.target.value }))} placeholder="6LeIxAcT..." />
                      <button className="btn btn-g" onClick={handleSaveSettings}>Save reCAPTCHA Keys</button>
                    </div>
                  )}
                </div>
              )}

              {/* Theme Tab */}
              {settingsTab === 'theme' && (
                <div>
                  {Object.entries(themeSettings).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <label className="fl">{key}</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input type="color" value={value} onChange={e => setThemeSettings(prev => ({ ...prev, [key]: e.target.value }))} style={{ width: 50, height: 42, padding: 2, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }} />
                        <input type="text" className="fi" value={value} onChange={e => setThemeSettings(prev => ({ ...prev, [key]: e.target.value }))} style={{ marginBottom: 0 }} />
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-g" onClick={handleSaveSettings}>Save Theme</button>
                </div>
              )}

              {/* Integration Keys Tab */}
              {settingsTab === 'keys' && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>SMTP Settings</div>
                  {[['smtp_host', 'SMTP Host', 'smtp.sendgrid.net'], ['smtp_port', 'SMTP Port', '587'], ['smtp_user', 'SMTP User', 'apikey'], ['smtp_pass', 'SMTP Password', '••••••••']].map(([k, label, ph]) => (
                    <div key={k}>
                      <label className="fl">{label}</label>
                      <input type={k === 'smtp_pass' ? 'password' : 'text'} className="fi" value={integrationKeys[k] || ''} onChange={e => setIntegrationKeys(prev => ({ ...prev, [k]: e.target.value }))} placeholder={ph} />
                    </div>
                  ))}
                  <button className="btn btn-g" onClick={handleSaveSettings} style={{ marginBottom: 24 }}>Save SMTP</button>
                </div>
              )}

              {/* Social Links Tab */}
              {settingsTab === 'social' && (
                <div>
                  {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(p => (
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

          {/* Maintenance Tab */}
          <div className={`ps ${activeTab === 'maintenance' ? 'active' : ''}`}>
            <div className="sh"><div className="sht"><Settings size={18} /> Maintenance Mode</div></div>
            <div className="card"><div className="card-b">
              <div className="toggle-row">
                <div className="toggle-info">
                  <strong>Enable Maintenance Mode</strong>
                  <p>When on, only admins can access the site</p>
                </div>
                <Toggle checked={maintenanceMode.enabled} onChange={handleToggleMaintenance} danger disabled={togglingMaintenance} />
              </div>
              {maintenanceMode.enabled && (
                <div style={{ marginTop: 20 }}>
                  <label className="fl">Message shown to users</label>
                  <textarea className="fi" rows="3" value={maintenanceMode.message} onChange={e => setMaintenanceMode(prev => ({ ...prev, message: e.target.value }))} placeholder="We're performing scheduled maintenance. Please check back soon!" />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-g" onClick={async () => { try { await adminApi.saveSettings({ keys: { maintenance_message: maintenanceMode.message } }); showToast('Message saved'); } catch (err) { showToast(err.message, true); } }}>Save Message</button>
                  </div>
                  <div style={{ marginTop: 16, padding: 14, background: 'var(--amber-l)', borderRadius: 'var(--r-md)', fontSize: 13, color: '#854F0B' }}>
                    <strong>Preview:</strong> "{maintenanceMode.message || 'We are currently under maintenance. Please check back later.'}"
                  </div>
                </div>
              )}
              {!maintenanceMode.enabled && (
                <div style={{ marginTop: 16, padding: 14, background: 'var(--green-l)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--green-d)' }}>
                  <CheckCircle size={14} /> Site is live — all users can access HopeBridge normally.
                </div>
              )}
            </div></div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bnav">
        <div className="bnav-inner">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Home' },
            { id: 'campaigns', icon: <Target size={20} />, label: 'Campaigns' },
            { id: 'deposits', icon: <CreditCard size={20} />, label: 'Deposits' },
            { id: 'withdrawals', icon: <Banknote size={20} />, label: 'Withdrawals' },
            { id: 'notifications', icon: <Bell size={20} />, label: 'Alerts' },
            { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
          ].map(({ id, icon, label }) => (
            <button key={id} className={`bni ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              <div className="bni-icon">{icon}</div>
              <span className="bni-lbl">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Modals */}
      <ChangePasswordModal 
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSave={handleChangePassword}
        showToast={showToast}
      />

      <DeleteUserModal
        isOpen={deleteUserModal.open}
        onClose={() => setDeleteUserModal({ open: false, userId: null, userName: '' })}
        onConfirm={() => handleDeleteUser(deleteUserModal.userId)}
        userName={deleteUserModal.userName}
        showToast={showToast}
      />

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUserSubmit}
        userData={newUser}
        setUserData={setNewUser}
        loading={addingUser}
      />
    </div>
  );
}