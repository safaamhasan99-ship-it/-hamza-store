/*==================================
Hamza Store V5
Cart Page
==================================*/

import{

getCart,
saveCart,
removeFromCart,
formatPrice,
showToast,
updateCartCount

}from"./utils.js";

const cartItems=
document.getElementById("cartItems");

const itemsCount=
document.getElementById("itemsCount");

const totalPrice=
document.getElementById("totalPrice");

const checkoutBtn=
document.getElementById("checkoutBtn");

let cart=getCart();

updateCartCount();

renderCart();
/*==================================
Render Cart
==================================*/

function renderCart(){

cart=getCart();

cartItems.innerHTML="";

if(cart.length===0){

document.getElementById("emptyCart").style.display="block";

itemsCount.textContent="0";

totalPrice.textContent="0 د.ع";

return;

}

document.getElementById("emptyCart").style.display="none";

let total=0;

let qty=0;

cart.forEach(item=>{

qty+=item.qty;

total+=item.price*item.qty;

cartItems.innerHTML+=`

<div class="cart-item">

<div class="cart-image">

<img src="${item.image}">

</div>

<div class="cart-content">

<h3>${item.name}</h3>

<p class="cart-product-price">

${formatPrice(item.price)}

</p>

<div class="cart-qty">

<button onclick="changeQty('${item.id}',-1)">

<i class="fa-solid fa-minus"></i>

</button>

<span>

${item.qty}

</span>

<button onclick="changeQty('${item.id}',1)">

<i class="fa-solid fa-plus"></i>

</button>

</div>

</div>

<button
class="delete-item"

onclick="deleteItem('${item.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

`;

});

itemsCount.textContent=qty;

totalPrice.textContent=formatPrice(total);

}/*==================================
Cart Actions
==================================*/

window.changeQty=function(id,change){

const index=cart.findIndex(item=>item.id===id);

if(index===-1) return;

cart[index].qty+=change;

if(cart[index].qty<=0){

cart.splice(index,1);

}

saveCart(cart);

renderCart();

updateCartCount();

};

/*==================================
Delete Item
==================================*/

window.deleteItem=function(id){

if(!confirm("هل تريد حذف هذا المنتج من السلة؟")) return;

removeFromCart(id);

cart=getCart();

renderCart();

updateCartCount();

showToast("تم حذف المنتج من السلة");

};

/*==================================
Checkout
==================================*/

checkoutBtn.onclick=()=>{

cart=getCart();

if(cart.length===0){

showToast("السلة فارغة");

return;

}

const name=document.getElementById("customerName").value.trim();

const phone=document.getElementById("customerPhone").value.trim();

const city=document.getElementById("customerCity").value.trim();

const address=document.getElementById("customerAddress").value.trim();

const notes=document.getElementById("customerNotes").value.trim();

if(name==="" || phone===""){

showToast("يرجى إدخال الاسم ورقم الهاتف");

return;

}

let message=`🛍️ طلب جديد من متجر مجمع حمزه الشطري\n\n`;

message+=`👤 الاسم: ${name}\n`;
message+=`📞 الهاتف: ${phone}\n`;
message+=`📍 المحافظة: ${city}\n`;
message+=`🏠 العنوان: ${address}\n`;

if(notes){

message+=`📝 ملاحظات: ${notes}\n`;

}

message+=`\n-------------------------\n`;

let total=0;

cart.forEach(item=>{

const sub=item.price*item.qty;

total+=sub;

message+=`${item.name}\n`;

message+=`الكمية: ${item.qty}\n`;

message+=`السعر: ${formatPrice(item.price)}\n`;

message+=`المجموع: ${formatPrice(sub)}\n\n`;

});

message+=`💰 الإجمالي: ${formatPrice(total)}`;

const whatsappUrl=

`https://wa.me/9647813555538?text=${encodeURIComponent(message)}`;

window.open(whatsappUrl,"_blank");

};

/*==================================
Page Ready
==================================*/

console.log("Cart Ready ✅");
