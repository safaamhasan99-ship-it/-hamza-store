/*==================================
Hamza Store V6
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
}from "./utils.js";

/*==================================
Elements
==================================*/

const productsContainer=document.getElementById("productsContainer");

const productTemplate=document.getElementById("productTemplate");

const searchInput=document.getElementById("searchInput");

const categoryFilter=document.getElementById("categoryFilter");

const sortProductsSelect=document.getElementById("sortProducts");

let products=[];

/*==================================
Start
==================================*/

updateCartCount();

if(productsContainer){

loadProducts();

}

/*==================================
Load Products
==================================*/

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

console.error(err);

productsContainer.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-triangle-exclamation"></i>

<h2>تعذر تحميل المنتجات</h2>

<p>

تحقق من اتصال Firebase أو الإنترنت.

</p>

</div>

`;

}

}
/*==================================
Filter + Search + Sort
==================================*/

function applyFilters(){

let list=[...products];

if(searchInput){

list=filterProducts(

list,

searchInput.value

);

}

if(categoryFilter && categoryFilter.value){

list=list.filter(product=>

(product.category||"")===categoryFilter.value

);

}

if(sortProductsSelect){

list=sortProducts(

list,

sortProductsSelect.value

);

}

renderProducts(list);

}

/*==================================
Render Products
==================================*/

function renderProducts(list){

productsContainer.innerHTML="";

if(list.length===0){

productsContainer.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-box-open"></i>

<h2>لا توجد منتجات</h2>

<p>لم يتم العثور على أي منتج.</p>

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

product.name||"بدون اسم";

card.querySelector(".price").textContent=

formatPrice(product.price);

const oldPrice=

card.querySelector(".old-price");

if(product.oldPrice){

oldPrice.textContent=

formatPrice(product.oldPrice);

}else{

oldPrice.style.display="none";

}

const favBtn=

card.querySelector(".favorite-btn");

if(isFavorite(product.id)){

favBtn.classList.add("active");

favBtn.innerHTML=

'<i class="fa-solid fa-heart"></i>';

}
  favBtn.onclick=()=>{

const state=toggleFavorite(product);

favBtn.classList.toggle("active",state);

favBtn.innerHTML=state
?'<i class="fa-solid fa-heart"></i>'
:'<i class="fa-regular fa-heart"></i>';

};

card.querySelector(".cart-btn").onclick=()=>{

addToCart(product);

};

card.querySelector(".details-btn").onclick=()=>{

location.href=`details.html?id=${product.id}`;

};

productsContainer.appendChild(card);

});

}

/*==================================
Events
==================================*/

if(searchInput){

searchInput.addEventListener("input",()=>{

applyFilters();

});

}

if(categoryFilter){

categoryFilter.addEventListener("change",()=>{

applyFilters();

});

}

if(sortProductsSelect){

sortProductsSelect.addEventListener("change",()=>{

applyFilters();

});

}

/*==================================
Ready
==================================*/

console.log("Products Page Ready ✅");
