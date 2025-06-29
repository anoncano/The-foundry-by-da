import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAefBe7cgSA8FNJzR7p5NHWTsbLFrRuyKY",
  authDomain: "the-foundry-by-da.firebaseapp.com",
  projectId: "the-foundry-by-da",
  storageBucket: "the-foundry-by-da.firebasestorage.app",
  messagingSenderId: "825755098252",
  appId: "1:825755098252:web:ad6e84e40be56271fbefa9",
  measurementId: "G-72Z53Z6LNR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
