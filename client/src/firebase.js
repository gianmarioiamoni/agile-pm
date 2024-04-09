// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "agile-pm-33617.firebaseapp.com",
    projectId: "agile-pm-33617",
    storageBucket: "agile-pm-33617.appspot.com",
    messagingSenderId: "731472679652",
    appId: "1:731472679652:web:cce3e5d5283bf71e37d2f1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);