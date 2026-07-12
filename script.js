// =============================
// مجمع حمزه الشطري
// =============================

// السلة
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// المفضلة
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

updateCartCount();

// =============================
// إضافة للسلة
// =============================

function addToCart(name, price, image) {

    cart.push({
        name,
        price,
        image,
        quantity: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("✅ تمت إضافة المنتج إلى السلة");

}

// =============================
// المفضلة
// =============================

function addToFavorites(name, price, image) {

    favorites.push({
        name,
        price,
        image
    });

    localStorage.setItem("favorites", JSON.stringify(favorites));

    alert("❤️ تمت الإضافة إلى المفضلة");

}

// =============================
// صفحة التفاصيل
// =============================

function openProduct(name, price, image){

    localStorage.setItem("product",
    JSON.stringify({
        name,
        price,
        image
    }));

    window.location.href="details.html";

}
// =============================
// السلايدر التلقائي
// =============================

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;

function showSlide(index){

    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");

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

const search = document.getElementById("search");

if(search){

search.addEventListener("keyup",function(){

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

if(document.body.classList.contains("dark")){

localStorage.setItem("theme","dark");

}else{

localStorage.setItem("theme","light");

}

}

}
