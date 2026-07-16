/*==================================
مجمع حمزه الشطري
Professional Cart V5
==================================*/

const cartItems=document.getElementById("cartItems");
const itemsCount=document.getElementById("itemsCount");
const totalPrice=document.getElementById("totalPrice");
const checkoutBtn=document.getElementById("checkoutBtn");

let cart=JSON.parse(localStorage.getItem("cart"))||[];

renderCart();

/*=========================
عرض السلة
=========================*/

function renderCart(){

if(cart.length===0){

document.getElementById("emptyCart").style.display="block";

cartItems.style.display="none";

itemsCount.textContent="0";

totalPrice.textContent="0 د.ع";

return;

}

document.getElementById("emptyCart").style.display="none";

cartItems.style.display="block";

cartItems.innerHTML="";

let total=0;
let count=0;

cart.forEach((item,index)=>{

total+=item.price*item.qty;

count+=item.qty;

cartItems.innerHTML+=`

<div class="cart-item fade-up">

<div class="cart-image">

<img src="${item.image}" alt="">

</div>

<div class="cart-content">

<h3>${item.name}</h3>

<p class="cart-product-price">

${Number(item.price).toLocaleString()} د.ع

</p>

<div class="cart-qty">

<button class="qty-minus"

onclick="changeQty(${index},-1)">

<i class="fa-solid fa-minus"></i>

</button>

<span class="qty-value">

${item.qty}

</span>

<button class="qty-plus"

onclick="changeQty(${index},1)">

<i class="fa-solid fa-plus"></i>

</button>

</div>

</div>

<button class="delete-item"

onclick="removeItem(${index})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

`;

});

itemsCount.textContent=count;

totalPrice.textContent=
`${total.toLocaleString()} د.ع`;

}
/*=========================
تغيير الكمية
=========================*/

window.changeQty=function(index,change){

cart[index].qty+=change;

if(cart[index].qty<=0){

cart.splice(index,1);

}

saveCart();

};

/*=========================
حذف منتج
=========================*/

window.removeItem=function(index){

if(confirm("هل تريد حذف هذا المنتج من السلة؟")){

cart.splice(index,1);

saveCart();

showToast("تم حذف المنتج");

}

};

/*=========================
حفظ السلة
=========================*/

function saveCart(){

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

renderCart();

}

/*=========================
Toast
=========================*/

function showToast(message){

const toast=document.getElementById("toast");

if(!toast) return;

toast.textContent=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

/*=========================
إرسال الطلب
=========================*/

checkoutBtn.onclick=()=>{

if(cart.length===0){

showToast("السلة فارغة");

return;

}

const name=document.getElementById("customerName").value.trim();
const phone=document.getElementById("customerPhone").value.trim();
const city=document.getElementById("customerCity").value.trim();
const address=document.getElementById("customerAddress").value.trim();
const notes=document.getElementById("customerNotes").value.trim();

if(!name || !phone){

showToast("يرجى إدخال الاسم ورقم الهاتف");

return;

}

let message="🛍️ *طلب جديد*%0A%0A";

message+=`👤 الاسم: ${name}%0A`;
message+=`📞 الهاتف: ${phone}%0A`;
message+=`📍 المحافظة: ${city}%0A`;
message+=`🏠 العنوان: ${address}%0A`;

if(notes){

message+=`📝 الملاحظات: ${notes}%0A`;

}

message+="%0A📦 المنتجات:%0A";

let total=0;

cart.forEach(item=>{

const sub=item.price*item.qty;

total+=sub;

message+=`• ${item.name}%0A`;
message+=`الكمية: ${item.qty}%0A`;
message+=`السعر: ${item.price.toLocaleString()} د.ع%0A`;
message+=`المجموع: ${sub.toLocaleString()} د.ع%0A%0A`;

});

message+=`💰 الإجمالي: ${total.toLocaleString()} د.ع`;

window.open(
`https://wa.me/9647813555538?text=${message}`,
"_blank"
);
};
