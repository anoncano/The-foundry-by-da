// src/lib/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAefBe7cgSA8FNJzR7p5NHWTsbLFrRuyKY",
  authDomain: "the-foundry-by-da.firebaseapp.com",
  projectId: "the-foundry-by-da",
  storageBucket: "the-foundry-by-da.appspot.com",
  messagingSenderId: "825755098252",
  appId: "1:825755098252:web:ad6e84e40be56271fbefa9",
  measurementId: "G-72Z53Z6LNR"
};

const app = initializeApp(firebaseConfig);
export default app;
