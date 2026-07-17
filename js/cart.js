/*==================================
Hamza Store V7
Cart
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





const cartItems =

document.getElementById("cartItems");


const totalPrice =

document.getElementById("totalPrice");


const itemsCount =

document.getElementById("itemsCount");


const checkoutBtn =

document.getElementById("checkoutBtn");




updateCartCount();


renderCart();






function renderCart(){


if(!cartItems)
return;



const cart=getCart();



cartItems.innerHTML="";



let total=0;

let count=0;




if(cart.length===0){


cartItems.innerHTML=`

<h3>

السلة فارغة

</h3>

`;


if(totalPrice)

totalPrice.textContent="0 د.ع";


return;


}




cart.forEach(item=>{



count += item.qty;


total += item.price * item.qty;





cartItems.innerHTML += `


<div class="cart-item">


<img src="${item.image}">


<div>


<h3>

${item.name}

</h3>


<p>

${formatPrice(item.price)}

</p>



<button onclick="changeQty('${item.id}',1)">
+
</button>


<span>
${item.qty}
</span>


<button onclick="changeQty('${item.id}',-1)">
-
</button>



</div>



<button onclick="deleteItem('${item.id}')">

🗑️

</button>


</div>



`;



});



if(itemsCount)

itemsCount.textContent=count;



if(totalPrice)

totalPrice.textContent=formatPrice(total);



}






window.changeQty=function(id,value){


let cart=getCart();



let item=cart.find(

x=>x.id===id

);



if(!item)
return;



item.qty += value;



if(item.qty<=0){


cart=

cart.filter(

x=>x.id!==id

);


}



saveCart(cart);


renderCart();


};








window.deleteItem=function(id){


removeFromCart(id);


renderCart();


showToast("تم حذف المنتج");


};









if(checkoutBtn){



checkoutBtn.onclick=()=>{


const cart=getCart();



if(cart.length===0){


showToast("السلة فارغة");


return;


}



let message=

"🛒 طلب جديد من مجمع حمزه الشطري\n\n";



let total=0;



cart.forEach(item=>{


let sum=item.price*item.qty;


total+=sum;



message+=

`${item.name}\n`;

message+=

`الكمية: ${item.qty}\n`;

message+=

`السعر: ${formatPrice(sum)}\n\n`;



});



message+=

`الإجمالي: ${formatPrice(total)}`;



window.open(

"https://wa.me/9647813555538?text="+

encodeURIComponent(message),

"_blank"

);



};



}




console.log("Cart Ready ✅");
