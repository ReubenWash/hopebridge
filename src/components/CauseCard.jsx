import { useNavigate } from 'react-router-dom';

export default function CauseCard({ campaign, onDonate }) {
  const navigate = useNavigate();
  const pct = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const imageUrl = campaign.image_url || 'https://placehold.co/600x200?text=HopeBridge';

  const handleCardClick = () => {
    navigate(`/campaign/${campaign.id}`);
  };

  const handleDonateClick = (e) => {
    e.stopPropagation();
    onDonate(campaign.id);
  };

  return (
    <div className="cause-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card-img-block" style={{ backgroundImage: `url('${imageUrl}')` }}>
        <span className="card-category">{campaign.category || 'Cause'}</span>
      </div>
      <div className="card-content">
        <h3>{campaign.title}</h3>
        <p>{campaign.description ? campaign.description.substring(0, 80) : 'No description available'}...</p>
        <div className="progress-label">
          <span>Raised: ${campaign.raised.toLocaleString()}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="prog-bg">
          <div className="prog-fill" style={{ width: `${pct}%` }}></div>
        </div>
        <div className="card-footer-row">
          <span className="raised-amount">Goal: ${campaign.goal.toLocaleString()}</span>
          <button className="donate-cause-btn" onClick={handleDonateClick}>Donate</button>
        </div>
      </div>
    </div>
  );
}