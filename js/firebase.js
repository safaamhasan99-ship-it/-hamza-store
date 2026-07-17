/*==================================
Hamza Store V7
Firebase Config
==================================*/


import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





/*==================================
Firebase Configuration
==================================*/


const firebaseConfig = {


apiKey:"ضع_API_KEY_هنا",


authDomain:"ضع_AUTH_DOMAIN_هنا",


projectId:"ضع_PROJECT_ID_هنا",


storageBucket:"ضع_STORAGE_BUCKET_هنا",


messagingSenderId:"ضع_MESSAGING_SENDER_ID_هنا",


appId:"ضع_APP_ID_هنا"


};





/*==================================
Initialize Firebase
==================================*/


const app = initializeApp(firebaseConfig);



const db = getFirestore(app);





/*==================================
Exports
==================================*/


export {

app,

db

};





/*==================================
Collections
==================================*/


export const PRODUCTS = "products";

export const ORDERS = "orders";

export const CATEGORIES = "categories";

export const OFFERS = "offers";





console.log("🔥 Hamza Store Firebase Ready");
