/*==================================
مجمع حمزه الشطري
Professional Store JS
==================================*/


import { db } from "./firebase.js";

import {

collection,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



/*==================================
السلة والمفضلة
==================================*/


let cart = JSON.parse(localStorage.getItem("cart")) || [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];




/*==================================
عداد السلة
==================================*/


function updateCartCount(){

const cartCount=document.getElementById("cartCount");


if(cartCount){

let count=0;


cart.forEach(item=>{

count += Number(item.qty || 1);

});


cartCount.innerText=count;

}

}


updateCartCount();




/*==================================
إضافة للسلة
==================================*/


window.addToCart=function(name,price,image){


let product=cart.find(item=>item.name===name);



if(product){

product.qty++;


}else{


cart.push({

name:name,

price:Number(price),

image:image,

qty:1

});


}



localStorage.setItem(

"cart",

JSON.stringify(cart)

);



updateCartCount();


alert("🛒 تمت إضافة المنتج للسلة");


};




/*==================================
المفضلة
==================================*/


window.addToFavorites=function(name,price,image){


let check=favorites.find(item=>item.name===name);


if(check){

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




/*==================================
البحث
==================================*/


const searchInput=document.getElementById("searchInput");


if(searchInput){


searchInput.addEventListener("input",function(){


let value=this.value.toLowerCase();



document.querySelectorAll(".product-card")

.forEach(card=>{


let title=card.querySelector("h3");


if(!title)return;



card.style.display=

title.innerText.toLowerCase().includes(value)

?""

:"none";



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


window.addEventListener("load",()=>{


const loader=document.getElementById("loader");


if(loader){


setTimeout(()=>{


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


if(slides[index]){


slides[index].classList.add("active");


}


}



if(slides.length>1){


setInterval(()=>{


currentSlide++;


if(currentSlide>=slides.length){


currentSlide=0;


}


showSlide(currentSlide);



},4000);


}





/*==================================
فتح تفاصيل المنتج
==================================*/


window.openProduct=function(name,price,image){


localStorage.setItem(

"selectedProduct",

JSON.stringify({

name:name,

price:price,

image:image

})

);



window.location.href="details.html";


};





/*==================================
عرض السلة
==================================*/


window.renderCart=function(){


const box=document.getElementById("cartItems");


if(!box)return;



box.innerHTML="";



if(cart.length===0){


box.innerHTML=`

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



box.innerHTML+=`


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


};






/*==================================
تعديل الكمية
==================================*/


window.changeQty=function(index,value){


cart[index].qty += value;



if(cart[index].qty<=0){


cart.splice(index,1);


}



localStorage.setItem(

"cart",

JSON.stringify(cart)

);



renderCart();


updateCartCount();


};





/*==================================
حذف من السلة
==================================*/


window.removeItem=function(index){


cart.splice(index,1);



localStorage.setItem(

"cart",

JSON.stringify(cart)

);



renderCart();


updateCartCount();


};





document.addEventListener("DOMContentLoaded",()=>{


renderCart();


});
/*==================================
تحميل المنتجات من Firebase
==================================*/


async function loadProducts(){


const productBox=document.getElementById("products");


if(!productBox)return;



try{


const snapshot=await getDocs(

collection(db,"products")

);



productBox.innerHTML="";



snapshot.forEach(doc=>{


let product=doc.data();



productBox.innerHTML+=`


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



}catch(error){


console.log(error);


}


}



loadProducts();






/*==================================
تحميل الأقسام الدائرية
==================================*/


async function loadCategories(){


const box=document.getElementById("categories");


if(!box)return;



try{


const snapshot=await getDocs(

collection(db,"categories")

);



box.innerHTML="";



snapshot.forEach(doc=>{


let cat=doc.data();



box.innerHTML+=`


<div class="category-circle">


<img src="${cat.image}">


<h3>${cat.name}</h3>


</div>


`;


});



}catch(error){


console.log(error);


}


}



loadCategories();







/*==================================
تحميل العروض
==================================*/


async function loadOffers(){


const offers=document.getElementById("offers");


if(!offers)return;



const snapshot=await getDocs(

collection(db,"offers")

);



offers.innerHTML="";



snapshot.forEach(doc=>{


let offer=doc.data();



offers.innerHTML+=`


<div class="offer-card">


<img src="${offer.image}">


<h3>${offer.name}</h3>


<p>${offer.price} د.ع</p>



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
طلب واتساب
==================================*/


window.sendWhatsApp=function(){


if(cart.length===0){


alert("السلة فارغة");


return;


}



let text=

"طلب جديد من مجمع حمزه الشطري%0A%0A";



cart.forEach(item=>{


text +=

`${item.name} × ${item.qty} - ${item.price} د.ع%0A`;



});



let total=0;


cart.forEach(item=>{


total += item.price * item.qty;


});



text +=

`%0Aالمجموع: ${total} د.ع`;



window.open(

"https://wa.me/964XXXXXXXXXX?text="+text,

"_blank"

);


};






/*==================================
زر الأعلى
==================================*/


const topBtn=document.getElementById("topBtn");



window.addEventListener("scroll",()=>{


if(topBtn){


topBtn.classList.toggle(

"show",

window.scrollY>400

);


}


});



if(topBtn){


topBtn.onclick=()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


};


}






/*==================================
حماية الصور
==================================*/


document.addEventListener("error",(e)=>{


if(e.target.tagName==="IMG"){


e.target.src="images/no-image.png";


}


},true);
