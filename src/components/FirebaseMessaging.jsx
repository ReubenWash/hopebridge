import { useEffect } from 'react';
import { messaging, requestFCMToken, onMessageListener } from '../services/firebase';
import { useApp } from '../context/AppContext';
import { adminApi } from '../services/api'; // or a dedicated user endpoint

const FirebaseMessaging = () => {
  const { currentUser, showToast } = useApp();

  useEffect(() => {
    if (!currentUser) return;

    const setupMessaging = async () => {
      // 1. Request permission (must be triggered by user gesture, so we do it once here)
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // 2. Get token
        const token = await requestFCMToken();
        if (token) {
          // 3. Send token to backend
          try {
            await adminApi.saveFCMToken(token); // we'll add this below
            console.log('FCM token saved to backend');
          } catch (err) {
            console.error('Failed to save FCM token', err);
          }
        }
      } else {
        showToast('Enable notifications to receive updates', true);
      }
    };

    setupMessaging();

    // Listen for foreground messages
    const unsubscribe = onMessageListener().then(payload => {
      showToast(payload.notification?.body || 'New notification');
    });

    return () => {
      // Clean up listener if needed (onMessage doesn't return unsubscribe, so no-op)
    };
  }, [currentUser, showToast]);

  return null; // this component renders nothing, it just runs logic
};

export default FirebaseMessaging;