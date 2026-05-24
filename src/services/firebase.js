import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase config (get from Firebase Console > Project Settings > General)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let messaging = null;
let app = null;

// ADD THIS FUNCTION - it's called from App.jsx
export const initFirebase = () => {
  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);
      console.log('✅ Firebase messaging initialized');
    }
    return { app, messaging };
  } catch (err) {
    console.error('❌ Firebase initialization failed:', err);
    return null;
  }
};

// Also initialize automatically (optional, but good for backward compatibility)
try {
  if (!app) {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    console.log('✅ Firebase messaging initialized (auto)');
  }
} catch (err) {
  console.error('❌ Firebase initialization failed:', err);
}

export { messaging };

// Request permission and get FCM token
export const requestFCMToken = async () => {
  if (!messaging) {
    console.warn('Messaging not available – token request skipped');
    return null;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get VAPID key from environment
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('⚠️ VAPID key is required for FCM');
      return null;
    }

    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('✅ FCM Token obtained:', currentToken.substring(0, 20) + '...');
      return currentToken;
    } else {
      console.log('No registration token available');
      return null;
    }
  } catch (err) {
    console.error('Error getting FCM token:', err);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn('Messaging not available');
      resolve(null);
      return;
    }
    onMessage(messaging, (payload) => {
      console.log('📱 Foreground message received:', payload);
      resolve(payload);
    });
  });