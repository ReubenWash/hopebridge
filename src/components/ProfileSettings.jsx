// src/components/ProfileSettings.jsx
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';
import { User, Mail, Lock, Bell, Shield, Save, Eye, EyeOff } from 'lucide-react';

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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/user/notification-settings`, {
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
    setLoading(true);
    try {
      await authApi.updateMe({ name: formData.name });
      showToast('Profile updated successfully');
      if (refreshUser) refreshUser();
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
      await authApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      showToast('Password changed successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/user/notification-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationSettings)
      });
      if (response.ok) {
        showToast('Notification settings saved');
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
    <div className="profile-settings-container">
      {/* Tabs */}
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        {onClose && (
          <button className="settings-close-btn" onClick={onClose}>×</button>
        )}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="settings-section">
          <h3>Profile Information</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-control"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="form-control disabled"
                />
              </div>
              <small>Email cannot be changed. Contact support for assistance.</small>
            </div>
            <div className="form-group">
              <label>Account Type</label>
              <div className="account-badge">
                <span className={`badge ${userRole === 'creator' ? 'creator-badge' : 'donor-badge'}`}>
                  {userRole === 'creator' ? 'Creator Account' : 'Donor Account'}
                </span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="settings-section">
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="form-control"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="form-control"
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  className="form-control"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="settings-section">
          <h3>Notification Preferences</h3>
          <div className="notification-options">
            <div className="notification-option">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.email_notifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, email_notifications: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="notification-info">
                <strong>Email Notifications</strong>
                <p>Receive email updates about your account activity</p>
              </div>
            </div>
            <div className="notification-option">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.donation_alerts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, donation_alerts: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="notification-info">
                <strong>Donation Alerts</strong>
                <p>Get notified when someone donates to your campaign</p>
              </div>
            </div>
            <div className="notification-option">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.campaign_updates}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, campaign_updates: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="notification-info">
                <strong>Campaign Updates</strong>
                <p>Receive updates about campaigns you support or manage</p>
              </div>
            </div>
            {userRole === 'creator' && (
              <div className="notification-option">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notificationSettings.marketing_emails}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, marketing_emails: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <div className="notification-info">
                  <strong>Marketing & Tips</strong>
                  <p>Receive tips and best practices for running successful campaigns</p>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={saveNotificationSettings} disabled={loading}>
            {loading ? 'Saving...' : <><Save size={16} /> Save Preferences</>}
          </button>
        </div>
      )}
    </div>
  );
}