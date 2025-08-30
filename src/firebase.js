import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBPYAVPVoBaPNVeReNstR4007BPDzoJasc",
    authDomain: "collegehub-5a88e.firebaseapp.com",
    projectId: "collegehub-5a88e",
    storageBucket: "collegehub-5a88e.firebasestorage.app",
    messagingSenderId: "610685613577",
    appId: "1:610685613577:web:f9b993dcb42974c4bf2ad8",
    measurementId: "G-LD1XEK8HXE"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
