/*==================================
مجمع حمزه الشطري
Professional Store JS v6
==================================*/

import { db } from "./firebase.js";

import {
collection,
getDocs,
query
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*========================
شاشة التحميل
========================*/

window.addEventListener("load",()=>{

const loader=document.getElementById("loader");

if(loader){

loader.classList.add("hide");

setTimeout(()=>{
loader.style.display="none";
},500);

}

});

/*========================
السلة والمفضلة
========================*/

let cart=JSON.parse(localStorage.getItem("cart"))||[];

let favorites=JSON.parse(localStorage.getItem("favorites"))||[];

/*========================
تحديث عدد السلة
========================*/

function updateCartCount(){

const count=document.getElementById("cartCount");

if(!count) return;

let total=0;

cart.forEach(item=>{
total+=item.qty||1;
});

count.innerText=total;

}

/*========================
حفظ السلة
========================*/

function saveCart(){

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCartCount();

}

/*========================
إضافة للسلة
========================*/

function addToCart(name,price,image){

let item=cart.find(p=>p.name===name);

if(item){

item.qty++;

}else{

cart.push({

name:name,
price:Number(price),
image:image,
qty:1

});

}

saveCart();

renderCart();

alert("🛒 تمت إضافة المنتج إلى السلة");

}

/*========================
إضافة للمفضلة
========================*/

function addToFavorites(name,price,image){

let item=favorites.find(p=>p.name===name);

if(item){

alert("❤️ المنتج موجود بالمفضلة");

return;

}

favorites.push({

name:name,
price:Number(price),
image:image

});

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

alert("❤️ تمت إضافة المنتج للمفضلة");

}
/*========================
عرض المفضلة
========================*/

function renderFavorites(){

const box=document.getElementById("favoritesGrid");

if(!box) return;

box.innerHTML="";

if(favorites.length===0){

box.innerHTML=`
<div class="empty-cart">
<i class="fa-solid fa-heart"></i>
<h3>لا توجد منتجات بالمفضلة</h3>
</div>
`;

return;

}

favorites.forEach(item=>{

box.innerHTML+=`

<div class="product-card">

<img src="${item.image}" alt="${item.name}">

<div class="product-info">

<h3>${item.name}</h3>

<p class="price">
${Number(item.price).toLocaleString()} د.ع
</p>

<button class="cart-btn"
onclick="addToCart('${item.name}',${item.price},'${item.image}')">

🛒 إضافة للسلة

</button>

</div>

</div>

`;

});

}

/*========================
عرض السلة
========================*/

function renderCart(){

const box=document.getElementById("cartItems");

if(!box) return;

box.innerHTML="";

const totalBox=document.getElementById("cartTotal");

if(cart.length===0){

box.innerHTML=`

<div class="empty-cart">

<i class="fa-solid fa-cart-shopping"></i>

<h3>السلة فارغة</h3>

<p>لم تقم بإضافة أي منتج</p>

</div>

`;

if(totalBox){

totalBox.innerText="المجموع : 0 د.ع";

}

return;

}

let total=0;

cart.forEach((item,index)=>{

total+=Number(item.price)*Number(item.qty);

box.innerHTML+=`

<div class="cart-item">

<img class="cart-image"
src="${item.image}"
alt="${item.name}">

<div class="cart-info">

<h3>${item.name}</h3>

<div class="cart-price">

${Number(item.price).toLocaleString()} د.ع

</div>

<div class="qty-box">

<button class="qty-btn"
onclick="changeQty(${index},-1)">-</button>

<span>${item.qty}</span>

<button class="qty-btn"
onclick="changeQty(${index},1)">+</button>

</div>

<button class="delete-cart"
onclick="removeItem(${index})">

<i class="fa-solid fa-trash"></i>

حذف

</button>

</div>

</div>

`;

});

if(totalBox){

totalBox.innerText=
"المجموع : "+total.toLocaleString()+" د.ع";

}

}

updateCartCount();

renderFavorites();

renderCart();
/*========================
زيادة ونقصان الكمية
========================*/

function changeQty(index,value){

if(!cart[index]) return;

cart[index].qty += value;

if(cart[index].qty <= 0){

cart.splice(index,1);

}

saveCart();

renderCart();

}

/*========================
حذف منتج
========================*/

function removeItem(index){

cart.splice(index,1);

saveCart();

renderCart();

}

/*========================
الوضع الليلي
========================*/

const darkBtn=document.getElementById("darkBtn");

if(darkBtn){

if(localStorage.getItem("darkMode")==="on"){

document.body.classList.add("dark");

}

darkBtn.onclick=()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark") ? "on" : "off"
);

};

}
/*========================
تحميل منتجات الرئيسية من Firebase
========================*/

