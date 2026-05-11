import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// 🔁 Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

let messaging = null;
try {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (err) {
  console.error('Firebase initialization failed:', err);
}

// ✅ Export messaging (may be null if init failed)
export { messaging };

export const requestFCMToken = async () => {
  if (!messaging) {
    console.warn('Messaging not available – token request skipped');
    return null;
  }

  const vapidKey = 'YOUR_VAPID_PUBLIC_KEY'; // from Firebase Console → Cloud Messaging
  if (!vapidKey || vapidKey === 'YOUR_VAPID_PUBLIC_KEY') {
    console.warn('Valid VAPID key is required for FCM');
    return null;
  }

  try {
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (err) {
    // Catch atob & other errors gracefully
    console.error('An error occurred while retrieving token.', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn('Messaging not available – cannot listen for messages');
      return;
    }
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      resolve(payload);
    });
  });