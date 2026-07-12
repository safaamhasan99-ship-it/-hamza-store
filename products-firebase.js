import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const productsRef = collection(db,"products");


async function loadStoreProducts(){

const container = document.getElementById("products");


if(!container) return;


container.innerHTML="";


const snapshot = await getDocs(productsRef);



snapshot.forEach((item)=>{


const p = item.data();



container.innerHTML += `

<div class="product-card">


<img src="${p.image}" alt="${p.name}">



<h3>
${p.name}
</h3>



<p>
${p.description || ""}
</p>



<div class="price">

${p.price} د.ع

</div>



<button onclick="addToCart('${p.name}',${p.price},'${p.image}')">

أضف للسلة

</button>



</div>

`;

});


}


loadStoreProducts();
