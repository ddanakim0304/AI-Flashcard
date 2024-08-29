// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB0P8ZQU7ytyE0JUJ6ZyfFX0SStytigVY",
  authDomain: "ai-flashcard-5cd95.firebaseapp.com",
  projectId: "ai-flashcard-5cd95",
  storageBucket: "ai-flashcard-5cd95.appspot.com",
  messagingSenderId: "53871142443",
  appId: "1:53871142443:web:cd885c227db7ab78702c6e",
  measurementId: "G-Q13DD9BPFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);