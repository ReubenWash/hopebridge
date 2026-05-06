// src/services/api.js
// All API calls to the HopeBridge backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Token helpers ─────────────────────────────────────────────────
export function saveToken(token) { localStorage.setItem('hb_token', token) }
export function clearToken()    { localStorage.removeItem('hb_token') }
export function getToken()      { return localStorage.getItem('hb_token') }

// ── Base request ─────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error || `Request failed: ${res.status}`)
  }
  return data
}

// Multipart request (for file uploads)
async function multipart(method, path, formData) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
  return data
}

// ── Auth ─────────────────────────────────────────────────────────
export const authApi = {
  register: (body) => {
    if (!body.recaptchaToken) {
      throw new Error('reCAPTCHA token is required')
    }
    return request('/auth/register', { method: 'POST', body: JSON.stringify(body) })
  },
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me:    ()    => request('/auth/me'),

  // Email verification (token-based, still available for backward compatibility)
  verifyEmail: (token) => request('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token })
  }),

  // New 6-digit code verification
  verifyCode: (body) => request('/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify(body)   // { email, code }
  }),
}

// ── Campaigns ─────────────────────────────────────────────────────
export const campaignApi = {
  getAll:  (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/campaigns${qs ? `?${qs}` : ''}`)
  },
  getMy:   () => request('/campaigns/my'),
  create:  (formData) => multipart('POST',  '/campaigns',     formData),
  update:  (id, formData) => multipart('PATCH', `/campaigns/${id}`, formData),
  delete:  (id) => request(`/campaigns/${id}`, { method: 'DELETE' }),
}

// ── Donations ─────────────────────────────────────────────────────
export const donationApi = {
  // Existing
  create:         (body) => request('/donations', { method: 'POST', body: JSON.stringify(body) }),
  getCampaignDons:(id)   => request(`/donations/campaign/${id}`),

   getMyDonations: () => request('/donations/my'),

  // PayPal
  createPayPalOrder: (body) => request('/donations/paypal/create-order', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  capturePayPalOrder: (orderID) => request('/donations/paypal/capture-order', {
    method: 'POST',
    body: JSON.stringify({ orderID }),
  }),

  // Creator payment methods
  getCreatorPaymentMethod: () => request('/creator/payment-method'),
  saveCreatorPaymentMethod: (data) => request('/creator/payment-method', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// ── Wallet (for donors) ───────────────────────────────────────────
export const walletApi = {
  getBalance: () => request('/wallet/balance'),
  getTransactions: () => request('/wallet/transactions'),
  getMyDepositRequests: () => request('/wallet/deposit-requests'),
  requestDeposit: (body) => request('/wallet/deposit-request', { method: 'POST', body: JSON.stringify(body) }),
  uploadProof: (requestId, formData) => multipart('POST', `/wallet/deposit-request/${requestId}/proof`, formData),
  donateFromWallet: (body) => request('/wallet/donate', { method: 'POST', body: JSON.stringify(body) }),
}

// ── Admin ─────────────────────────────────────────────────────────
export const adminApi = {
  getStats:       ()           => request('/admin/stats'),
  getUsers:       ()           => request('/admin/users'),
  toggleUser:     (id)         => request(`/admin/users/${id}/toggle`, { method: 'PATCH' }),
  getCampaigns:   (params)     => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/admin/campaigns${qs ? `?${qs}` : ''}`)
  },
  updateCampaign: (id, body)   => request(`/admin/campaigns/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
  getDonations:   ()           => request('/admin/donations'),
  getDisputes:    ()           => request('/admin/disputes'),
  resolveDispute: (id)         => request(`/admin/disputes/${id}/resolve`, { method: 'PATCH' }),

  // Theme management
  getTheme:       ()           => request('/admin/theme'),
  saveTheme:      (theme)      => request('/admin/theme', { method: 'PUT', body: JSON.stringify(theme) }),

  // Firebase Cloud Messaging token
  saveFCMToken:   (token)      => request('/admin/fcm-token', { method: 'POST', body: JSON.stringify({ token }) }),

  // Admin settings (theme + integration keys)
  getSettings:    ()           => request('/admin/settings'),
  saveSettings:   (data)       => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Mass Mail sender
  sendMassMail:   (body)       => request('/admin/mass-mail', { method: 'POST', body: JSON.stringify(body) }),

  // Content management (hero, banners, impact stats, social links)
  getContent:     ()           => request('/admin/content'),
  saveContent:    (data)       => request('/admin/content', { method: 'PUT', body: JSON.stringify(data) }),

  // Deposit requests (admin)
  getDepositRequests: () => request('/admin/deposit-requests'),
  updateDepositRequest: (id, data) => request(`/admin/deposit-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

// ── Public endpoints (no auth required) ──────────────────────────
export const publicApi = {
  getSettings: () => request('/settings/public'),
}