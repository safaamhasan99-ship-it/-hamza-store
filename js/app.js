/*==================================
Hamza Store V6
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

/*==================================
Elements
==================================*/

const productsContainer=document.getElementById("productsContainer");
const productTemplate=document.getElementById("productTemplate");

const searchInput=document.getElementById("searchInput");
const sortSelect=document.getElementById("sortProducts");
const categoryFilter=document.getElementById("categoryFilter");

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

renderProducts(products);

}catch(error){

console.error(error);

productsContainer.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-box-open"></i>

<h2>تعذر تحميل المنتجات</h2>

<p>

تحقق من اتصال Firebase أو الإنترنت.

</p>

</div>

`;

}

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

<p>

لا توجد منتجات حالياً.

</p>

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

const old=

card.querySelector(".old-price");

if(product.oldPrice){

old.textContent=

formatPrice(product.oldPrice);

}else{

old.style.display="none";

}
  const favBtn=

card.querySelector(".favorite-btn");

if(isFavorite(product.id)){

favBtn.classList.add("active");

favBtn.innerHTML=

'<i class="fa-solid fa-heart"></i>';

}

favBtn.onclick=()=>{

const state=

toggleFavorite(product);

favBtn.classList.toggle(

"active",

state

);

favBtn.innerHTML=state

?'<i class="fa-solid fa-heart"></i>'

:'<i class="fa-regular fa-heart"></i>';

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

/*==================================
Search + Filter + Sort
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

list=list.filter(item=>

(item.category||"")

===categoryFilter.value

);

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

()=>{

applyFilters();

}

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

showSlide(0);

dots.forEach((dot,index)=>{

dot.onclick=()=>{

currentSlide=index;

showSlide(currentSlide);

};

});

setInterval(()=>{

currentSlide++;

if(currentSlide>=slides.length){

currentSlide=0;

}

showSlide(currentSlide);

},5000);

}

/*==================================
Dark Mode
==================================*/

const darkBtn=document.getElementById("darkBtn");

if(localStorage.getItem("theme")==="dark"){

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
Scroll To Top
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

/*==================================
Ready
==================================*/

console.log("Hamza Store V6 Ready ✅");
