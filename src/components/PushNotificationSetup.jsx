// src/components/PushNotificationSetup.jsx
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { authApi } from '../services/api';

// Your Firebase config (get from Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export default function PushNotificationSetup() {
  const { currentUser, showToast } = useApp();
  const [initialized, setInitialized] = useState(false);

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
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
          console.log('Firebase not configured - push notifications disabled');
          return;
        }

        // Request permission
        if (Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.log('Notification permission denied');
            return;
          }
        }

        // Dynamically import Firebase modules
        const { initializeApp } = await import('firebase/app');
        const { getMessaging, getToken, onMessage } = await import('firebase/messaging');

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        // Get VAPID key from environment
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
          console.warn('VAPID key not found in environment variables');
          return;
        }

        // Get FCM token
        const token = await getToken(messaging, { vapidKey });
        if (token) {
          console.log('FCM token obtained');
          // Save token to backend
          try {
            await authApi.saveFCMToken(token);
            console.log('FCM token saved to backend');
          } catch (err) {
            console.error('Failed to save FCM token:', err);
          }
        } else {
          console.log('No FCM token available');
        }

        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          console.log('Foreground message received:', payload);
          const body = payload.notification?.body || 'New update';
          showToast(body);
          
          // Also show browser notification
          if (Notification.permission === 'granted') {
            new Notification(payload.notification?.title || 'HopeBridge', { 
              body, 
              icon: '/logo192.png' 
            });
          }
        });

        setInitialized(true);
      } catch (err) {
        console.error('Push notification setup error:', err);
        // Don't show error toast to avoid annoying users
      }
    };

    setupPushNotifications();
  }, [currentUser, initialized, showToast]);

  // Don't render anything - this is a background component
  return null;
}