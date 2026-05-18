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

// Multipart (file uploads) - IMPROVED VERSION
async function multipart(method, path, formData) {
  const token = getToken()
  
  // IMPORTANT: Do NOT set Content-Type header for FormData
  // The browser will set the correct multipart boundary automatically
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  console.log(`📤 ${method} ${path} - Sending multipart request`)
  
  // Debug: Log FormData contents
  if (formData instanceof FormData) {
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`   📎 File: ${pair[0]} = ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`)
      } else {
        console.log(`   📋 Field: ${pair[0]} = ${String(pair[1]).substring(0, 100)}`)
      }
    }
  }
  
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: formData,
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    console.error(`❌ ${method} ${path} failed:`, data)
    const err = new Error(data?.error || `Request failed: ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  
  console.log(`✅ ${method} ${path} succeeded`)
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
  getVerificationStatus: () => request('/auth/verification-status'),
  checkSession: () => request('/auth/check-session'),

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
  getUpdates: (id) => request(`/campaigns/${id}/updates`),
  getRelated: (id, category) => request(`/campaigns/${id}/related?category=${category}`),
  getCreator: (userId) => request(`/users/${userId}`),
  create:  (formData) => {
    // Ensure formData is properly formatted
    if (!(formData instanceof FormData)) {
      console.error('createCampaign called without FormData:', formData)
      throw new Error('Invalid form data for campaign creation')
    }
    return multipart('POST', '/campaigns', formData)
  },
  update:  (id, formData) => {
    if (!(formData instanceof FormData)) {
      console.error('updateCampaign called without FormData:', formData)
      throw new Error('Invalid form data for campaign update')
    }
    return multipart('PATCH', `/campaigns/${id}`, formData)
  },
  delete:  (id) => request(`/campaigns/${id}`, { method: 'DELETE' }),
  addUpdate: (id, data) => request(`/campaigns/${id}/updates`, {
    method: 'POST', body: JSON.stringify(data),
  }),
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
  uploadProof: (requestId, formData) => {
    if (!(formData instanceof FormData)) {
      console.error('uploadProof called without FormData')
      throw new Error('Invalid form data for proof upload')
    }
    return multipart('POST', `/wallet/deposit-request/${requestId}/proof`, formData)
  },

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
  // Stats & Users
  getStats:       () => request('/admin/stats'),
  getUsers:       () => request('/admin/users'),
  toggleUser:     (id) => request(`/admin/users/${id}/toggle`, { method: 'PATCH' }),

  // Campaign Management
  getCampaigns:   (params) => {
    const qs = new URLSearchParams(params || {}).toString()
    return request(`/admin/campaigns${qs ? `?${qs}` : ''}`)
  },
  updateCampaign: (id, body) => request(`/admin/campaigns/${id}/status`, {
    method: 'PATCH', body: JSON.stringify(body),
  }),

  // Donations
  getDonations:   () => request('/admin/donations'),

  // Theme & Content
  getTheme:  () => request('/admin/theme'),
  saveTheme: (theme) => request('/admin/theme', { method: 'PUT', body: JSON.stringify(theme) }),
  getContent:  () => request('/admin/content'),
  saveContent: (data) => request('/admin/content', { method: 'PUT', body: JSON.stringify(data) }),

  // Settings
  getSettings:  () => request('/admin/settings'),
  saveSettings: (data) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Email Verification Settings
  getVerificationSetting: () => request('/admin/verification-setting'),
  updateVerificationSetting: (data) => request('/admin/verification-setting', {
    method: 'PUT', body: JSON.stringify(data),
  }),

  // FCM / Push Notifications
  saveFCMToken: (token) => request('/admin/fcm-token', {
    method: 'POST', body: JSON.stringify({ token }),
  }),
  saveAdminFCMToken: (token) => request('/admin/admin-fcm-token', {
    method: 'POST', body: JSON.stringify({ token }),
  }),
  getAdminFCMTokens: () => request('/admin/admin-fcm-tokens'),
  removeAdminFCMToken: (token) => request('/admin/admin-fcm-token', {
    method: 'DELETE', body: JSON.stringify({ token }),
  }),
  sendTestPushNotification: (data) => request('/admin/test-push', {
    method: 'POST', body: JSON.stringify(data),
  }),

  // Firebase Settings
  getFirebaseSettings: () => request('/admin/firebase-settings'),
  saveFirebaseSettings: (data) => request('/admin/firebase-settings', {
    method: 'PUT', body: JSON.stringify(data),
  }),

  // ImageKit.io Settings
  getImageKitSettings: () => request('/admin/imagekit-settings'),
  saveImageKitSettings: (data) => request('/admin/imagekit-settings', {
    method: 'PUT', body: JSON.stringify(data),
  }),

  // Mass Mail
  sendMassMail: (body) => request('/admin/mass-mail', { method: 'POST', body: JSON.stringify(body) }),

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

  // Campaign Completion Requests (Escrow)
  getCompletionRequests: () => request('/admin/campaigns/completion-requests'),
  releaseCampaignEscrow: (id) => request(`/admin/campaigns/${id}/release-escrow`, {
    method: 'POST',
  }),
  refundCampaignEscrow: (id) => request(`/admin/campaigns/${id}/refund-escrow`, {
    method: 'POST',
  }),

  // Maintenance Mode
  getMaintenanceStatus: () => request('/admin/maintenance-status'),
  toggleMaintenance: (data) => request('/admin/maintenance-toggle', {
    method: 'POST', body: JSON.stringify(data),
  }),

  // Disputes (keep for reference but not used in UI)
  getDisputes:    () => request('/admin/disputes'),
  resolveDispute: (id) => request(`/admin/disputes/${id}/resolve`, { method: 'PATCH' }),
}

// ── Public ────────────────────────────────────────────────────────
export const publicApi = {
  getSettings: () => request('/settings/public'),
  getMaintenanceStatus: () => request('/maintenance-status'),
}