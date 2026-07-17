/*==================================
Hamza Store V7
Products
==================================*/


import { db } from "./firebase.js";


import {

collection,
getDocs,
query,
orderBy

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

addToCart,
toggleFavorite,
isFavorite,
formatPrice,
imageOrDefault,
updateCartCount

}

from "./utils.js";





const container =
document.getElementById("productsContainer");


const template =
document.getElementById("productTemplate");



let products=[];



updateCartCount();



loadProducts();





async function loadProducts(){


try{


const q=query(

collection(db,"products"),

orderBy("createdAt","desc")

);



const snap=await getDocs(q);



products=[];



snap.forEach(doc=>{


products.push({

id:doc.id,

...doc.data()

});


});



renderProducts(products);



}catch(error){


console.log(error);


if(container){

container.innerHTML=`

<h3>
تعذر تحميل المنتجات
</h3>

`;

}


}


}







function renderProducts(list){


if(!container || !template)
return;



container.innerHTML="";



if(list.length===0){


container.innerHTML=`

<h3>
لا توجد منتجات
</h3>

`;


return;

}



list.forEach(product=>{



const card =

template.content.cloneNode(true);




const img=

card.querySelector(".product-img");


img.src=

imageOrDefault(product.image);




card.querySelector(".product-name")

.textContent=

product.name || "منتج";




card.querySelector(".price")

.textContent=

formatPrice(product.price);





const fav=

card.querySelector(".favorite-btn");



if(isFavorite(product.id)){


fav.classList.add("active");


fav.innerHTML=

`<i class="fa-solid fa-heart"></i>`;


}





fav.onclick=()=>{


const state=

toggleFavorite(product);



fav.classList.toggle(

"active",

state

);


};






card.querySelector(".cart-btn")

.onclick=()=>{


addToCart(product);


};






card.querySelector(".details-btn")

.onclick=()=>{


location.href=

"details.html?id="+product.id;


};





container.appendChild(card);



});



}





console.log("Products Ready ✅");
