// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHjXFmk0js7GVoxD3MiLnD1FESD-RBvOo",
  authDomain: "debaroon-chat-app.firebaseapp.com",
  projectId: "debaroon-chat-app",
  storageBucket: "debaroon-chat-app.appspot.com",
  messagingSenderId: "515634427462",
  appId: "1:515634427462:web:f95c0b04ff79aa7a08fc47",
  measurementId: "G-4W76DHMPBK"
};

// Initialize Firebase
export const {app} = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


