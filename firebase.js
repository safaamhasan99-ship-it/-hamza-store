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





// ضع بيانات Firebase الخاصة بك هنا


const firebaseConfig = {


apiKey:"ضع_api_key",

authDomain:"ضع_auth_domain",

projectId:"ضع_project_id",

storageBucket:"ضع_storage_bucket",

messagingSenderId:"ضع_sender_id",

appId:"ضع_app_id"


};






const app = initializeApp(firebaseConfig);



const db = getFirestore(app);




export {

app,

db

};



console.log("Firebase Connected ✅");
