// =============================
// مجمع حمزه الشطري
// =============================


// السلة

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// المفضلة

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];




// تحديث عداد السلة

function updateCartCount(){

let count = document.getElementById("cartCount");

if(count){

count.textContent = cart.length;

}

}


updateCartCount();





// إضافة للسلة

function addToCart(name,price,image){


cart.push({

name:name,

price:Number(price),

image:image,

quantity:1

});


localStorage.setItem("cart",JSON.stringify(cart));


updateCartCount();


alert("✅ تمت إضافة المنتج إلى السلة");


}






// إضافة للمفضلة

function addToFavorites(name,price,image){


favorites.push({

name:name,

price:price,

image:image

});


localStorage.setItem("favorites",JSON.stringify(favorites));


alert("❤️ تمت الإضافة للمفضلة");


}







// تفاصيل المنتج

function openProduct(name,price,image){


localStorage.setItem("product",JSON.stringify({

name:name,

price:price,

image:image

}));


window.location.href="details.html";


}






// =============================
// السلايدر
// =============================


const slides=document.querySelectorAll(".hero-slide");

let slideIndex=0;



function changeSlide(){


slides.forEach(item=>{

item.classList.remove("active");

});



if(slides.length){

slides[slideIndex].classList.add("active");


slideIndex++;


if(slideIndex>=slides.length){

slideIndex=0;

}

}


}



if(slides.length){

setInterval(changeSlide,4000);

}







// =============================
// البحث
// =============================


const searchInput=document.getElementById("searchInput");



if(searchInput){


searchInput.addEventListener("keyup",function(){


let value=this.value.toLowerCase();



document.querySelectorAll(".product-card").forEach(card=>{


let title=card.querySelector("h3");



if(title){


card.style.display = title.textContent.toLowerCase().includes(value)
?
"block"
:
"none";


}


});


});


}






// =============================
// الوضع الليلي
// =============================


const darkBtn=document.getElementById("darkBtn");



if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

}




if(darkBtn){


darkBtn.onclick=function(){


document.body.classList.toggle("dark");



if(document.body.classList.contains("dark")){


localStorage.setItem("theme","dark");


}else{


localStorage.setItem("theme","light");


}


};


}
