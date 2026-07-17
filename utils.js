/*==================================
Hamza Store V7
Utils
==================================*/


// =============================
// Format Price
// =============================

export function formatPrice(price){

return Number(price || 0)
.toLocaleString("ar-IQ") + " د.ع";

}



// =============================
// Cart
// =============================


export function getCart(){

return JSON.parse(
localStorage.getItem("cart")
) || [];

}



export function saveCart(cart){

localStorage.setItem(
"cart",
JSON.stringify(cart)
);


updateCartCount();

}




export function updateCartCount(){

const badge =
document.getElementById("cartCount");


if(!badge) return;


const cart=getCart();


const count=cart.reduce(
(sum,item)=>sum+(item.qty||1),
0
);


badge.textContent=count;


badge.style.display =
count>0 ? "flex":"none";

}





export function addToCart(product){

let cart=getCart();



let found=cart.find(
item=>item.id===product.id
);



if(found){

found.qty++;


}else{


cart.push({

id:product.id,

name:product.name || "منتج",

price:Number(product.price || 0),

image:imageOrDefault(product.image),

qty:1

});


}



saveCart(cart);


showToast("تمت إضافة المنتج للسلة");


}






export function removeFromCart(id){


let cart=getCart();


cart=cart.filter(
item=>item.id!==id
);


saveCart(cart);


}





// =============================
// Favorites
// =============================


export function getFavorites(){

return JSON.parse(
localStorage.getItem("favorites")
) || [];

}





export function saveFavorites(data){

localStorage.setItem(
"favorites",
JSON.stringify(data)
);


}





export function isFavorite(id){

return getFavorites()
.includes(id);

}





export function toggleFavorite(product){


let fav=getFavorites();



if(fav.includes(product.id)){


fav=fav.filter(
id=>id!==product.id
);


saveFavorites(fav);


showToast("تم حذف المنتج من المفضلة");


return false;



}else{


fav.push(product.id);


saveFavorites(fav);


showToast("تمت إضافة المنتج للمفضلة");


return true;


}


}






// =============================
// Image Fix
// =============================


export function imageOrDefault(image){


const fallback =
"./images/no-image.png";



if(!image){

return fallback;

}



let url =
String(image).trim();




// رابط خارجي

if(
url.startsWith("http://") ||
url.startsWith("https://")
){

return url;

}



// مسار يبدأ images

if(url.startsWith("images/")){

return "./"+url;

}



// مسار يبدأ ./images

if(url.startsWith("./images")){

return url;

}



// اسم صورة فقط

return "./images/"+url;



}







// =============================
// Toast
// =============================


export function showToast(text){


let toast =
document.getElementById("toast");


if(!toast) return;



toast.textContent=text;


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2500);



}






console.log("Utils Ready V7 ✅");
