import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { donationApi, walletApi } from '../services/api';
import DonationForm from '../components/DonationForm';

export default function DonorDashboard() {
  const { currentUser, approvedCampaigns, loadCampaigns, walletBalance, refreshWallet } = useApp();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('campaigns');

  useEffect(() => {
    if (!currentUser) navigate('/');
    loadCampaigns();
    loadDonationHistory();
  }, []);

  const loadDonationHistory = async () => {
    try {
      const res = await donationApi.getMyDonations();
      setDonations(res.donations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = () => {
    navigate('/wallet');  // wallet page handles deposit requests
  };

  if (!currentUser) return null;

  return (
    <div className="donor-dashboard container-inner" style={{ padding: '40px 0' }}>
      {/* Header with wallet */}
      <div className="dash-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <h2>My Dashboard</h2>
        <div className="wallet-card" style={{ background: 'var(--primary)', padding: '12px 24px', borderRadius: '12px', color: '#fff' }}>
          <span>💰 Wallet Balance: </span>
          <strong>${walletBalance.toFixed(2)}</strong>
          <button onClick={handleAddFunds} style={{ marginLeft: '12px', background: '#fff', color: 'var(--primary)', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>
            + Add Funds
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="settings-tabs" style={{ margin: '30px 0 20px' }}>
        <button className={`role-tab ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')}>
          Active Campaigns
        </button>
        <button className={`role-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          My Donations
        </button>
      </div>

      {/* Campaigns tab */}
      {activeTab === 'campaigns' && (
        <div>
          {approvedCampaigns.length === 0 ? (
            <p>No active campaigns at the moment.</p>
          ) : (
            <div className="cards-grid">
              {approvedCampaigns.map(campaign => (
                <div key={campaign.id} className="cause-card">
                  <div className="card-img-block" style={{ backgroundImage: `url(${campaign.image_url || 'https://placehold.co/600x200?text=HopeBridge'})` }}>
                    <span className="card-category">{campaign.category || 'Cause'}</span>
                  </div>
                  <div className="card-content">
                    <h3>{campaign.title}</h3>
                    <p>{campaign.description?.slice(0, 80)}...</p>
                    <div className="progress-label">
                      <span>Raised: ${parseFloat(campaign.raised || 0).toLocaleString()}</span>
                      <span>{Math.min((campaign.raised / campaign.goal) * 100, 100).toFixed(0)}%</span>
                    </div>
                    <div className="prog-bg"><div className="prog-fill" style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}></div></div>
                    <button className="donate-cause-btn" onClick={() => navigate('/?scrollTo=donate', { state: { presetCampaign: campaign.id } })}>
                      Donate Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="tab-card">
          <h5>Recent Donations</h5>
          {loading ? (
            <p>Loading...</p>
          ) : donations.length === 0 ? (
            <p>You haven't made any donations yet.</p>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Date</th><th>Campaign</th><th>Amount</th><th>Method</th><th>Monthly</th></tr></thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id}>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                    <td>{d.campaign_title}</td>
                    <td>${parseFloat(d.amount).toLocaleString()}</td>
                    <td>{d.payment_method || 'card'}</td>
                    <td>{d.is_monthly ? '✅' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}