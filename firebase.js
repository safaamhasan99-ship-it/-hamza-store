/*==================================
Hamza Store V6
Firebase
==================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*==================================
Firebase Config
==================================*/

const firebaseConfig={

apiKey:"",

authDomain:"",

projectId:"",

storageBucket:"",

messagingSenderId:"",

appId:""

};

/*
ضع بيانات مشروع Firebase هنا
*/

const app=initializeApp(firebaseConfig);

const db=getFirestore(app);

export { app, db };
/*==================================
Collections
==================================*/

export const COLLECTIONS={

products:"products",

orders:"orders",

categories:"categories",

offers:"offers",

settings:"settings"

};

/*==================================
Collection References
==================================*/

export const productsCollection=()=>

collection(db,COLLECTIONS.products);

export const ordersCollection=()=>

collection(db,COLLECTIONS.orders);

export const categoriesCollection=()=>

collection(db,COLLECTIONS.categories);

export const offersCollection=()=>

collection(db,COLLECTIONS.offers);

export const settingsCollection=()=>

collection(db,COLLECTIONS.settings);

/*==================================
Document References
==================================*/

export const productDoc=(id)=>

doc(db,COLLECTIONS.products,id);

export const orderDoc=(id)=>

doc(db,COLLECTIONS.orders,id);

export const categoryDoc=(id)=>

doc(db,COLLECTIONS.categories,id);

export const offerDoc=(id)=>

doc(db,COLLECTIONS.offers,id);

export const settingsDoc=(id)=>

doc(db,COLLECTIONS.settings,id);
/*==================================
Version
==================================*/

export const APP_NAME="Hamza Store";

export const APP_VERSION="6.0 Ultimate";

/*==================================
Firebase Status
==================================*/

export function firebaseReady(){

return !!db;

}

console.log(

`${APP_NAME} ${APP_VERSION} Loaded`

);

if(firebaseReady()){

console.log("✅ Firebase Connected");

}else{

console.error("❌ Firebase Not Connected");

}

/*==================================
Default Export
==================================*/

export default db;
