/*==================================
مجمع حمزه الشطري
Professional Store JS v3
==================================*/


import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



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


let cart=
JSON.parse(localStorage.getItem("cart")) || [];


let favorites=
JSON.parse(localStorage.getItem("favorites")) || [];





function updateCartCount(){


const count=
document.getElementById("cartCount");


if(!count) return;


let total=0;


cart.forEach(item=>{

total += item.qty || 1;

});


count.innerText=total;


}


updateCartCount();





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


let item=
cart.find(p=>p.name===name);



if(item){

item.qty++;

}

else{


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





/*========================
إضافة للمفضلة
========================*/


function addToFavorites(name,price,image){


let item=
favorites.find(p=>p.name===name);



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


const box=
document.getElementById("favoritesGrid");


if(!box) return;



box.innerHTML="";



favorites.forEach(item=>{


box.innerHTML +=`


<div class="product-card">


<img src="${item.image}">



<div class="product-info">


<h3>${item.name}</h3>



<p class="price">

${item.price} د.ع

</p>



<button class="cart-add"

onclick="addToCart('${item.name}',${item.price},'${item.image}')">

🛒 إضافة للسلة

</button>



</div>


</div>


`;

});


}


renderFavorites();





/*========================
عرض السلة
========================*/


function renderCart(){


const box=
document.getElementById("cartItems");



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



box.innerHTML +=`


<div class="cart-item">


<img src="${item.image}">



<div class="cart-info">


<h3>${item.name}</h3>



<p>${item.price} د.ع</p>



<div class="qty-box">


<button onclick="changeQty(${index},-1)">
-
</button>


<span>
${item.qty}
</span>


<button onclick="changeQty(${index},1)">
+
</button>


</div>


</div>



<button class="delete-cart"

onclick="removeItem(${index})">

<i class="fa-solid fa-trash"></i>

</button>



</div>


`;

});



const totalBox=
document.getElementById("cartTotal");


if(totalBox){

totalBox.innerText=
"المجموع: "+total+" د.ع";

}


}



renderCart();





/*========================
تعديل الكمية والحذف
========================*/


function changeQty(index,value){


if(!cart[index]) return;



cart[index].qty += value;



if(cart[index].qty<=0){

cart.splice(index,1);

}



saveCart();

renderCart();


}



function removeItem(index){


cart.splice(index,1);


saveCart();


renderCart();


}





/*========================
الوضع الليلي
========================*/


const darkBtn=
document.getElementById("darkBtn");



if(darkBtn){



if(localStorage.getItem("darkMode")==="on"){

document.body.classList.add("dark");

}



darkBtn.onclick=()=>{


document.body.classList.toggle("dark");



if(document.body.classList.contains("dark")){


localStorage.setItem(
"darkMode",
"on"
);


}

else{


localStorage.setItem(
"darkMode",
"off"
);


}


};


}
/*========================
تحميل منتجات الرئيسية من Firebase
========================*/


async function loadProducts(){


const grid=
document.getElementById("productsGrid");



if(!grid) return;



try{


const q=query(

collection(db,"products"),

limit(8)

);



const snap=
await getDocs(q);



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



grid.innerHTML +=`


<div class="product-card">


<img src="${p.image || '5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png'}">



<div class="product-info">


<h3>

${p.name || "منتج"}

</h3>



<p class="price">

${Number(p.price || 0).toLocaleString()} د.ع

</p>



<div class="product-actions">


<button class="cart-add"

onclick="addToCart('${p.name || ''}',${Number(p.price || 0)},'${p.image || ''}')">

🛒 السلة

</button>



<button class="fav-add"

onclick="addToFavorites('${p.name || ''}',${Number(p.price || 0)},'${p.image || ''}')">

❤️

</button>


</div>



</div>


</div>


`;

});


}

catch(error){


console.error(error);



grid.innerHTML=`

<div class="loading-products">

خطأ في تحميل المنتجات

</div>

`;


}


}



loadProducts();





/*========================
البحث
========================*/


const searchInput=
document.getElementById("searchInput");


if(searchInput){


searchInput.addEventListener("input",()=>{


let value=
searchInput.value.toLowerCase();



document.querySelectorAll(".product-card").forEach(card=>{


let text=
card.innerText.toLowerCase();



card.style.display=
text.includes(value)
?
"block"
:
"none";



});


});


}





/*========================
السلايدر
========================*/


const slides=
document.querySelectorAll(".hero-slide");


let slideIndex=0;



function showSlide(){


slides.forEach(s=>{

s.classList.remove("active");

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





/*========================
واتساب
========================*/


function sendWhatsApp(){


if(cart.length===0){

alert("السلة فارغة");

return;

}



let msg=
"طلب جديد من مجمع حمزه الشطري%0A%0A";



let total=0;



cart.forEach(item=>{


msg+=
`${item.name} × ${item.qty} - ${item.price} د.ع%0A`;


total += item.price * item.qty;


});



msg+=
`%0Aالمجموع: ${total} د.ع`;



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

e.target.src=
"5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png";

}


},true);





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
