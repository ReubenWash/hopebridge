import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { publicApi } from '../services/api'
import CauseCard from '../components/CauseCard'
import DonationForm from '../components/DonationForm'
import {
  Star,
  Heart,
  HandHeart,
  Search,
  Info,
  Gift,
  Quote,
  Plus,
  ArrowRight,
  Shield,
  CheckCircle,
  Eye,
  Receipt,
  BarChart,
  Users,
  Award,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Zap,
  Sparkles,
  Target,
  ChevronRight
} from 'lucide-react'

// Static content that doesn't need to be dynamic
const HOW_STEPS = [
  { n: 1, title: 'Browse Causes', desc: 'Explore verified campaigns across education, health, and environment.', icon: <Search size={24} /> },
  { n: 2, title: 'Choose Amount', desc: 'Pick any amount — every dollar directly helps those in need.', icon: <DollarSign size={24} /> },
  { n: 3, title: 'Donate Securely', desc: 'Your donation is processed with full security and transparency.', icon: <Shield size={24} /> },
  { n: 4, title: 'See the Change', desc: 'Track your impact and get updates from the campaigns you support.', icon: <TrendingUp size={24} /> },
]

const TRUST_ITEMS = [
  { icon: <Shield size={20} />, title: '100% Secure', desc: 'Your payment info is encrypted and protected.' },
  { icon: <CheckCircle size={20} />, title: 'Verified Campaigns', desc: 'All campaigns are reviewed by our admin team.' },
  { icon: <Eye size={20} />, title: 'Full Transparency', desc: 'See exactly where your money goes.' },
  { icon: <Receipt size={20} />, title: 'Tax Receipt', desc: 'Get a receipt for your donation instantly.' },
]

const TESTIMONIALS = [
  { stars: 5, text: 'HopeBridge makes giving transparent — I see exactly where my donation goes. Amazing platform!', author: 'Amanda R.', role: 'Regular Donor' },
  { stars: 5, text: 'I started a campaign for clean water and the support was overwhelming. This platform works!', author: 'Marcus T.', role: 'Campaign Creator' },
  { stars: 5, text: 'The admin team is responsive and every campaign feels legitimate. I trust HopeBridge completely.', author: 'Priya S.', role: 'Monthly Donor' },
]

