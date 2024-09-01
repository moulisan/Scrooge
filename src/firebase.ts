import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDDl_r4PlWDWoQvfhGTQmP2Q87dMK-ZLJI",
    authDomain: "scrooge-app-8fd7f.firebaseapp.com",
    projectId: "scrooge-app-8fd7f",
    storageBucket: "scrooge-app-8fd7f.appspot.com",
    messagingSenderId: "158316843287",
    appId: "1:158316843287:web:4f0d89708d2af1721ee752",
    measurementId: "G-RVX0EBZEMQ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);