import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { walletApi } from '../services/api'

const TABS = ['overview', 'deposit', 'withdraw', 'history']

export default function WalletFloating() {
  const { currentUser, walletBalance, refreshWallet, showToast } = useApp()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('overview')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Deposit form
  const [depositAmount, setDepositAmount] = useState('')
  const [depositLoading, setDepositLoading] = useState(false)
  const [depositRequest, setDepositRequest] = useState(null)
  const [proofFile, setProofFile] = useState(null)
  const [proofUploading, setProofUploading] = useState(false)
  const proofInputRef = useRef()

  // Withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState('bank')
  const [withdrawDetails, setWithdrawDetails] = useState('')
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  const panelRef = useRef()

  useEffect(() => {
    if (open && currentUser) loadSummary()
  }, [open, currentUser])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const loadSummary = async () => {
    setLoading(true)
    try {
      const data = await walletApi.getSummary()
      setSummary(data)
      // Check for pending deposit request
      const pending = data.depositRequests?.find(r =>
        ['pending','instructions_sent','awaiting_proof'].includes(r.status)
      )
      if (pending) setDepositRequest(pending)
    } catch (err) {
      console.warn('Wallet summary failed:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestDeposit = async (e) => {
    e.preventDefault()
    const amt = parseFloat(depositAmount)
    if (!amt || amt < 1) { showToast('Enter amount (min $1)', true); return }
    setDepositLoading(true)
    try {
      const res = await walletApi.requestDeposit({ amount: amt })
      setDepositRequest(res.request)
      showToast(res.message)
      setDepositAmount('')
      loadSummary()
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setDepositLoading(false)
    }
  }

  const handleUploadProof = async () => {
    if (!proofFile || !depositRequest) return
    setProofUploading(true)
    try {
      const fd = new FormData()
      fd.append('proof', proofFile)
      const res = await walletApi.uploadProof(depositRequest.id, fd)
      showToast(res.message)
      setProofFile(null)
      setDepositRequest(res.request)
      loadSummary()
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setProofUploading(false)
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    const amt = parseFloat(withdrawAmount)
    if (!amt || amt < 1) { showToast('Enter amount (min $1)', true); return }
    if (amt > (summary?.balance || walletBalance)) {
      showToast('Insufficient balance', true); return
    }
    if (!withdrawDetails.trim()) { showToast('Payment details required', true); return }
    setWithdrawLoading(true)
    try {
      const res = await walletApi.requestWithdrawal({
        amount: amt,
        payment_method: withdrawMethod,
        payment_details: withdrawDetails,
      })
      showToast(res.message)
      setWithdrawAmount('')
      setWithdrawDetails('')
      refreshWallet()
      loadSummary()
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setWithdrawLoading(false)
    }
  }

  if (!currentUser) return null

  const balance = summary?.balance ?? walletBalance
  const txList = summary?.transactions || []
  const deposits = summary?.depositRequests || []
  const withdrawals = summary?.withdrawals || []

  const statusColor = (s) => ({
    pending: '#f59e0b', instructions_sent: '#3b82f6', awaiting_proof: '#8b5cf6',
    approved: '#10b981', rejected: '#ef4444', paid: '#10b981',
  }[s] || '#6b7280')

  const statusLabel = (s) => ({
    pending: 'Pending',
    instructions_sent: 'Instructions Sent ✉',
    awaiting_proof: 'Proof Uploaded',
    approved: 'Approved ✓',
    rejected: 'Rejected',
    paid: 'Paid ✓',
  }[s] || s)

  const txIcon = (type) => ({
    deposit: '⬆', donation_out: '❤', refund_in: '↩',
    withdrawal_out: '⬇', escrow_hold: '🔒', escrow_release: '🔓', escrow_refund: '↩',
  }[type] || '•')

  const txColor = (type) =>
    ['deposit','refund_in','escrow_release','escrow_refund'].includes(type) ? '#10b981' : '#ef4444'

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#1D9E75,#0F6E56)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 800,
          boxShadow: '0 6px 24px rgba(29,158,117,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          transition: 'transform 0.2s,box-shadow 0.2s',
          transform: open ? 'scale(0.9)' : 'scale(1)',
        }}
        title="Open Wallet"
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>💰</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', fontWeight: 700, letterSpacing: 0.3 }}>
          ${balance.toFixed(0)}
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            bottom: 100,
            right: 28,
            width: 360,
            maxHeight: '80vh',
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            zIndex: 801,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#085041,#1D9E75)',
            padding: '20px 20px 16px',
            color: '#fff',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                  My Wallet
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, marginTop: 4 }}>
                  ${balance.toFixed(2)}
                </div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 3 }}>
                  {currentUser.name}
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16,
              }}>×</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1,
                  background: tab === t ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 4px',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: tab === t ? 700 : 500,
                  fontFamily: 'inherit',
                  textTransform: 'capitalize',
                  letterSpacing: 0.3,
                  transition: 'background 0.15s',
                }}>
                  {t === 'overview' ? '🏠' : t === 'deposit' ? '⬆' : t === 'withdraw' ? '⬇' : '📋'} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div>
                {loading && <div style={{ textAlign:'center', color:'#9ca3af', padding: 20 }}>Loading...</div>}

                {/* Quick actions */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 16 }}>
                  <button onClick={() => setTab('deposit')} style={{
                    background:'#e1f5ee', border:'none', borderRadius:12, padding:'14px 8px',
                    cursor:'pointer', textAlign:'center', transition:'0.15s',
                  }}>
                    <div style={{ fontSize: 22 }}>⬆</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color:'#0F6E56', marginTop: 4 }}>Add Funds</div>
                  </button>
                  <button onClick={() => setTab('withdraw')} style={{
                    background:'#fef3c7', border:'none', borderRadius:12, padding:'14px 8px',
                    cursor:'pointer', textAlign:'center', transition:'0.15s',
                  }}>
                    <div style={{ fontSize: 22 }}>⬇</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color:'#92400e', marginTop: 4 }}>Withdraw</div>
                  </button>
                </div>

                {/* Pending deposit notice */}
                {depositRequest && ['pending','instructions_sent','awaiting_proof'].includes(depositRequest.status) && (
                  <div style={{
                    background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius: 12,
                    padding: 14, marginBottom: 14,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color:'#1d4ed8', marginBottom: 6 }}>
                      📋 Pending Deposit #{depositRequest.id}
                    </div>
                    <div style={{ fontSize: 11, color:'#374151', marginBottom: 6 }}>
                      Amount: <strong>${depositRequest.amount}</strong> ·
                      Status: <span style={{ color: statusColor(depositRequest.status), fontWeight: 700 }}>
                        {statusLabel(depositRequest.status)}
                      </span>
                    </div>
                    {depositRequest.admin_instructions && (
                      <div style={{
                        background:'#dbeafe', borderRadius: 8, padding: '10px 12px',
                        fontSize: 12, color:'#1e40af', marginBottom: 8,
                      }}>
                        <strong>Payment Instructions:</strong><br/>
                        <span style={{ whiteSpace:'pre-wrap' }}>{depositRequest.admin_instructions}</span>
                      </div>
                    )}
                    {(depositRequest.status === 'pending' || depositRequest.status === 'instructions_sent') && !depositRequest.proof_image_url && (
                      <button onClick={() => setTab('deposit')} style={{
                        background:'#2563eb', color:'#fff', border:'none', borderRadius: 8,
                        padding:'7px 14px', cursor:'pointer', fontSize: 12, fontWeight: 700,
                      }}>
                        Upload Payment Proof →
                      </button>
                    )}
                    {depositRequest.status === 'awaiting_proof' && (
                      <div style={{ fontSize: 11, color:'#6b7280' }}>⏳ Admin is reviewing your proof…</div>
                    )}
                  </div>
                )}

                {/* Recent transactions */}
                <div style={{ fontSize: 12, fontWeight: 700, color:'#6b7280', marginBottom: 8, textTransform:'uppercase', letterSpacing: 1 }}>
                  Recent Activity
                </div>
                {txList.length === 0 && !loading && (
                  <div style={{ textAlign:'center', color:'#9ca3af', fontSize: 13, padding: '20px 0' }}>
                    No transactions yet
                  </div>
                )}
                {txList.slice(0,8).map(tx => (
                  <div key={tx.id} style={{
                    display:'flex', alignItems:'center', gap: 10, padding: '10px 0',
                    borderBottom:'1px solid #f3f4f6',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: ['deposit','refund_in','escrow_release'].includes(tx.type) ? '#e1f5ee' : '#fee2e2',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {txIcon(tx.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color:'#111', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {tx.description || tx.type}
                      </div>
                      <div style={{ fontSize: 11, color:'#9ca3af' }}>
                        {new Date(tx.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: txColor(tx.type), flexShrink: 0 }}>
                      {['deposit','refund_in','escrow_release','escrow_refund'].includes(tx.type) ? '+' : '-'}
                      ${parseFloat(tx.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── DEPOSIT TAB ── */}
            {tab === 'deposit' && (
              <div>
                {/* Existing pending request flow */}
                {depositRequest && ['pending','instructions_sent','awaiting_proof'].includes(depositRequest.status) ? (
                  <div>
                    <div style={{
                      background:'linear-gradient(135deg,#eff6ff,#dbeafe)',
                      borderRadius: 14, padding: 16, marginBottom: 16,
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color:'#1d4ed8', marginBottom: 4 }}>
                        Deposit Request #{depositRequest.id}
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 700, color:'#1e40af' }}>
                        ${depositRequest.amount}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <span style={{
                          background: statusColor(depositRequest.status),
                          color:'#fff', borderRadius: 20, padding:'3px 10px', fontSize: 11, fontWeight: 700,
                        }}>
                          {statusLabel(depositRequest.status)}
                        </span>
                      </div>
                    </div>

                    {depositRequest.status === 'pending' && !depositRequest.admin_instructions && (
                      <div style={{
                        background:'#fef9c3', border:'1px solid #fde68a', borderRadius: 12, padding: 14,
                        fontSize: 13, color:'#713f12',
                      }}>
                        <strong>⏳ Awaiting admin review.</strong><br/>
                        Admin will review your request and provide payment instructions. You'll see them here when ready.
                      </div>
                    )}

                    {depositRequest.admin_instructions && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color:'#374151', marginBottom: 6 }}>
                          💳 Payment Instructions from Admin:
                        </div>
                        <div style={{
                          background:'#f0fdf4', border:'1px solid #86efac', borderRadius: 12,
                          padding: 14, fontSize: 13, color:'#14532d', whiteSpace:'pre-wrap',
                        }}>
                          {depositRequest.admin_instructions}
                        </div>
                      </div>
                    )}

                    {(depositRequest.status === 'pending' || depositRequest.status === 'instructions_sent') && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color:'#374151', marginBottom: 8 }}>
                          📎 Upload Payment Proof
                        </div>
                        <div style={{ fontSize: 12, color:'#6b7280', marginBottom: 10 }}>
                          After completing payment, upload a screenshot or receipt as proof.
                        </div>
                        <input
                          type="file"
                          ref={proofInputRef}
                          accept="image/*"
                          style={{ display:'none' }}
                          onChange={e => setProofFile(e.target.files[0])}
                        />
                        {proofFile ? (
                          <div style={{
                            background:'#e1f5ee', borderRadius: 10, padding: 12,
                            fontSize: 13, color:'#0F6E56', marginBottom: 10,
                            display:'flex', alignItems:'center', gap: 8,
                          }}>
                            <span>📄</span>
                            <span style={{ flex: 1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {proofFile.name}
                            </span>
                            <button onClick={() => setProofFile(null)} style={{
                              background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize: 16,
                            }}>×</button>
                          </div>
                        ) : (
                          <button onClick={() => proofInputRef.current?.click()} style={{
                            width:'100%', background:'#f3f4f6', border:'2px dashed #d1d5db',
                            borderRadius: 12, padding: 16, cursor:'pointer', color:'#6b7280',
                            fontSize: 13, fontWeight: 600, fontFamily:'inherit',
                          }}>
                            + Select proof image
                          </button>
                        )}
                        {proofFile && (
                          <button
                            onClick={handleUploadProof}
                            disabled={proofUploading}
                            style={{
                              width:'100%', marginTop: 10,
                              background:'linear-gradient(135deg,#1D9E75,#0F6E56)',
                              color:'#fff', border:'none', borderRadius: 10, padding: 12,
                              cursor:'pointer', fontSize: 14, fontWeight: 700, fontFamily:'inherit',
                            }}
                          >
                            {proofUploading ? 'Uploading...' : '✓ Submit Proof'}
                          </button>
                        )}
                      </div>
                    )}

                    {depositRequest.status === 'awaiting_proof' && (
                      <div style={{
                        background:'#f0fdf4', border:'1px solid #86efac', borderRadius: 12,
                        padding: 14, fontSize: 13, color:'#14532d',
                      }}>
                        ✅ Proof submitted. Admin is verifying your payment. Your wallet will be credited upon approval.
                      </div>
                    )}
                  </div>
                ) : (
                  /* New deposit request form */
                  <div>
                    <div style={{ fontSize: 14, color:'#374151', marginBottom: 16, lineHeight: 1.5 }}>
                      Request a wallet top-up. Admin will review and provide payment details.
                    </div>
                    <form onSubmit={handleRequestDeposit}>
                      <label style={{ fontSize: 12, fontWeight: 700, color:'#374151', display:'block', marginBottom: 6 }}>
                        Amount (USD)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        placeholder="e.g. 100"
                        required
                        style={{
                          width:'100%', padding:'12px 14px', border:'2px solid #e5e7eb',
                          borderRadius: 10, fontSize: 15, fontFamily:'inherit',
                          marginBottom: 12, outline:'none', boxSizing:'border-box',
                        }}
                      />

                      {/* Quick amounts */}
                      <div style={{ display:'flex', gap: 8, marginBottom: 14 }}>
                        {[20,50,100,200,500].map(a => (
                          <button key={a} type="button" onClick={() => setDepositAmount(a)} style={{
                            flex: 1, background: depositAmount == a ? '#1D9E75' : '#f3f4f6',
                            color: depositAmount == a ? '#fff' : '#374151',
                            border:'none', borderRadius: 8, padding:'7px 4px',
                            cursor:'pointer', fontSize: 12, fontWeight: 600, fontFamily:'inherit',
                          }}>
                            ${a}
                          </button>
                        ))}
                      </div>

                      <div style={{
                        background:'#f0fdf4', border:'1px solid #86efac', borderRadius: 10,
                        padding: 12, fontSize: 12, color:'#14532d', marginBottom: 14,
                      }}>
                        💡 After submitting, wait for admin to send payment instructions. Then make the payment and upload proof.
                      </div>

                      <button type="submit" disabled={depositLoading} style={{
                        width:'100%', background:'linear-gradient(135deg,#1D9E75,#0F6E56)',
                        color:'#fff', border:'none', borderRadius: 10, padding: 13,
                        cursor:'pointer', fontSize: 14, fontWeight: 700, fontFamily:'inherit',
                      }}>
                        {depositLoading ? 'Submitting...' : '📤 Request Deposit'}
                      </button>
                    </form>

                    {/* Recent deposits */}
                    {deposits.length > 0 && (
                      <div style={{ marginTop: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color:'#6b7280', marginBottom: 8, textTransform:'uppercase', letterSpacing: 1 }}>
                          Recent Deposits
                        </div>
                        {deposits.map(d => (
                          <div key={d.id} style={{
                            display:'flex', justifyContent:'space-between', alignItems:'center',
                            padding:'10px 0', borderBottom:'1px solid #f3f4f6', fontSize: 13,
                          }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>${d.amount}</div>
                              <div style={{ fontSize: 11, color:'#9ca3af' }}>
                                {new Date(d.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <span style={{
                              background: statusColor(d.status),
                              color:'#fff', borderRadius: 20, padding:'2px 8px', fontSize: 10, fontWeight: 700,
                            }}>
                              {statusLabel(d.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── WITHDRAW TAB ── */}
            {tab === 'withdraw' && (
              <div>
                <div style={{
                  background:'linear-gradient(135deg,#fef9c3,#fef3c7)',
                  borderRadius: 12, padding: 14, marginBottom: 16,
                }}>
                  <div style={{ fontSize: 12, color:'#713f12', fontWeight: 600 }}>Available Balance</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color:'#92400e' }}>
                    ${balance.toFixed(2)}
                  </div>
                </div>

                <form onSubmit={handleWithdraw}>
                  <label style={{ fontSize: 12, fontWeight: 700, color:'#374151', display:'block', marginBottom: 6 }}>
                    Amount (USD)
                  </label>
                  <input
                    type="number" min="1" step="0.01" max={balance}
                    value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 50" required
                    style={{
                      width:'100%', padding:'12px 14px', border:'2px solid #e5e7eb',
                      borderRadius: 10, fontSize: 15, fontFamily:'inherit',
                      marginBottom: 12, outline:'none', boxSizing:'border-box',
                    }}
                  />

                  <label style={{ fontSize: 12, fontWeight: 700, color:'#374151', display:'block', marginBottom: 6 }}>
                    Payment Method
                  </label>
                  <select
                    value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value)}
                    style={{
                      width:'100%', padding:'12px 14px', border:'2px solid #e5e7eb',
                      borderRadius: 10, fontSize: 14, fontFamily:'inherit',
                      marginBottom: 12, outline:'none', background:'#fff', boxSizing:'border-box',
                    }}
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="paypal">PayPal</option>
                  </select>

                  <label style={{ fontSize: 12, fontWeight: 700, color:'#374151', display:'block', marginBottom: 6 }}>
                    {withdrawMethod === 'bank' ? 'Account Number / Bank Details' :
                     withdrawMethod === 'mobile_money' ? 'Mobile Money Number' :
                     'PayPal Email'}
                  </label>
                  <textarea
                    value={withdrawDetails} onChange={e => setWithdrawDetails(e.target.value)}
                    placeholder={
                      withdrawMethod === 'bank' ? 'Bank name, account number, account name...' :
                      withdrawMethod === 'mobile_money' ? 'Number and network (e.g. 0244123456 MTN)' :
                      'your@paypal.com'
                    }
                    rows={3} required
                    style={{
                      width:'100%', padding:'12px 14px', border:'2px solid #e5e7eb',
                      borderRadius: 10, fontSize: 13, fontFamily:'inherit',
                      marginBottom: 12, outline:'none', resize:'vertical', boxSizing:'border-box',
                    }}
                  />

                  <button type="submit" disabled={withdrawLoading} style={{
                    width:'100%', background:'linear-gradient(135deg,#f59e0b,#d97706)',
                    color:'#fff', border:'none', borderRadius: 10, padding: 13,
                    cursor:'pointer', fontSize: 14, fontWeight: 700, fontFamily:'inherit',
                  }}>
                    {withdrawLoading ? 'Submitting...' : '⬇ Request Withdrawal'}
                  </button>
                </form>

                {/* Recent withdrawals */}
                {withdrawals.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color:'#6b7280', marginBottom: 8, textTransform:'uppercase', letterSpacing: 1 }}>
                      Recent Withdrawals
                    </div>
                    {withdrawals.map(w => (
                      <div key={w.id} style={{
                        display:'flex', justifyContent:'space-between', alignItems:'center',
                        padding:'10px 0', borderBottom:'1px solid #f3f4f6', fontSize: 13,
                      }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>${w.amount}</div>
                          <div style={{ fontSize: 11, color:'#9ca3af' }}>
                            {w.payment_method} · {new Date(w.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <span style={{
                          background: statusColor(w.status),
                          color:'#fff', borderRadius: 20, padding:'2px 8px', fontSize: 10, fontWeight: 700,
                        }}>
                          {statusLabel(w.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── HISTORY TAB ── */}
            {tab === 'history' && (
              <div>
                {loading && <div style={{ textAlign:'center', color:'#9ca3af', padding: 20 }}>Loading...</div>}
                {txList.length === 0 && !loading && (
                  <div style={{ textAlign:'center', color:'#9ca3af', padding: '30px 0' }}>
                    No transactions yet
                  </div>
                )}
                {txList.map(tx => (
                  <div key={tx.id} style={{
                    display:'flex', alignItems:'center', gap: 10, padding:'11px 0',
                    borderBottom:'1px solid #f3f4f6',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: ['deposit','refund_in','escrow_release','escrow_refund'].includes(tx.type) ? '#e1f5ee' : '#fee2e2',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize: 16,
                    }}>
                      {txIcon(tx.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {tx.description || tx.type.replace(/_/g,' ')}
                      </div>
                      <div style={{ fontSize: 11, color:'#9ca3af' }}>
                        {new Date(tx.created_at).toLocaleDateString('en-US', {
                          year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit',
                        })}
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: txColor(tx.type) }}>
                        {['deposit','refund_in','escrow_release','escrow_refund'].includes(tx.type) ? '+' : '-'}
                        ${parseFloat(tx.amount).toFixed(2)}
                      </div>
                      <div style={{ fontSize: 10, color:'#d1d5db', textTransform:'uppercase' }}>
                        {tx.type.replace(/_/g,' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding:'10px 16px',
            borderTop:'1px solid #f3f4f6',
            fontSize: 11, color:'#d1d5db', textAlign:'center',
          }}>
            🔒 Secured by HopeBridge Escrow
          </div>
        </div>
      )}
    </>
  )
}