// Global style injection
let stylesInjected = false
const injectStyles = () => {
  if (stylesInjected) return
  stylesInjected = true
  const styleEl = document.createElement('style')
  styleEl.textContent = `
    :root {
      --primary: #e8531e;
      --primary-dark: #c4400f;
      --primary-light: #f47c50;
      --secondary: #27a96c;
      --dark: #1a1a2e;
      --text: #444;
      --text-light: #777;
      --bg-light: #f8f9fa;
      --grad1: linear-gradient(135deg, #e8531e 0%, #f47c50 50%, #e8531e 100%);
      --grad2: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      --shadow: 0 8px 30px rgba(232, 83, 30, 0.18);
      --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Open Sans', sans-serif; color: var(--text); line-height: 1.7; background: #fff; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Raleway', sans-serif; font-weight: 700; }
    
    /* Hero Section */
    .hero {
      background: var(--grad2);
      position: relative;
      overflow: hidden;
      min-height: 600px;
      display: flex;
      align-items: center;
    }
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1400&h=700&fit=crop') center/cover;
      opacity: .15;
    }
    .hero-shapes { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .hero-shape { position: absolute; border-radius: 50%; background: rgba(232,83,30,.15); }
    .hero-shape.s1 { width: 400px; height: 400px; top: -100px; right: -100px; }
    .hero-shape.s2 { width: 200px; height: 200px; bottom: 50px; left: 5%; }
    .hero-shape.s3 { width: 120px; height: 120px; top: 30%; right: 30%; }
    .hero-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 24px;
      display: flex;
      align-items: center;
      gap: 60px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
      width: 100%;
    }
    .hero-content { flex: 1.2; min-width: 280px; }
    .hero-badge {
      background: rgba(232,83,30,.2);
      border: 1px solid rgba(232,83,30,.4);
      color: #f47c50;
      padding: 7px 18px;
      border-radius: 30px;
      font-size: .82rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .hero-content h1 {
      font-size: clamp(2.2rem, 5vw, 3.6rem);
      line-height: 1.15;
      margin-bottom: 18px;
      color: #fff;
      font-weight: 900;
    }
    .hero-content h1 .highlight { color: var(--primary-light); }
    .hero-content p {
      font-size: 1.05rem;
      color: rgba(255,255,255,.75);
      margin-bottom: 32px;
      max-width: 500px;
    }
    .hero-stats { display: flex; gap: 36px; margin-bottom: 36px; flex-wrap: wrap; align-items: center; }
    .hero-stat-item { text-align: left; }
    .hero-stat-num { font-size: 2rem; font-weight: 900; color: var(--primary-light); font-family: 'Raleway', sans-serif; line-height: 1; }
    .hero-stat-lbl { font-size: .8rem; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: .5px; margin-top: 3px; }
    .hero-stat-divider { width: 1px; background: rgba(255,255,255,.15); align-self: stretch; }
    .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
    .btn-hero-primary {
      background: var(--grad1);
      color: #fff;
      border: none;
      padding: 14px 32px;
      border-radius: 40px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all .25s;
      box-shadow: var(--shadow);
      font-family: 'Raleway', sans-serif;
      text-transform: uppercase;
      letter-spacing: .5px;
    }
    .btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(232,83,30,.35); }
    .btn-hero-outline {
      background: transparent;
      border: 2px solid rgba(255,255,255,.4);
      color: #fff;
      padding: 12px 30px;
      border-radius: 40px;
      font-weight: 700;
      font-size: .9rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all .2s;
      font-family: 'Raleway', sans-serif;
      text-transform: uppercase;
      letter-spacing: .5px;
    }
    .btn-hero-outline:hover { border-color: #fff; background: rgba(255,255,255,.1); }
    .hero-visual { flex: .9; min-width: 260px; }
    .hero-card {
      background: rgba(255,255,255,.08);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 16px;
      color: #fff;
    }
    .hero-card-label { font-size: .75rem; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,.5); margin-bottom: 8px; }
    .hero-card-value { font-size: 1.6rem; font-weight: 800; font-family: 'Raleway', sans-serif; }
    .mini-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .mini-card {
      background: rgba(232,83,30,.15);
      border: 1px solid rgba(232,83,30,.25);
      border-radius: 14px;
      padding: 16px;
      color: #fff;
      text-align: center;
    }
    .mini-card-num { font-size: 1.3rem; font-weight: 800; font-family: 'Raleway', sans-serif; color: var(--primary-light); }
    .mini-card-lbl { font-size: .72rem; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: .5px; }
    
    /* Section Common */
    .section-wrap { padding: 90px 0; }
    .section-wrap.bg-light { background: var(--bg-light); }
    .container-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(232,83,30,.1);
      color: var(--primary);
      padding: 5px 16px;
      border-radius: 30px;
      font-size: .78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }
    .section-title {
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      color: var(--dark);
      margin-bottom: 12px;
      line-height: 1.25;
    }
    .section-title .accent { color: var(--primary); }
    .section-sub { color: var(--text-light); font-size: 1rem; margin-bottom: 48px; max-width: 560px; }
    .section-divider {
      width: 60px;
      height: 4px;
      background: var(--grad1);
      border-radius: 4px;
      margin: 16px 0 40px;
    }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .text-center { text-align: center; }
    .row { display: flex; flex-wrap: wrap; margin: -12px; }
    .col-md-3 { width: 25%; padding: 12px; }
    .col-6 { width: 50%; padding: 12px; }
    @media (max-width: 768px) { .col-md-3 { width: 50%; } }
    
    /* How It Works */
    .how-item { text-align: center; padding: 24px 20px; background: white; border-radius: 20px; transition: transform 0.3s; height: 100%; }
    .how-item:hover { transform: translateY(-5px); box-shadow: var(--shadow-card); }
    .how-num {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--grad1);
      color: #fff;
      font-size: 1.5rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
      font-family: 'Raleway', sans-serif;
      box-shadow: var(--shadow);
    }
    .how-item h4 { font-size: 1.05rem; color: var(--dark); margin-bottom: 8px; }
    .how-item p { font-size: .88rem; color: var(--text-light); }
    
    /* Causes Grid */
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 30px; }
    
    /* Parallax Banner */
    .parallax-banner {
      background: url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&h=500&fit=crop') center/cover fixed;
      position: relative;
      padding: 100px 0;
      text-align: center;
    }
    .parallax-banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(232,83,30,.88), rgba(26,26,46,.92));
    }
    .parallax-content { position: relative; z-index: 1; color: #fff; }
    .parallax-content h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin-bottom: 16px; font-weight: 900; }
    .parallax-content p { font-size: 1.1rem; opacity: .85; margin-bottom: 36px; max-width: 600px; margin-left: auto; margin-right: auto; }
    .parallax-stats { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; margin-top: 50px; }
    .pstat { text-align: center; }
    .pstat-num { font-size: 3rem; font-weight: 900; font-family: 'Raleway', sans-serif; color: #fff; line-height: 1; }
    .pstat-lbl { font-size: .85rem; color: rgba(255,255,255,.7); text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }
    .counter-accent { color: var(--primary-light); }
    .parallax-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,.15);
      color: #fff;
      border: 1px solid rgba(255,255,255,.3);
      padding: 5px 16px;
      border-radius: 30px;
      font-size: .78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }
    
    /* Donation Section */
    .donation-section { background: var(--bg-light); padding: 90px 0; }
    .donation-wrapper {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 60px;
      align-items: start;
    }
    @media (max-width: 900px) { .donation-wrapper { grid-template-columns: 1fr; } }
    .donation-info { padding-top: 20px; }
    .donation-info h2 { font-size: clamp(1.6rem, 3vw, 2.2rem); color: var(--dark); margin-bottom: 14px; }
    .donation-info p { color: var(--text-light); margin-bottom: 28px; }
    .trust-items { margin-top: 28px; }
    .trust-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #eee; }
    .trust-item:last-child { border: none; }
    .trust-icon {
      width: 44px; height: 44px;
      border-radius: 50%;
      background: rgba(232,83,30,.1);
      display: flex; align-items: center; justify-content: center;
      color: var(--primary);
      flex-shrink: 0;
    }
    .trust-text strong { display: block; font-size: .9rem; color: var(--dark); }
    .trust-text span { font-size: .82rem; color: var(--text-light); }
    
    /* Testimonials */
    .testimonial-section { padding: 90px 0; background: #fff; }
    .testimonial-card {
      background: var(--bg-light);
      border-radius: 20px;
      padding: 36px;
      position: relative;
      text-align: center;
      height: 100%;
      transition: transform 0.3s;
    }
    .testimonial-card:hover { transform: translateY(-5px); }
    .testimonial-text {
      font-size: 1.05rem;
      color: var(--text);
      font-style: italic;
      margin: 12px 0 20px;
      position: relative;
      z-index: 1;
    }
    .testimonial-author { font-weight: 700; color: var(--dark); font-family: 'Raleway', sans-serif; }
    .testimonial-role { font-size: 0.8rem; color: var(--primary); margin-top: 4px; }
    .stars { color: #f59e0b; margin-bottom: 8px; }
    
    /* CTA Strip */
    .cta-strip { background: var(--grad1); padding: 64px 0; text-align: center; }
    .cta-strip h2 { color: #fff; font-size: clamp(1.6rem, 4vw, 2.4rem); margin-bottom: 14px; }
    .cta-strip p { color: rgba(255,255,255,.8); margin-bottom: 30px; font-size: 1.05rem; }
    .cta-strip-btn-white {
      background: #fff;
      color: var(--primary);
      border: none;
      padding: 14px 32px;
      border-radius: 40px;
      font-weight: 800;
      font-size: .95rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'Raleway', sans-serif;
      text-transform: uppercase;
      letter-spacing: .5px;
    }
    
    /* Footer */
    .site-footer { background: var(--dark); color: rgba(255,255,255,.6); padding: 70px 0 28px; }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
    }
    @media (max-width: 768px) { .footer-inner { grid-template-columns: 1fr 1fr; } }
    .footer-logo { font-family: 'Raleway', sans-serif; font-size: 1.5rem; font-weight: 900; color: var(--primary); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .site-footer h4 { font-size: .9rem; text-transform: uppercase; letter-spacing: 1px; color: #fff; margin-bottom: 18px; font-family: 'Raleway', sans-serif; }
    .footer-links { list-style: none; padding: 0; }
    .footer-links li { margin-bottom: 10px; }
    .footer-links a {
      color: rgba(255,255,255,.55);
      text-decoration: none;
      font-size: .88rem;
      transition: .2s;
      cursor: pointer;
    }
    .footer-links a:hover { color: var(--primary); }
    .footer-bottom {
      max-width: 1200px;
      margin: 48px auto 0;
      padding: 24px 24px 0;
      border-top: 1px solid rgba(255,255,255,.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      font-size: .83rem;
    }
    .social-icons { display: flex; gap: 12px; margin-top: 16px; }
    .social-icons a {
      width: 36px; height: 36px;
      background: rgba(255,255,255,.08);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,.6);
      text-decoration: none;
      transition: .2s;
    }
    .social-icons a:hover { background: var(--primary); color: #fff; }
    
    @media (max-width: 768px) {
      .hero-visual { display: none; }
      .parallax-stats { gap: 32px; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
    }
  `
  document.head.appendChild(styleEl)
}

