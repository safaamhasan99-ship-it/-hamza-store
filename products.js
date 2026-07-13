import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const productsBox = document.getElementById("productsBox");



async function loadProducts(){


if(!productsBox) return;



productsBox.innerHTML="";



const snapshot =
await getDocs(
collection(db,"products")
);



snapshot.forEach((item)=>{


let product = item.data();



productsBox.innerHTML += `


<div class="product-card">


<img src="${product.image}">



<h3>
${product.name}
</h3>



<p class="price">
${product.price.toLocaleString()} د.ع
</p>



<button onclick="addToCart(
'${product.name}',
${product.price},
'${product.image}'
)">
إضافة للسلة 🛒
</button>



</div>


`;



});


}



loadProducts();
