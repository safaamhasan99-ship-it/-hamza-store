let cart = JSON.parse(localStorage.getItem("cart")) || [];


function showCart(){

const cartList = document.getElementById("cartList");
const totalBox = document.getElementById("total");
const orderBtn = document.getElementById("orderWhatsapp");


if(!cartList || !totalBox || !orderBtn){
return;
}


cartList.innerHTML = "";


let total = 0;


let message =
"السلام عليكم، أريد طلب:\n\n";



if(cart.length === 0){


cartList.innerHTML = `

<div class="about-box">

<h2>
🛒 السلة فارغة
</h2>

<p>
لم يتم إضافة منتجات
</p>

</div>

`;


totalBox.innerHTML="0 د.ع";

orderBtn.href="#";

return;

}



cart.forEach((item,index)=>{


let price = Number(item.price) || 0;

let qty = Number(item.quantity) || 1;


let sum = price * qty;


total += sum;



message +=
"• "+item.name+"\n"+
"الكمية: "+qty+"\n"+
"السعر: "+price+" د.ع\n"+
"----------------\n";



cartList.innerHTML += `

<div class="product-card">


<img src="${item.image}">


<div class="product-info">


<h3>
${item.name}
</h3>


<p class="price">
${price.toLocaleString()} د.ع
</p>



<div class="quantity-box">


<button class="cart-btn"
onclick="changeQuantity(${index},-1)">
➖
</button>


<span>
${qty}
</span>


<button class="cart-btn"
onclick="changeQuantity(${index},1)">
➕
</button>


</div>



<p>
المجموع:
${sum.toLocaleString()} د.ع
</p>



<button class="favorite"
onclick="removeCart(${index})">

🗑 حذف

</button>



</div>


</div>

`;



});



totalBox.innerHTML =
total.toLocaleString()+" د.ع";



message +=
"\n💰 المجموع الكلي: "+
total+
" د.ع";



orderBtn.href =
"https://wa.me/9647813555538?text="
+
encodeURIComponent(message);



localStorage.setItem(
"cart",
JSON.stringify(cart)
);


}





function changeQuantity(index,value){


cart[index].quantity =
(cart[index].quantity || 1)
+
value;



if(cart[index].quantity <=0){

cart.splice(index,1);

}



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



showCart();


}





function removeCart(index){


cart.splice(index,1);


localStorage.setItem(
"cart",
JSON.stringify(cart)
);



showCart();


}




showCart();
