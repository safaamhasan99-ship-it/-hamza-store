/*==================================
مجمع حمزه الشطري
Professional Store Firebase JS
Version 3
==================================*/


import { db } from "./firebase.js";


import {

collection,
getDocs

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





/*==================================
شاشة التحميل
==================================*/


window.addEventListener("load",()=>{


const loader=document.getElementById("loader");


if(loader){


setTimeout(()=>{


loader.classList.add("hide");


setTimeout(()=>{


loader.style.display="none";


},500);



},700);


}


});






/*==================================
السلة والمفضلة
==================================*/


let cart = JSON.parse(
localStorage.getItem("cart")
) || [];



let favorites = JSON.parse(
localStorage.getItem("favorites")
) || [];







/*==================================
تحديث عداد السلة
==================================*/


function updateCartCount(){


const count=
document.getElementById("cartCount");



if(count){


let total=0;



cart.forEach(item=>{


total += Number(item.qty || 1);



});



count.innerText=total;


}


}



updateCartCount();






/*==================================
حفظ السلة
==================================*/


function saveCart(){


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


updateCartCount();


}






/*==================================
إضافة للسلة
==================================*/


window.addToCart=function(
name,
price,
image
){



let item=
cart.find(
p=>p.name===name
);




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



alert("🛒 تمت إضافة المنتج للسلة");


};
/*==================================
المفضلة
==================================*/


window.addToFavorites=function(
name,
price,
image
){


let item =
favorites.find(
p=>p.name===name
);



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



alert("❤️ تمت الإضافة للمفضلة");


};






/*==================================
الوضع الليلي
==================================*/


const darkBtn=
document.getElementById("darkBtn");



if(localStorage.getItem("darkMode")==="true"){


document.body.classList.add(
"dark-mode"
);


}




if(darkBtn){


darkBtn.onclick=()=>{


document.body.classList.toggle(
"dark-mode"
);



localStorage.setItem(

"darkMode",

document.body.classList.contains(
"dark-mode"
)

);


};


}






/*==================================
البحث عن المنتجات
==================================*/


const searchInput=
document.getElementById("searchInput");



if(searchInput){


searchInput.addEventListener(
"input",
()=>{


let value=
searchInput.value.toLowerCase();



document.querySelectorAll(
".product-card"
)

.forEach(card=>{


let text=
card.innerText.toLowerCase();



if(text.includes(value)){


card.style.display="";


}

else{


card.style.display="none";


}


});



});


}






/*==================================
عرض السلة
==================================*/


window.renderCart=function(){


const box=
document.getElementById("cartItems");



if(!box)return;



box.innerHTML="";



if(cart.length===0){


box.innerHTML=`

<div class="empty-cart">

<i class="fa-solid fa-cart-shopping"></i>

<h3>
السلة فارغة
</h3>

</div>

`;

return;


}



let total=0;



cart.forEach((item,index)=>{


total +=
item.price * item.qty;



box.innerHTML += `

<div class="cart-product">


<img src="${item.image}">



<div class="cart-info">


<h3>${item.name}</h3>


<p>
${item.price} د.ع
</p>



<div class="qty">


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


<button class="delete"
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


};
/*==================================
تعديل كمية السلة
==================================*/


window.changeQty=function(index,value){


if(!cart[index]) return;



cart[index].qty += value;



if(cart[index].qty<=0){


cart.splice(index,1);


}



saveCart();


renderCart();


};






/*==================================
حذف من السلة
==================================*/


window.removeItem=function(index){


cart.splice(index,1);



saveCart();


renderCart();


};






document.addEventListener(
"DOMContentLoaded",
()=>{


renderCart();


});







/*==================================
تحميل المنتجات من Firebase
==================================*/


async function loadProducts(){


const box=
document.getElementById(
"productsGrid"
);



if(!box)return;



try{


const snap=
await getDocs(
collection(db,"products")
);



box.innerHTML="";



let count=0;



snap.forEach(doc=>{


let p=doc.data();



if(count>=8)return;




let name=
p.name || "منتج";



let price=
Number(p.price || 0);



let image=
p.image ||
"5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png";





box.innerHTML += `


<div class="product-card">


<img src="${image}"
onerror="this.src='5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png'">



<div class="product-info">



<h3>
${name}
</h3>



<p class="price">

${price.toLocaleString()} د.ع

</p>




<div class="product-actions">



<button class="cart-add"

onclick="addToCart('${name}',${price},'${image}')">


<i class="fa-solid fa-cart-shopping"></i>

السلة


</button>




<button class="fav-add"

onclick="addToFavorites('${name}',${price},'${image}')">


<i class="fa-solid fa-heart"></i>


</button>



</div>



</div>



</div>



`;



count++;


});





if(count===0){


box.innerHTML=`

<div class="loading-products">

لا توجد منتجات حالياً

</div>

`;


}



}


catch(error){


console.log(error);



box.innerHTML=`

<div class="loading-products">

حدث خطأ في تحميل المنتجات

</div>

`;

}



}



loadProducts();
/*==================================
السلايدر الرئيسي
==================================*/


const slides =
document.querySelectorAll(".hero-slide");


let slideIndex = 0;



function showSlide(){


slides.forEach(slide=>{


slide.classList.remove("active");


});



if(slides[slideIndex]){


slides[slideIndex]
.classList.add("active");


}


}



if(slides.length > 1){


setInterval(()=>{


slideIndex++;



if(slideIndex >= slides.length){


slideIndex = 0;


}



showSlide();



},4000);


}







/*==================================
فتح تفاصيل المنتج
==================================*/


window.openProduct=function(
name,
price,
image
){


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
إرسال طلب واتساب
==================================*/


window.sendWhatsApp=function(){


if(cart.length===0){


alert("السلة فارغة");


return;


}



let message =

"طلب جديد من مجمع حمزه الشطري%0A%0A";




cart.forEach(item=>{


message +=

`${item.name} × ${item.qty} - ${item.price} د.ع%0A`;


});




let total=0;



cart.forEach(item=>{


total +=

item.price * item.qty;


});



message +=

`%0Aالمجموع: ${total} د.ع`;





window.open(

"https://wa.me/9647813555538?text="+message,

"_blank"

);



};








/*==================================
حماية الصور
==================================*/


document.addEventListener(

"error",

(e)=>{


if(e.target.tagName==="IMG"){


e.target.src =
"5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png";


}


},

true

);
