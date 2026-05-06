import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import {
  authApi, campaignApi, donationApi, adminApi, walletApi,
  saveToken, clearToken, getToken,
} from '../services/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [campaigns, setCampaigns]     = useState([])
  const [myCampaigns, setMyCampaigns] = useState([])
  const [toast, setToast]             = useState(null)
  const [authOpen, setAuthOpen]       = useState(false)
  const [authMode, setAuthMode]       = useState('login')   // 'login' or 'register'
  const [authRole, setAuthRole]       = useState('donor')   // 'donor' or 'creator'
  const [loading, setLoading]         = useState(true)
  const [theme, setTheme]             = useState({})
  const [walletBalance, setWalletBalance] = useState(0)

  // Prevents double /auth/me call in React StrictMode
  const sessionRestored = useRef(false)

  const showToast = useCallback((msg, error = false) => {
    setToast({ msg, error })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // Fetch wallet balance for logged‑in user
  const fetchWalletBalance = useCallback(async () => {
    if (!currentUser) return
    try {
      const data = await walletApi.getBalance()
      setWalletBalance(data.balance)
    } catch (err) {
      console.warn('Wallet fetch failed:', err.message)
    }
  }, [currentUser])

  // Restore session on page load
  useEffect(() => {
    if (sessionRestored.current) return
    sessionRestored.current = true

    const token = getToken()
    if (!token) {
      console.log('[AppContext] No token found, skipping session restore')
      setLoading(false)
      return
    }

    console.log('[AppContext] Token found, calling /auth/me...')
    authApi.me()
      .then(data => {
        console.log('[AppContext] /auth/me success:', data)
        const user = data.user ?? data
        setCurrentUser(user)
        if (user) fetchWalletBalance()
      })
      .catch((err) => {
        console.warn('[AppContext] /auth/me failed:', err.message)
        clearToken()
      })
      .finally(() => setLoading(false))
  }, [fetchWalletBalance])

  // Refresh wallet when currentUser changes (login/logout)
  useEffect(() => {
    if (currentUser) fetchWalletBalance()
    else setWalletBalance(0)
  }, [currentUser, fetchWalletBalance])

  // Theme (admin only)
  const applyTheme = useCallback((themeObj) => {
    const root = document.documentElement
    Object.entries(themeObj).forEach(([key, value]) => {
      if (key.startsWith('--')) root.style.setProperty(key, value)
    })
  }, [])

  const fetchTheme = useCallback(async () => {
    try {
      const data = await adminApi.getTheme()
      if (data.theme) { setTheme(data.theme); applyTheme(data.theme) }
    } catch { /* fallback to CSS defaults */ }
  }, [applyTheme])

  const saveTheme = async (updatedTheme) => {
    await adminApi.saveTheme(updatedTheme)
    setTheme(updatedTheme)
    applyTheme(updatedTheme)
    showToast('Theme updated')
  }

  // Only fetch theme for admin
  useEffect(() => {
    if (currentUser?.role === 'admin') fetchTheme()
  }, [currentUser, fetchTheme])

  // Campaigns
  const loadCampaigns = useCallback(async (params = {}) => {
    try {
      const data = await campaignApi.getAll(params)
      setCampaigns(data.campaigns || [])
      return data
    } catch (err) { showToast(err.message, true) }
  }, [showToast])

  const loadMyCampaigns = useCallback(async () => {
    try {
      const data = await campaignApi.getMy()
      setMyCampaigns(data.campaigns || [])
    } catch (err) { showToast(err.message, true) }
  }, [showToast])

  // Auth
  const openAuth = (mode = 'login', role = 'donor') => {
    setAuthMode(mode)
    setAuthRole(role)
    setAuthOpen(true)
  }
  const closeAuth = () => setAuthOpen(false)

  const register = async (name, email, password, role, recaptchaToken) => {
    // role is either 'donor' or 'creator' – backend will accept it
    const data = await authApi.register({ name, email, password, role, recaptchaToken })
    saveToken(data.token)
    setCurrentUser(data.user)
    showToast(data.message)
    return data.user
  }

  const login = async (email, password) => {
    const data = await authApi.login({ email, password })
    saveToken(data.token)
    setCurrentUser(data.user)
    showToast(data.message)
    return data.user
  }

  const logout = () => {
    clearToken()
    setCurrentUser(null)
    setMyCampaigns([])
    setWalletBalance(0)
    showToast('Logged out successfully')
  }

  // Donations (guest or card/PayPal)
  const donate = async ({ campaign_id, donor_name, donor_email, amount, message, is_monthly }) => {
    const data = await donationApi.create({ campaign_id, donor_name, donor_email, amount, message, is_monthly })
    showToast(data.message)
    await loadCampaigns()
    return data
  }

  // Wallet donation (logged‑in user)
  const donateFromWallet = async ({ campaign_id, amount, donor_name, donor_email, message, is_monthly }) => {
    const data = await walletApi.donateFromWallet({
      campaign_id, amount, donor_name, donor_email, message, is_monthly,
    })
    showToast(data.message)
    await loadCampaigns()
    fetchWalletBalance() // refresh balance after spending
    return data
  }

  // Campaign helpers
  function buildFormData(fields) {
    const fd = new FormData()
    Object.entries(fields).forEach(([key, val]) => {
      if (val !== undefined && val !== null) fd.append(key, val)
    })
    return fd
  }

  const createCampaign = async (fields) => {
    const data = await campaignApi.create(buildFormData(fields))
    showToast(data.message)
    await loadMyCampaigns()
    return data.campaign
  }

  const updateCampaign = async (id, fields) => {
    const data = await campaignApi.update(id, buildFormData(fields))
    showToast(data.message)
    await loadMyCampaigns()
    return data.campaign
  }

  const deleteCampaign = async (id) => {
    await campaignApi.delete(id)
    showToast('Campaign deleted')
    setMyCampaigns(prev => prev.filter(c => c.id !== id))
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  const approvedCampaigns = campaigns.filter(c => c.status === 'approved')
  const totalFunds = campaigns.reduce((s, c) => s + parseFloat(c.raised || 0), 0)

  return (
    <AppContext.Provider value={{
      currentUser, campaigns, approvedCampaigns,
      myCampaigns, totalFunds, loading,
      toast, authOpen, authMode, authRole,
      openAuth, closeAuth, login, register, logout,
      loadCampaigns, loadMyCampaigns,
      createCampaign, updateCampaign, deleteCampaign,
      donate, donateFromWallet,   // both donation methods
      showToast,
      theme, saveTheme, fetchTheme,
      walletBalance, refreshWallet: fetchWalletBalance,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() { return useContext(AppContext) }