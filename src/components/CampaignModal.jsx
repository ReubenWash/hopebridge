import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function CampaignModal({ campaign, onClose }) {
  const { createCampaign, updateCampaign, showToast } = useApp()
  const [title, setTitle]           = useState(campaign?.title || '')
  const [description, setDescription] = useState(campaign?.description || '')
  const [goal, setGoal]             = useState(campaign?.goal || '')
  const [imageUrl, setImageUrl]     = useState(campaign?.image_url || '')
  const [imageFile, setImageFile]   = useState(null)
  const [category, setCategory]     = useState(campaign?.category || 'General')
  const [busy, setBusy]             = useState(false)

  const CATEGORIES = ['Education','Water','Health','Environment','Food','Shelter','General']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !goal || goal < 10) { showToast('Title and goal (min $10) required', true); return }
    setBusy(true)
    try {
      const fields = {
        title, description, goal: parseFloat(goal), category,
        image_url: imageFile ? undefined : imageUrl,
        ...(imageFile ? { image: imageFile } : {}),
      }
      if (campaign) await updateCampaign(campaign.id, fields)
      else await createCampaign(fields)
      onClose()
    } catch (err) {
      showToast(err.message, true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h3>{campaign ? 'Edit Campaign' : 'Create Campaign'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mf-field">
            <label>Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="mf-field">
            <label>Description</label>
            <textarea rows="2" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="mf-field">
            <label>Goal ($) *</label>
            <input type="number" min="10" value={goal} onChange={e => setGoal(e.target.value)} required />
          </div>
          <div className="mf-field">
            <label>Category</label>
            <select className="form-ctrl" style={{marginBottom:0}} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mf-field" style={{marginTop:16}}>
            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{width:'100%',padding:'8px 0'}} />
          </div>
          <div className="mf-field">
            <label>Or Image URL</label>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." disabled={!!imageFile} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <button type="button" className="btn-outline-custom" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-custom" disabled={busy}>
              {busy ? 'Saving...' : 'Save Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
