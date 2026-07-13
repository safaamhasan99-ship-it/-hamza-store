import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const productsBox = document.getElementById("productsBox");


// اسم القسم من الصفحة
const category =
document.body.getAttribute("data-category");



async function loadProducts(){


if(!productsBox) return;


productsBox.innerHTML="";



let productsRef =
collection(db,"products");



let q;



if(category){

q = query(
productsRef,
where("category","==",category)
);

}else{

q = productsRef;

}



const snapshot =
await getDocs(q);



snapshot.forEach((item)=>{


let product = item.data();



productsBox.innerHTML += `


<div class="product-card">


<img src="${product.image}">


<div class="product-info">


<h3>
${product.name}
</h3>



<p class="price">
${Number(product.price).toLocaleString()} د.ع
</p>



<button onclick="addToCart(
'${product.name}',
${product.price},
'${product.image}'
)">
إضافة للسلة 🛒
</button>



</div>


</div>


`;


});


}


loadProducts();
