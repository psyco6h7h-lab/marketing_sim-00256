import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Fallback configuration if environment variables are not loaded
const fallbackConfig = {
  apiKey: "AIzaSyDkdNg9g3Rg_MiHBCECbS0fdSpQw2kZDis",
  authDomain: "bba-buddy.firebaseapp.com",
  projectId: "bba-buddy",
  storageBucket: "bba-buddy.firebasestorage.app",
  messagingSenderId: "193282659171",
  appId: "1:193282659171:web:ad2ae341e264ae7dceb956",
  measurementId: "G-NZ8KJTNK5D"
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
