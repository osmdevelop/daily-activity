// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCA_KA9TplwIO5mGZfOkc5i6BoRAjvVMsw",
  authDomain: "sra-daily-activity.firebaseapp.com",
  projectId: "sra-daily-activity",
  storageBucket: "sra-daily-activity.appspot.com",
  messagingSenderId: "697263346244",
  appId: "1:697263346244:web:d026021445d592ee5c6211",
  measurementId: "G-9W1W6RPP03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);
export { db };