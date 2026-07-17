/*==================================
Hamza Store V8
Products JS
==================================*/

import { db } from "../firebase.js";

import {
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

const container=document.getElementById("productsContainer");

const searchInput=document.getElementById("searchInput");

const categoryFilter=document.getElementById("categoryFilter");

const sortProducts=document.getElementById("sortProducts");

let products=[];

document.addEventListener("DOMContentLoaded",()=>{

updateCartCount();

loadProducts();

if(searchInput){

searchInput.oninput=filterProducts;

}

if(categoryFilter){

categoryFilter.onchange=filterProducts;

}

if(sortProducts){

sortProducts.onchange=filterProducts;

}

});

/*========================
LOAD PRODUCTS
========================*/

async function loadProducts(){

try{

const snap=await getDocs(collection(db,"products"));

products=[];

snap.forEach(doc=>{

products.push({

id:doc.id,

...doc.data()

});

});

filterProducts();

}catch(err){

console.error(err);

container.innerHTML=`

<div style="text-align:center;padding:40px">

حدث خطأ أثناء تحميل المنتجات

</div>

`;

}

}

/*========================
CREATE PRODUCT CARD
========================*/

function createCard(product){

const card=document.createElement("div");

card.className="product-card";

card.innerHTML=`

<div class="product-image">

<img
src="${safeImage(product.image)}"
alt="${product.name}"
loading="lazy">

${product.offer?'<span class="product-badge">عرض</span>':''}

<button class="favorite-btn">

<i class="fa-regular fa-heart"></i>

</button>

</div>

<div class="product-info">

<h3 class="product-title">

${product.name||""}

</h3>

<div class="product-price">

${formatPrice(product.price||0)}

</div>

<div class="product-actions">

<button class="add-cart">

<i class="fa-solid fa-cart-shopping"></i>

إضافة للسلة

</button>

<a
href="details.html?id=${product.id}"
class="details-btn">

التفاصيل

</a>

</div>

</div>

`;

card.querySelector(".add-cart").onclick=()=>{

addToCart(product);

};

card.querySelector(".favorite-btn").onclick=()=>{

toggleFavorite(product);

card.querySelector(".favorite-btn i").classList.remove("fa-regular");

card.querySelector(".favorite-btn i").classList.add("fa-solid");

};

return card;

}
