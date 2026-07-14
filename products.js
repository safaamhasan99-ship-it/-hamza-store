import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const productsBox = document.getElementById("productsList");



async function loadProducts(){


if(!productsBox) return;



productsBox.innerHTML="جاري تحميل المنتجات...";



try{


const snapshot = await getDocs(
collection(db,"products")
);



productsBox.innerHTML="";



let category = new URLSearchParams(
window.location.search
).get("category");



let found=false;



snapshot.forEach((item)=>{


const product=item.data();



if(
!category ||
product.category===category
){


found=true;


const price =
Number(product.price) || 0;



productsBox.innerHTML += `


<div class="product-card">


<img src="${product.image || ''}">


<div class="product-info">


<h3>
${product.name || ''}
</h3>


<p class="price">
${price.toLocaleString()} د.ع
</p>


<button class="cart-btn"
onclick="addToCart(
'${product.name}',
${price},
'${product.image}'
)">

🛒 إضافة للسلة

</button>


</div>


</div>


`;

}


});



if(!found){

productsBox.innerHTML="<h3>لا توجد منتجات</h3>";

}



}catch(error){


console.log(error);


productsBox.innerHTML="<h3>حدث خطأ في تحميل المنتجات</h3>";

}


}



loadProducts();
