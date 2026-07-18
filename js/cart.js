/*==================================
Hamza Store V12
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

const cartItems=document.getElementById("cartItems");
const totalPrice=document.getElementById("totalPrice");
const itemsCount=document.getElementById("itemsCount");
const checkoutBtn=document.getElementById("checkoutBtn");

const customerName=document.getElementById("customerName");
const customerPhone=document.getElementById("customerPhone");
const customerAddress=document.getElementById("customerAddress");

const loader=document.getElementById("loader");

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

const cart=getCart();

if(!cartItems) return;

cartItems.innerHTML="";

let total=0;
let count=0;

if(cart.length===0){

const template=document.getElementById("emptyCartTemplate");

if(template){

cartItems.appendChild(template.content.cloneNode(true));

}

if(totalPrice) totalPrice.textContent="0 د.ع";
if(itemsCount) itemsCount.textContent="0";

return;

}
  cart.forEach(item=>{

const qty=item.qty||1;
const price=Number(item.price)||0;

count+=qty;
total+=price*qty;

cartItems.innerHTML+=`

<div class="cart-card">

<div class="cart-image">

<img
src="${item.image}"
alt="${item.name}"
loading="lazy">

</div>

<div class="cart-details">

<h3>${item.name}</h3>

<div class="cart-price">

${formatPrice(price)}

</div>

<div class="cart-qty">

<button
class="qty-btn"
onclick="changeQty('${item.id}',-1)">

<i class="fa-solid fa-minus"></i>

</button>

<span>${qty}</span>

<button
class="qty-btn"
onclick="changeQty('${item.id}',1)">

<i class="fa-solid fa-plus"></i>

</button>

</div>

</div>

<button
class="delete-btn"
onclick="deleteItem('${item.id}')">

<i class="fa-solid fa-trash"></i>

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

const item=cart.find(x=>x.id===id);

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

const name=customerName.value.trim();
const phone=customerPhone.value.trim();
const address=customerAddress.value.trim();

if(!name){

showToast("يرجى إدخال اسم الزبون");

customerName.focus();

return;

}

if(!phone){

showToast("يرجى إدخال رقم الهاتف");

customerPhone.focus();

return;

}

if(!address){

showToast("يرجى إدخال العنوان");

customerAddress.focus();

return;

}

const cart=getCart();

if(cart.length===0){

showToast("السلة فارغة");

return;

}

let total=0;

let message=`🛍️ طلب جديد من مجمع حمزه الشطري

━━━━━━━━━━━━━━

👤 الاسم:
${name}

📞 الهاتف:
${phone}

📍 العنوان:
${address}

━━━━━━━━━━━━━━

`;

cart.forEach(item=>{

const qty=item.qty||1;
const price=Number(item.price)||0;
const sum=qty*price;

total+=sum;

message+=`📦 ${item.name}
الكمية : ${qty}
السعر : ${formatPrice(sum)}

`;

});

message+=`━━━━━━━━━━━━━━

💰 الإجمالي:
${formatPrice(total)}

شكراً لتسوقكم من
مجمع حمزه الشطري ❤️`;

window.open(
"https://wa.me/9647813555538?text="+
encodeURIComponent(message),
"_blank"
);

};

}

console.log("Hamza Store V12 Ready ✅");