export default function HomePage() {
  injectStyles()
  
  const { approvedCampaigns, totalFunds, loadCampaigns, openAuth } = useApp()
  const navigate = useNavigate()
  const [content, setContent] = useState({
    hero_title: 'Every Contribution Builds A Brighter Tomorrow',
    hero_subtitle: 'Join thousands of donors empowering education, healthcare, and clean water across the globe.',
    hero_badge: 'Making A Real Difference',
    impact_title: 'Our Impact',
    impact_subtitle: 'Where Your Money Goes',
    impact_stats: { efficiency: '89%', lives: '14K+', projects: '120+', transparency: '100%' },
    social_links: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }
  })
  const [loadingContent, setLoadingContent] = useState(true)

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => { 
    loadCampaigns()
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const data = await publicApi.getSettings()
      if (data) {
        setContent({
          hero_title: data.hero_title || content.hero_title,
          hero_subtitle: data.hero_subtitle || content.hero_subtitle,
          hero_badge: data.hero_badge || content.hero_badge,
          impact_title: data.impact_title || content.impact_title,
          impact_subtitle: data.impact_subtitle || content.impact_subtitle,
          impact_stats: data.impact_stats || content.impact_stats,
          social_links: data.social_links || content.social_links
        })
      }
    } catch (err) {
      console.error('Failed to load content:', err)
    } finally {
      setLoadingContent(false)
    }
  }

  const totalRaisedFormatted = totalFunds >= 1000000 
    ? `$${(totalFunds / 1000000).toFixed(1)}M`
    : totalFunds >= 1000 
      ? `$${(totalFunds / 1000).toFixed(1)}K`
      : `$${totalFunds.toLocaleString()}`

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-shapes">
          <div className="hero-shape s1"></div>
          <div className="hero-shape s2"></div>
          <div className="hero-shape s3"></div>
        </div>
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} /> {content.hero_badge}
            </div>
            <h1>{content.hero_title.split(' ').map((word, i) => 
              word.toLowerCase() === 'tomorrow' || word.toLowerCase() === 'difference' 
                ? <span key={i} className="highlight">{word} </span>
                : word + ' '
            )}</h1>
            <p>{content.hero_subtitle}</p>
            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-num">{approvedCampaigns.length}</div>
                <div className="hero-stat-lbl">Active Projects</div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat-item">
                <div className="hero-stat-num">{totalRaisedFormatted}</div>
                <div className="hero-stat-lbl">Funds Raised</div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat-item">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-lbl">Transparent</div>
              </div>
            </div>
            <div className="hero-cta">
              <button className="btn-hero-primary" onClick={() => scrollTo('donate')}>
                <HandHeart size={18} /> Donate Now
              </button>
              <button className="btn-hero-outline" onClick={() => scrollTo('causes')}>
                <Search size={16} /> Browse Causes
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-label">Total Raised</div>
              <div className="hero-card-value">{totalRaisedFormatted}</div>
              <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)', marginTop: 4 }}>Across all active campaigns</div>
            </div>
            <div className="mini-cards">
              <div className="mini-card"><div className="mini-card-num">{content.impact_stats.efficiency || '89%'}</div><div className="mini-card-lbl">Efficiency</div></div>
              <div className="mini-card"><div className="mini-card-num">{content.impact_stats.lives || '14K+'}</div><div className="mini-card-lbl">Lives</div></div>
              <div className="mini-card"><div className="mini-card-num">{content.impact_stats.projects || '120+'}</div><div className="mini-card-lbl">Projects</div></div>
              <div className="mini-card"><div className="mini-card-num">{content.impact_stats.transparency || '100%'}</div><div className="mini-card-lbl">Transparent</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-wrap">
        <div className="container-inner">
          <div className="text-center">
            <div className="section-tag"><Info size={14} /> How It Works</div>
            <h2 className="section-title">Simple Steps to <span className="accent">Make an Impact</span></h2>
            <div className="section-divider mx-auto"></div>
          </div>
          <div className="row">
            {HOW_STEPS.map(s => (
              <div key={s.n} className="col-md-3 col-6">
                <div className="how-item">
                  <div className="how-num">{s.n}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAUSES */}
      <section id="causes" className="section-wrap bg-light">
        <div className="container-inner">
          <div className="section-tag"><Heart size={14} /> Active Causes</div>
          <h2 className="section-title">Urgent Causes <span className="accent">You Can Change</span></h2>
          <div className="section-divider"></div>
          <p className="section-sub">Every donation goes directly to verified campaigns.</p>
          {approvedCampaigns.length === 0 ? (
            <div className="text-center p-5" style={{ color: 'var(--text-light)' }}>No active campaigns yet.</div>
          ) : (
            <div className="cards-grid">
              {approvedCampaigns.map(c => (
                <CauseCard key={c.id} campaign={c} onDonate={() => scrollTo('donate')} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* IMPACT PARALLAX */}
      <section id="impact" className="parallax-banner">
        <div className="parallax-content container-inner">
          <div className="parallax-tag"><BarChart size={14} /> {content.impact_title}</div>
          <h2>{content.impact_subtitle} <span style={{ color: 'var(--primary-light)' }}>Goes</span></h2>
          <p>We operate with 100% transparency. Every cent is tracked and reported.</p>
          <button className="btn-hero-primary" onClick={() => scrollTo('donate')}>
            <Heart size={16} /> Donate Now
          </button>
          <div className="parallax-stats">
            <div className="pstat">
              <div className="pstat-num"><span className="counter-accent">{content.impact_stats.efficiency || '89%'}</span></div>
              <div className="pstat-lbl">Program Efficiency</div>
            </div>
            <div className="pstat">
              <div className="pstat-num"><span className="counter-accent">{content.impact_stats.lives || '14K+'}</span></div>
              <div className="pstat-lbl">Lives Impacted</div>
            </div>
            <div className="pstat">
              <div className="pstat-num"><span className="counter-accent">{content.impact_stats.projects || '120+'}</span></div>
              <div className="pstat-lbl">Projects Funded</div>
            </div>
            <div className="pstat">
              <div className="pstat-num"><span className="counter-accent">{content.impact_stats.transparency || '100%'}</span></div>
              <div className="pstat-lbl">Transparency</div>
            </div>
          </div>
        </div>
      </section>

      {/* DONATION FORM */}
      <section id="donate" className="donation-section">
        <div className="container-inner">
          <div className="section-tag"><Gift size={14} /> Make A Donation</div>
          <h2 className="section-title mb-0">Give <span className="accent">Today</span></h2>
          <div className="section-divider"></div>
          <div className="donation-wrapper">
            <div className="donation-info">
              <h2>Your Generosity <span style={{ color: 'var(--primary)' }}>Transforms Lives</span></h2>
              <p>Select a campaign, enter your details, and help make the world a better place.</p>
              <div className="trust-items">
                {TRUST_ITEMS.map(t => (
                  <div key={t.title} className="trust-item">
                    <div className="trust-icon">{t.icon}</div>
                    <div className="trust-text"><strong>{t.title}</strong><span>{t.desc}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <DonationForm />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonial-section">
        <div className="container-inner">
          <div className="text-center mb-5">
            <div className="section-tag"><Quote size={14} /> Testimonials</div>
            <h2 className="section-title">What Our <span className="accent">Donors Say</span></h2>
            <div className="section-divider mx-auto"></div>
          </div>
          <div className="row g-4 justify-content-center">
            {TESTIMONIALS.map(t => (
              <div key={t.author} className="col-md-4">
                <div className="testimonial-card">
                  <div className="stars">{'★'.repeat(t.stars)}</div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">— {t.author}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="cta-strip">
        <div className="container-inner">
          <h2>Ready to Make a Difference?</h2>
          <p>Start your campaign today or donate to an existing cause.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-hero-outline" 
              style={{ borderColor: 'rgba(255,255,255,.8)' }} 
              onClick={() => openAuth('register', 'creator')}
            >
              <Plus size={16} /> Start a Campaign
            </button>
            <button className="cta-strip-btn-white" onClick={() => scrollTo('donate')}>
              Donate Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo"><Heart size={20} /> HopeBridge</div>
            <p style={{ fontSize: '.88rem', lineHeight: 1.8, maxWidth: 240 }}>Empowering communities through transparent giving.</p>
            <div className="social-icons">
              <a href={content.social_links?.facebook || '#'} target="_blank" rel="noopener noreferrer"><Facebook size={16} /></a>
              <a href={content.social_links?.twitter || '#'} target="_blank" rel="noopener noreferrer"><Twitter size={16} /></a>
              <a href={content.social_links?.instagram || '#'} target="_blank" rel="noopener noreferrer"><Instagram size={16} /></a>
              <a href={content.social_links?.linkedin || '#'} target="_blank" rel="noopener noreferrer"><Linkedin size={16} /></a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><a onClick={() => scrollTo('causes')}>Active Causes</a></li>
              <li><a onClick={() => scrollTo('how-it-works')}>How It Works</a></li>
              <li><a onClick={() => scrollTo('impact')}>Our Impact</a></li>
            </ul>
          </div>
          <div>
            <h4>Sign In As</h4>
            <ul className="footer-links">
              <li><a onClick={() => openAuth('register', 'donor')}>Donor</a></li>
              <li><a onClick={() => openAuth('register', 'creator')}>Campaign Creator</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:hello@hopebridge.org"><Mail size={12} /> hello@hopebridge.org</a></li>
              <li><a href="tel:+15551234567"><Phone size={12} /> +1 (555) 123-4567</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HopeBridge — Nonprofit. All Rights Reserved.</p>
          <p>Made with <span style={{ color: 'var(--primary)' }}>❤</span> for a better world</p>
        </div>
      </footer>
    </>
  )
}