/*==================================
مجمع حمزه الشطري
Professional Store JS
==================================*/

// شاشة التحميل
window.addEventListener("load", () => {

const loader = document.getElementById("loader");

if(loader){

loader.classList.add("hide");

setTimeout(()=>{

loader.style.display="none";

},600);

}

});

// السلة
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// المفضلة
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// تحديث عداد السلة
function updateCartCount(){

const count=document.getElementById("cartCount");

if(count){

let total=0;

cart.forEach(item=>{

total += item.qty || 1;

});

count.innerText=total;

}

}

updateCartCount();

// حفظ السلة
function saveCart(){

localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

}
/*==================================
إضافة للسلة
==================================*/

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

alert("🛒 تمت إضافة المنتج إلى السلة");

}


/*==================================
إضافة للمفضلة
==================================*/

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


/*==================================
عرض المفضلة
==================================*/

function renderFavorites(){

const box=document.getElementById("favoritesGrid");

if(!box) return;

box.innerHTML="";

favorites.forEach(item=>{

box.innerHTML+=`

<div class="product-card">

<img src="${item.image}">

<div class="product-info">

<h3>${item.name}</h3>

<p class="price">${item.price} د.ع</p>

<button class="cart-add"
onclick="addToCart('${item.name}',${item.price},'${item.image}')">

إضافة للسلة

</button>

</div>

</div>

`;

});

}

renderFavorites();
/*==================================
عرض السلة
==================================*/

function renderCart(){

const box=document.getElementById("cartItems");

if(!box) return;

box.innerHTML="";

if(cart.length===0){

box.innerHTML=`

<div class="empty-cart">

<i class="fa-solid fa-cart-shopping"></i>

<h3>السلة فارغة</h3>

</div>

`;

return;

}

let total=0;

cart.forEach((item,index)=>{

total += item.price * item.qty;

box.innerHTML += `

<div class="cart-item">

<img src="${item.image}">

<div class="cart-info">

<h3>${item.name}</h3>

<p>${item.price} د.ع</p>

<div class="qty-box">

<button onclick="changeQty(${index},-1)">-</button>

<span>${item.qty}</span>

<button onclick="changeQty(${index},1)">+</button>

</div>

</div>

<button class="delete-cart"
onclick="removeItem(${index})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

`;

});

const totalBox=document.getElementById("cartTotal");

if(totalBox){

totalBox.innerText="المجموع: "+total+" د.ع";

}

}


/*==================================
تعديل الكمية
==================================*/

function changeQty(index,value){

if(!cart[index]) return;

cart[index].qty += value;

if(cart[index].qty<=0){

cart.splice(index,1);

}

saveCart();

renderCart();

}


/*==================================
حذف منتج
==================================*/

function removeItem(index){

cart.splice(index,1);

saveCart();

renderCart();

}

renderCart();
/*==================================
البحث
==================================*/

const searchInput=document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("input",function(){

let value=this.value.toLowerCase();

document.querySelectorAll(".product-card").forEach(card=>{

let text=card.innerText.toLowerCase();

if(text.includes(value)){

card.style.display="block";

}else{

card.style.display="none";

}

});

});

}


/*==================================
الوضع الليلي
==================================*/

const darkBtn=document.getElementById("darkBtn");

if(darkBtn){

if(localStorage.getItem("darkMode")==="on"){

document.body.classList.add("dark-mode");

}

darkBtn.onclick=()=>{

document.body.classList.toggle("dark-mode");

if(document.body.classList.contains("dark-mode")){

localStorage.setItem("darkMode","on");

}else{

localStorage.setItem("darkMode","off");

}

};

}


/*==================================
تحميل المنتجات
==================================*/

function loadProducts(){

const grid=document.getElementById("productsGrid");

if(!grid) return;

const products=
JSON.parse(localStorage.getItem("products")) || [];

grid.innerHTML="";

if(products.length===0){

grid.innerHTML=`
<div class="loading-products">
لا توجد منتجات حالياً
</div>
`;

return;

}

products.slice(0,8).forEach(product=>{

grid.innerHTML +=`

<div class="product-card">

<img src="${product.image}">

<div class="product-info">

<h3>${product.name}</h3>

<p class="price">${product.price} د.ع</p>

<div class="product-actions">

<button class="cart-add"
onclick="addToCart('${product.name}',${product.price},'${product.image}')">

<i class="fa-solid fa-cart-shopping"></i>

السلة

</button>

<button class="fav-add"
onclick="addToFavorites('${product.name}',${product.price},'${product.image}')">

<i class="fa-solid fa-heart"></i>

</button>

</div>

</div>

</div>

`;

});

}

loadProducts();
/*==================================
السلايدر الرئيسي
==================================*/

const slides=document.querySelectorAll(".hero-slide");

let slideIndex=0;

function showSlide(){

slides.forEach(slide=>{

slide.classList.remove("active");

});

if(slides[slideIndex]){

slides[slideIndex].classList.add("active");

}

}

if(slides.length>1){

setInterval(()=>{

slideIndex++;

if(slideIndex>=slides.length){

slideIndex=0;

}

showSlide();

},4000);

}


/*==================================
إرسال الطلب واتساب
==================================*/

function sendWhatsApp(){

if(cart.length===0){

alert("السلة فارغة");

return;

}

let message="طلب جديد من مجمع حمزه الشطري%0A%0A";

let total=0;

cart.forEach(item=>{

message+=`${item.name} × ${item.qty} - ${item.price} د.ع%0A`;

total+=item.price*item.qty;

});

message+=`%0Aالمجموع: ${total} د.ع`;

window.open(

"https://wa.me/9647813555538?text="+message,

"_blank"

);

}


/*==================================
حماية الصور
==================================*/

document.addEventListener("error",(e)=>{

if(e.target.tagName==="IMG"){

e.target.src="5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png";

}

},true);


/*==================================
ربط الدوال بالصفحات
==================================*/

window.addToCart=addToCart;
window.addToFavorites=addToFavorites;
window.changeQty=changeQty;
window.removeItem=removeItem;
window.sendWhatsApp=sendWhatsApp;
window.renderCart=renderCart;
window.renderFavorites=renderFavorites;
