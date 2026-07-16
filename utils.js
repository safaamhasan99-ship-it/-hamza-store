/*==================================
Hamza Store V5
Utils
==================================*/

/*========== السعر ==========*/

export function formatPrice(price){

return Number(price||0).toLocaleString("ar-IQ")+" د.ع";

}

/*========== Toast ==========*/

export function showToast(message){

let toast=document.getElementById("toast");

if(!toast){

toast=document.createElement("div");

toast.id="toast";

toast.className="toast";

document.body.appendChild(toast);

}

toast.textContent=message;

toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer=setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

/*========== السلة ==========*/

export function getCart(){

return JSON.parse(localStorage.getItem("cart"))||[];

}

export function saveCart(cart){

localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

}

/*========== عدد السلة ==========*/

export function updateCartCount(){

const badge=document.getElementById("cartCount");

if(!badge) return;

const cart=getCart();

const total=cart.reduce((sum,item)=>sum+(item.qty||1),0);

badge.textContent=total;

badge.style.display=total>0?"flex":"none";

}

/*========== إضافة للسلة ==========*/

export function addToCart(product){

const cart=getCart();

const index=cart.findIndex(i=>i.id===product.id);

if(index>-1){

cart[index].qty++;

}else{

cart.push({

id:product.id,

name:product.name,

price:Number(product.price||0),

image:product.image,

qty:1

});

}

saveCart(cart);

showToast("تمت إضافة المنتج إلى السلة");

}

/*========== حذف من السلة ==========*/

export function removeFromCart(id){

let cart=getCart();

cart=cart.filter(i=>i.id!==id);

saveCart(cart);

}
/*==================================
Favorites
==================================*/

export function getFavorites(){

return JSON.parse(
localStorage.getItem("favorites")
)||[];

}

export function saveFavorites(favorites){

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

}

export function isFavorite(id){

return getFavorites().includes(id);

}

export function toggleFavorite(product){

let favorites=getFavorites();

const index=favorites.indexOf(product.id);

if(index>-1){

favorites.splice(index,1);

saveFavorites(favorites);

showToast("تمت إزالة المنتج من المفضلة");

return false;

}else{

favorites.push(product.id);

saveFavorites(favorites);

showToast("تمت إضافة المنتج إلى المفضلة");

return true;

}

}

/*==================================
Search
==================================*/

export function filterProducts(products,text){

if(!text) return products;

const keyword=text.toLowerCase().trim();

return products.filter(product=>{

return(

(product.name||"")
.toLowerCase()
.includes(keyword)

||

(product.category||"")
.toLowerCase()
.includes(keyword)

||

(product.description||"")
.toLowerCase()
.includes(keyword)

);

});

}

/*==================================
Sort
==================================*/

export function sortProducts(products,type){

const list=[...products];

switch(type){

case "low":

return list.sort(
(a,b)=>
Number(a.price)-Number(b.price)
);

case "high":

return list.sort(
(a,b)=>
Number(b.price)-Number(a.price)
);

case "name":

return list.sort(
(a,b)=>
(a.name||"")
.localeCompare(b.name||"")
);

default:

return list;

}

}

/*==================================
Image
==================================*/

export function imageOrDefault(image){

return image && image.trim()

? image

: "images/no-image.png";

}
