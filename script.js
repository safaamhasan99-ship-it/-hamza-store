/*==================================
Hamza Store V7
Main Script
==================================*/


// =============================
// Dark Mode
// =============================


const darkBtn = document.getElementById("darkBtn");


if(localStorage.getItem("theme") === "dark"){

document.body.classList.add("dark");

}


if(darkBtn){

darkBtn.onclick = ()=>{

document.body.classList.toggle("dark");


localStorage.setItem(

"theme",

document.body.classList.contains("dark")

? "dark"

: "light"

);


};

}





// =============================
// Hero Slider
// =============================


const slides =
document.querySelectorAll(".hero-slide");


let slideIndex = 0;


function changeSlide(){


if(slides.length === 0)
return;


slides.forEach(item=>{

item.classList.remove("active");

});


slideIndex++;


if(slideIndex >= slides.length){

slideIndex = 0;

}


slides[slideIndex].classList.add("active");


}



if(slides.length){

setInterval(changeSlide,5000);

}






// =============================
// Scroll Button
// =============================


const scrollBtn =
document.querySelector(".scroll-top");



window.addEventListener("scroll",()=>{


if(!scrollBtn)
return;



if(window.scrollY > 400){

scrollBtn.classList.add("show");

}else{

scrollBtn.classList.remove("show");

}


});



if(scrollBtn){


scrollBtn.onclick=()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


};


}





// =============================
// Cart Count
// =============================


function updateCartCount(){


const badge =
document.getElementById("cartCount");


if(!badge)
return;



let cart =
JSON.parse(localStorage.getItem("cart")) || [];



let count =
cart.reduce((sum,item)=>{

return sum + (item.qty || 1);

},0);



badge.textContent=count;



if(count>0){

badge.style.display="flex";

}else{

badge.style.display="none";

}


}



updateCartCount();






// =============================
// Toast
// =============================


window.showToast=function(message){


let toast =
document.getElementById("toast");


if(!toast)
return;



toast.textContent=message;


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2500);


};






console.log("Hamza Store V7 Loaded ✅");
