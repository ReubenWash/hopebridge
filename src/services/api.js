// src/services/api.js
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
    const err = new Error(data?.error || `Request failed: ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

// Multipart (file uploads)
async function multipart(method, path, formData) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed: ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

// ── Users ─────────────────────────────────────────────────────────
export const userApi = {
  getById: (id) => request(`/users/${id}`),
}

// ── Auth ─────────────────────────────────────────────────────────
export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => request('/auth/me'),
  updateMe: (body) => request('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),

  verifyEmail: (token) => request('/auth/verify-email', {
    method: 'POST', body: JSON.stringify({ token }),
  }),
  verifyCode: (body) => request('/auth/verify-code', {
    method: 'POST', body: JSON.stringify(body),
  }),
  resendCode: (email) => request('/auth/resend-code', {
    method: 'POST', body: JSON.stringify({ email }),
  }),
}

// ── Campaigns ─────────────────────────────────────────────────────
export const campaignApi = {
  getAll:  (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/campaigns${qs ? `?${qs}` : ''}`)
  },
  getMy:   () => request('/campaigns/my'),
  getById: (id) => request(`/campaigns/${id}`),
  getCreator: (userId) => request(`/users/${userId}`),
  create:  (formData) => multipart('POST',  '/campaigns',      formData),
  update:  (id, formData) => multipart('PATCH', `/campaigns/${id}`, formData),
  delete:  (id) => request(`/campaigns/${id}`, { method: 'DELETE' }),
}

// ── Donations (wallet‑only, no PayPal) ────────────────────────────
export const donationApi = {
  getMyDonations:  () => request('/donations/my'),
  getCampaignDons: (id) => request(`/donations/campaign/${id}`),

  // Creator payment methods (for withdrawals)
  getCreatorPaymentMethod:  () => request('/donations/creator/payment-method'),
  saveCreatorPaymentMethod: (data) => request('/donations/creator/payment-method', {
    method: 'PUT', body: JSON.stringify(data),
  }),

  // Creator wallet and payouts (for creator dashboard)
  getCreatorWallet: () => request('/donations/creator/wallet'),
  getMyPayoutRequests: () => request('/donations/creator/payout-requests'),
  requestPayout: (data) => request('/donations/creator/request-payout', {
    method: 'POST', body: JSON.stringify(data),
  }),
  updateCampaignProgress: (id, data) => request(`/campaigns/${id}/progress`, {
    method: 'PATCH', body: JSON.stringify(data),
  }),
}

// ── Wallet ────────────────────────────────────────────────────────
export const walletApi = {
  getBalance:          () => request('/wallet/balance'),
  getTransactions:     () => request('/wallet/transactions'),
  getSummary:          () => request('/wallet/summary'),
  getMyDepositRequests:() => request('/wallet/deposit-requests'),
  getDepositRequestById: (id) => request(`/wallet/deposit-requests/${id}`),

  requestDeposit: (body) => request('/wallet/deposit-request', {
    method: 'POST', body: JSON.stringify(body),
  }),
  uploadProof: (requestId, formData) =>
    multipart('POST', `/wallet/deposit-request/${requestId}/proof`, formData),

  donateFromWallet: (body) => request('/wallet/donate', {
    method: 'POST', body: JSON.stringify(body),
  }),

  requestWithdrawal: (body) => request('/wallet/withdrawal', {
    method: 'POST', body: JSON.stringify(body),
  }),
  getMyWithdrawals: () => request('/wallet/withdrawals'),
}

// ── Admin ─────────────────────────────────────────────────────────
export const adminApi = {
  getStats:       () => request('/admin/stats'),
  getUsers:       () => request('/admin/users'),
  toggleUser:     (id) => request(`/admin/users/${id}/toggle`, { method: 'PATCH' }),

  getCampaigns:   (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/admin/campaigns${qs ? `?${qs}` : ''}`)
  },
  updateCampaign: (id, body) => request(`/admin/campaigns/${id}/status`, {
    method: 'PATCH', body: JSON.stringify(body),
  }),

  getDonations:   () => request('/admin/donations'),
  getDisputes:    () => request('/admin/disputes'),
  resolveDispute: (id) => request(`/admin/disputes/${id}/resolve`, { method: 'PATCH' }),

  getTheme:  () => request('/admin/theme'),
  saveTheme: (theme) => request('/admin/theme', { method: 'PUT', body: JSON.stringify(theme) }),

  saveFCMToken: (token) => request('/admin/fcm-token', {
    method: 'POST', body: JSON.stringify({ token }),
  }),

  getSettings:  () => request('/admin/settings'),
  saveSettings: (data) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),

  sendMassMail: (body) => request('/admin/mass-mail', { method: 'POST', body: JSON.stringify(body) }),

  getContent:  () => request('/admin/content'),
  saveContent: (data) => request('/admin/content', { method: 'PUT', body: JSON.stringify(data) }),

  // Deposit requests
  getDepositRequests:   () => request('/admin/deposit-requests'),
  updateDepositRequest: (id, data) => request(`/admin/deposit-requests/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
  }),

  // Withdrawal requests
  getWithdrawalRequests: () => request('/admin/withdrawal-requests'),
  approveWithdrawal: (id) => request(`/admin/withdrawal-requests/${id}/approve`, {
    method: 'PUT',
  }),
  rejectWithdrawal: (id, reason) => request(`/admin/withdrawal-requests/${id}/reject`, {
    method: 'PUT', body: JSON.stringify({ reason }),
  }),
}

// ── Public ────────────────────────────────────────────────────────
export const publicApi = {
  getSettings: () => request('/settings/public'),
}