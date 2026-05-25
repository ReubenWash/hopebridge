import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, Bell, Shield, Save, Eye, EyeOff, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProfileSettings({ onClose, userRole }) {
  const { currentUser, showToast, refreshUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    donation_alerts: true,
    campaign_updates: true,
    marketing_emails: false
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
    loadNotificationSettings();
  }, [currentUser]);

  const loadNotificationSettings = async () => {
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${API_URL}/users/me/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotificationSettings(data.settings || notificationSettings);
      }
    } catch (err) {
      console.error('Failed to load notification settings:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim() === '') {
      showToast('Name is required', true);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${API_URL}/users/me/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: formData.name.trim() })
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Profile updated successfully');
        if (refreshUser) refreshUser();
      } else {
        showToast(data.error || 'Update failed', true);
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast('New passwords do not match', true);
      return;
    }
    if (passwordData.new_password.length < 6) {
      showToast('Password must be at least 6 characters', true);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${API_URL}/users/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Password changed successfully');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        showToast(data.error || 'Password change failed', true);
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hb_token');
      const response = await fetch(`${API_URL}/users/me/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationSettings)
      });
      if (response.ok) {
        showToast('Notification settings saved');
      } else {
        const data = await response.json();
        showToast(data.error || 'Save failed', true);
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Header with close button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)'
      }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--fd)', fontSize: '20px' }}>Settings</h3>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} stroke="var(--txt-3)" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        padding: '0 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: activeTab === tab.id ? 'var(--green)' : 'var(--txt-2)',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--green)' : '2px solid transparent',
              transition: 'all var(--tr)'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px', background: 'var(--surface)' }}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt-2)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Full Name
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', color: 'var(--txt-3)' }} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    border: '1px solid var(--border-2)',
                    borderRadius: '10px',
                    fontFamily: 'var(--fb)',
                    background: 'var(--surface-2)',
                    color: 'var(--txt)'
                  }}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt-2)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', color: 'var(--txt-3)' }} />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    border: '1px solid var(--border-2)',
                    borderRadius: '10px',
                    fontFamily: 'var(--fb)',
                    background: 'var(--surface-2)',
                    color: 'var(--txt-3)',
                    cursor: 'not-allowed'
                  }}
                />
              </div>
              <small style={{ fontSize: '11px', color: 'var(--txt-3)', marginTop: '4px', display: 'block' }}>
                Email cannot be changed. Contact support for assistance.
              </small>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt-2)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Account Type
              </label>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                background: userRole === 'creator' ? 'var(--green-l)' : 'var(--blue-l)',
                color: userRole === 'creator' ? 'var(--green-d)' : 'var(--blue)'
              }}>
                {userRole === 'creator' ? 'Creator Account' : 'Donor Account'}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: 'var(--green)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt-2)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Current Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', color: 'var(--txt-3)' }} />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    border: '1px solid var(--border-2)',
                    borderRadius: '10px',
                    fontFamily: 'var(--fb)',
                    background: 'var(--surface-2)',
                    color: 'var(--txt)'
                  }}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--txt-3)'
                  }}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt-2)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                New Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', color: 'var(--txt-3)' }} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    border: '1px solid var(--border-2)',
                    borderRadius: '10px',
                    fontFamily: 'var(--fb)',
                    background: 'var(--surface-2)',
                    color: 'var(--txt)'
                  }}
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--txt-3)'
                  }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--txt-2)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', color: 'var(--txt-3)' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    border: '1px solid var(--border-2)',
                    borderRadius: '10px',
                    fontFamily: 'var(--fb)',
                    background: 'var(--surface-2)',
                    color: 'var(--txt)'
                  }}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--txt-3)'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: 'var(--green)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              <Lock size={16} /> {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px', background: 'var(--surface-2)', borderRadius: '12px', marginBottom: '12px' }}>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.email_notifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, email_notifications: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: notificationSettings.email_notifications ? 'var(--green)' : '#ccc',
                    transition: '.3s',
                    borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '20px',
                      width: '20px',
                      left: '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '.3s',
                      borderRadius: '50%',
                      transform: notificationSettings.email_notifications ? 'translateX(24px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Email Notifications</strong>
                  <p style={{ fontSize: '12px', color: 'var(--txt-3)', margin: 0 }}>Receive email updates about your account activity</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px', background: 'var(--surface-2)', borderRadius: '12px', marginBottom: '12px' }}>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.donation_alerts}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, donation_alerts: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: notificationSettings.donation_alerts ? 'var(--green)' : '#ccc',
                    transition: '.3s',
                    borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      height: '20px',
                      width: '20px',
                      left: '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '.3s',
                      borderRadius: '50%',
                      transform: notificationSettings.donation_alerts ? 'translateX(24px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Donation Alerts</strong>
                  <p style={{ fontSize: '12px', color: 'var(--txt-3)', margin: 0 }}>Get notified when someone donates to your campaign</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px', background: 'var(--surface-2)', borderRadius: '12px', marginBottom: '12px' }}>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.campaign_updates}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, campaign_updates: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: notificationSettings.campaign_updates ? 'var(--green)' : '#ccc',
                    transition: '.3s',
                    borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      height: '20px',
                      width: '20px',
                      left: '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '.3s',
                      borderRadius: '50%',
                      transform: notificationSettings.campaign_updates ? 'translateX(24px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Campaign Updates</strong>
                  <p style={{ fontSize: '12px', color: 'var(--txt-3)', margin: 0 }}>Receive updates about campaigns you support or manage</p>
                </div>
              </div>
              {userRole === 'creator' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px', background: 'var(--surface-2)', borderRadius: '12px', marginBottom: '12px' }}>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketing_emails}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, marketing_emails: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: notificationSettings.marketing_emails ? 'var(--green)' : '#ccc',
                      transition: '.3s',
                      borderRadius: '34px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        height: '20px',
                        width: '20px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '.3s',
                        borderRadius: '50%',
                        transform: notificationSettings.marketing_emails ? 'translateX(24px)' : 'translateX(0)'
                      }} />
                    </span>
                  </label>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Marketing & Tips</strong>
                    <p style={{ fontSize: '12px', color: 'var(--txt-3)', margin: 0 }}>Receive tips and best practices for running successful campaigns</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={saveNotificationSettings}
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: 'var(--green)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              <Save size={16} /> {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}