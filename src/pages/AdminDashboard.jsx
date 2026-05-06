import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { adminApi, campaignApi } from '../services/api'

const safeGet = async (apiCall, fallback) => {
  try { return await apiCall() }
  catch { return fallback }
}

let fetchInitiated = false

export default function AdminDashboard() {
  const { currentUser, logout, showToast, loading: sessionLoading } = useApp()
  const navigate = useNavigate()
  const [authChecked, setAuthChecked] = useState(false)

  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [campaigns, setCampaigns] = useState([])
  const [users, setUsers] = useState([])
  const [disputes, setDisputes] = useState([])
  const [donations, setDonations] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('hb_darkmode') === 'true')
  const [settings, setSettings] = useState({
    theme: {
      '--primary': '#e8531e',
      '--primary-dark': '#c4400f',
      '--secondary': '#27a96c',
      '--dark': '#1a1a2e',
    },
    keys: {
      smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '',
      paypal_client_id: '', recaptcha_site_key: '',
      recaptcha_secret_key: '', firebase_config: '',
    }
  })
  const [settingsTab, setSettingsTab] = useState('theme')
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  })

  // Wait for session to load, then validate admin
  useEffect(() => {
    if (sessionLoading) return

    if (!currentUser) {
      console.log('[AdminDashboard] No user, redirecting to home')
      showToast('Please log in first', true)
      navigate('/')
      return
    }
    if (currentUser.role !== 'admin') {
      console.log('[AdminDashboard] User role is not admin:', currentUser.role)
      showToast('Access denied – admin only', true)
      navigate('/')
      return
    }
    setAuthChecked(true)
  }, [sessionLoading, currentUser, navigate, showToast])

  // Only fetch data after we've confirmed admin
  useEffect(() => {
    if (!authChecked) return
    if (fetchInitiated) return
    fetchInitiated = true
    fetchAll()
    return () => { fetchInitiated = false }
  }, [authChecked])

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('hb_darkmode', darkMode)
  }, [darkMode])

  const fetchAll = async () => {
    setDataLoading(true)
    console.log('[AdminDashboard] fetchAll started')
    try {
      const [s, c, u, d, don, sett, contentRes] = await Promise.all([
        safeGet(() => adminApi.getStats(), { stats: {} }),
        safeGet(() => adminApi.getCampaigns(), { campaigns: [] }),
        safeGet(() => adminApi.getUsers(), { users: [] }),
        safeGet(() => adminApi.getDisputes(), { disputes: [] }),
        safeGet(() => adminApi.getDonations(), { donations: [] }),
        safeGet(() => adminApi.getSettings(), { settings: null }),
        safeGet(() => adminApi.getContent(), { content: null }),
      ])

      setStats(s.stats || {})
      setCampaigns(c.campaigns || [])
      setUsers(u.users || [])
      setDisputes(d.disputes || [])
      setDonations(don.donations || [])
      if (sett.settings) {
        setSettings(prev => ({
          theme: { ...prev.theme, ...(sett.settings.theme || {}) },
          keys: { ...prev.keys, ...(sett.settings.keys || {}) }
        }))
      }
      if (contentRes.content && contentRes.content.social_links) {
        setSocialLinks(contentRes.content.social_links)
      }
    } catch (err) {
      console.error('FetchAll error:', err)
      showToast('Failed to load admin data', true)
    } finally {
      setDataLoading(false)
    }
  }

  const refetchAll = () => {
    fetchInitiated = false
    fetchAll()
    fetchInitiated = true
  }

  // ── Campaign actions ─────────────────────────────────────────────
  const handleApprove = async (id) => {
    try {
      await adminApi.updateCampaign(id, { status: 'approved' })
      showToast('Campaign approved!')
      refetchAll()
    } catch (err) { showToast(err.message, true) }
  }

  const handleReject = async (id) => {
    try {
      await adminApi.updateCampaign(id, { status: 'rejected' })
      showToast('Campaign rejected')
      refetchAll()
    } catch (err) { showToast(err.message, true) }
  }

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign permanently? This cannot be undone.')) return
    try {
      await campaignApi.delete(id)
      showToast('Campaign deleted successfully')
      refetchAll()
    } catch (err) { showToast(err.message, true) }
  }

  // ── User & dispute handlers ──────────────────────────────────────
  const handleToggleUser = async (id) => {
    try {
      const data = await adminApi.toggleUser(id)
      showToast(data.message)
      refetchAll()
    } catch (err) { showToast(err.message, true) }
  }

  const handleResolveDispute = async (id) => {
    try {
      await adminApi.resolveDispute(id)
      showToast('Dispute resolved')
      refetchAll()
    } catch (err) { showToast(err.message, true) }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const saveSettings = async () => {
    try {
      await adminApi.saveSettings(settings)
      showToast('Settings saved')
    } catch (err) { showToast(err.message, true) }
  }

  const saveSocialLinks = async () => {
    try {
      const existing = await adminApi.getContent()
      const updatedContent = {
        ...existing.content,
        social_links: socialLinks,
      }
      await adminApi.saveContent(updatedContent)
      showToast('Social links saved')
    } catch (err) {
      showToast(err.message, true)
    }
  }

  const updateTheme = (k, v) => setSettings(p => ({ ...p, theme: { ...p.theme, [k]: v } }))
  const updateKey = (k, v) => setSettings(p => ({ ...p, keys: { ...p.keys, [k]: v } }))

  const tabs = [
    { key: 'overview', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { key: 'campaigns', label: 'Campaigns', icon: 'fa-flag' },
    { key: 'users', label: 'Users', icon: 'fa-users' },
    { key: 'donations', label: 'Donations', icon: 'fa-donate' },
    { key: 'disputes', label: 'Disputes', icon: 'fa-exclamation-triangle' },
    { key: 'deposits', label: 'Deposits', icon: 'fa-money-bill-wave' },
    { key: 'content', label: 'Content', icon: 'fa-edit' },
    { key: 'massmail', label: 'Mass Mail', icon: 'fa-envelope' },
    { key: 'settings', label: 'Settings', icon: 'fa-cog' },
  ]

  // Loading states
  if (sessionLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Restoring session...</p>
      </div>
    )
  }

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Validating access...</p>
      </div>
    )
  }

  return (
    <div className="dash-layout">
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
      </button>

      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo-area">
          <div className="footer-logo" style={{ fontSize: '1.2rem' }}><i className="fas fa-heart"></i> HopeBridge</div>
          <small>Admin Panel</small>
        </div>
        <nav className="admin-nav">
          <div className="nav-grp">Overview</div>
          {tabs.slice(0, 1).map(t => (
            <a key={t.key} className={activeTab === t.key ? 'active' : ''} onClick={() => { setActiveTab(t.key); setSidebarOpen(false) }}>
              <i className={`fas ${t.icon}`}></i> {t.label}
            </a>
          ))}
          <div className="nav-grp">Management</div>
          {tabs.slice(1).map(t => (
            <a key={t.key} className={activeTab === t.key ? 'active' : ''} onClick={() => { setActiveTab(t.key); setSidebarOpen(false) }}>
              <i className={`fas ${t.icon}`}></i> {t.label}
              {t.key === 'campaigns' && campaigns.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: '#fff', borderRadius: '30px', padding: '1px 8px', fontSize: '.72rem' }}>{campaigns.length}</span>
              )}
            </a>
          ))}
          <a style={{ color: 'var(--primary)', marginTop: 8 }} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </a>
          <a style={{ marginTop: 4, cursor: 'pointer' }} onClick={() => setDarkMode(!darkMode)}>
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i> {darkMode ? 'Light' : 'Dark'} Mode
          </a>
        </nav>
      </div>

      <div className="admin-main">
        {dataLoading && (
          <div style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', fontSize: '.85rem', borderRadius: 6, marginBottom: 12 }}>
            Loading data...
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            <div className="admin-stat-row">
              <div className="astat primary"><div className="lbl">Total Raised</div><div className="val">${parseFloat(stats.total_raised || 0).toLocaleString()}</div></div>
              <div className="astat"><div className="lbl">Total Campaigns</div><div className="val">{stats.total_campaigns || 0}</div></div>
              <div className="astat"><div className="lbl">Pending</div><div className="val">{stats.pending_campaigns || 0}</div></div>
              <div className="astat"><div className="lbl">Total Users</div><div className="val">{stats.total_users || 0}</div></div>
              <div className="astat"><div className="lbl">Open Disputes</div><div className="val">{stats.open_disputes || 0}</div></div>
            </div>
            <div className="tab-card">
              <h5><i className="fas fa-flag" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Open Flags</h5>
              {disputes.filter(d => d.status === 'open').length === 0 ? (
                <div style={{ color: 'var(--secondary)', padding: '10px 0' }}><i className="fas fa-check-circle"></i> No open flags</div>
              ) : (
                disputes.filter(d => d.status === 'open').slice(0, 3).map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i>
                    {d.description}
                    <button className="small-btn approve" style={{ marginLeft: 'auto' }} onClick={() => handleResolveDispute(d.id)}>Resolve</button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'campaigns' && (
          <div className="tab-card">
            <h5><i className="fas fa-flag" style={{ color: 'var(--primary)', marginRight: 8 }}></i>All Campaigns</h5>
            {campaigns.length === 0 ? (
              <div style={{ color: 'var(--secondary)', padding: 16 }}>No campaigns found.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Creator</th>
                    <th>Goal</th>
                    <th>Raised</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.title}</td>
                      <td>{c.creator_name}</td>
                      <td>${parseFloat(c.goal).toLocaleString()}</td>
                      <td>${parseFloat(c.raised || 0).toLocaleString()}</td>
                      <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                      <td>
                        {c.status === 'pending' && (
                          <>
                            <button className="small-btn approve" style={{ marginRight: 6 }} onClick={() => handleApprove(c.id)}>Approve</button>
                            <button className="small-btn reject" style={{ marginRight: 6 }} onClick={() => handleReject(c.id)}>Reject</button>
                          </>
                        )}
                        <button className="small-btn reject" onClick={() => handleDeleteCampaign(c.id)} style={{ background: '#dc3545', color: '#fff' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-card">
            <h5><i className="fas fa-users" style={{ color: 'var(--primary)', marginRight: 8 }}></i>All Users</h5>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="status-badge approved">{u.role}</span></td>
                    <td><span className={`status-badge ${u.is_active ? 'approved' : 'pending'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      {u.role !== 'admin' && (
                        <button className={`small-btn ${u.is_active ? 'reject' : 'approve'}`} onClick={() => handleToggleUser(u.id)}>
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="tab-card">
            <h5><i className="fas fa-donate" style={{ color: 'var(--primary)', marginRight: 8 }}></i>All Donations</h5>
            <table className="admin-table">
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
                    <td>{d.donor_name}</td>
                    <td>{d.campaign_title}</td>
                    <td>${parseFloat(d.amount).toLocaleString()}</td>
                    <td>{d.is_monthly ? '✅' : '—'}</td>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="tab-card">
            <h5><i className="fas fa-gavel" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Disputes</h5>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map(d => (
                  <tr key={d.id}>
                    <td>{d.type}</td>
                    <td>{d.description}</td>
                    <td><span className={`status-badge ${d.status === 'resolved' ? 'approved' : 'pending'}`}>{d.status}</span></td>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                    <td>
                      {d.status !== 'resolved'
                        ? <button className="small-btn approve" onClick={() => handleResolveDispute(d.id)}>Resolve</button>
                        : <span style={{ color: '#999' }}>Done</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="tab-card">
            <h5><i className="fas fa-money-bill-wave" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Deposit Requests</h5>
            <DepositRequestsManager />
          </div>
        )}

        {activeTab === 'content' && (
          <div className="tab-card">
            <h5><i className="fas fa-edit" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Manage Platform Content</h5>
            <ContentEditor />
          </div>
        )}

        {activeTab === 'massmail' && (
          <div className="tab-card">
            <h5><i className="fas fa-envelope" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Send Mass Email</h5>
            <MassMailForm />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-card">
            <h5><i className="fas fa-cog" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Settings</h5>
            <div className="settings-tabs">
              <button className={`role-tab ${settingsTab === 'theme' ? 'active' : ''}`} onClick={() => setSettingsTab('theme')}>Theme Colours</button>
              <button className={`role-tab ${settingsTab === 'keys' ? 'active' : ''}`} onClick={() => setSettingsTab('keys')}>Integration Keys</button>
              <button className={`role-tab ${settingsTab === 'social' ? 'active' : ''}`} onClick={() => setSettingsTab('social')}>Social Links</button>
            </div>
            {settingsTab === 'theme' && (
              <div className="theme-settings">
                {Object.entries(settings.theme || {}).map(([k, v]) => (
                  <div className="auth-field" key={k}>
                    <label>{k}</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input type="color" value={v} onChange={e => updateTheme(k, e.target.value)} style={{ width: 50, padding: 0, border: 'none' }} />
                      <input type="text" value={v} onChange={e => updateTheme(k, e.target.value)} />
                    </div>
                  </div>
                ))}
                <button className="btn-primary-custom" onClick={saveSettings}>Save Theme</button>
              </div>
            )}
            {settingsTab === 'keys' && (
              <div className="keys-settings">
                {Object.entries(settings.keys || {}).map(([k, v]) => (
                  <div className="auth-field" key={k}>
                    <label>{k.replace(/_/g, ' ').toUpperCase()}</label>
                    <input type="text" value={v || ''} onChange={e => updateKey(k, e.target.value)} placeholder={`Enter ${k}`} />
                  </div>
                ))}
                <button className="btn-primary-custom" onClick={saveSettings}>Save Keys</button>
              </div>
            )}
            {settingsTab === 'social' && (
              <div className="social-links-settings">
                <div className="auth-field">
                  <label>Facebook URL</label>
                  <input type="text" value={socialLinks.facebook} onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})} placeholder="https://facebook.com/yourpage" />
                </div>
                <div className="auth-field">
                  <label>Twitter URL</label>
                  <input type="text" value={socialLinks.twitter} onChange={e => setSocialLinks({...socialLinks, twitter: e.target.value})} placeholder="https://twitter.com/yourhandle" />
                </div>
                <div className="auth-field">
                  <label>Instagram URL</label>
                  <input type="text" value={socialLinks.instagram} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} placeholder="https://instagram.com/yourprofile" />
                </div>
                <div className="auth-field">
                  <label>YouTube URL</label>
                  <input type="text" value={socialLinks.youtube} onChange={e => setSocialLinks({...socialLinks, youtube: e.target.value})} placeholder="https://youtube.com/c/yourchannel" />
                </div>
                <div className="auth-field">
                  <label>LinkedIn URL</label>
                  <input type="text" value={socialLinks.linkedin} onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})} placeholder="https://linkedin.com/company/yourcompany" />
                </div>
                <button className="btn-primary-custom" onClick={saveSocialLinks}>Save Social Links</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Mass Mail ──────────────────────────────────────────────────────
function MassMailForm() {
  const { showToast } = useApp()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [recipientType, setRecipientType] = useState('all_donors')
  const [campaignId, setCampaignId] = useState('')
  const [campaigns, setCampaigns] = useState([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    adminApi.getCampaigns({ status: 'approved' }).then(r => setCampaigns(r.campaigns || [])).catch(() => {})
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!subject || !message) return showToast('Please fill subject and message', true)
    setSending(true)
    try {
      await adminApi.sendMassMail({ subject, message, recipient_type: recipientType, campaign_id: recipientType === 'campaign_donors' ? campaignId : null })
      showToast('Emails sent successfully!')
      setSubject(''); setMessage('')
    } catch (err) { showToast(err.message, true) }
    finally { setSending(false) }
  }

  return (
    <form onSubmit={handleSend}>
      <div className="auth-field">
        <label>Recipient Group</label>
        <select className="form-ctrl" value={recipientType} onChange={e => setRecipientType(e.target.value)}>
          <option value="all_donors">All donors</option>
          <option value="all_creators">All creators</option>
          <option value="all_users">All registered users</option>
          <option value="campaign_donors">Donors of a specific campaign</option>
        </select>
      </div>
      {recipientType === 'campaign_donors' && (
        <div className="auth-field">
          <label>Campaign</label>
          <select className="form-ctrl" value={campaignId} onChange={e => setCampaignId(e.target.value)} required>
            <option value="">-- Select campaign --</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      )}
      <div className="auth-field"><label>Subject</label><input type="text" className="form-ctrl" value={subject} onChange={e => setSubject(e.target.value)} required /></div>
      <div className="auth-field">
        <label>Message (plain text)</label>
        <textarea className="form-ctrl" rows="6" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Write your email content here..." />
      </div>
      <button className="btn-primary-custom" disabled={sending}>
        {sending ? 'Sending...' : <><i className="fas fa-paper-plane"></i> Send Emails</>}
      </button>
    </form>
  )
}

// ─── Content Editor ─────────────────────────────────────────────────
function ContentEditor() {
  const { showToast } = useApp()
  const [content, setContent] = useState({
    hero_title: 'Together We Can', hero_subtitle: 'Support the causes you care about and make a real difference.',
    hero_badge: 'HopeBridge', impact_title: 'Our Impact', impact_subtitle: 'Every donation counts',
    impact_stats: { raised: '$0', campaigns: '0', donors: '0' },
    banner_image: '', notification_message: '',
    social_links: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' }
  })
  const [loadingContent, setLoadingContent] = useState(true)

  useEffect(() => {
    adminApi.getContent()
      .then(res => { if (res.content) setContent(p => ({ ...p, ...res.content, social_links: { ...p.social_links, ...(res.content.social_links || {}) } })) })
      .catch(() => {})
      .finally(() => setLoadingContent(false))
  }, [])

  const save = async () => { try { await adminApi.saveContent(content); showToast('Content updated') } catch (err) { showToast(err.message, true) } }
  const updateField = (f, v) => setContent(p => ({ ...p, [f]: v }))
  const updateStat = (k, v) => setContent(p => ({ ...p, impact_stats: { ...p.impact_stats, [k]: v } }))
  const updateSocial = (pl, v) => setContent(p => ({ ...p, social_links: { ...p.social_links, [pl]: v } }))

  if (loadingContent) return <p>Loading content...</p>

  return (
    <div>
      <h5 style={{ marginTop: 20 }}>Hero Section</h5>
      <div className="auth-field"><label>Badge Text</label><input type="text" value={content.hero_badge} onChange={e => updateField('hero_badge', e.target.value)} /></div>
      <div className="auth-field"><label>Hero Title</label><input type="text" value={content.hero_title} onChange={e => updateField('hero_title', e.target.value)} /></div>
      <div className="auth-field"><label>Hero Subtitle</label><textarea value={content.hero_subtitle} onChange={e => updateField('hero_subtitle', e.target.value)} rows="2" /></div>

      <h5 style={{ marginTop: 20 }}>Impact Section</h5>
      <div className="auth-field"><label>Section Title</label><input type="text" value={content.impact_title} onChange={e => updateField('impact_title', e.target.value)} /></div>
      <div className="auth-field"><label>Section Subtitle</label><input type="text" value={content.impact_subtitle} onChange={e => updateField('impact_subtitle', e.target.value)} /></div>
      <div className="auth-field"><label>Stat – Total Raised</label><input type="text" value={content.impact_stats.raised} onChange={e => updateStat('raised', e.target.value)} /></div>
      <div className="auth-field"><label>Stat – Campaigns</label><input type="text" value={content.impact_stats.campaigns} onChange={e => updateStat('campaigns', e.target.value)} /></div>
      <div className="auth-field"><label>Stat – Donors</label><input type="text" value={content.impact_stats.donors} onChange={e => updateStat('donors', e.target.value)} /></div>

      <h5 style={{ marginTop: 20 }}>Banner & Notification</h5>
      <div className="auth-field"><label>Banner Image URL</label><input type="text" value={content.banner_image} onChange={e => updateField('banner_image', e.target.value)} /></div>
      <div className="auth-field"><label>Notification Message</label><textarea value={content.notification_message} onChange={e => updateField('notification_message', e.target.value)} rows="2" /></div>

      <h5 style={{ marginTop: 20 }}>Social Media Links</h5>
      {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(pl => (
        <div className="auth-field" key={pl}>
          <label>{pl.charAt(0).toUpperCase() + pl.slice(1)} URL</label>
          <input type="text" value={content.social_links[pl]} onChange={e => updateSocial(pl, e.target.value)} placeholder={`https://${pl}.com/...`} />
        </div>
      ))}
      <button className="btn-primary-custom" onClick={save} style={{ marginTop: 8 }}>Save Content</button>
    </div>
  )
}

// ─── Deposit Requests Manager ───────────────────────────────────────
function DepositRequestsManager() {
  const { showToast } = useApp()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const res = await adminApi.getDepositRequests()
      setRequests(res.requests || [])
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])

  const updateRequest = async (id, updates) => {
    try {
      await adminApi.updateDepositRequest(id, updates)
      showToast('Request updated')
      fetchRequests()
    } catch (err) {
      showToast(err.message, true)
    }
  }

  if (loading) return <p>Loading deposit requests...</p>
  if (requests.length === 0) return <p>No deposit requests.</p>

  return (
    <div>
      {requests.map(req => (
        <div key={req.id} style={{ borderBottom: '1px solid #eee', padding: '16px 0' }}>
          <div><strong>User:</strong> {req.name} ({req.email})</div>
          <div><strong>Amount:</strong> ${req.amount}</div>
          <div><strong>Status:</strong> <span className={`status-badge ${req.status}`}>{req.status}</span></div>
          {req.status === 'pending' && (
            <div style={{ marginTop: 10 }}>
              <textarea 
                placeholder="Payment instructions (bank, mobile money, crypto)" 
                rows="2" 
                style={{ width: '100%', padding: '8px' }} 
                id={`instructions-${req.id}`}
              />
              <button 
                className="small-btn approve" 
                onClick={() => {
                  const instructions = document.getElementById(`instructions-${req.id}`).value
                  updateRequest(req.id, { admin_instructions: instructions, status: 'awaiting_proof' })
                }}
              >
                Provide Instructions
              </button>
            </div>
          )}
          {req.status === 'awaiting_proof' && req.proof_image_url && (
            <div style={{ marginTop: 10 }}>
              <a href={req.proof_image_url} target="_blank" rel="noopener noreferrer">View Proof</a>
              <div style={{ marginTop: 8 }}>
                <button className="small-btn approve" style={{ marginRight: 8 }} onClick={() => updateRequest(req.id, { status: 'approved' })}>Approve & Credit</button>
                <button className="small-btn reject" onClick={() => updateRequest(req.id, { status: 'rejected' })}>Reject</button>
              </div>
            </div>
          )}
          {req.status === 'approved' && <span style={{ color: 'green' }}>✓ Credited to wallet</span>}
          {req.status === 'rejected' && <span style={{ color: 'red' }}>✗ Rejected</span>}
        </div>
      ))}
    </div>
  )
}