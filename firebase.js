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


// إعدادات Firebase
const firebaseConfig = {

    apiKey: "ضع_apiKey_الخاص_بك",

    authDomain: "ضع_authDomain_الخاص_بك",

    projectId: "ضع_projectId_الخاص_بك",

    storageBucket: "ضع_storageBucket_الخاص_بك",

    messagingSenderId: "ضع_messagingSenderId_الخاص_بك",

    appId: "ضع_appId_الخاص_بك"

};


// تشغيل Firebase
const app = initializeApp(firebaseConfig);


// قواعد البيانات
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
