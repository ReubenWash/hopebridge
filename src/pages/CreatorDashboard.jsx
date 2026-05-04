import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CampaignModal from '../components/CampaignModal'
import DonationsModal from '../components/DonationsModal'
import { donationApi } from '../services/api'

export default function CreatorDashboard() {
  const { currentUser, myCampaigns, loadMyCampaigns, deleteCampaign, logout, showToast } = useApp()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [editCampaign, setEditCampaign] = useState(null)
  const [viewDonations, setViewDonations] = useState(null)
  const [activeTab, setActiveTab] = useState('campaigns')
  const [paymentMethod, setPaymentMethod] = useState({ paypal_email: '' })
  const [loadingPayment, setLoadingPayment] = useState(false)

  useEffect(() => {
    if (!currentUser) { navigate('/'); return }
    if (currentUser.role !== 'creator') { navigate('/'); return }
    loadMyCampaigns()
    loadPaymentMethod()
  }, [currentUser])

  const loadPaymentMethod = async () => {
    try {
      const res = await donationApi.getCreatorPaymentMethod()
      if (res.payment_method) setPaymentMethod(res.payment_method)
    } catch { /* ignore */ }
  }

  const savePaymentMethod = async (e) => {
    e.preventDefault()
    setLoadingPayment(true)
    try {
      await donationApi.saveCreatorPaymentMethod(paymentMethod)
      showToast('Payment method saved')
    } catch (err) { showToast(err.message, true) }
    finally { setLoadingPayment(false) }
  }

  if (!currentUser || currentUser.role !== 'creator') return null

  const totalRaised = myCampaigns.reduce((s, c) => s + parseFloat(c.raised || 0), 0)
  const initials = (currentUser.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleLogout = () => { logout(); navigate('/') }
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return
    await deleteCampaign(id)
  }

  return (
    <div className="dash-layout">
      {/* Sidebar (desktop) */}
      <div className="dash-sidebar">
        <div className="ds-logo">
          <div className="logo" style={{ fontSize: '1.2rem', cursor:'pointer' }} onClick={() => navigate('/')}>
            <i className="fas fa-heart" style={{ fontSize: '1rem' }}></i> Hope<span>Bridge</span>
          </div>
        </div>
        <div className="ds-user">
          <div className="ds-avatar">{initials}</div>
          <h5>{currentUser.name}</h5>
          <small>{currentUser.email}</small>
        </div>
        <nav className="ds-nav">
          <a className={activeTab === 'campaigns' ? 'active' : ''} onClick={() => setActiveTab('campaigns')}>
            <i className="fas fa-th-large"></i> My Campaigns
          </a>
          <a onClick={() => { setEditCampaign(null); setShowModal(true) }}>
            <i className="fas fa-plus-circle"></i> New Campaign
          </a>
          <a className={activeTab === 'payment' ? 'active' : ''} onClick={() => setActiveTab('payment')}>
            <i className="fas fa-credit-card"></i> Payment Methods
          </a>
          <a style={{ color: 'var(--primary)' }} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="dash-main">
        {activeTab === 'campaigns' && (
          <>
            <div className="dash-header">
              <h3>My Campaigns</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary-custom" onClick={() => { setEditCampaign(null); setShowModal(true) }}>
                  <i className="fas fa-plus"></i> Create Campaign
                </button>
                <button className="btn-outline-custom" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>
            <div className="stat-cards-row">
              <div className="stat-card"><div className="lbl">Total Campaigns</div><div className="val">{myCampaigns.length}</div></div>
              <div className="stat-card"><div className="lbl">Total Raised</div><div className="val">${totalRaised.toLocaleString()}</div></div>
            </div>

            {myCampaigns.length === 0 ? (
              <div className="text-center p-5" style={{ color: 'var(--text-light)' }}>
                <i className="fas fa-inbox" style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12, color: '#ddd' }}></i>
                No campaigns yet. Create your first one!
              </div>
            ) : (
              <div className="creator-camps-grid">
                {myCampaigns.map(c => {
                  const pct = Math.min((parseFloat(c.raised) / parseFloat(c.goal)) * 100, 100)
                  return (
                    <div key={c.id} className="cc-card">
                      <div style={{ height: 130, background: `url('${c.image_url || 'https://placehold.co/400x130'}') center/cover` }}></div>
                      <div className="cc-body">
                        <span className={`status-badge ${c.status}`}>{c.status.toUpperCase()}</span>
                        <h4>{c.title}</h4>
                        <div className="meta">Goal: ${parseFloat(c.goal).toLocaleString()} · Raised: ${parseFloat(c.raised || 0).toLocaleString()}</div>
                        <div className="prog-bg" style={{ margin: '8px 0' }}>
                          <div className="prog-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                        <div className="cc-actions">
                          <button className="small-btn approve" onClick={() => setViewDonations(c)}><i className="fas fa-list"></i> Donations</button>
                          {c.status === 'pending' && (
                            <button className="small-btn neutral" onClick={() => { setEditCampaign(c); setShowModal(true) }}><i className="fas fa-edit"></i> Edit</button>
                          )}
                          <button className="small-btn reject" onClick={() => handleDelete(c.id)}><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'payment' && (
          <div className="tab-card">
            <h5><i className="fas fa-credit-card" style={{ color:'var(--primary)', marginRight: 8 }}></i>Payment Methods</h5>
            <p style={{ color: 'var(--text-light)', marginBottom: 20 }}>
              Add how you'd like to receive funds. Currently only PayPal email is supported.
            </p>
            <form onSubmit={savePaymentMethod}>
              <div className="auth-field">
                <label>PayPal Email Address</label>
                <input
                  type="email"
                  value={paymentMethod.paypal_email}
                  onChange={e => setPaymentMethod(prev => ({ ...prev, paypal_email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button type="submit" className="btn-primary-custom" disabled={loadingPayment}>
                {loadingPayment ? 'Saving...' : 'Save Payment Method'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="creator-bottom-nav">
        <button className={`bottom-nav-item ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}>
          <i className="fas fa-th-large"></i>
          <span>Campaigns</span>
        </button>
        <button className="bottom-nav-item" onClick={() => { setEditCampaign(null); setShowModal(true) }}>
          <i className="fas fa-plus-circle"></i>
          <span>Create</span>
        </button>
        <button className={`bottom-nav-item ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')}>
          <i className="fas fa-credit-card"></i>
          <span>Payment</span>
        </button>
        <button className="bottom-nav-item" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>

      {/* Modals */}
      {showModal && (
        <CampaignModal campaign={editCampaign} onClose={() => { setShowModal(false); setEditCampaign(null) }} />
      )}
      {viewDonations && (
        <DonationsModal campaign={viewDonations} onClose={() => setViewDonations(null)} />
      )}
    </div>
  )
}