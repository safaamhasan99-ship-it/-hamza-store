/*==================================
Hamza Store V8
Utils JS
==================================*/


/*========================
CART
========================*/

export function getCart(){

return JSON.parse(

localStorage.getItem("cart")||"[]"

);

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

cart[index].qty++;

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

let cart=getCart().filter(

item=>item.id!==id

);

saveCart(cart);

showToast("تم حذف المنتج من السلة");

}



export function changeQty(id,value){

let cart=getCart();

const item=cart.find(

p=>p.id===id

);

if(!item) return;

item.qty+=value;

if(item.qty<1){

removeFromCart(id);

return;

}

saveCart(cart);

}



/*========================
CART COUNT
========================*/

export function updateCartCount(){

const badge=document.getElementById("cartCount");

if(!badge) return;

const total=getCart().reduce(

(sum,item)=>sum+item.qty,

0

);

badge.textContent=total;

}

/*========================
FAVORITES
========================*/

export function getFavorites(){

return JSON.parse(

localStorage.getItem("favorites")||"[]"

);

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

showToast("تمت إزالة المنتج من المفضلة ❤️");

}else{

list.push(product);

showToast("تمت إضافة المنتج إلى المفضلة ❤️");

}

saveFavorites(list);

}



/*========================
TOAST
========================*/

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

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}



/*========================
IMAGE
========================*/

export function safeImage(url){

if(!url) return "./images/no-image.png";

return url;

}



/*========================
PRICE
========================*/

export function formatPrice(price){

return Number(price).toLocaleString("ar-IQ")+" د.ع";

}



/*========================
DATE
========================*/

export function formatDate(date){

return new Date(date).toLocaleDateString("ar-IQ");

}
