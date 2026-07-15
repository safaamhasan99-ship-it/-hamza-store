/*==================================
مجمع حمزه الشطري
Professional Store JS
==================================*/

// السلة والمفضلة

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// تحديث عداد السلة

function updateCartCount(){

const cartCount=document.getElementById("cartCount");

if(cartCount){

let total=0;

cart.forEach(item=>{

total += Number(item.qty || 1);

});

cartCount.textContent=total;

}

}

updateCartCount();

// إضافة للسلة

window.addToCart=function(name,price,image){

const index=cart.findIndex(item=>item.name===name);

if(index>-1){

cart[index].qty++;

}else{

cart.push({

name:name,
price:Number(price),
image:image,
qty:1

});

}

localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

alert("✅ تمت إضافة المنتج إلى السلة");

};

// إضافة للمفضلة

window.addToFavorites=function(name,price,image){

if(favorites.find(item=>item.name===name)){

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

alert("❤️ تمت الإضافة للمفضلة");

};

// البحث

const searchInput=document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

document.querySelectorAll(".product-card").forEach(card=>{

const title=card.querySelector("h3");

if(!title)return;

card.style.display=

title.textContent.toLowerCase().includes(value)

? ""

: "none";

});

});

}
/*==================================
الوضع الليلي
==================================*/

const darkBtn=document.getElementById("darkBtn");

if(localStorage.getItem("darkMode")==="true"){

document.body.classList.add("dark-mode");

}

if(darkBtn){

darkBtn.onclick=function(){

document.body.classList.toggle("dark-mode");

localStorage.setItem(

"darkMode",

document.body.classList.contains("dark-mode")

);

};

}

/*==================================
شاشة التحميل
==================================*/

window.addEventListener("load",function(){

const loader=document.getElementById("loader");

if(loader){

setTimeout(function(){

loader.classList.add("hide");

},800);

}

});

/*==================================
السلايدر
==================================*/

const slides=document.querySelectorAll(".hero-slide");

let currentSlide=0;

function showSlide(index){

slides.forEach(slide=>{

slide.classList.remove("active");

});

slides[index].classList.add("active");

}

if(slides.length>1){

setInterval(function(){

currentSlide++;

if(currentSlide>=slides.length){

currentSlide=0;

}

showSlide(currentSlide);

},4000);

}
/*==================================
عداد السلة
==================================*/

function updateCartCount(){

let cart=JSON.parse(localStorage.getItem("cart")) || [];

let count=0;

cart.forEach(item=>{

count += item.qty || 1;

});

const cartCount=document.getElementById("cartCount");

if(cartCount){

cartCount.innerText=count;

}

}

updateCartCount();



/*==================================
إضافة للسلة
==================================*/

function addToCart(name,price,image){

let cart=JSON.parse(localStorage.getItem("cart")) || [];


let existing=cart.find(item=>item.name===name);


if(existing){

existing.qty++;

}else{

cart.push({

name:name,

price:price,

image:image,

qty:1

});

}


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


updateCartCount();


alert("تم إضافة المنتج إلى السلة 🛒");


}



/*==================================
المفضلة
==================================*/

function addToFavorites(name,price,image){


let fav=JSON.parse(localStorage.getItem("favorites")) || [];


let check=fav.find(item=>item.name===name);


if(!check){

fav.push({

name:name,

price:price,

image:image

});


localStorage.setItem(

"favorites",

JSON.stringify(fav)

);


alert("تمت الإضافة للمفضلة ❤️");


}else{

alert("المنتج موجود بالمفضلة");

}


}



/*==================================
فتح تفاصيل المنتج
==================================*/

function openProduct(name,price,image){


localStorage.setItem(

"selectedProduct",

JSON.stringify({

name:name,

price:price,

image:image

})

);


window.location.href="details.html";


}

/*==================================
عرض السلة
==================================*/

function renderCart(){

const cartBox=document.getElementById("cartItems");

if(!cartBox) return;


let cart=JSON.parse(localStorage.getItem("cart")) || [];


cartBox.innerHTML="";


if(cart.length===0){

cartBox.innerHTML=`

<div class="empty-cart">

<i class="fa-solid fa-cart-shopping"></i>

<p>السلة فارغة</p>

</div>

`;

return;

}



let total=0;


cart.forEach((item,index)=>{


total += item.price * item.qty;


cartBox.innerHTML += `

<div class="cart-product">


<img src="${item.image}">


<div class="cart-info">

<h3>${item.name}</h3>

<p>${item.price} د.ع</p>


<div class="qty">

<button onclick="changeQty(${index},-1)">-</button>

<span>${item.qty}</span>

<button onclick="changeQty(${index},1)">+</button>

</div>


</div>


<button class="delete"

onclick="removeItem(${index})">

<i class="fa-solid fa-trash"></i>

</button>


</div>

`;

});



const totalBox=document.getElementById("cartTotal");

if(totalBox){

totalBox.innerText=

"المجموع: "+total+" د.ع";

}


}



/*==================================
تغيير الكمية
==================================*/

