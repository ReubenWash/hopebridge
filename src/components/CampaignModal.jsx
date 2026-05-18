import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function CampaignModal({ campaign, onClose }) {
  const { createCampaign, updateCampaign, showToast } = useApp()
  const [title, setTitle]           = useState(campaign?.title || '')
  const [description, setDescription] = useState(campaign?.description || '')
  const [goal, setGoal]             = useState(campaign?.goal || '')
  const [imageUrl, setImageUrl]     = useState(campaign?.image_url || '')
  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState(campaign?.image_url || '')
  const [category, setCategory]     = useState(campaign?.category || 'General')
  const [busy, setBusy]             = useState(false)

  const CATEGORIES = ['Education','Water','Health','Environment','Food','Shelter','General']

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image too large. Please use a file under 5MB.', true)
        return
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file (JPG, PNG, WebP)', true)
        return
      }
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      // Clear URL field when file is selected
      setImageUrl('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !goal || goal < 10) { 
      showToast('Title and goal (min $10) required', true)
      return 
    }
    
    setBusy(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description || '')
      formData.append('goal', parseFloat(goal))
      formData.append('category', category)
      
      // Handle image - use file if selected, otherwise use URL
      if (imageFile) {
        formData.append('image', imageFile)
        console.log('Appending image file:', imageFile.name, imageFile.size)
      } else if (imageUrl) {
        formData.append('image_url', imageUrl)
        console.log('Appending image URL:', imageUrl)
      }
      
      // Debug: Log FormData contents
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0], pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1])
      }
      
      if (campaign) {
        await updateCampaign(campaign.id, formData)
      } else {
        await createCampaign(formData)
      }
      onClose()
      showToast(campaign ? 'Campaign updated successfully!' : 'Campaign created successfully!')
    } catch (err) {
      console.error('Campaign submission error:', err)
      showToast(err.message || 'Failed to save campaign', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 550, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3>{campaign ? 'Edit Campaign' : 'Create Campaign'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mf-field">
            <label>Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          
          <div className="mf-field">
            <label>Description</label>
            <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          
          <div className="mf-field">
            <label>Goal ($) *</label>
            <input type="number" min="10" step="10" value={goal} onChange={e => setGoal(e.target.value)} required />
          </div>
          
          <div className="mf-field">
            <label>Category</label>
            <select className="form-ctrl" style={{marginBottom:0}} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mf-field" style={{ marginTop: 16 }}>
              <label>Image Preview</label>
              <div style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                padding: 8,
                background: '#f9fafb'
              }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 150, 
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto'
                  }} 
                />
              </div>
            </div>
          )}
          
          <div className="mf-field" style={{marginTop:16}}>
            <label>Upload Image (JPG, PNG, WebP, max 5MB)</label>
            <input 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/webp" 
              onChange={handleFileChange} 
              style={{width:'100%',padding:'8px 0'}} 
            />
            <small style={{ color: '#6b7280', fontSize: 11 }}>
              {imageFile ? `Selected: ${imageFile.name}` : 'Choose an image file...'}
            </small>
          </div>
          
          <div className="mf-field">
            <label>Or Image URL</label>
            <input 
              type="text" 
              value={imageUrl} 
              onChange={e => {
                setImageUrl(e.target.value)
                if (e.target.value) {
                  setImageFile(null)
                  setImagePreview(e.target.value)
                }
              }} 
              placeholder="https://example.com/image.jpg" 
              disabled={!!imageFile} 
            />
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