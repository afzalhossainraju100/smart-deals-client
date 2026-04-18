import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8mWRRutAqkXPTEcuncQjYaVh7EhetFPA",
  authDomain: "smart-deals-779b6.firebaseapp.com",
  projectId: "smart-deals-779b6",
  storageBucket: "smart-deals-779b6.firebasestorage.app",
  messagingSenderId: "1006607461721",
  appId: "1:1006607461721:web:2779527eda10c5926b7048",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
