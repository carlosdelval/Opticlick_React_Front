// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXNZwJkYptAW6q3UHWw9t48mYUy6GxuYw",
  authDomain: "opticlick-6598e.firebaseapp.com",
  projectId: "opticlick-6598e",
  storageBucket: "opticlick-6598e.firebasestorage.app",
  messagingSenderId: "681529425946",
  appId: "1:681529425946:web:b0ca3f6a7ac3b8aceb91a3",
  measurementId: "G-RJCWCEJY1T",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };