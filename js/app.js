/*==================================
Hamza Store V5
Main App
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
updateCartCount,
filterProducts,
sortProducts

}from"./utils.js";

const productsContainer=
document.getElementById("productsContainer");

const productTemplate=
document.getElementById("productTemplate");

const searchInput=
document.getElementById("searchInput");

const sortSelect=
document.getElementById("sortProducts");

const categoryFilter=
document.getElementById("categoryFilter");

let products=[];

updateCartCount();

loadProducts();
/*==================================
تحميل المنتجات
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

renderProducts(products);

}catch(err){

console.error(err);

productsContainer.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-box-open"></i>

<h2>تعذر تحميل المنتجات</h2>

<p>يرجى المحاولة مرة أخرى.</p>

</div>

`;

}

}

/*==================================
عرض المنتجات
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

const card=productTemplate.content.cloneNode(true);

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

favBtn.innerHTML=`

<i class="fa-solid fa-heart"></i>

`;

}

favBtn.onclick=()=>{

toggleFavorite(product);

favBtn.classList.toggle("active");

};

card.querySelector(".cart-btn").onclick=()=>{

addToCart(product);

};

card.querySelector(".details-btn").onclick=()=>{

location.href=`details.html?id=${product.id}`;

};

productsContainer.appendChild(card);

});

}/*==================================
البحث والفلترة والترتيب
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

list=list.filter(product=>{

return (product.category||"")==categoryFilter.value;

});

}

if(sortSelect){

list=sortProducts(

list,

sortSelect.value

);

}

renderProducts(list);

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

if(sortSelect){

sortSelect.addEventListener(

"change",

applyFilters

);

}

/*==================================
Hero Slider
==================================*/

const slides=document.querySelectorAll(".hero-slide");
const dots=document.querySelectorAll(".hero-dot");

let currentSlide=0;

function showSlide(index){

slides.forEach(slide=>{

slide.classList.remove("active");

});

dots.forEach(dot=>{

dot.classList.remove("active");

});

if(slides[index]){

slides[index].classList.add("active");

}

if(dots[index]){

dots[index].classList.add("active");

}

}

if(slides.length){

setInterval(()=>{

currentSlide++;

if(currentSlide>=slides.length){

currentSlide=0;

}

showSlide(currentSlide);

},5000);

}

/*==================================
الوضع الليلي
==================================*/

const darkBtn=document.getElementById("darkBtn");

if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

}

if(darkBtn){

darkBtn.onclick=()=>{

document.body.classList.toggle("dark");

localStorage.setItem(

"theme",

document.body.classList.contains("dark")

?"dark":"light"

);

};

}

/*==================================
زر العودة للأعلى
==================================*/

const scrollBtn=document.querySelector(".scroll-top");

window.addEventListener("scroll",()=>{

if(!scrollBtn) return;

if(window.scrollY>350){

scrollBtn.classList.add("show");

}else{

scrollBtn.classList.remove("show");

}

});

if(scrollBtn){

scrollBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}
