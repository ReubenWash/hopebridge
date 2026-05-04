import { useState, useEffect } from 'react'
import { donationApi } from '../services/api'
import { useApp } from '../context/AppContext'

export default function DonationsModal({ campaign, onClose }) {
  const { showToast } = useApp()
  const [donations, setDonations] = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    donationApi.getCampaignDons(campaign.id)
      .then(data => { setDonations(data.donations); setTotal(data.total) })
      .catch(err => showToast(err.message, true))
      .finally(() => setLoading(false))
  }, [campaign.id])

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 620 }}>
        <h3>Donations — {campaign.title}</h3>
        {loading ? (
          <p style={{ color: 'var(--text-light)', padding: 20 }}>Loading...</p>
        ) : donations.length === 0 ? (
          <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 20 }}>No donations yet.</p>
        ) : (
          <>
            <table className="admin-table">
              <thead><tr><th>Donor</th><th>Amount</th><th>Date</th><th>Monthly</th></tr></thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id}>
                    <td>{d.donor_name}</td>
                    <td>${parseFloat(d.amount).toLocaleString()}</td>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                    <td>{d.is_monthly ? '✅' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: 14, fontWeight: 700, color: 'var(--dark)' }}>
              Total raised: ${parseFloat(total).toLocaleString()}
            </p>
          </>
        )}
        <button className="btn-outline-custom" style={{ marginTop: 16 }} onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
