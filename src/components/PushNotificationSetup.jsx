// src/components/PushNotificationSetup.jsx
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';
import { requestFCMToken, onMessageListener } from '../services/firebase';

export default function PushNotificationSetup() {
  const { currentUser, showToast } = useApp();
  const [initialized, setInitialized] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');

  useEffect(() => {
    if (!currentUser || initialized) return;

    const setupPushNotifications = async () => {
      try {
        // Check if browser supports notifications
        if (!('Notification' in window)) {
          console.log('Browser does not support notifications');
          return;
        }

        // Check if Firebase config is available
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey || vapidKey === 'undefined') {
          console.log('VAPID key not configured - push notifications disabled');
          return;
        }

        // Get current permission status
        setPermissionStatus(Notification.permission);

        // If permission is already granted, get token
        if (Notification.permission === 'granted') {
          const token = await requestFCMToken();
          if (token) {
            try {
              await authApi.saveFCMToken(token);
              console.log('✅ FCM token saved to backend');
            } catch (err) {
              console.error('Failed to save FCM token:', err);
            }
          }
        } 
        // If not granted yet, we can show a subtle prompt later
        else if (Notification.permission === 'default') {
          // Wait for user interaction before requesting permission
          const handleUserInteraction = async () => {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);
            if (permission === 'granted') {
              const token = await requestFCMToken();
              if (token) {
                try {
                  await authApi.saveFCMToken(token);
                  console.log('✅ FCM token saved after user grant');
                  showToast('Notifications enabled! You\'ll receive updates about campaigns and donations.');
                } catch (err) {
                  console.error('Failed to save FCM token:', err);
                }
              }
            }
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
          };
          
          // Listen for user interaction to request permission
          document.addEventListener('click', handleUserInteraction);
          document.addEventListener('keydown', handleUserInteraction);
        }

        // Listen for foreground messages
        onMessageListener().then((payload) => {
          if (payload) {
            console.log('Foreground message received:', payload);
            const { title, body } = payload.notification || {};
            if (title && body) {
              showToast(`${title}: ${body}`);
            } else if (body) {
              showToast(body);
            }
          }
        });

        setInitialized(true);
      } catch (err) {
        console.error('Push notification setup error:', err);
      }
    };

    setupPushNotifications();
  }, [currentUser, initialized, showToast]);

  // Don't render anything - this is a background component
  return null;
}