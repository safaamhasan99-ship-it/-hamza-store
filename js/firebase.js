/*==================================
Hamza Store V17
Firebase Config
==================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcaOIwNodH5IESCShyYQkpHBFiywzIi-4",
  authDomain: "hamza-shatri-store.firebaseapp.com",
  projectId: "hamza-shatri-store",
  storageBucket: "hamza-shatri-store.firebasestorage.app",
  messagingSenderId: "372483512160",
  appId: "1:372483512160:web:b594dd13f4774db6d13005",
  measurementId: "G-B98RK4FDZ9"
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Firebase Authentication
export const auth = getAuth(app);

// Export App
export default app;
