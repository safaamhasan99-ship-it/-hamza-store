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

    apiKey: "ضع apiKey هنا",

    authDomain: "ضع authDomain هنا",

    projectId: "ضع projectId هنا",

    storageBucket: "ضع storageBucket هنا",

    messagingSenderId: "ضع messagingSenderId هنا",

    appId: "ضع appId هنا"

};
const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const storage = getStorage(app);


const auth = getAuth(app);



export {

    db,

    storage,

    auth

};
