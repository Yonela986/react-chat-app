import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyA9bi6_nSQY34_Rh53R1yKszXEX8Q9bKJc",
  authDomain: "react-chat-app-65354.firebaseapp.com",
  projectId: "react-chat-app-65354",
  storageBucket: "react-chat-app-65354.appspot.com",
  messagingSenderId: "1003321427891",
  appId: "1:1003321427891:web:7105cc084f0adb5327edc6",
  measurementId: "G-Q939FNJPMR"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);