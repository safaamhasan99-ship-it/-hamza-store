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

count.innerHTML = cart.length;

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

price:Number(price),

image:image

});


localStorage.setItem("favorites",JSON.stringify(favorites));


alert("❤️ تمت الإضافة إلى المفضلة");


}





// صفحة التفاصيل

function openProduct(name,price,image){


let product={

name:name,

price:price,

image:image

};


localStorage.setItem("product",JSON.stringify(product));


window.location.href="details.html";


}






// السلايدر

let slides=document.querySelectorAll(".hero-slide");

let current=0;



function slider(){


slides.forEach(item=>{

item.classList.remove("active");

});



if(slides.length){

slides[current].classList.add("active");


current++;


if(current>=slides.length){

current=0;

}

}


}



if(slides.length){

setInterval(slider,4000);

}






// البحث

let searchInput=document.getElementById("searchInput");


if(searchInput){


searchInput.addEventListener("keyup",function(){


let value=this.value.toLowerCase();



document.querySelectorAll(".product-card").forEach(product=>{


let name=product.querySelector("h3").innerText.toLowerCase();



if(name.includes(value)){


product.style.display="block";


}else{


product.style.display="none";


}


});


});


}







// الوضع الليلي


let darkBtn=document.getElementById("darkBtn");



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


}


}
