export default function CauseCard({ campaign, onDonate }) {
  const pct = Math.min((campaign.raised / campaign.goal) * 100, 100)

  return (
    <div className="cause-card">
      <div className="card-img-block" style={{ backgroundImage: `url('${campaign.image || 'https://placehold.co/600x200?text=HopeBridge'}')` }}>
        <span className="card-category">{campaign.category || 'Cause'}</span>
      </div>
      <div className="card-content">
        <h3>{campaign.title}</h3>
        <p>{campaign.description.substring(0, 80)}...</p>
        <div className="progress-label">
          <span>Raised: ${campaign.raised.toLocaleString()}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="prog-bg">
          <div className="prog-fill" style={{ width: `${pct}%` }}></div>
        </div>
        <div className="card-footer-row">
          <span className="raised-amount">Goal: ${campaign.goal.toLocaleString()}</span>
          <button className="donate-cause-btn" onClick={() => onDonate(campaign.id)}>Donate</button>
        </div>
      </div>
    </div>
  )
}
