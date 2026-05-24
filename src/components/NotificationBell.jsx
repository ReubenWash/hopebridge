import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, X, AlertCircle, Heart, DollarSign, Target, Users, Settings } from 'lucide-react';
import { adminApi } from '../services/api';
import { useApp } from '../context/AppContext';

export default function NotificationBell({ showToast }) {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef();
  const notificationSound = useRef(null);

  // Load notifications
  const fetchNotifications = async () => {
    try {
      // Try to get notifications from API
      let data;
      try {
        if (currentUser?.role === 'admin') {
          data = await adminApi.getNotificationHistory();
        }
      } catch (err) {
        // If API fails, use mock data for demo
        console.log('Using mock notifications');
      }
      
      // Mock notifications for demo (replace with actual API data)
      const mockNotifications = [
        {
          id: 1,
          title: 'New Donation Received!',
          body: 'Someone just donated $50 to your campaign "Clean Water Project"',
          type: 'donation',
          read: false,
          created_at: new Date().toISOString(),
          link: '/admin-dashboard?tab=donations'
        },
        {
          id: 2,
          title: 'Campaign Approved',
          body: 'Your campaign "School Supplies" has been approved and is now live!',
          type: 'campaign',
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          link: '/creator-dashboard'
        },
        {
          id: 3,
          title: 'Withdrawal Processed',
          body: 'Your withdrawal request of $200 has been approved.',
          type: 'withdrawal',
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          link: '/donor-dashboard?tab=wallet'
        }
      ];
      
      // Filter notifications based on user role
      let userNotifications = mockNotifications;
      if (currentUser?.role === 'donor') {
        userNotifications = mockNotifications.filter(n => n.type !== 'campaign');
      } else if (currentUser?.role === 'creator') {
        userNotifications = mockNotifications;
      } else if (currentUser?.role === 'admin') {
        userNotifications = mockNotifications;
      }
      
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Play sound for new notifications
  useEffect(() => {
    const hasNewUnread = notifications.some(n => !n.read);
    if (hasNewUnread && unreadCount > 0 && notificationSound.current) {
      // Play sound (optional - can be enabled)
      // notificationSound.current.play().catch(e => console.log('Audio disabled'));
    }
  }, [unreadCount]);

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // API call to mark as read would go here
    // await adminApi.markNotificationRead(id);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    // await adminApi.markAllNotificationsRead();
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    setShowDropdown(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donation':
        return <Heart size={14} color="#e8531e" />;
      case 'campaign':
        return <Target size={14} color="#1D9E75" />;
      case 'withdrawal':
        return <DollarSign size={14} color="#f59e0b" />;
      case 'user':
        return <Users size={14} color="#378ADD" />;
      default:
        return <Bell size={14} />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      {/* Audio element for notification sound (optional) */}
      <audio ref={notificationSound} preload="auto" style={{ display: 'none' }}>
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      <div ref={dropdownRef} style={{ position: 'relative' }}>
        {/* Bell Button */}
        <button
          className="notification-bell-btn"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="Notifications"
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Bell size={20} strokeWidth={1.8} />
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="notification-dropdown">
            {/* Header */}
            <div className="notification-header">
              <h4>Notifications</h4>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="mark-all-read">
                  <CheckCircle size={14} /> Mark all read
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="notification-loading">
                <div className="spinner-small"></div>
                <span>Loading...</span>
              </div>
            )}

            {/* Empty State */}
            {!loading && notifications.length === 0 && (
              <div className="notification-empty">
                <Bell size={32} strokeWidth={1.5} />
                <p>No notifications yet</p>
                <span>We'll notify you when something happens</span>
              </div>
            )}

            {/* Notifications List */}
            {!loading && notifications.length > 0 && (
              <div className="notification-list">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-body">{notification.body}</div>
                      <div className="notification-time">
                        {getTimeAgo(notification.created_at)}
                      </div>
                    </div>
                    {!notification.read && <div className="notification-unread-dot" />}
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="notification-footer">
              <button onClick={() => setShowDropdown(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .notification-bell-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
        }

        .notification-dropdown {
          position: absolute;
          top: 45px;
          right: 0;
          width: 360px;
          max-width: calc(100vw - 32px);
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }

        .notification-header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .mark-all-read {
          background: none;
          border: none;
          font-size: 12px;
          color: #1D9E75;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
        }

        .mark-all-read:hover {
          text-decoration: underline;
        }

        .notification-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px;
          color: #999;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid #f0f0f0;
          border-top-color: #1D9E75;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .notification-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 48px 20px;
          text-align: center;
          color: #999;
        }

        .notification-empty p {
          margin: 0;
          font-weight: 500;
        }

        .notification-empty span {
          font-size: 12px;
        }

        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f5f5f5;
          position: relative;
        }

        .notification-item:hover {
          background: #fafafa;
        }

        .notification-item.unread {
          background: #f0fdf4;
        }

        .notification-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-title {
          font-weight: 600;
          font-size: 14px;
          color: #1a1a2e;
          margin-bottom: 4px;
        }

        .notification-body {
          font-size: 13px;
          color: #666;
          line-height: 1.4;
          word-break: break-word;
        }

        .notification-time {
          font-size: 11px;
          color: #999;
          margin-top: 6px;
        }

        .notification-unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1D9E75;
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .notification-footer {
          padding: 12px 20px;
          border-top: 1px solid #f0f0f0;
          text-align: center;
        }

        .notification-footer button {
          background: none;
          border: none;
          color: #999;
          font-size: 13px;
          cursor: pointer;
        }

        /* Dark Mode Support */
        body.dark-mode .notification-dropdown {
          background: #1e1e36;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }

        body.dark-mode .notification-header {
          background: #2a2a40;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        body.dark-mode .notification-header h4 {
          color: #fff;
        }

        body.dark-mode .notification-item {
          border-bottom-color: rgba(255, 255, 255, 0.05);
        }

        body.dark-mode .notification-item:hover {
          background: #2a2a40;
        }

        body.dark-mode .notification-item.unread {
          background: rgba(29, 158, 117, 0.15);
        }

        body.dark-mode .notification-title {
          color: #fff;
        }

        body.dark-mode .notification-body {
          color: #aaa;
        }

        body.dark-mode .notification-footer {
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .notification-dropdown {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            max-width: 100%;
            border-radius: 20px 20px 0 0;
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .notification-header {
            padding: 16px;
          }

          .notification-list {
            max-height: 60vh;
          }

          .notification-item {
            padding: 14px 16px;
          }
        }
      `}</style>
    </>
  );
}X