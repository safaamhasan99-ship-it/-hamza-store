/*==================================
Hamza Store V8
Products JS
==================================*/

import { db } from "../firebase.js";

import {

collection,
getDocs,
query,
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {

addToCart,
toggleFavorite,
formatPrice,
safeImage

} from "./utils.js";


const latestContainer=document.getElementById("latestProducts");
const bestContainer=document.getElementById("bestProducts");

document.addEventListener("DOMContentLoaded",()=>{

loadProducts();

});


/*========================
LOAD PRODUCTS
========================*/

async function loadProducts(){

try{

const q=query(

collection(db,"products"),

orderBy("createdAt","desc")

);

const snap=await getDocs(q);

const products=[];

snap.forEach(doc=>{

products.push({

id:doc.id,

...doc.data()

});

});

renderLatest(products);

renderBest(products);

}catch(err){

console.error(err);

}

}

/*========================
PRODUCT CARD
========================*/

function createCard(product){

const card=document.createElement("div");

card.className="product-card";

card.innerHTML=`

<div class="product-image">

<img src="${safeImage(product.image)}"
alt="${product.name}">

${product.offer?
'<span class="product-badge">عرض</span>'
:''}

<button class="favorite-btn">

<i class="fa-regular fa-heart"></i>

</button>

</div>

<div class="product-info">

<h3 class="product-title">

${product.name}

</h3>

<div class="product-price">

${formatPrice(product.price)}

</div>

<div class="product-actions">

<button class="add-cart">

أضف للسلة

</button>

<a
class="details-btn"
href="details.html?id=${product.id}">

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

};

return card;

}