function changeQty(index,value){


let cart=JSON.parse(localStorage.getItem("cart")) || [];


cart[index].qty += value;


if(cart[index].qty <=0){

cart.splice(index,1);

}


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


renderCart();

updateCartCount();


}



/*==================================
حذف منتج من السلة
==================================*/

function removeItem(index){


let cart=JSON.parse(localStorage.getItem("cart")) || [];


cart.splice(index,1);


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


renderCart();

updateCartCount();


}



/* تشغيل عرض السلة */

document.addEventListener("DOMContentLoaded",()=>{

renderCart();

});
/*==================================
تحميل المنتجات
==================================*/

import { db } from "./firebase.js";

import {

collection,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function loadProducts(){


const productBox=document.getElementById("products");


if(!productBox) return;



productBox.innerHTML="";



const snapshot=await getDocs(

collection(db,"products")

);



snapshot.forEach(doc=>{


let product=doc.data();



productBox.innerHTML += `


<div class="product-card">


<img src="${product.image}">


<h3>${product.name}</h3>


<p>${product.price} د.ع</p>



<div class="product-actions">


<button onclick="addToCart(

'${product.name}',

${product.price},

'${product.image}'

)">

<i class="fa-solid fa-cart-plus"></i>

</button>



<button onclick="addToFavorites(

'${product.name}',

${product.price},

'${product.image}'

)">

<i class="fa-solid fa-heart"></i>

</button>



</div>


</div>


`;


});


}



loadProducts();




/*==================================
تحميل الأقسام الدائرية
==================================*/


async function loadCategories(){


const categoryBox=document.getElementById("categories");


if(!categoryBox) return;



const snapshot=await getDocs(

collection(db,"categories")

);



categoryBox.innerHTML="";



snapshot.forEach(doc=>{


let cat=doc.data();



categoryBox.innerHTML += `


<div class="category-circle">


<img src="${cat.image}">


<h3>${cat.name}</h3>


</div>


`;


});


}



loadCategories();
/*==================================
البحث عن المنتجات
==================================*/

const searchInput=document.getElementById("search");


if(searchInput){

searchInput.addEventListener("input",function(){


let value=this.value.toLowerCase();


const products=document.querySelectorAll(".product-card");


products.forEach(product=>{


let name=product

.querySelector("h3")

.innerText

.toLowerCase();



if(name.includes(value)){


product.style.display="block";


}else{


product.style.display="none";


}



});


});


}



/*==================================
عرض العروض
==================================*/

async function loadOffers(){


const offersBox=document.getElementById("offers");


if(!offersBox) return;



offersBox.innerHTML="";



const snapshot=await getDocs(

collection(db,"offers")

);



snapshot.forEach(doc=>{


let offer=doc.data();



offersBox.innerHTML += `


<div class="offer-card">


<img src="${offer.image}">


<h3>${offer.name}</h3>


<p>

${offer.price} د.ع

</p>


<button onclick="addToCart(

'${offer.name}',

${offer.price},

'${offer.image}'

)">

أضف للسلة 🛒

</button>


</div>


`;



});


}


loadOffers();




/*==================================
إرسال الطلب واتساب
==================================*/


function sendWhatsApp(){


let cart=

JSON.parse(

localStorage.getItem("cart")

) || [];



if(cart.length===0){

alert("السلة فارغة");

return;

}



let message="طلب جديد من مجمع حمزه الشطري%0A%0A";



cart.forEach(item=>{


message +=

`${item.name} - ${item.qty} - ${item.price} د.ع%0A`;



});



let total=0;


cart.forEach(item=>{

total += item.price * item.qty;

});



message +=

`%0Aالمجموع: ${total} د.ع`;



window.open(

"https://wa.me/964xxxxxxxxxx?text="+message,

"_blank"

);



}
/*==================================
القائمة الجانبية للموبايل
==================================*/

const menuBtn=document.getElementById("menuBtn");

const sideMenu=document.getElementById("sideMenu");


if(menuBtn && sideMenu){


menuBtn.onclick=function(){


sideMenu.classList.toggle("open");


};


}



/* إغلاق القائمة عند الضغط خارجها */

document.addEventListener("click",function(e){


if(sideMenu && 

!sideMenu.contains(e.target) &&

menuBtn &&

!menuBtn.contains(e.target)){


sideMenu.classList.remove("open");


}


});




/*==================================
زر الصعود للأعلى
==================================*/


const topBtn=document.getElementById("topBtn");


window.addEventListener("scroll",()=>{


if(topBtn){


if(window.scrollY>400){


topBtn.classList.add("show");


}else{


topBtn.classList.remove("show");


}


}


});



if(topBtn){


topBtn.onclick=function(){


window.scrollTo({

top:0,

behavior:"smooth"

});


};


}




/*==================================
حماية تشغيل الصور
==================================*/


document.addEventListener(

"error",

function(e){


if(e.target.tagName==="IMG"){


e.target.src="images/no-image.png";


}


},

true

);




/*==================================
تشغيل عند فتح الصفحة
==================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


updateCartCount();


renderCart();


}

);