async function loadProducts(){

const grid=document.getElementById("productsGrid");

if(!grid) return;

try{

const q=query(collection(db,"products"));

const snap=await getDocs(q);

grid.innerHTML="";

if(snap.empty){

grid.innerHTML=`
<div class="loading-products">
لا توجد منتجات حالياً
</div>
`;

return;

}

snap.forEach(doc=>{

const p=doc.data();

grid.innerHTML+=`

<div class="product-card">

<img src="${p.image || '5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png'}">

<div class="product-info">

<h3>${p.name || "منتج"}</h3>

<p class="price">
${Number(p.price||0).toLocaleString()} د.ع
</p>

<div class="product-actions">

<button class="cart-btn"
onclick="addToCart('${p.name||""}',${Number(p.price||0)},'${p.image||""}')">

🛒 إضافة للسلة

</button>

<button class="fav-btn"
onclick="addToFavorites('${p.name||""}',${Number(p.price||0)},'${p.image||""}')">

❤️

</button>

</div>

</div>

</div>

`;

});

}catch(error){

console.log(error);

grid.innerHTML=`
<div class="loading-products">
خطأ في تحميل المنتجات
</div>
`;

}

}

if(
document.body.classList.contains("home-page") ||
document.body.classList.contains("products-page")
){
loadProducts();
}

/*========================
البحث
========================*/

const searchInput=document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("input",()=>{

const value=searchInput.value.toLowerCase();

document.querySelectorAll(".product-card").forEach(card=>{

card.style.display=
card.innerText.toLowerCase().includes(value)
? "block"
: "none";

});

});

}
/*========================
سلايدر الأقسام
========================*/

const heroSlides=document.querySelectorAll(".hero-slide");

let heroIndex=0;

if(heroSlides.length>1){

setInterval(()=>{

heroSlides[heroIndex].classList.remove("active");

heroIndex++;

if(heroIndex>=heroSlides.length){

heroIndex=0;

}

heroSlides[heroIndex].classList.add("active");

},3000);

}

/*========================
إرسال الطلب واتساب
========================*/

function sendWhatsApp(){

if(cart.length===0){

alert("السلة فارغة");

return;

}

const name=document.getElementById("customerName")?.value || "غير محدد";

const phone=document.getElementById("customerPhone")?.value || "غير محدد";

const address=document.getElementById("customerAddress")?.value || "غير محدد";

let msg=`طلب جديد من مجمع حمزه الشطري%0A%0A`;

msg+=`👤 اسم الزبون: ${name}%0A`;
msg+=`📱 رقم الهاتف: ${phone}%0A`;
msg+=`📍 العنوان: ${address}%0A%0A`;

let total=0;

cart.forEach(item=>{

msg+=`🛍️ ${item.name} × ${item.qty} = ${(item.price*item.qty).toLocaleString()} د.ع%0A`;

total+=item.price*item.qty;

});

msg+=`%0A💰 المجموع: ${total.toLocaleString()} د.ع`;

window.open(
"https://wa.me/9647813555538?text="+msg,
"_blank"
);

}

/*========================
حماية الصور
========================*/

document.addEventListener("error",(e)=>{

if(e.target.tagName==="IMG"){

e.target.src="5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png";

}

},true);

/*========================
تشغيل الدوال
========================*/

updateCartCount();
renderFavorites();
renderCart();

/*========================
ربط الدوال
========================*/

window.addToCart=addToCart;
window.addToFavorites=addToFavorites;
window.changeQty=changeQty;
window.removeItem=removeItem;
window.sendWhatsApp=sendWhatsApp;
window.renderCart=renderCart;
window.renderFavorites=renderFavorites;
