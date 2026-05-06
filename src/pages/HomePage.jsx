import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CauseCard from '../components/CauseCard'
import DonationForm from '../components/DonationForm'

const HOW_STEPS = [
  { n: 1, title: 'Browse Causes',   desc: 'Explore verified campaigns across education, health, and environment.' },
  { n: 2, title: 'Choose Amount',   desc: 'Pick any amount — every dollar directly helps those in need.' },
  { n: 3, title: 'Donate Securely', desc: 'Your donation is processed with full security and transparency.' },
  { n: 4, title: 'See the Change',  desc: 'Track your impact and get updates from the campaigns you support.' },
]
const TRUST_ITEMS = [
  { icon: 'fa-shield-alt',   title: '100% Secure',         desc: 'Your payment info is encrypted and protected.' },
  { icon: 'fa-check-circle', title: 'Verified Campaigns',  desc: 'All campaigns are reviewed by our admin team.' },
  { icon: 'fa-eye',          title: 'Full Transparency',   desc: 'See exactly where your money goes.' },
  { icon: 'fa-undo',         title: 'Tax Receipt',         desc: 'Get a receipt for your donation instantly.' },
]
const TESTIMONIALS = [
  { stars: 5, text: 'HopeBridge makes giving transparent — I see exactly where my donation goes. Amazing platform!', author: 'Amanda R.' },
  { stars: 5, text: 'I started a campaign for clean water and the support was overwhelming. This platform works!',   author: 'Marcus T.' },
  { stars: 5, text: 'The admin team is responsive and every campaign feels legitimate. I trust HopeBridge completely.', author: 'Priya S.' },
]

export default function HomePage() {
  const { approvedCampaigns, totalFunds, loadCampaigns, openAuth } = useApp()
  const navigate = useNavigate()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => { loadCampaigns() }, [])

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
            <div className="hero-badge"><i className="fas fa-star"></i> Making A Real Difference</div>
            <h1>Every Contribution <br />Builds A Brighter <span className="highlight">Tomorrow</span></h1>
            <p>Join thousands of donors empowering education, healthcare, and clean water across the globe.</p>
            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-num">{approvedCampaigns.length}</div>
                <div className="hero-stat-lbl">Active Projects</div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat-item">
                <div className="hero-stat-num">${(totalFunds / 1000).toFixed(1)}K</div>
                <div className="hero-stat-lbl">Funds Raised</div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat-item">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-lbl">Transparent</div>
              </div>
            </div>
            <div className="hero-cta">
              <button className="btn-hero-primary" onClick={() => scrollTo('donate')}><i className="fas fa-hand-holding-heart"></i> Donate Now</button>
              <button className="btn-hero-outline" onClick={() => scrollTo('causes')}><i className="fas fa-search"></i> Browse Causes</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-label">Total Raised</div>
              <div className="hero-card-value">${totalFunds.toLocaleString()}</div>
              <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)', marginTop: 4 }}>Across all active campaigns</div>
            </div>
            <div className="mini-cards">
              {[['89%','Efficiency'],['14K+','Lives'],['120+','Projects'],['100%','Transparent']].map(([n,l]) => (
                <div key={l} className="mini-card"><div className="mini-card-num">{n}</div><div className="mini-card-lbl">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-wrap">
        <div className="container-inner">
          <div className="text-center">
            <div className="section-tag"><i className="fas fa-info-circle"></i> How It Works</div>
            <h2 className="section-title">Simple Steps to <span className="accent">Make an Impact</span></h2>
            <div className="section-divider mx-auto"></div>
          </div>
          <div className="row mt-4">
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
          <div className="section-tag"><i className="fas fa-heart"></i> Active Causes</div>
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
          <div className="parallax-tag"><i className="fas fa-chart-line"></i> Our Impact</div>
          <h2>Where Your Money <span style={{ color: 'var(--primary-light)' }}>Goes</span></h2>
          <p>We operate with 100% transparency. Every cent is tracked and reported.</p>
          <button className="btn-hero-primary" onClick={() => scrollTo('donate')}><i className="fas fa-donate"></i> Donate Now</button>
          <div className="parallax-stats">
            {[['89%','Program Efficiency'],['14K+','Lives Impacted'],['120+','Projects Funded'],['100%','Transparency']].map(([n,l]) => (
              <div key={l} className="pstat">
                <div className="pstat-num"><span className="counter-accent">{n}</span></div>
                <div className="pstat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION FORM */}
      <section id="donate" className="donation-section">
        <div className="container-inner">
          <div className="section-tag"><i className="fas fa-gift"></i> Make A Donation</div>
          <h2 className="section-title mb-0">Give <span className="accent">Today</span></h2>
          <div className="section-divider"></div>
          <div className="donation-wrapper">
            <div className="donation-info">
              <h2>Your Generosity <span style={{ color: 'var(--primary)' }}>Transforms Lives</span></h2>
              <p>Select a campaign, enter your details, and help make the world a better place.</p>
              <div className="trust-items">
                {TRUST_ITEMS.map(t => (
                  <div key={t.title} className="trust-item">
                    <div className="trust-icon"><i className={`fas ${t.icon}`}></i></div>
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
            <div className="section-tag"><i className="fas fa-quote-right"></i> Testimonials</div>
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
              <i className="fas fa-plus"></i> Start a Campaign
            </button>
            <button className="cta-strip-btn-white" onClick={() => scrollTo('donate')}>Donate Now <i className="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo"><i className="fas fa-heart"></i> HopeBridge</div>
            <p style={{ fontSize: '.88rem', lineHeight: 1.8, maxWidth: 240 }}>Empowering communities through transparent giving.</p>
            <div className="social-icons">
              {['facebook-f','twitter','instagram','linkedin-in'].map(icon => (<a key={icon} href="#"><i className={`fab fa-${icon}`}></i></a>))}
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
              <li><a onClick={() => openAuth('register', 'donor')}>Donor </a></li>
              <li><a onClick={() => openAuth('register', 'creator')}>Campaign Creator</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li><a>hello@hopebridge.org</a></li>
              <li><a>+1 (555) 123-4567</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 HopeBridge — Nonprofit. All Rights Reserved.</p>
          <p>Made with <span style={{ color: 'var(--primary)' }}>❤</span> for a better world</p>
        </div>
      </footer>
    </>
  )
}