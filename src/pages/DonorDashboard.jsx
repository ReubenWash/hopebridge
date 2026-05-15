import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { donationApi } from '../services/api'
import DonationForm from '../components/DonationForm'
import CauseCard from '../components/CauseCard'

export default function DonorDashboard() {
  const {
    currentUser, approvedCampaigns, loadCampaigns,
    openAuth, totalFunds, walletBalance,
  } = useApp()
  const navigate = useNavigate()

  const [donations, setDonations] = useState([])
  const [loadingDons, setLoadingDons] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const CATEGORIES = ['Education','Water','Health','Environment','Food','Shelter','General']

  useEffect(() => {
    loadCampaigns()
  }, [])

  useEffect(() => {
    if (currentUser) loadMyDonations()
  }, [currentUser])

  const loadMyDonations = async () => {
    setLoadingDons(true)
    try {
      const res = await donationApi.getMyDonations()
      setDonations(res.donations || [])
    } catch { /* ignore */ }
    finally { setLoadingDons(false) }
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const filtered = approvedCampaigns.filter(c => {
    const matchSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat    = !selectedCategory || c.category === selectedCategory
    return matchSearch && matchCat
  })

  const totalDonated = donations.reduce((s, d) => s + parseFloat(d.amount || 0), 0)

  const HOW_STEPS = [
    { n:1, title:'Browse Causes',   desc:'Explore verified campaigns across education, health, environment and more.' },
    { n:2, title:'Choose Amount',   desc:'Pick any amount — every dollar directly helps those in need.' },
    { n:3, title:'Donate Securely', desc:'Pay via PayPal or your HopeBridge wallet with full security.' },
    { n:4, title:'See the Change',  desc:'Track your impact and get updates from the campaigns you support.' },
  ]
  const TRUST_ITEMS = [
    { icon:'🛡', title:'100% Secure',        desc:'Encrypted and protected payments.' },
    { icon:'✅', title:'Verified Campaigns', desc:'All campaigns reviewed by our team.' },
    { icon:'👁', title:'Full Transparency',  desc:'See exactly where your money goes.' },
    { icon:'📧', title:'Tax Receipt',        desc:'Get your receipt instantly.' },
  ]
  const TESTIMONIALS = [
    { stars:5, text:'HopeBridge makes giving transparent — I see exactly where my donation goes. Amazing!', author:'Amanda R.' },
    { stars:5, text:'I supported a clean water campaign and got real updates. This platform works!', author:'Marcus T.' },
    { stars:5, text:'Every campaign feels legitimate. I trust HopeBridge completely.', author:'Priya S.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
        position: 'relative', overflow: 'hidden',
        minHeight: 500, display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1400&h=700&fit=crop)',
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12,
        }} />
        {/* Decorative circles */}
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(232,83,30,0.12)', top:-100, right:-100 }} />
        <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'rgba(232,83,30,0.08)', bottom:50, left:'5%' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'70px 24px', width:'100%', position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:60, flexWrap:'wrap' }}>
            <div style={{ flex:'1.2', minWidth:280 }}>
              {/* Welcome badge for logged-in donors */}
              {currentUser ? (
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'rgba(29,158,117,0.2)', border:'1px solid rgba(29,158,117,0.4)',
                  color:'#4ade80', padding:'7px 18px', borderRadius:30,
                  fontSize:'0.82rem', fontWeight:700, marginBottom:20, letterSpacing:1,
                  textTransform:'uppercase',
                }}>
                  👋 Welcome back, {currentUser.name.split(' ')[0]}!
                </div>
              ) : (
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'rgba(232,83,30,0.2)', border:'1px solid rgba(232,83,30,0.4)',
                  color:'#f47c50', padding:'7px 18px', borderRadius:30,
                  fontSize:'0.82rem', fontWeight:700, marginBottom:20, letterSpacing:1,
                  textTransform:'uppercase',
                }}>
                  ⭐ Making A Real Difference
                </div>
              )}

              <h1 style={{
                fontFamily:'Raleway,sans-serif', fontWeight:900,
                fontSize:'clamp(2rem,5vw,3.2rem)', lineHeight:1.15,
                color:'#fff', marginBottom:16,
              }}>
                Every Contribution <br />
                Builds A Brighter <span style={{ color:'#f47c50' }}>Tomorrow</span>
              </h1>
              <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,0.72)', marginBottom:28, maxWidth:480 }}>
                Join thousands of donors empowering education, healthcare, and clean water across the globe.
              </p>

              {/* Stats row */}
              <div style={{ display:'flex', gap:32, flexWrap:'wrap', alignItems:'center', marginBottom:32 }}>
                {[
                  [approvedCampaigns.length, 'Active Projects'],
                  [`$${(totalFunds/1000).toFixed(1)}K`, 'Funds Raised'],
                  ['100%', 'Transparent'],
                  ...(currentUser ? [[`$${walletBalance.toFixed(0)}`, 'Your Wallet']] : []),
                ].map(([n,l],i) => (
                  <div key={i} style={{ textAlign:'left' }}>
                    <div style={{ fontSize:'2rem', fontWeight:900, color:'#f47c50', fontFamily:'Raleway,sans-serif', lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'.5px', marginTop:3 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                <button
                  onClick={() => scrollTo('causes')}
                  style={{
                    background:'linear-gradient(135deg,#e8531e,#f47c50)',
                    color:'#fff', border:'none', padding:'14px 30px', borderRadius:6,
                    fontWeight:700, fontSize:'1rem', cursor:'pointer',
                    fontFamily:'Raleway,sans-serif', textTransform:'uppercase', letterSpacing:'.5px',
                    boxShadow:'0 8px 30px rgba(232,83,30,0.3)',
                  }}
                >
                  ❤ Donate Now
                </button>
                {!currentUser && (
                  <button
                    onClick={() => openAuth('register','donor')}
                    style={{
                      background:'transparent', border:'2px solid rgba(255,255,255,0.4)',
                      color:'#fff', padding:'12px 28px', borderRadius:6,
                      fontWeight:700, fontSize:'0.9rem', cursor:'pointer',
                      fontFamily:'Raleway,sans-serif', textTransform:'uppercase', letterSpacing:'.5px',
                    }}
                  >
                    🔑 Join Free
                  </button>
                )}
              </div>
            </div>

            {/* Right stats card */}
            <div style={{ flex:'.9', minWidth:240 }}>
              <div style={{
                background:'rgba(255,255,255,0.07)', backdropFilter:'blur(10px)',
                border:'1px solid rgba(255,255,255,0.12)', borderRadius:18,
                padding:24, marginBottom:14, color:'#fff',
              }}>
                <div style={{ fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:1, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>
                  Total Raised
                </div>
                <div style={{ fontFamily:'Raleway,sans-serif', fontSize:'1.6rem', fontWeight:800 }}>
                  ${totalFunds.toLocaleString()}
                </div>
                <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', marginTop:4 }}>
                  Across all active campaigns
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[['89%','Efficiency'],['14K+','Lives'],['120+','Projects'],['100%','Trust']].map(([n,l]) => (
                  <div key={l} style={{
                    background:'rgba(232,83,30,0.15)', border:'1px solid rgba(232,83,30,0.25)',
                    borderRadius:12, padding:'14px 12px', color:'#fff', textAlign:'center',
                  }}>
                    <div style={{ fontSize:'1.25rem', fontWeight:800, color:'#f47c50', fontFamily:'Raleway,sans-serif' }}>{n}</div>
                    <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:.5 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Donor stats bar (logged-in only) ── */}
      {currentUser && (
        <div style={{
          background:'linear-gradient(135deg,#0F6E56,#1D9E75)',
          padding:'14px 24px',
        }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:32, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.85rem', fontWeight:600 }}>
              Your Activity
            </div>
            {[
              ['💰', `$${walletBalance.toFixed(2)}`, 'Wallet Balance'],
              ['❤', donations.length, 'Total Donations'],
              ['📊', `$${totalDonated.toFixed(2)}`, 'Amount Given'],
            ].map(([icon, val, label]) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ fontSize:'1.2rem' }}>{icon}</div>
                <div>
                  <div style={{ fontWeight:800, color:'#fff', fontSize:'1rem', fontFamily:'Raleway,sans-serif' }}>{val}</div>
                  <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:.5 }}>{label}</div>
                </div>
              </div>
            ))}
            {currentUser && (
              <button
                onClick={() => setActiveTab(activeTab === 'history' ? 'home' : 'history')}
                style={{
                  marginLeft:'auto', background:'rgba(255,255,255,0.15)',
                  border:'1px solid rgba(255,255,255,0.3)', color:'#fff',
                  borderRadius:8, padding:'8px 16px', cursor:'pointer',
                  fontSize:'0.85rem', fontWeight:700, fontFamily:'inherit',
                }}
              >
                {activeTab === 'history' ? 'Back to Home' : 'My Donations →'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── MY DONATIONS VIEW ── */}
      {activeTab === 'history' && currentUser && (
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'48px 24px' }}>
          <h2 style={{ fontFamily:'Raleway,sans-serif', fontSize:'1.8rem', color:'#1a1a2e', marginBottom:24 }}>
            My Donation History
          </h2>
          {loadingDons ? (
            <p style={{ color:'#9ca3af' }}>Loading…</p>
          ) : donations.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'#9ca3af' }}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>❤</div>
              <p>You haven't donated yet. Browse campaigns below and make a difference!</p>
              <button
                onClick={() => setActiveTab('home')}
                style={{
                  marginTop:16, background:'linear-gradient(135deg,#e8531e,#f47c50)',
                  color:'#fff', border:'none', padding:'12px 28px', borderRadius:8,
                  cursor:'pointer', fontWeight:700, fontFamily:'inherit',
                }}
              >
                Browse Causes
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                background:'linear-gradient(135deg,#e1f5ee,#f0fdf4)',
                borderRadius:16, padding:'20px 24px', marginBottom:28,
                display:'flex', gap:32, flexWrap:'wrap',
              }}>
                <div>
                  <div style={{ fontSize:'0.78rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Total Given</div>
                  <div style={{ fontSize:'2rem', fontWeight:800, color:'#0F6E56', fontFamily:'Raleway,sans-serif' }}>
                    ${totalDonated.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:'0.78rem', color:'#6b7280', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Donations Made</div>
                  <div style={{ fontSize:'2rem', fontWeight:800, color:'#0F6E56', fontFamily:'Raleway,sans-serif' }}>
                    {donations.length}
                  </div>
                </div>
              </div>

              <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.9rem' }}>
                  <thead>
                    <tr style={{ background:'#f9fafb' }}>
                      {['Date','Campaign','Amount','Method','Monthly'].map(h => (
                        <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontWeight:700, color:'#6b7280', fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:.5, borderBottom:'1px solid #f3f4f6' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.id} style={{ borderBottom:'1px solid #f9fafb' }}>
                        <td style={{ padding:'13px 16px', color:'#6b7280' }}>
                          {new Date(d.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding:'13px 16px', fontWeight:600, color:'#1a1a2e' }}>
                          {d.campaign_title || '—'}
                        </td>
                        <td style={{ padding:'13px 16px', fontWeight:700, color:'#0F6E56' }}>
                          ${parseFloat(d.amount).toFixed(2)}
                        </td>
                        <td style={{ padding:'13px 16px' }}>
                          <span style={{
                            background: d.payment_method === 'paypal' ? '#eff6ff' : '#e1f5ee',
                            color: d.payment_method === 'paypal' ? '#1d4ed8' : '#0F6E56',
                            borderRadius:20, padding:'2px 10px', fontSize:'0.78rem', fontWeight:700,
                          }}>
                            {d.payment_method || 'card'}
                          </span>
                        </td>
                        <td style={{ padding:'13px 16px' }}>
                          {d.is_monthly ? '✅' : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MAIN HOME CONTENT ── */}
      {activeTab === 'home' && (
        <>
          {/* HOW IT WORKS */}
          <section id="how-it-works" style={{ padding:'80px 0', background:'#fff' }}>
            <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
              <div style={{ textAlign:'center', marginBottom:48 }}>
                <div className="section-tag"><i className="fas fa-info-circle"></i> How It Works</div>
                <h2 className="section-title">Simple Steps to <span className="accent">Make an Impact</span></h2>
                <div className="section-divider" style={{ margin:'16px auto 0' }}></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:24 }}>
                {HOW_STEPS.map(s => (
                  <div key={s.n} style={{ textAlign:'center', padding:'24px 16px' }}>
                    <div style={{
                      width:60, height:60, borderRadius:'50%',
                      background:'linear-gradient(135deg,#e8531e,#f47c50)',
                      color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'1.4rem', fontWeight:900, margin:'0 auto 16px',
                      fontFamily:'Raleway,sans-serif', boxShadow:'0 8px 24px rgba(232,83,30,0.25)',
                    }}>
                      {s.n}
                    </div>
                    <h4 style={{ fontFamily:'Raleway,sans-serif', color:'#1a1a2e', marginBottom:8 }}>{s.title}</h4>
                    <p style={{ color:'#6b7280', fontSize:'0.88rem', lineHeight:1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CAUSES */}
          <section id="causes" style={{ padding:'80px 0', background:'#f8f9fa' }}>
            <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
              <div className="section-tag"><i className="fas fa-heart"></i> Active Causes</div>
              <h2 className="section-title">
                Urgent Causes <span className="accent">You Can Change</span>
              </h2>
              <div className="section-divider"></div>

              {/* Search & filter */}
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 }}>
                <input
                  type="text"
                  placeholder="🔍 Search campaigns..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    flex:1, minWidth:200, padding:'11px 16px',
                    border:'2px solid #e5e7eb', borderRadius:10,
                    fontSize:'0.95rem', fontFamily:'inherit', outline:'none',
                  }}
                />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{
                    padding:'11px 16px', border:'2px solid #e5e7eb', borderRadius:10,
                    fontSize:'0.95rem', fontFamily:'inherit', outline:'none',
                    background:'#fff', cursor:'pointer',
                  }}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign:'center', padding:'60px 0', color:'#9ca3af' }}>
                  {approvedCampaigns.length === 0 ? 'No active campaigns yet.' : 'No campaigns match your search.'}
                </div>
              ) : (
                <div className="cards-grid">
                  {filtered.map(c => (
                    <CauseCard
                      key={c.id}
                      campaign={c}
                      onDonate={() => scrollTo('donate')}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* IMPACT PARALLAX */}
          <section id="impact" className="parallax-banner">
            <div className="parallax-content container-inner">
              <div className="parallax-tag"><i className="fas fa-chart-line"></i> Our Impact</div>
              <h2>Where Your Money <span style={{ color:'var(--primary-light)' }}>Goes</span></h2>
              <p>We operate with 100% transparency. Every cent is tracked and reported.</p>
              <button
                onClick={() => scrollTo('donate')}
                style={{
                  background:'linear-gradient(135deg,#e8531e,#f47c50)',
                  color:'#fff', border:'none', padding:'14px 32px', borderRadius:6,
                  fontWeight:700, fontSize:'1rem', cursor:'pointer',
                  fontFamily:'Raleway,sans-serif', textTransform:'uppercase',
                }}
              >
                ❤ Donate Now
              </button>
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
          <section id="donate" style={{ padding:'80px 0', background:'#f8f9fa' }}>
            <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
              <div className="section-tag"><i className="fas fa-gift"></i> Make A Donation</div>
              <h2 className="section-title mb-0">
                Give <span className="accent">Today</span>
              </h2>
              <div className="section-divider"></div>
              <div className="donation-wrapper">
                <div className="donation-info">
                  <h2>Your Generosity <span style={{ color:'var(--primary)' }}>Transforms Lives</span></h2>
                  <p>Select a campaign, enter your details, and help make the world a better place.</p>
                  <div className="trust-items">
                    {TRUST_ITEMS.map(t => (
                      <div key={t.title} className="trust-item">
                        <div className="trust-icon" style={{ fontSize:'1.3rem' }}>{t.icon}</div>
                        <div className="trust-text">
                          <strong>{t.title}</strong>
                          <span>{t.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <DonationForm />
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section style={{ padding:'80px 0', background:'#fff' }}>
            <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
              <div style={{ textAlign:'center', marginBottom:48 }}>
                <div className="section-tag"><i className="fas fa-quote-right"></i> Testimonials</div>
                <h2 className="section-title">What Our <span className="accent">Donors Say</span></h2>
                <div className="section-divider" style={{ margin:'16px auto 0' }}></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
                {TESTIMONIALS.map(t => (
                  <div key={t.author} className="testimonial-card">
                    <div className="stars">{'★'.repeat(t.stars)}</div>
                    <p className="testimonial-text">"{t.text}"</p>
                    <div className="testimonial-author">— {t.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA STRIP */}
          <section className="cta-strip">
            <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', textAlign:'center' }}>
              <h2>Ready to Make a Difference?</h2>
              <p>Start your campaign today or donate to an existing cause.</p>
              <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
                <button
                  className="btn-hero-outline"
                  style={{ borderColor:'rgba(255,255,255,.8)' }}
                  onClick={() => openAuth('register','creator')}
                >
                  <i className="fas fa-plus"></i> Start a Campaign
                </button>
                <button className="cta-strip-btn-white" onClick={() => scrollTo('donate')}>
                  Donate Now <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="site-footer">
            <div className="footer-inner">
              <div>
                <div className="footer-logo"><i className="fas fa-heart"></i> HopeBridge</div>
                <p style={{ fontSize:'.88rem', lineHeight:1.8, maxWidth:240 }}>
                  Empowering communities through transparent giving.
                </p>
                <div className="social-icons">
                  {['facebook-f','twitter','instagram','linkedin-in'].map(icon => (
                    <a key={icon} href="#"><i className={`fab fa-${icon}`}></i></a>
                  ))}
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
                <h4>Join Us</h4>
                <ul className="footer-links">
                  <li><a onClick={() => openAuth('register','donor')}>Become a Donor</a></li>
                  <li><a onClick={() => openAuth('register','creator')}>Start a Campaign</a></li>
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
              <p>Made with <span style={{ color:'var(--primary)' }}>❤</span> for a better world</p>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}