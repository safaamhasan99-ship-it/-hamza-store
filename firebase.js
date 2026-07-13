// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// إعدادات مشروع Firebase
const firebaseConfig = {

    apiKey: "ضع API KEY هنا",

    authDomain: "ضع AUTH DOMAIN هنا",

    projectId: "ضع PROJECT ID هنا",

    storageBucket: "ضع STORAGE BUCKET هنا",

    messagingSenderId: "ضع MESSAGING SENDER ID هنا",

    appId: "ضع APP ID هنا"

};


// تشغيل التطبيق
const app = initializeApp(firebaseConfig);


// قاعدة البيانات
const db = getFirestore(app);


// تخزين الصور
const storage = getStorage(app);


// تسجيل الدخول
const auth = getAuth(app);



export {
    db,
    storage,
    auth
};
