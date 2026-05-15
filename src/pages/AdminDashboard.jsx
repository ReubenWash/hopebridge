import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { adminApi, campaignApi } from '../services/api';

// ---------- Helper: safe API call ----------
const safeGet = async (apiCall, fallback) => {
  try {
    return await apiCall();
  } catch {
    return fallback;
  }
};

// ---------- Helper: safely convert to number ----------
const toNumber = (val, fallback = 0) => {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
};

// ---------- Global style injection (once) ----------
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
    .card-t{font-family:var(--fd);font-size:17px;color:var(--txt)}
    .card-a{font-size:12px;font-weight:600;color:var(--green);cursor:pointer;border:none;background:none;font-family:var(--fb)}
    .card-b{padding:16px 20px}
    .cr{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:background var(--tr)}
    .cr:last-child{border-bottom:none}
    .cr:hover{background:var(--surface-2);margin:0 -20px;padding:10px 20px;border-radius:var(--r-sm)}
    .ct{width:40px;height:40px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    .ci{flex:1;min-width:0}
    .cn{font-size:13.5px;font-weight:600;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .cm{font-size:11px;color:var(--txt-3);margin-top:2px}
    .pb{height:4px;background:var(--bg);border-radius:2px;margin-top:5px;overflow:hidden}
    .pf{height:100%;background:var(--green);border-radius:2px;transition:width .9s ease}
    .badge{font-size:10px;font-weight:700;padding:4px 9px;border-radius:20px;flex-shrink:0;white-space:nowrap}
    .bp{background:var(--amber-l);color:#854F0B}
    .ba{background:var(--green-l);color:var(--green-d)}
    .br{background:var(--blue-l);color:#185FA5}
    .bx{background:var(--red-l);color:var(--red)}
    .qg{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
    .qb{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px 8px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:transform var(--tr),box-shadow var(--tr);font-family:var(--fb);border:none}
    .qb:hover{transform:translateY(-2px);box-shadow:var(--sh-md);background:var(--surface)}
    .qb:active{transform:scale(0.96)}
    .qi{width:40px;height:40px;border-radius:var(--r-sm);background:var(--green-l);display:flex;align-items:center;justify-content:center;border:1px solid var(--border)}
    .qi svg{width:20px;height:20px;stroke:var(--green-d);stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .qb.qx .qi{background:var(--red-l)}.qb.qx .qi svg{stroke:var(--red)}.qb.qx .ql{color:var(--red)}
    .ql{font-size:11px;font-weight:600;color:var(--txt-2);text-align:center}
    .hpills{display:flex;gap:10px;flex-wrap:wrap}
    .mp{flex:1;min-width:80px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 10px;text-align:center}
    .mpl{font-size:10px;color:var(--txt-3);font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:4px}
    .mpv{font-size:14px;font-weight:700}
    .ok{color:var(--green)}.stable{color:var(--blue)}.norm{color:var(--txt)}
    .pulse-w{display:flex;align-items:center;gap:6px}
    .pb2{width:3px;border-radius:2px;background:var(--green);animation:pa 1.2s ease-in-out infinite}
    .pb2:nth-child(1){height:8px;animation-delay:0s}.pb2:nth-child(2){height:14px;animation-delay:.2s}
    .pb2:nth-child(3){height:10px;animation-delay:.4s}.pb2:nth-child(4){height:16px;animation-delay:.1s}
    .pb2:nth-child(5){height:8px;animation-delay:.3s}
    @keyframes pa{0%,100%{opacity:.3;transform:scaleY(.7)}50%{opacity:1;transform:scaleY(1)}}
    .di{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
    .di:last-child{border-bottom:none}
    .di-info{flex:1}
    .di-user{font-size:13px;font-weight:600;color:var(--txt)}
    .di-amt{font-size:12px;color:var(--txt-2);margin-top:2px}
    .di-acts{display:flex;gap:6px}
    .db{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:none;font-family:var(--fb);transition:opacity var(--tr)}
    .dba{background:var(--green-l);color:var(--green-d)}
    .dba:hover{background:var(--green-m)}
    .dbr{background:var(--red-l);color:var(--red)}
    .dbr:hover{background:#F7C1C1}
    .dbv{background:var(--blue-l);color:#185FA5}
    .wh{background:linear-gradient(130deg,#042C53 0%,#185FA5 55%,#378ADD 100%);border-radius:var(--r-xl);padding:30px 32px;margin-bottom:24px;color:#fff;position:relative;overflow:hidden}
    .wh::before{content:'';position:absolute;top:-50px;right:-50px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.05)}
    .wh::after{content:'';position:absolute;bottom:-40px;left:40px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,0.04)}
    .wh-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;position:relative;z-index:1}
    .wh-lbl{font-size:12px;color:rgba(255,255,255,0.6);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px}
    .wh-bal{font-family:var(--fd);font-size:46px;color:#fff;line-height:1}
    .wh-sub{font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px}
    .wh-num{font-size:14px;font-weight:500;color:rgba(255,255,255,0.7);letter-spacing:.15em}
    .wh-acts{display:flex;gap:10px;position:relative;z-index:1;flex-wrap:wrap}
    .wa{display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(255,255,255,0.14);border:1px solid rgba(255,255,255,0.18);border-radius:var(--r-md);padding:12px 20px;cursor:pointer;transition:background var(--tr);color:#fff;font-family:var(--fb)}
    .wa:hover{background:rgba(255,255,255,0.22)}
    .wa svg{width:20px;height:20px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .wa span{font-size:12px;font-weight:600}
    .wallet-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
    .txt{width:100%;border-collapse:collapse}
    .txt th{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--txt-3);text-align:left;padding:8px 0;border-bottom:1px solid var(--border)}
    .txt td{font-size:13px;color:var(--txt);padding:12px 0;border-bottom:1px solid var(--border);vertical-align:middle}
    .txt tr:last-child td{border-bottom:none}
    .txt td:last-child{text-align:right}
    .txi{width:32px;height:32px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .txi svg{width:16px;height:16px;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .txr{display:flex;align-items:center;gap:10px}
    .txn{font-size:13px;font-weight:600;color:var(--txt)}
    .txd{font-size:11px;color:var(--txt-3);margin-top:1px}
    .txam{font-weight:700;font-size:14px}
    .tcc{color:var(--green)}.tcd{color:var(--red)}
    .modal-bd{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}
    .modal-bd.open{opacity:1;pointer-events:all}
    .modal{background:var(--surface);border-radius:var(--r-xl);padding:28px;width:90%;max-width:500px;box-shadow:var(--sh-lg);transform:translateY(20px);transition:transform .25s}
    .modal-bd.open .modal{transform:translateY(0)}
    .modal-t{font-family:var(--fd);font-size:22px;color:var(--txt);margin-bottom:6px}
    .modal-s{font-size:13px;color:var(--txt-2);margin-bottom:20px}
    .fl{font-size:12px;font-weight:700;color:var(--txt-2);letter-spacing:.05em;text-transform:uppercase;margin-bottom:6px;display:block}
    .fi{width:100%;background:var(--surface-2);border:1px solid var(--border-2);border-radius:var(--r-sm);padding:11px 14px;font-size:14px;color:var(--txt);font-family:var(--fb);outline:none;transition:border-color var(--tr);margin-bottom:14px}
    .fi:focus{border-color:var(--green)}
    .btn{padding:11px 22px;border-radius:var(--r-sm);font-size:14px;font-weight:600;cursor:pointer;border:none;font-family:var(--fb);transition:opacity var(--tr),transform var(--tr)}
    .btn:active{transform:scale(0.97)}
    .btn-g{background:var(--green);color:#fff}.btn-g:hover{background:var(--green-d)}
    .btn-gh{background:var(--surface-2);color:var(--txt-2);border:1px solid var(--border-2)}.btn-gh:hover{background:var(--bg)}
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
    .sht{font-family:var(--fd);font-size:20px;color:var(--txt)}
    .bsum{display:flex;flex-direction:column;gap:0}
    .brow{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)}
    .brow:last-child{border-bottom:none}
    .brl{font-size:13px;color:var(--txt-2)}
    .brv{font-size:14px;font-weight:700}
    .mob-top{display:none;height:58px;background:var(--surface);border-bottom:1px solid var(--border);align-items:center;padding:0 16px;gap:12px;position:sticky;top:0;z-index:100}
    .mob-logo{font-family:var(--fd);font-size:20px;color:var(--txt);flex:1}
  .bnav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav);
  background: var(--surface);
  border-top: 1px solid var(--border);
  z-index: 200;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.07);
}
.bnav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 100%;
  padding: 0 12px;
}
.bni {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  border: none;
  background: none;
  position: relative;
  font-family: var(--fb);
  transition: background var(--tr);
  padding: 8px 0;
}
.bni.active .bni-icon svg {
  stroke: var(--green);
}
.bni.active .bni-lbl {
  color: var(--green);
  font-weight: 700;
}
.bni-icon svg {
  width: 40px;
  height: 24px;
  stroke: var(--txt-3);
  stroke-width: 1.8;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bni-lbl {
  font-size: 10px;
  font-weight: 600;
  color: var(--txt-3);
}
.bni-dot {
  position: absolute;
  top: 6px;
  right: calc(50% - 18px);
  width: 8px;
  height: 8px;
  background: var(--red);
  border-radius: 50%;
  border: 1.5px solid var(--surface);
}
    .fab{display:none;position:fixed;right:18px;bottom:calc(var(--bottom-nav) + 14px);width:56px;height:56px;border-radius:50%;background:var(--green);border:none;cursor:pointer;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(29,158,117,0.5);z-index:150;transition:transform var(--tr)}
    .fab:active{transform:scale(0.93)}
    .fab svg{width:24px;height:24px;stroke:#fff;stroke-width:2.2;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .toast{position:fixed;bottom:calc(var(--bottom-nav) + 12px);left:50%;transform:translateX(-50%) translateY(12px);background:rgba(17,19,24,0.93);color:#fff;font-size:13px;font-weight:500;padding:10px 22px;border-radius:30px;white-space:nowrap;z-index:9999;opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;font-family:var(--fb)}
    .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
    .settings-tabs{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:10px}
    .role-tab{background:none;border:none;padding:6px 14px;border-radius:20px;cursor:pointer;font-size:13px;font-weight:600;color:var(--txt-2)}
    .role-tab.active{background:var(--green-l);color:var(--green-d)}
    .theme-settings .auth-field{margin-bottom:16px}
    .keys-settings .auth-field{margin-bottom:16px}
    .social-links-settings .auth-field{margin-bottom:16px}
    @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.qg{grid-template-columns:repeat(4,1fr)}.three-col{grid-template-columns:1fr}.wallet-cols{grid-template-columns:1fr}.two-col{grid-template-columns:1fr}}
    @media(max-width:768px){
      .sidebar{display:none}.main{margin-left:0}.topbar{display:none}
      .mob-top{display:flex}.bnav{display:flex}.fab{display:flex}
      .page{padding:16px;padding-bottom:calc(var(--bottom-nav) + 70px)}
      .stats-grid{grid-template-columns:1fr 1fr;gap:10px}.qg{grid-template-columns:repeat(4,1fr);gap:8px}
      .ov-hero{border-radius:var(--r-lg);padding:20px}.hero-t{font-size:22px}.hst-v{font-size:20px}
      .two-col,.three-col,.wallet-cols{grid-template-columns:1fr}
      .wh{border-radius:var(--r-lg);padding:22px 18px}.wh-bal{font-size:34px}
      .ut th:nth-child(3),.ut td:nth-child(3),.ut th:nth-child(4),.ut td:nth-child(4){display:none}
      .toast{bottom:calc(var(--bottom-nav) + 10px)}
    }
    @media(max-width:480px){.qg{grid-template-columns:repeat(4,1fr)}.sv{font-size:26px}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    .ps.active>*{animation:fadeUp .35s ease both}
  `;
  document.head.appendChild(styleEl);
};

// ---------- Component: MassMailForm ----------
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
    if (!subject || !message) {
      showToast('Please fill subject and message', true);
      return;
    }
    setSending(true);
    try {
      await adminApi.sendMassMail({
        subject,
        message,
        recipient_type: recipientType,
        campaign_id: recipientType === 'campaign_donors' ? campaignId : null,
      });
      showToast('Emails sent successfully!');
      setSubject('');
      setMessage('');
      if (onSend) onSend();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend}>
      <div className="auth-field">
        <label className="fl">Recipient Group</label>
        <select className="fi" value={recipientType} onChange={e => setRecipientType(e.target.value)}>
          <option value="all_donors">All donors</option>
          <option value="all_creators">All creators</option>
          <option value="all_users">All registered users</option>
          <option value="campaign_donors">Donors of a specific campaign</option>
        </select>
      </div>
      {recipientType === 'campaign_donors' && (
        <div className="auth-field">
          <label className="fl">Campaign</label>
          <select className="fi" value={campaignId} onChange={e => setCampaignId(e.target.value)} required>
            <option value="">-- Select campaign --</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      )}
      <div className="auth-field">
        <label className="fl">Subject</label>
        <input type="text" className="fi" value={subject} onChange={e => setSubject(e.target.value)} required />
      </div>
      <div className="auth-field">
        <label className="fl">Message (plain text)</label>
        <textarea className="fi" rows="6" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Write your email content here..." />
      </div>
      <button className="btn btn-g" disabled={sending}>
        {sending ? 'Sending...' : <><i className="fas fa-paper-plane"></i> Send Emails</>}
      </button>
    </form>
  );
}

// ---------- Component: ContentEditor ----------
function ContentEditor({ content, onSave, showToast }) {
  const [localContent, setLocalContent] = useState(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const updateField = (field, value) => setLocalContent(prev => ({ ...prev, [field]: value }));
  const updateStat = (stat, value) => setLocalContent(prev => ({ ...prev, impact_stats: { ...prev.impact_stats, [stat]: value } }));
  const updateSocial = (platform, value) => setLocalContent(prev => ({ ...prev, social_links: { ...prev.social_links, [platform]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localContent);
      showToast('Content updated');
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h5 style={{ marginTop: 20 }}>Hero Section</h5>
      <div className="auth-field"><label className="fl">Badge Text</label><input type="text" className="fi" value={localContent.hero_badge || ''} onChange={e => updateField('hero_badge', e.target.value)} /></div>
      <div className="auth-field"><label className="fl">Hero Title</label><input type="text" className="fi" value={localContent.hero_title || ''} onChange={e => updateField('hero_title', e.target.value)} /></div>
      <div className="auth-field"><label className="fl">Hero Subtitle</label><textarea className="fi" rows="2" value={localContent.hero_subtitle || ''} onChange={e => updateField('hero_subtitle', e.target.value)} /></div>

      <h5 style={{ marginTop: 20 }}>Impact Section</h5>
      <div className="auth-field"><label className="fl">Section Title</label><input type="text" className="fi" value={localContent.impact_title || ''} onChange={e => updateField('impact_title', e.target.value)} /></div>
      <div className="auth-field"><label className="fl">Section Subtitle</label><input type="text" className="fi" value={localContent.impact_subtitle || ''} onChange={e => updateField('impact_subtitle', e.target.value)} /></div>
      <div className="auth-field"><label className="fl">Stat – Total Raised</label><input type="text" className="fi" value={localContent.impact_stats?.raised || '$0'} onChange={e => updateStat('raised', e.target.value)} /></div>
      <div className="auth-field"><label className="fl">Stat – Campaigns</label><input type="text" className="fi" value={localContent.impact_stats?.campaigns || '0'} onChange={e => updateStat('campaigns', e.target.value)} /></div>
      <div className="auth-field"><label className="fl">Stat – Donors</label><input type="text" className="fi" value={localContent.impact_stats?.donors || '0'} onChange={e => updateStat('donors', e.target.value)} /></div>

      <h5 style={{ marginTop: 20 }}>Banner & Notification</h5>
      <div className="auth-field"><label className="fl">Banner Image URL</label><input type="text" className="fi" value={localContent.banner_image || ''} onChange={e => updateField('banner_image', e.target.value)} /></div>
      <div className="auth-field"><label className="fl">Notification Message</label><textarea className="fi" rows="2" value={localContent.notification_message || ''} onChange={e => updateField('notification_message', e.target.value)} /></div>

      <h5 style={{ marginTop: 20 }}>Social Media Links</h5>
      {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(platform => (
        <div className="auth-field" key={platform}>
          <label className="fl">{platform.charAt(0).toUpperCase() + platform.slice(1)} URL</label>
          <input type="text" className="fi" value={localContent.social_links?.[platform] || ''} onChange={e => updateSocial(platform, e.target.value)} placeholder={`https://${platform}.com/...`} />
        </div>
      ))}
      <button className="btn btn-g" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Content'}</button>
    </div>
  );
}

// ---------- Component: DepositRequestsManager ----------
function DepositRequestsManager({ requests, onApprove, onReject, onProvideInstructions, showToast }) {
  const [instructionsText, setInstructionsText] = useState({});

  const handleProvide = (id) => {
    const instructions = instructionsText[id];
    if (!instructions || instructions.trim() === '') {
      showToast('Please enter payment instructions', true);
      return;
    }
    onProvideInstructions(id, instructions);
    setInstructionsText(prev => ({ ...prev, [id]: '' }));
  };

  if (requests.length === 0) return <div>No deposit requests.</div>;

  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div><strong>User:</strong> {req.userName || req.name} ({req.email})</div>
          <div><strong>Amount:</strong> ${toNumber(req.amount).toFixed(2)}</div>
          <div><strong>Status:</strong> <span className={`badge ${req.status === 'pending' ? 'bp' : req.status === 'approved' ? 'ba' : 'bx'}`}>{req.status}</span></div>
          {req.status === 'pending' && (
            <div style={{ marginTop: 10 }}>
              <textarea
                placeholder="Payment instructions (bank, mobile money, crypto)"
                rows="2"
                className="fi"
                value={instructionsText[req.id] || ''}
                onChange={e => setInstructionsText(prev => ({ ...prev, [req.id]: e.target.value }))}
              />
              <button className="db dba" onClick={() => handleProvide(req.id)}>Provide Instructions</button>
            </div>
          )}
          {req.status === 'awaiting_proof' && req.proof_image_url && (
            <div style={{ marginTop: 10 }}>
              <a href={req.proof_image_url} target="_blank" rel="noopener noreferrer">View Proof</a>
              <div style={{ marginTop: 8 }}>
                <button className="db dba" style={{ marginRight: 8 }} onClick={() => onApprove(req.id, req.amount)}>Approve & Credit</button>
                <button className="db dbr" onClick={() => onReject(req.id)}>Reject</button>
              </div>
            </div>
          )}
          {req.status === 'approved' && <span style={{ color: 'var(--green)' }}>✓ Credited to wallet</span>}
          {req.status === 'rejected' && <span style={{ color: 'var(--red)' }}>✗ Rejected</span>}
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
  const [settingsTab, setSettingsTab] = useState('theme'); // theme, keys, social
  const [themeSettings, setThemeSettings] = useState({
    '--primary': '#e8531e',
    '--primary-dark': '#c4400f',
    '--secondary': '#27a96c',
    '--dark': '#1a1a2e',
  });
  const [integrationKeys, setIntegrationKeys] = useState({
    smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '',
    paypal_client_id: '', paypal_client_secret: '', paypal_mode: 'sandbox',
    recaptcha_site_key: '', recaptcha_secret_key: '', firebase_config: '',
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '',
  });

  // Data states
  const [stats, setStats] = useState({ total_raised: 0, total_campaigns: 0, pending_campaigns: 0, total_users: 0, open_disputes: 0 });
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [donations, setDonations] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);
  const [content, setContent] = useState({
    hero_title: 'Together We Can',
    hero_subtitle: 'Support the causes you care about and make a real difference.',
    hero_badge: 'HopeBridge',
    impact_title: 'Our Impact',
    impact_subtitle: 'Every donation counts',
    impact_stats: { raised: '$0', campaigns: '0', donors: '0' },
    banner_image: '',
    notification_message: '',
    social_links: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' }
  });

  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('hb_darkmode', darkMode);
  }, [darkMode]);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeSettings).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [themeSettings]);

  // Auth check
  useEffect(() => {
    if (sessionLoading) return;
    if (!currentUser) {
      showToast('Please log in first', true);
      navigate('/');
      return;
    }
    if (currentUser.role !== 'admin') {
      showToast('Access denied – admin only', true);
      navigate('/');
      return;
    }
    setAuthChecked(true);
  }, [sessionLoading, currentUser, navigate, showToast]);

  // Fetch all data with number conversion
  const fetchAll = async () => {
    setDataLoading(true);
    try {
      const [s, c, u, d, don, dep, sett, cont] = await Promise.all([
        safeGet(() => adminApi.getStats(), { stats: {} }),
        safeGet(() => adminApi.getCampaigns(), { campaigns: [] }),
        safeGet(() => adminApi.getUsers(), { users: [] }),
        safeGet(() => adminApi.getDisputes(), { disputes: [] }),
        safeGet(() => adminApi.getDonations(), { donations: [] }),
        safeGet(() => adminApi.getDepositRequests?.(), { requests: [] }),
        safeGet(() => adminApi.getSettings(), { settings: null }),
        safeGet(() => adminApi.getContent(), { content: null }),
      ]);

      // Convert stats numbers
      const parsedStats = { ...(s.stats || {}) };
      ['total_raised', 'total_campaigns', 'pending_campaigns', 'total_users', 'open_disputes'].forEach(key => {
        if (parsedStats[key] !== undefined) parsedStats[key] = toNumber(parsedStats[key]);
      });
      setStats(parsedStats);

      // Convert campaigns goal & raised
      const parsedCampaigns = (c.campaigns || []).map(camp => ({
        ...camp,
        goal: toNumber(camp.goal),
        raised: toNumber(camp.raised)
      }));
      setCampaigns(parsedCampaigns);

      // Convert users wallet_balance
      const parsedUsers = (u.users || []).map(user => ({
        ...user,
        wallet_balance: toNumber(user.wallet_balance)
      }));
      setUsers(parsedUsers);

      // Convert donations amount
      const parsedDonations = (don.donations || []).map(d => ({
        ...d,
        amount: toNumber(d.amount)
      }));
      setDonations(parsedDonations);

      // Convert deposit requests amount
      const parsedDeposits = (dep.requests || []).map(req => ({
        ...req,
        amount: toNumber(req.amount)
      }));
      setDepositRequests(parsedDeposits);

      // Settings and content (no numbers there)
      if (sett?.settings) {
        if (sett.settings.theme) setThemeSettings(prev => ({ ...prev, ...sett.settings.theme }));
        if (sett.settings.keys) setIntegrationKeys(prev => ({ ...prev, ...sett.settings.keys }));
      }
      if (cont?.content) {
        setContent(prev => ({
          ...prev,
          ...cont.content,
          social_links: { ...prev.social_links, ...(cont.content.social_links || {}) }
        }));
        if (cont.content.social_links) setSocialLinks(cont.content.social_links);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load admin data', true);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) fetchAll();
  }, [authChecked]);

  // Handlers
  const handleApproveCampaign = async (id) => {
    try {
      await adminApi.updateCampaign(id, { status: 'approved' });
      showToast('Campaign approved');
      fetchAll();
    } catch (err) { showToast(err.message, true); }
  };

  const handleRejectCampaign = async (id) => {
    try {
      await adminApi.updateCampaign(id, { status: 'rejected' });
      showToast('Campaign rejected');
      fetchAll();
    } catch (err) { showToast(err.message, true); }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Delete campaign permanently? This cannot be undone.')) return;
    try {
      await campaignApi.delete(id);
      showToast('Campaign deleted');
      fetchAll();
    } catch (err) { showToast(err.message, true); }
  };

  const handleToggleUser = async (id) => {
    try {
      await adminApi.toggleUser(id);
      showToast('User status updated');
      fetchAll();
    } catch (err) { showToast(err.message, true); }
  };

  const handleResolveDispute = async (id) => {
    try {
      await adminApi.resolveDispute(id);
      showToast('Dispute resolved');
      fetchAll();
    } catch (err) { showToast(err.message, true); }
  };

  const handleApproveDeposit = async (id, amount) => {
    try {
      await adminApi.updateDepositRequest?.(id, { status: 'approved' });
      showToast(`Deposit $${toNumber(amount).toFixed(2)} approved`);
      fetchAll();
    } catch (err) { showToast(err.message, true); }
  };

  const handleRejectDeposit = async (id) => {
    try {
      await adminApi.updateDepositRequest?.(id, { status: 'rejected' });
      showToast('Deposit rejected');
      fetchAll();
    } catch (err) { showToast(err.message, true); }
  };

  const handleProvideInstructions = async (id, instructions) => {
    try {
      await adminApi.updateDepositRequest?.(id, { admin_instructions: instructions, status: 'awaiting_proof' });
      showToast('Instructions provided, waiting for proof');
      fetchAll();
    } catch (err) { showToast(err.message, true); }
  };

  const handleSendMassMail = async (data) => {
    // Called from MassMailForm, already handles API
  };

  const handleSaveContent = async (newContent) => {
    await adminApi.saveContent(newContent);
    setContent(newContent);
    if (newContent.social_links) setSocialLinks(newContent.social_links);
  };

  const handleSaveSettings = async () => {
    try {
      await adminApi.saveSettings({ theme: themeSettings, keys: integrationKeys });
      showToast('Settings saved');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleSaveSocialLinks = async () => {
    try {
      const updatedContent = { ...content, social_links: socialLinks };
      await adminApi.saveContent(updatedContent);
      setContent(updatedContent);
      showToast('Social links saved');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (sessionLoading || !authChecked) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading admin panel...</div>;
  }

  // All values are now guaranteed numbers
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const pendingCampaigns = campaigns.filter(c => c.status === 'pending' || c.status === 'review').length;
  const donorsCount = users.filter(u => u.role === 'donor').length;
  const creatorsCount = users.filter(u => u.role === 'creator').length;
  const pendingDepositsSum = depositRequests.reduce((sum, r) => sum + r.amount, 0);
  const openDisputesCount = disputes.filter(d => d.status !== 'resolved').length;

  const tabs = ['overview', 'campaigns', 'users', 'donations', 'deposits', 'massmail', 'content', 'settings'];

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-mark">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
            </div>
            <div><div className="logo-text">HopeBridge</div><div className="logo-sub">Admin Console</div></div>
          </div>
        </div>
        <div className="sb-admin">
          <div className="admin-av">SA</div>
          <div><div className="admin-name-s">System Admin</div><div className="admin-role">Super Administrator</div></div>
        </div>
        <nav className="sb-nav">
          <div className="nav-sec">Main</div>
          {['overview', 'campaigns', 'users'].map(tab => (
            <button key={tab} className={`nl ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'overview' && <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
              {tab === 'campaigns' && <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>}
              {tab === 'users' && <svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg>}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'campaigns' && pendingCampaigns > 0 && <span className="nb">{pendingCampaigns}</span>}
            </button>
          ))}
          <div className="nav-sec">Finance</div>
          {['donations', 'deposits'].map(tab => (
            <button key={tab} className={`nl ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'donations' && <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>}
              {tab === 'deposits' && <svg viewBox="0 0 24 24"><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <div className="nav-sec">Admin</div>
          {['massmail', 'content', 'settings'].map(tab => (
            <button key={tab} className={`nl ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'massmail' && <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
              {tab === 'content' && <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
              {tab === 'settings' && <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button className="nl" onClick={() => setDarkMode(!darkMode)} style={{ marginTop: 8 }}>
            <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
        <div className="sb-footer">
          <button className="nl" style={{ color: 'var(--red)' }} onClick={handleLogout}>
            <svg viewBox="0 0 24 24" style={{ stroke: 'var(--red)' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="tb-title">{tabs.find(t => t === activeTab)?.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
          <div className="tb-actions">
            <div className="tb-btn" onClick={() => showToast('Search feature coming')}><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
            <div className="tb-btn" onClick={() => showToast('Notifications')} style={{ position: 'relative' }}><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><div className="ndot"></div></div>
            <div className="tb-btn" style={{ overflow: 'hidden', padding: 0 }}><div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--green),var(--green-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>SA</div></div>
          </div>
        </div>
        <div className="mob-top">
          <div className="mob-logo">HopeBridge</div>
          <div className="tb-btn" onClick={() => showToast('Search')}><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
          <div className="tb-btn" onClick={() => showToast('Notifications')} style={{ position: 'relative' }}><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><div className="ndot"></div></div>
        </div>

        <div className="page">
          {dataLoading && <div style={{ padding: '8px 16px', background: 'var(--green)', color: '#fff', borderRadius: 6, marginBottom: 12 }}>Loading data...</div>}

          {/* Overview */}
          <div className={`ps ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="ov-hero">
              <div className="hero-row">
                <div>
                  <div className="hero-g">Good morning, Administrator</div>
                  <div className="hero-t">HopeBridge<br /><em>Admin Console</em></div>
                  <div className="hero-s">{pendingCampaigns} campaigns awaiting review today</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Platform Status</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)' }}>● Live</div>
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
              <div className="sc"><div className="si si-g"><svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg></div><div className="sv">{stats.total_users || users.length}</div><div className="sl">Total Users</div><div className="sd dup">↑ 12% this month</div></div>
              <div className="sc"><div className="si si-b"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg></div><div className="sv">{activeCampaigns}</div><div className="sl">Active Campaigns</div><div className="sd dup">↑ {pendingCampaigns} pending</div></div>
              <div className="sc"><div className="si si-a"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg></div><div className="sv">${(totalRaised / 1000).toFixed(0)}k</div><div className="sl">Total Raised</div><div className="sd dup">↑ $8.2k this week</div></div>
              <div className="sc"><div className="si si-r"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div className="sv">{openDisputesCount}</div><div className="sl">Open Disputes</div><div className="sd ddn">↑ 1 new today</div></div>
            </div>

            <div className="sh"><div className="sht">Quick Actions</div></div>
            <div className="qg">
              {['campaigns', 'users', 'massmail', 'content', 'settings'].map(tab => (
                <button key={tab} className="qb" onClick={() => setActiveTab(tab)}>
                  <div className="qi">
                    {tab === 'campaigns' && <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>}
                    {tab === 'users' && <svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>}
                    {tab === 'massmail' && <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                    {tab === 'content' && <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                    {tab === 'settings' && <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
                  </div>
                  <span className="ql">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                </button>
              ))}
              <button className="qb qx" onClick={handleLogout}>
                <div className="qi"><svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
                <span className="ql">Sign Out</span>
              </button>
            </div>

            <div className="three-col">
              <div className="card">
                <div className="card-h"><div className="card-t">Pending Approvals</div><button className="card-a" onClick={() => setActiveTab('campaigns')}>View all →</button></div>
                <div className="card-b">
                  {campaigns.filter(c => c.status === 'pending' || c.status === 'review').map(c => (
                    <div key={c.id} className="cr">
                      <div className="ct" style={{ background: '#E1F5EE' }}>🌱</div>
                      <div className="ci">
                        <div className="cn">{c.title}</div>
                        <div className="cm">Goal: ${c.goal.toLocaleString()} · {c.creator_name}</div>
                        <div className="pb"><div className="pf" style={{ width: `${((c.raised) / c.goal) * 100}%` }}></div></div>
                      </div>
                      <span className="badge bp">{c.status}</span>
                    </div>
                  ))}
                  {pendingCampaigns === 0 && <div>No pending campaigns</div>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card">
                  <div className="card-h"><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="pulse-w"><div className="pb2"></div><div className="pb2"></div><div className="pb2"></div><div className="pb2"></div><div className="pb2"></div></div><div className="card-t">System Health</div></div></div>
                  <div className="card-b"><div className="hpills"><div className="mp"><div className="mpl">Server</div><div className="mpv ok">Online</div></div><div className="mp"><div className="mpl">DB</div><div className="mpv stable">Stable</div></div><div className="mp"><div className="mpl">Latency</div><div className="mpv norm">35ms</div></div></div></div>
                </div>
                <div className="card">
                  <div className="card-h"><div className="card-t">Deposit Queue</div><button className="card-a" onClick={() => setActiveTab('deposits')}>Manage →</button></div>
                  <div className="card-b">
                    {depositRequests.slice(0, 3).map(req => (
                      <div key={req.id} className="di">
                        <div className="uav avb" style={{ width: 32, height: 32, fontSize: 11 }}>{req.userName?.[0] || 'U'}</div>
                        <div className="di-info"><div className="di-user">{req.userName}</div><div className="di-amt">${req.amount.toFixed(2)} · {req.method}</div></div>
                        <div className="di-acts"><button className="db dba" onClick={() => handleApproveDeposit(req.id, req.amount)}>OK</button><button className="db dbr" onClick={() => handleRejectDeposit(req.id)}>✕</button></div>
                      </div>
                    ))}
                    {depositRequests.length === 0 && <div>No pending deposits</div>}
                  </div>
                </div>
                <div className="card">
                  <div className="card-h"><div className="card-t">Open Disputes</div><button className="card-a" onClick={() => setActiveTab('disputes')}>View all →</button></div>
                  <div className="card-b">
                    {disputes.filter(d => d.status !== 'resolved').slice(0, 3).map(d => (
                      <div key={d.id} className="di">
                        <div className="uav avr" style={{ width: 32, height: 32 }}>!</div>
                        <div className="di-info"><div className="di-user">{d.user_name || 'User'}</div><div className="di-amt">{d.description || d.reason}</div></div>
                        <div className="di-acts"><button className="db dba" onClick={() => handleResolveDispute(d.id)}>Resolve</button></div>
                      </div>
                    ))}
                    {openDisputesCount === 0 && <div>No open disputes</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          

          {/* Users */}
          <div className={`ps ${activeTab === 'users' ? 'active' : ''}`}>
            <div className="sh"><div className="sht">User Management</div><button className="btn btn-g" onClick={() => showToast('Invite user feature')}>+ Invite User</button></div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}><table className="ut"><thead><tr><th style={{ paddingLeft: 20 }}>User</th><th>Role</th><th>Joined</th><th>Wallet</th><th>Status</th><th style={{ paddingRight: 20 }}>Actions</th></tr></thead><tbody>{users.map(u => (<tr key={u.id}><td style={{ paddingLeft: 20 }}><div className="uc"><div className={`uav avg`}>{u.name?.charAt(0)}</div><div><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{u.email}</div></div></div></td><td><span className="badge br">{u.role}</span></td><td style={{ color: 'var(--txt-2)' }}>{new Date(u.created_at).toLocaleDateString()}</td><td style={{ fontWeight: 600 }}>${u.wallet_balance.toFixed(2)}</td><td><span className={`badge ${u.is_active ? 'ba' : 'bx'}`}>{u.is_active ? 'Active' : 'Suspended'}</span></td><td style={{ paddingRight: 20 }}><button className="db dbv" onClick={() => handleToggleUser(u.id)}>{u.is_active ? 'Suspend' : 'Restore'}</button></td></tr>))}</tbody></table></div></div>
          </div>

          {/* Donations */}
          <div className={`ps ${activeTab === 'donations' ? 'active' : ''}`}>
            <div className="sh"><div className="sht">Recent Donations</div></div>
            <div className="card"><div className="card-b" style={{ padding: 0 }}><table className="ut"><thead><tr><th>Donor</th><th>Campaign</th><th>Amount</th><th>Monthly</th><th>Date</th></tr></thead><tbody>{donations.map(d => (<tr key={d.id}><td>{d.donor_name}</td><td>{d.campaign_title}</td><td>${d.amount.toLocaleString()}</td><td>{d.is_monthly ? '✅' : '—'}</td><td>{new Date(d.created_at).toLocaleDateString()}</td></tr>))}</tbody></table></div></div>
          </div>

          {/* Deposits */}
          <div className={`ps ${activeTab === 'deposits' ? 'active' : ''}`}>
            <div className="sh"><div className="sht">Deposit Requests</div></div>
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

          {/* Mass Mail */}
          <div className={`ps ${activeTab === 'massmail' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t">Broadcast Email</div></div><div className="card-b">
              <MassMailForm onSend={handleSendMassMail} showToast={showToast} />
            </div></div>
          </div>

          {/* Content */}
          <div className={`ps ${activeTab === 'content' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t">Platform Content</div></div><div className="card-b">
              <ContentEditor content={content} onSave={handleSaveContent} showToast={showToast} />
            </div></div>
          </div>

          {/* Settings */}
          <div className={`ps ${activeTab === 'settings' ? 'active' : ''}`}>
            <div className="card"><div className="card-h"><div className="card-t">System Settings</div></div><div className="card-b">
              <div className="settings-tabs">
                <button className={`role-tab ${settingsTab === 'theme' ? 'active' : ''}`} onClick={() => setSettingsTab('theme')}>Theme Colours</button>
                <button className={`role-tab ${settingsTab === 'keys' ? 'active' : ''}`} onClick={() => setSettingsTab('keys')}>Integration Keys</button>
                <button className={`role-tab ${settingsTab === 'social' ? 'active' : ''}`} onClick={() => setSettingsTab('social')}>Social Links</button>
              </div>
              {settingsTab === 'theme' && (
                <div className="theme-settings">
                  {Object.entries(themeSettings).map(([key, value]) => (
                    <div className="auth-field" key={key}>
                      <label className="fl">{key}</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input type="color" value={value} onChange={e => setThemeSettings(prev => ({ ...prev, [key]: e.target.value }))} style={{ width: 50, padding: 0, border: 'none' }} />
                        <input type="text" className="fi" value={value} onChange={e => setThemeSettings(prev => ({ ...prev, [key]: e.target.value }))} />
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-g" onClick={handleSaveSettings}>Save Theme</button>
                </div>
              )}
              {settingsTab === 'keys' && (
                <div className="keys-settings">
                  {Object.entries(integrationKeys).map(([key, value]) => (
                    <div className="auth-field" key={key}>
                      <label className="fl">{key.replace(/_/g, ' ').toUpperCase()}</label>
                      <input type="text" className="fi" value={value || ''} onChange={e => setIntegrationKeys(prev => ({ ...prev, [key]: e.target.value }))} placeholder={`Enter ${key}`} />
                    </div>
                  ))}
                  <button className="btn btn-g" onClick={handleSaveSettings}>Save Keys</button>
                </div>
              )}
              {settingsTab === 'social' && (
                <div className="social-links-settings">
                  {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(platform => (
                    <div className="auth-field" key={platform}>
                      <label className="fl">{platform.charAt(0).toUpperCase() + platform.slice(1)} URL</label>
                      <input type="text" className="fi" value={socialLinks[platform]} onChange={e => setSocialLinks(prev => ({ ...prev, [platform]: e.target.value }))} placeholder={`https://${platform}.com/...`} />
                    </div>
                  ))}
                  <button className="btn btn-g" onClick={handleSaveSocialLinks}>Save Social Links</button>
                </div>
              )}
            </div></div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button className="fab" onClick={() => setActiveTab('campaigns')}><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>

      {/* Bottom Nav */}
      <nav className="bnav"><div className="bnav-inner">
        {['overview', 'campaigns', 'users'].map(tab => (
          <button key={tab} className={`bni ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            <div className="bni-icon">
              {tab === 'overview' && <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
              {tab === 'campaigns' && <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>}
              {tab === 'users' && <svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>}
            </div>
            <span className="bni-lbl">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div></nav>

      <div id="toast" className="toast" style={{ display: 'none' }}></div>
    </div>
  );
}