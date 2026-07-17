/*==================================
Hamza Store V5
Products Page
==================================*/

import { db } from "./firebase.js";

import {

collection,
getDocs,
query,
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import{

addToCart,
toggleFavorite,
isFavorite,
formatPrice,
imageOrDefault,
filterProducts,
sortProducts,
updateCartCount

}from"./utils.js";

const productsContainer=
document.getElementById("productsContainer");

const productTemplate=
document.getElementById("productTemplate");

const searchInput=
document.getElementById("searchInput");

const categoryFilter=
document.getElementById("categoryFilter");

const sortProductsSelect=
document.getElementById("sortProducts");

let products=[];

updateCartCount();

loadProducts();
async function loadProducts(){

try{

const q=query(

collection(db,"products"),

orderBy("createdAt","desc")

);

const snap=await getDocs(q);

products=[];

snap.forEach(doc=>{

products.push({

id:doc.id,

...doc.data()

});

});

applyFilters();

}catch(err){

console.log(err);

}

}
function applyFilters(){

let list=[...products];

if(searchInput){

list=filterProducts(

list,

searchInput.value

);

}

if(categoryFilter && categoryFilter.value){

list=list.filter(product=>{

return product.category==categoryFilter.value;

});

}

if(sortProductsSelect){

list=sortProducts(

list,

sortProductsSelect.value

);

}

renderProducts(list);

}
function renderProducts(list){

productsContainer.innerHTML="";

if(list.length===0){

productsContainer.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-box-open"></i>

<h2>

لا توجد منتجات

</h2>

</div>

`;

return;

}

list.forEach(product=>{

const card=

productTemplate.content.cloneNode(true);

card.querySelector(".product-img").src=

imageOrDefault(product.image);

card.querySelector(".product-name").textContent=

product.name;

card.querySelector(".price").textContent=

formatPrice(product.price);

const old=

card.querySelector(".old-price");

if(product.oldPrice){

old.textContent=

formatPrice(product.oldPrice);

}else{

old.style.display="none";

}

const fav=

card.querySelector(".favorite-btn");

if(isFavorite(product.id)){

fav.classList.add("active");

}

fav.onclick=()=>{

toggleFavorite(product);

fav.classList.toggle("active");

};

card.querySelector(".cart-btn").onclick=()=>{

addToCart(product);

};

card.querySelector(".details-btn").onclick=()=>{

location.href=

`details.html?id=${product.id}`;

};

productsContainer.appendChild(card);

});

}
if(searchInput){

searchInput.addEventListener(

"input",

applyFilters

);

}

if(categoryFilter){

categoryFilter.addEventListener(

"change",

applyFilters

);

}

if(sortProductsSelect){

sortProductsSelect.addEventListener(

"change",

applyFilters

);

}
