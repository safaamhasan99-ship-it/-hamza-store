/*==================================
Hamza Store V8
Main JS
==================================*/

import {
updateCartCount,
showToast
} from "./utils.js";

document.addEventListener("DOMContentLoaded",()=>{

initDarkMode();

initSlider();

initSearch();

updateCartCount();

hideLoader();

});



/*========================
DARK MODE
========================*/

function initDarkMode(){

const btn=document.getElementById("darkBtn");

if(!btn) return;

const mode=localStorage.getItem("theme");

if(mode==="dark"){

document.body.classList.add("dark");

btn.innerHTML='<i class="fa-solid fa-sun"></i>';

}

btn.onclick=()=>{

document.body.classList.toggle("dark");

const dark=document.body.classList.contains("dark");

localStorage.setItem("theme",dark?"dark":"light");

btn.innerHTML=dark
?'<i class="fa-solid fa-sun"></i>'
:'<i class="fa-solid fa-moon"></i>';

};

}



/*========================
HERO SLIDER
========================*/

function initSlider(){

const slides=document.querySelectorAll(".hero-slide");

const dots=document.querySelectorAll(".hero-dot");

if(!slides.length) return;

let current=0;

function show(index){

slides.forEach(s=>s.classList.remove("active"));

dots.forEach(d=>d.classList.remove("active"));

slides[index].classList.add("active");

if(dots[index]) dots[index].classList.add("active");

}

dots.forEach((dot,index)=>{

dot.onclick=()=>{

current=index;

show(current);

};

});

setInterval(()=>{

current++;

if(current>=slides.length){

current=0;

}

show(current);

},5000);

}

/*========================
SEARCH
========================*/

function initSearch(){

const input=document.getElementById("searchInput");

if(!input) return;

input.addEventListener("input",()=>{

const value=input.value.trim().toLowerCase();

const cards=document.querySelectorAll(".product-card");

cards.forEach(card=>{

const title=card.querySelector(".product-title");

if(!title) return;

const text=title.textContent.toLowerCase();

card.style.display=text.includes(value)?"":"none";

});

});

}



/*========================
LOADER
========================*/

function hideLoader(){

const loader=document.getElementById("loader");

if(!loader) return;

window.addEventListener("load",()=>{

setTimeout(()=>{

loader.classList.add("hidden");

},500);

});

}



/*========================
SCROLL ANIMATION
========================*/

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:.15
});

document.querySelectorAll(
".product-card,.category-card,.feature-card,.brand-card,.offer-card"
).forEach(el=>observer.observe(el));



/*========================
SCROLL TO TOP
========================*/

const topBtn=document.createElement("button");

topBtn.className="scroll-top";

topBtn.innerHTML='<i class="fa-solid fa-arrow-up"></i>';

document.body.appendChild(topBtn);

window.addEventListener("scroll",()=>{

topBtn.classList.toggle("show",window.scrollY>500);

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};



/*========================
WELCOME TOAST
========================*/

setTimeout(()=>{

showToast("مرحباً بكم في مجمع حمزه الشطري ❤️");

},1200);

/*========================
PERFORMANCE
========================*/

document.addEventListener("visibilitychange",()=>{

if(document.hidden){

console.log("Page Hidden");

}else{

console.log("Page Active");

}

});



/*========================
PRELOAD IMAGES
========================*/

document.querySelectorAll("img").forEach(img=>{

img.loading="lazy";

img.decoding="async";

});



/*========================
ONLINE / OFFLINE
========================*/

window.addEventListener("offline",()=>{

showToast("⚠️ لا يوجد اتصال بالإنترنت");

});

window.addEventListener("online",()=>{

showToast("✅ تم استعادة الاتصال");

});



/*========================
ERROR IMAGE
========================*/

document.querySelectorAll("img").forEach(img=>{

img.onerror=()=>{

img.src="./images/no-image.png";

};

});



/*========================
HEADER SHADOW
========================*/

const header=document.querySelector(".header");

window.addEventListener("scroll",()=>{

if(!header) return;

if(window.scrollY>40){

header.classList.add("scrolled");

}else{

header.classList.remove("scrolled");

}

});



/*========================
EXPORTS
========================*/

export{
initDarkMode,
initSlider,
initSearch
};

