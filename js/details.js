/*==================================
Hamza Store V8
Details JS
==================================*/

import { db } from "../firebase.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
addToCart,
toggleFavorite,
formatPrice,
safeImage,
updateCartCount
} from "./utils.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let currentProduct = null;

document.addEventListener("DOMContentLoaded", async ()=>{

    updateCartCount();

    if(!productId) return;

    await loadProduct();

    await loadRelated();

});


/*========================
LOAD PRODUCT
========================*/

async function loadProduct(){

    try{

        const ref = doc(db,"products",productId);

        const snap = await getDoc(ref);

        if(!snap.exists()){

            document.getElementById("productName").textContent="المنتج غير موجود";

            return;

        }

        currentProduct = {

            id:snap.id,

            ...snap.data()

        };

        renderProduct();

    }catch(err){

        console.error(err);

    }

}
