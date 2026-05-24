import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  authApi, campaignApi, donationApi, adminApi, walletApi,
  saveToken, clearToken, getToken,
} from '../services/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null)
  const [campaigns, setCampaigns]       = useState([])
  const [myCampaigns, setMyCampaigns]   = useState([])
  const [toast, setToast]               = useState(null)
  const [authOpen, setAuthOpen]         = useState(false)
  const [authMode, setAuthMode]         = useState('login')
  const [authRole, setAuthRole]         = useState('donor')
  const [loading, setLoading]           = useState(true)
  const [theme, setTheme]               = useState({})
  const [walletBalance, setWalletBalance] = useState(0)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState(null)

  const sessionRestored = useRef(false)
  const navigate = useNavigate()

  const showToast = useCallback((msg, error = false) => {
    setToast({ msg, error })
    setTimeout(() => setToast(null), 3800)
  }, [])

  const fetchWalletBalance = useCallback(async () => {
    try {
      const data = await walletApi.getBalance()
      setWalletBalance(parseFloat(data.balance) || 0)
    } catch (err) {
      console.warn('[Wallet] Fetch failed:', err.message)
    }
  }, [])

  const redirectToDashboard = useCallback((user) => {
    if (!user) return
    if (user.role === 'admin') {
      navigate('/admin-dashboard')
    } else if (user.role === 'creator') {
      navigate('/creator-dashboard')
    } else if (user.role === 'donor') {
      navigate('/donor-dashboard')
    }
  }, [navigate])

  // Restore session
  useEffect(() => {
    if (sessionRestored.current) return
    sessionRestored.current = true

    const token = getToken()
    if (!token) { setLoading(false); return }

    authApi.me()
      .then(data => {
        const user = data.user ?? data
        setCurrentUser(user)
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchWalletBalance()
    } else {
      setWalletBalance(0)
    }
  }, [currentUser, fetchWalletBalance])

  // Theme helpers
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
    } catch {
      // Fallback to CSS defaults
    }
  }, [applyTheme])

  const saveTheme = async (updatedTheme) => {
    await adminApi.saveTheme(updatedTheme)
    setTheme(updatedTheme)
    applyTheme(updatedTheme)
    showToast('Theme updated')
  }

  useEffect(() => {
    if (currentUser?.role === 'admin') fetchTheme()
  }, [currentUser, fetchTheme])

  // Campaigns
  const loadCampaigns = useCallback(async (params = {}) => {
    try {
      const data = await campaignApi.getAll(params)
      setCampaigns(data.campaigns || [])
      return data
    } catch (err) {
      showToast(err.message, true)
    }
  }, [showToast])

  const loadMyCampaigns = useCallback(async () => {
    try {
      const data = await campaignApi.getMy()
      setMyCampaigns(data.campaigns || [])
    } catch (err) {
      showToast(err.message, true)
    }
  }, [showToast])

  // Auth
  const openAuth = (mode = 'login', role = 'donor') => {
    setAuthMode(mode)
    setAuthRole(role)
    setAuthOpen(true)
  }
  const closeAuth = () => setAuthOpen(false)

  const register = async (name, email, password, role, recaptchaToken) => {
    const data = await authApi.register({ name, email, password, role, recaptchaToken })
    
    if (data.needsVerification) {
      setPendingVerificationEmail(email)
      showToast(data.message)
      return { needsVerification: true, email: data.email }
    }
    
    if (data.token) {
      saveToken(data.token)
    }
    if (data.user) {
      setCurrentUser(data.user)
      showToast(`Welcome to HopeBridge, ${data.user.name}!`)
      redirectToDashboard(data.user)
    } else {
      showToast(data.message)
    }
    return data.user
  }

  const login = async (email, password) => {
    const data = await authApi.login({ email, password })
    
    if (data.token) {
      saveToken(data.token)
    }
    if (data.user) {
      setCurrentUser(data.user)
      showToast(data.message)
      redirectToDashboard(data.user)
    }
    return data.user
  }

  const logout = () => {
    clearToken()
    setCurrentUser(null)
    setMyCampaigns([])
    setWalletBalance(0)
    setPendingVerificationEmail(null)
    showToast('Logged out successfully')
    navigate('/')
  }

  // Wallet donation
  const donateFromWallet = async ({ campaign_id, amount, donor_name, donor_email, message, is_monthly }) => {
    const data = await walletApi.donateFromWallet({
      campaign_id, amount, donor_name, donor_email, message, is_monthly,
    })
    showToast(data.message)
    await loadCampaigns()
    fetchWalletBalance()
    return data
  }

  // Campaign helpers
  const buildFormData = useCallback((fields) => {
    const formData = new FormData()
    
    Object.entries(fields).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      
      if (value instanceof File) {
        formData.append(key, value, value.name)
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && !(item instanceof File)) {
            formData.append(`${key}[${index}]`, JSON.stringify(item))
          } else {
            formData.append(`${key}[${index}]`, item)
          }
        })
      } else if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, String(value))
      }
    })
    
    return formData
  }, [])

  const createCampaign = async (fields) => {
    const formData = fields instanceof FormData ? fields : buildFormData(fields)
    const data = await campaignApi.create(formData)
    showToast(data.message)
    await loadMyCampaigns()
    return data.campaign
  }

  const updateCampaign = async (id, fields) => {
    const formData = fields instanceof FormData ? fields : buildFormData(fields)
    const data = await campaignApi.update(id, formData)
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

  // Refresh user data (for after verification)
  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.me()
      const user = data.user ?? data
      setCurrentUser(user)
      return user
    } catch (err) {
      console.error('Failed to refresh user:', err)
      return null
    }
  }, [])

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,  // ← ADDED: This is needed for AuthModal to update user after verification
      campaigns,
      approvedCampaigns,
      myCampaigns,
      totalFunds,
      loading,
      toast,
      authOpen,
      authMode,
      authRole,
      openAuth,
      closeAuth,
      login,
      register,
      logout,
      loadCampaigns,
      loadMyCampaigns,
      createCampaign,
      updateCampaign,
      deleteCampaign,
      donateFromWallet,
      showToast,
      theme,
      saveTheme,
      fetchTheme,
      walletBalance,
      refreshWallet: fetchWalletBalance,
      pendingVerificationEmail,
      redirectToDashboard,
      refreshUser,  // ← ADDED: For refreshing user data
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() { return useContext(AppContext) }