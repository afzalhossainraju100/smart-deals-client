// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8mWRRutAqkXPTEcuncQjYaVh7EhetFPA",
  authDomain: "smart-deals-779b6.firebaseapp.com",
  projectId: "smart-deals-779b6",
  storageBucket: "smart-deals-779b6.firebasestorage.app",
  messagingSenderId: "1006607461721",
  appId: "1:1006607461721:web:2779527eda10c5926b7048",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default auth;
