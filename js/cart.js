/*==================================
Hamza Store V11
Professional Cart JS
==================================*/

import {

getCart,
saveCart,
removeFromCart,
formatPrice,
showToast,
updateCartCount

}

from "./utils.js";

/*========================
ELEMENTS
========================*/

const cartItems =
document.getElementById("cartItems");

const totalPrice =
document.getElementById("totalPrice");

const itemsCount =
document.getElementById("itemsCount");

const checkoutBtn =
document.getElementById("checkoutBtn");

const loader =
document.getElementById("loader");

/*========================
START
========================*/

document.addEventListener("DOMContentLoaded",()=>{

updateCartCount();

renderCart();

if(loader){

loader.style.display="none";

}

});
/*========================
RENDER CART
========================*/

function renderCart(){

if(!cartItems) return;

const cart=getCart();

cartItems.innerHTML="";

let total=0;
let count=0;

if(cart.length===0){

const template=document.getElementById("emptyCartTemplate");

if(template){

cartItems.appendChild(
template.content.cloneNode(true)
);

}else{

cartItems.innerHTML="<h3>السلة فارغة</h3>";

}

if(totalPrice)
totalPrice.textContent="0 د.ع";

if(itemsCount)
itemsCount.textContent="0";

return;

}

cart.forEach(item=>{

const qty=item.qty||1;

const price=Number(item.price)||0;

count+=qty;
total+=price*qty;

cartItems.innerHTML+=`

<div class="cart-item">

<img
src="${item.image}"
alt="${item.name}">

<div class="cart-info">

<h3>${item.name}</h3>

<p>${formatPrice(price)}</p>

<div class="qty-box">

<button onclick="changeQty('${item.id}',1)">+</button>

<span>${qty}</span>

<button onclick="changeQty('${item.id}',-1)">-</button>

</div>

</div>

<button
class="delete-btn"
onclick="deleteItem('${item.id}')">

🗑️

</button>

</div>

`;

});

itemsCount.textContent=count;
totalPrice.textContent=formatPrice(total);

}
/*========================
GLOBAL FUNCTIONS
========================*/

window.changeQty=function(id,value){

let cart=getCart();

const item=cart.find(p=>p.id===id);

if(!item) return;

item.qty=(item.qty||1)+value;

if(item.qty<=0){

removeFromCart(id);

}else{

saveCart(cart);

}

updateCartCount();

renderCart();

};



window.deleteItem=function(id){

removeFromCart(id);

updateCartCount();

renderCart();

showToast("تم حذف المنتج من السلة");

};



/*========================
CHECKOUT
========================*/

if(checkoutBtn){

checkoutBtn.onclick=()=>{

const cart=getCart();

if(cart.length===0){

showToast("السلة فارغة");

return;

}

let total=0;

let message="🛒 طلب جديد من مجمع حمزه الشطري\n\n";

cart.forEach(item=>{

const qty=item.qty||1;
const price=Number(item.price)||0;
const sum=qty*price;

total+=sum;

message+=`📦 ${item.name}\n`;
message+=`الكمية: ${qty}\n`;
message+=`السعر: ${formatPrice(sum)}\n\n`;

});

message+=`💰 الإجمالي: ${formatPrice(total)}`;

window.open(

"https://wa.me/9647813555538?text="+
encodeURIComponent(message),

"_blank"

);

};

}

console.log("Hamza Store Cart Ready ✅");
