
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBEBk22JaseTkyeGQAP1ctuRiKeyj8ico4",
  authDomain: "kepy-bb8b8.firebaseapp.com",
  projectId: "kepy-bb8b8",
  storageBucket: "kepy-bb8b8.firebasestorage.app",
  messagingSenderId: "247311747048",
  appId: "1:247311747048:web:5acb774cefc0087affc65d",
  measurementId: "G-KYS3YG04ZG"
};

const app = initializeApp(firebaseConfig);
let analytics = null;

// Initialize analytics safely
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("🔥 Firebase Analytics Initialized");
  } else {
    console.warn("Firebase Analytics not supported in this environment");
  }
}).catch((err) => {
  console.error("Error initializing analytics:", err);
});

export { app, analytics };
