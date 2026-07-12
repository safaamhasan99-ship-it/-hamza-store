// =============================
// مجمع حمزه الشطري
// SCRIPT.JS
// =============================


// السلة والمفضلة

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];



// تحديث عداد السلة

function updateCartCount(){

let count = 0;

cart.forEach(item=>{
count += item.quantity;
});


let cartCount = document.getElementById("cartCount");

if(cartCount){

cartCount.textContent = count;

}

}


updateCartCount();




// إضافة للسلة

function addToCart(name,price,image){


let product = cart.find(item=>item.name === name);



if(product){

product.quantity++;

}else{


cart.push({

name:name,
price:price,
image:image,
quantity:1

});


}


localStorage.setItem(
"cart",
JSON.stringify(cart)
);


updateCartCount();


alert("✅ تمت إضافة المنتج إلى السلة");


}





// المفضلة

function addToFavorites(name,price,image){


favorites.push({

name:name,
price:price,
image:image

});


localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);


alert("❤️ تمت الإضافة إلى المفضلة");


}





// تفاصيل المنتج

function openProduct(name,price,image){


localStorage.setItem(
"product",
JSON.stringify({

name:name,
price:price,
image:image

})

);


window.location.href="details.html";


}





// =============================
// السلايدر
// =============================


const slides = document.querySelectorAll(".hero-slide");

let currentSlide = 0;



function showSlide(index){


slides.forEach(slide=>{

slide.classList.remove("active");

});


if(slides[index]){

slides[index].classList.add("active");

}


}



if(slides.length > 0){


setInterval(()=>{


currentSlide++;


if(currentSlide >= slides.length){

currentSlide = 0;

}


showSlide(currentSlide);


},4000);


}






// =============================
// البحث
// =============================


const searchInput = document.getElementById("searchInput");


if(searchInput){


searchInput.addEventListener("keyup",function(){


let value = this.value.toLowerCase();



document.querySelectorAll(".product-card").forEach(card=>{


let title = card.querySelector("h3").textContent.toLowerCase();



card.style.display = 
title.includes(value) ? "block" : "none";


});


});


}





// =============================
// الوضع الليلي
// =============================


const darkBtn = document.getElementById("darkBtn");



if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

}



if(darkBtn){


darkBtn.onclick=function(){


document.body.classList.toggle("dark");



localStorage.setItem(

"theme",

document.body.classList.contains("dark")
?"dark"
:"light"

);


};


}
