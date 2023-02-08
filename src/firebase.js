import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:process.env.REACT_APP_API_KEY,
  authDomain: "chat-app-4b582.firebaseapp.com",
  projectId: "chat-app-4b582",
  storageBucket: "chat-app-4b582.appspot.com",
  messagingSenderId: "643566737720",
  appId: "1:643566737720:web:b1e9a7c8e9c7d0940489cd",
  measurementId: "G-RJ7H2H34ER"
};





export const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);