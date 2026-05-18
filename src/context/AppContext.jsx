import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
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

  const sessionRestored = useRef(false)

  const showToast = useCallback((msg, error = false) => {
    setToast({ msg, error })
    setTimeout(() => setToast(null), 3800)
  }, [])

  const fetchWalletBalance = useCallback(async () => {
    try {
      const data = await walletApi.getBalance()
      setWalletBalance(parseFloat(data.balance) || 0)
    } catch (err) {
      console.warn('Wallet fetch failed:', err.message)
    }
  }, [])

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
    if (currentUser) fetchWalletBalance()
    else setWalletBalance(0)
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
    } catch { /* fallback to CSS defaults */ }
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

  // Campaign helpers with proper FormData handling for file uploads
  const buildFormData = useCallback((fields) => {
    const formData = new FormData()
    
    console.log('🔨 Building FormData from fields:', Object.keys(fields))
    
    Object.entries(fields).forEach(([key, value]) => {
      // Skip undefined or null values
      if (value === undefined || value === null) return
      
      // Handle File objects specially
      if (value instanceof File) {
        formData.append(key, value, value.name)
        console.log(`   📎 Appending file: ${key} = ${value.name} (${value.size} bytes, ${value.type})`)
      }
      // Handle arrays
      else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && !(item instanceof File)) {
            formData.append(`${key}[${index}]`, JSON.stringify(item))
          } else {
            formData.append(`${key}[${index}]`, item)
          }
        })
        console.log(`   📋 Appending array: ${key} with ${value.length} items`)
      }
      // Handle objects (but not Files)
      else if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value))
        console.log(`   📦 Appending object: ${key} =`, value)
      }
      // Handle primitive values
      else {
        formData.append(key, String(value))
        console.log(`   📝 Appending field: ${key} = ${String(value).substring(0, 50)}`)
      }
    })
    
    // Debug: Log all FormData contents
    console.log('📋 Final FormData contents:')
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`   ✅ ${pair[0]} = [FILE: ${pair[1].name}, ${pair[1].size} bytes, ${pair[1].type}]`)
      } else {
        console.log(`   ✅ ${pair[0]} = ${String(pair[1]).substring(0, 100)}`)
      }
    }
    
    return formData
  }, [])

  const createCampaign = async (fields) => {
    console.log('🚀 createCampaign called with type:', fields instanceof FormData ? 'FormData' : 'Object')
    
    if (fields instanceof FormData) {
      console.log('   📋 Received FormData directly, checking contents:')
      let hasFile = false
      for (let pair of fields.entries()) {
        if (pair[1] instanceof File) {
          console.log(`   ✅ FormData contains file: ${pair[0]} = ${pair[1].name} (${pair[1].size} bytes)`)
          hasFile = true
        } else {
          console.log(`   ✅ FormData contains field: ${pair[0]} = ${pair[1]}`)
        }
      }
      if (!hasFile) {
        console.warn('⚠️ FormData has no file! Image may not be uploaded.')
      }
    } else {
      console.log('   📋 Fields object keys:', Object.keys(fields))
      if (fields.image && fields.image instanceof File) {
        console.log(`   ✅ Has image file: ${fields.image.name} (${fields.image.size} bytes)`)
      } else if (fields.image_url) {
        console.log(`   ✅ Has image URL: ${fields.image_url}`)
      } else {
        console.warn('⚠️ No image provided!')
      }
    }
    
    const formData = fields instanceof FormData ? fields : buildFormData(fields)
    
    console.log('📤 Sending to API...')
    const data = await campaignApi.create(formData)
    console.log('✅ API Response:', data)
    
    showToast(data.message)
    await loadMyCampaigns()
    return data.campaign
  }

  const updateCampaign = async (id, fields) => {
    console.log(`✏️ updateCampaign called for ID ${id} with type:`, fields instanceof FormData ? 'FormData' : 'Object')
    
    if (fields instanceof FormData) {
      console.log('   📋 Received FormData directly, checking contents:')
      let hasFile = false
      for (let pair of fields.entries()) {
        if (pair[1] instanceof File) {
          console.log(`   ✅ FormData contains file: ${pair[0]} = ${pair[1].name} (${pair[1].size} bytes)`)
          hasFile = true
        } else {
          console.log(`   ✅ FormData contains field: ${pair[0]} = ${pair[1]}`)
        }
      }
      if (!hasFile) {
        console.warn('⚠️ FormData has no file! Image may not be uploaded.')
      }
    } else {
      console.log('   📋 Fields object keys:', Object.keys(fields))
      if (fields.image && fields.image instanceof File) {
        console.log(`   ✅ Has image file: ${fields.image.name} (${fields.image.size} bytes)`)
      } else if (fields.image_url) {
        console.log(`   ✅ Has image URL: ${fields.image_url}`)
      } else {
        console.warn('⚠️ No image provided!')
      }
    }
    
    const formData = fields instanceof FormData ? fields : buildFormData(fields)
    
    console.log(`📤 Sending update to API for ID ${id}...`)
    const data = await campaignApi.update(id, formData)
    console.log('✅ API Response:', data)
    
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
      donateFromWallet,
      showToast,
      theme, saveTheme, fetchTheme,
      walletBalance, refreshWallet: fetchWalletBalance,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() { return useContext(AppContext) }