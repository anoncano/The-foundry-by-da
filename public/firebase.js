// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAefBe7cgSA8FNJzR7p5NHWTsbLFrRuyKY",
  authDomain: "the-foundry-by-da.firebaseapp.com",
  projectId: "the-foundry-by-da",
  storageBucket: "the-foundry-by-da.firebasestorage.app",
  messagingSenderId: "825755098252",
  appId: "1:825755098252:web:ad6e84e40be56271fbefa9",
  measurementId: "G-72Z53Z6LNR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase (unused for now)
export const app = initializeApp(firebaseConfig);
