/*==================================
Hamza Store V5
Firebase Config
==================================*/

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const app=initializeApp(firebaseConfig);

export const db=getFirestore(app);
/*==================================
Exports
==================================*/

export { app };

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
Helpers
==================================*/

export function productsRef(){

return COLLECTIONS.products;

}

export function ordersRef(){

return COLLECTIONS.orders;

}

export function categoriesRef(){

return COLLECTIONS.categories;

}

export function offersRef(){

return COLLECTIONS.offers;

}

export function settingsRef(){

return COLLECTIONS.settings;

}

/*==================================
Version
==================================*/

export const APP_NAME="Hamza Store";

export const APP_VERSION="5.0 Ultimate";

console.log(
`${APP_NAME} ${APP_VERSION} Loaded`
);
/*==================================
Firestore Helpers
==================================*/

import{

collection,
doc

}from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*========== Collections ==========*/

export function productsCollection(){

return collection(db,COLLECTIONS.products);

}

export function ordersCollection(){

return collection(db,COLLECTIONS.orders);

}

export function categoriesCollection(){

return collection(db,COLLECTIONS.categories);

}

export function offersCollection(){

return collection(db,COLLECTIONS.offers);

}

/*========== Documents ==========*/

export function productDoc(id){

return doc(db,COLLECTIONS.products,id);

}

export function orderDoc(id){

return doc(db,COLLECTIONS.orders,id);

}

export function categoryDoc(id){

return doc(db,COLLECTIONS.categories,id);

}

export function offerDoc(id){

return doc(db,COLLECTIONS.offers,id);

}

/*==================================
Ready
==================================*/

console.log("Firebase Ready ✅");
