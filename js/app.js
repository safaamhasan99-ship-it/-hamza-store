/*==================================
مجمع حمزه الشطري
V5 Ultimate
Main App JS
==================================*/

import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productsContainer =
document.getElementById("productsContainer");

const productTemplate =
document.getElementById("productTemplate");

const cartCount =
document.getElementById("cartCount");

const searchInput =
document.getElementById("searchInput");

let products=[];

let cart=
JSON.parse(localStorage.getItem("cart"))||[];

let favorites=
JSON.parse(localStorage.getItem("favorites"))||[];

updateCartCount();

loadProducts();

if(searchInput){

searchInput.oninput=()=>{

renderProducts(searchInput.value);

};

}

/*=========================
تحميل المنتجات
=========================*/

async function loadProducts(){

productsContainer.innerHTML=`
<div class="loading">
جاري تحميل المنتجات...
</div>
`;

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

renderProducts();

}catch(err){

productsContainer.innerHTML=`
<div class="empty">
تعذر تحميل المنتجات
</div>
`;

console.log(err);

}

}
/*=========================
عرض المنتجات
=========================*/

function renderProducts(search=""){

productsContainer.innerHTML="";

const list=products.filter(p=>{

const name=(p.name||"").toLowerCase();

return name.includes(search.toLowerCase());

});

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
product.image||"images/no-image.png";

card.querySelector(".product-name").textContent=
product.name||"بدون اسم";

card.querySelector(".price").textContent=
`${Number(product.price||0).toLocaleString()} د.ع`;

const oldPrice=card.querySelector(".old-price");

if(product.oldPrice){

oldPrice.textContent=
`${Number(product.oldPrice).toLocaleString()} د.ع`;

}else{

oldPrice.style.display="none";

}

const favBtn=
card.querySelector(".favorite-btn");

const icon=
favBtn.querySelector("i");

if(favorites.includes(product.id)){

favBtn.classList.add("active");

icon.className="fa-solid fa-heart";

}

favBtn.onclick=()=>{

toggleFavorite(product.id,favBtn,icon);

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

/*=========================
السلة
=========================*/

function addToCart(product){

const index=cart.findIndex(i=>i.id===product.id);

if(index>-1){

cart[index].qty++;

}else{

cart.push({

id:product.id,

name:product.name,

price:Number(product.price||0),

image:product.image,

qty:1

});

}

localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

showToast("تمت إضافة المنتج إلى السلة");

}

/*=========================
عداد السلة
=========================*/

function updateCartCount(){

const total=cart.reduce((a,b)=>a+b.qty,0);

if(cartCount){

cartCount.textContent=total;

}

}
/*=========================
المفضلة
=========================*/

function toggleFavorite(id,btn,icon){

const index=favorites.indexOf(id);

if(index>-1){

favorites.splice(index,1);

btn.classList.remove("active");

icon.className="fa-regular fa-heart";

showToast("تمت إزالة المنتج من المفضلة");

}else{

favorites.push(id);

btn.classList.add("active");

icon.className="fa-solid fa-heart";

showToast("تمت إضافة المنتج إلى المفضلة");

}

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

}

/*=========================
Toast
=========================*/

function showToast(message){

let toast=document.querySelector(".toast");

if(!toast){

toast=document.createElement("div");

toast.className="toast";

document.body.appendChild(toast);

}

toast.textContent=message;

toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer=setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

/*=========================
الوضع الليلي
=========================*/

const darkBtn=document.getElementById("darkBtn");

if(localStorage.getItem("darkMode")==="on"){

document.body.classList.add("dark");

}

if(darkBtn){

darkBtn.onclick=()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark")
?"on":"off"
);

};

}

/*=========================
Hero Slider
=========================*/

const slides=
document.querySelectorAll(".hero-slide");

const dots=
document.querySelectorAll(".hero-dot");

let currentSlide=0;

function showSlide(index){

slides.forEach(s=>s.classList.remove("active"));

dots.forEach(d=>d.classList.remove("active"));

slides[index].classList.add("active");

dots[index].classList.add("active");

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

/*=========================
زر العودة للأعلى
=========================*/

const scrollBtn=
document.querySelector(".scroll-top");

window.addEventListener("scroll",()=>{

if(!scrollBtn)return;

if(window.scrollY>400){

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
