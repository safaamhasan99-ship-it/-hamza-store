/*==================================
Hamza Store V11
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
isFavorite,
formatPrice,
safeImage,
updateCartCount
} from "./utils.js";

/*========================
ELEMENTS
========================*/

const productsContainer =
document.getElementById("productsContainer") ||
document.getElementById("latestProducts");

const bestProductsContainer =
document.getElementById("bestProducts");

const searchInput =
document.getElementById("searchInput");

const categoryFilter =
document.getElementById("categoryFilter");

const sortProducts =
document.getElementById("sortProducts");

let products=[];

/*========================
START
========================*/

document.addEventListener("DOMContentLoaded",()=>{

updateCartCount();

loadProducts();

if(searchInput){

searchInput.addEventListener("input",filterProducts);

}

if(categoryFilter){

categoryFilter.addEventListener("change",filterProducts);

}

if(sortProducts){

sortProducts.addEventListener("change",filterProducts);

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

renderBestProducts();

}catch(error){

console.error("Products Error:",error);

if(productsContainer){

productsContainer.innerHTML=`
<div class="empty-products">
<i class="fa-solid fa-circle-exclamation"></i>
<h3>تعذر تحميل المنتجات</h3>
<p>تحقق من اتصال الإنترنت أو إعدادات Firebase.</p>
</div>
`;
}

}finally{

const loader=document.getElementById("loader");

if(loader){

loader.classList.add("hidden");

}

}

}
/*========================
CREATE PRODUCT CARD
========================*/

function createCard(product){

const card=document.createElement("div");

card.className="product-card";

const fav=isFavorite(product.id);

card.innerHTML=`

<div class="product-image">

<img
src="${safeImage(product.image)}"
alt="${product.name||''}"
loading="lazy">

${product.offer?
'<span class="product-badge">عرض</span>'
:''}

<button class="favorite-btn">

<i class="fa-${fav?'solid':'regular'} fa-heart"></i>

</button>

</div>

<div class="product-info">

<h3 class="product-title">

${product.name||'بدون اسم'}

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
  /*========================
RENDER PRODUCTS
========================*/

function renderProducts(list){

if(!productsContainer) return;

productsContainer.innerHTML="";

if(!list.length){

productsContainer.innerHTML=`

<div class="empty-products">

<i class="fa-solid fa-box-open"></i>

<h3>لا توجد منتجات</h3>

<p>لم يتم العثور على أي منتج.</p>

</div>

`;

return;

}

list.forEach(product=>{

productsContainer.appendChild(

createCard(product)

);

});

}
  
