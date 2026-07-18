/*==================================
Hamza Store V11
Professional Utils JS
==================================*/


/*========================
CART
========================*/

export function getCart(){

try{

return JSON.parse(

localStorage.getItem("cart") || "[]"

);

}catch{

return [];

}

}



export function saveCart(cart){

localStorage.setItem(

"cart",

JSON.stringify(cart)

);

updateCartCount();

}



export function addToCart(product){

let cart=getCart();

const index=cart.findIndex(

item=>item.id===product.id

);

if(index>-1){

cart[index].qty=(cart[index].qty||1)+1;

}else{

cart.push({

...product,

qty:1

});

}

saveCart(cart);

showToast("تمت إضافة المنتج إلى السلة 🛒");

}



export function removeFromCart(id){

const cart=getCart().filter(

item=>item.id!==id

);

saveCart(cart);

showToast("تم حذف المنتج من السلة");

}



/*========================
CHANGE QTY
========================*/

export function changeQty(id,value){

const cart=getCart();

const item=cart.find(

p=>p.id===id

);

if(!item) return;

item.qty=(item.qty||1)+value;

if(item.qty<=0){

removeFromCart(id);

return;

}

saveCart(cart);

}



/*========================
CLEAR CART
========================*/

export function clearCart(){

localStorage.removeItem("cart");

updateCartCount();

}



/*========================
CART COUNT
========================*/

export function updateCartCount(){

const badge=document.getElementById("cartCount");

if(!badge) return;

const total=getCart().reduce(

(sum,item)=>sum+(item.qty||1),

0

);

badge.textContent=total;

badge.style.display=

total>0 ? "flex" : "none";

}
/*========================
FAVORITES
========================*/

export function getFavorites(){

try{

return JSON.parse(

localStorage.getItem("favorites") || "[]"

);

}catch{

return [];

}

}



export function saveFavorites(list){

localStorage.setItem(

"favorites",

JSON.stringify(list)

);

}



export function toggleFavorite(product){

let list=getFavorites();

const index=list.findIndex(

item=>item.id===product.id

);

if(index>-1){

list.splice(index,1);

saveFavorites(list);

showToast("تمت إزالة المنتج من المفضلة ❤️");

return false;

}

list.push(product);

saveFavorites(list);

showToast("تمت إضافة المنتج إلى المفضلة ❤️");

return true;

}



/*========================
CHECK FAVORITE
========================*/

export function isFavorite(id){

return getFavorites().some(

item=>item.id===id

);

}



/*========================
SAFE IMAGE V11
========================*/

export function safeImage(url){

const fallback="./IMG_5661.jpeg";

try{

if(url===null || url===undefined){

return fallback;

}

url=String(url).trim();

if(url===""){

return fallback;

}

/* إذا تم لصق كود HTML */

const html=url.match(/src=['"]([^'"]+)['"]/i);

if(html){

url=html[1];

}

/* إزالة المحارف المخفية */

url=url
.replace(/\u200B/g,"")
.replace(/\u200C/g,"")
.replace(/\u200D/g,"")
.replace(/\uFEFF/g,"")
.trim();

/* إزالة أي نقطة أو مسافة في نهاية الرابط */

url=url.replace(/[.\s]+$/,"");

/* إزالة الفراغات */

url=url.replace(/\s+/g,"");

/* تحويل // إلى https */

if(url.startsWith("//")){

url="https:"+url;

}
  /* Google Drive */

if(url.includes("drive.google.com/file/d/")){

const id=url.split("/d/")[1]?.split("/")[0];

if(id){

url=`https://drive.google.com/uc?export=view&id=${id}`;

}

}

/* Dropbox */

if(url.includes("dropbox.com")){

url=url.replace("?dl=0","?raw=1");

}

/* ImgBB */

if(url.includes("ibb.co") && !url.includes("i.ibb.co")){

url = url.replace("https://ibb.co/", "https://i.ibb.co/");

}

/* السماح فقط بالروابط المباشرة */

if(

!url.startsWith("https://") &&

!url.startsWith("http://")

){

return fallback;

}

/* ترميز الرابط */

url=encodeURI(url);
url = url.split("?")[0];
return url;

}catch{

return fallback;

}

}
/*========================
PRELOAD IMAGE
========================*/

export function preloadImage(url){

const img=new Image();

img.src=safeImage(url);

}



/*========================
PRICE
========================*/

export function formatPrice(price){

const value=Number(price);

if(isNaN(value)){

return "0 د.ع";

}

return value.toLocaleString("ar-IQ")+" د.ع";

}



/*========================
DATE
========================*/

export function formatDate(date){

try{

return new Date(date).toLocaleDateString("ar-IQ");

}catch{

return "";

}

}



/*========================
TOAST
========================*/

let toastTimer;

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

clearTimeout(toastTimer);

toastTimer=setTimeout(()=>{

toast.classList.remove("show");

},2500);

}
