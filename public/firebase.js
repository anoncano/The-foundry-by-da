import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "the-foundry-by-da.firebaseapp.com",
  projectId: "the-foundry-by-da",
  storageBucket: "the-foundry-by-da.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (unused for now)
export const app = initializeApp(firebaseConfig);
