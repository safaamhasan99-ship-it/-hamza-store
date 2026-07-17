/*==================================
Hamza Store V5
Details Page
==================================*/

import { db } from "./firebase.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import{

addToCart,
toggleFavorite,
isFavorite,
formatPrice,
imageOrDefault,
updateCartCount

}from"./utils.js";

const params=new URLSearchParams(location.search);

const productId=params.get("id");

const productImage=document.getElementById("productImage");
const productName=document.getElementById("productName");
const productPrice=document.getElementById("productPrice");
const productDescription=document.getElementById("productDescription");

const addCartBtn=document.getElementById("addCartBtn");
const favoriteBtn=document.getElementById("favoriteBtn");

const relatedProducts=document.getElementById("relatedProducts");

let product=null;

updateCartCount();

loadProduct();
/*==================================
تحميل المنتج
==================================*/

async function loadProduct(){

try{

const ref=doc(db,"products",productId);

const snap=await getDoc(ref);

if(!snap.exists()){

productName.textContent="المنتج غير موجود";

return;

}

product={

id:snap.id,

...snap.data()

};

renderProduct();

loadRelatedProducts();

}catch(error){

console.error(error);

}

}

/*==================================
عرض المنتج
==================================*/

function renderProduct(){

productImage.src=imageOrDefault(product.image);

productName.textContent=product.name||"بدون اسم";

productPrice.textContent=formatPrice(product.price);

productDescription.textContent=

product.description||

"لا يوجد وصف لهذا المنتج.";

if(isFavorite(product.id)){

favoriteBtn.classList.add("active");

favoriteBtn.innerHTML=`
<i class="fa-solid fa-heart"></i>
في المفضلة
`;

}

addCartBtn.onclick=()=>{

addToCart(product);

};

favoriteBtn.onclick=()=>{

const state=toggleFavorite(product);

if(state){

favoriteBtn.classList.add("active");

favoriteBtn.innerHTML=`
<i class="fa-solid fa-heart"></i>
في المفضلة
`;

}else{

favoriteBtn.classList.remove("active");

favoriteBtn.innerHTML=`
<i class="fa-regular fa-heart"></i>
المفضلة
`;

}

};

}/*==================================
المنتجات المشابهة
==================================*/

async function loadRelatedProducts(){

try{

const snap=await getDocs(collection(db,"products"));

relatedProducts.innerHTML="";

let count=0;

snap.forEach(doc=>{

if(count>=4) return;

const item={

id:doc.id,

...doc.data()

};

if(item.id===product.id) return;

count++;

relatedProducts.innerHTML+=`

<div class="product-card">

<div class="product-image">

<img
src="${imageOrDefault(item.image)}"
class="product-img"
loading="lazy">

</div>

<div class="product-content">

<h3 class="product-name">

${item.name||""}

</h3>

<div class="price-box">

<span class="price">

${formatPrice(item.price)}

</span>

</div>

<div class="product-buttons">

<button
class="details-btn"
onclick="location.href='details.html?id=${item.id}'">

<i class="fa-solid fa-eye"></i>

عرض

</button>

<button
class="cart-btn"
onclick="window.addRelatedToCart('${item.id}')">

<i class="fa-solid fa-cart-shopping"></i>

إضافة للسلة

</button>

</div>

</div>

</div>

`;

});

window.addRelatedToCart=function(id){

const selected=snap.docs.find(d=>d.id===id);

if(!selected) return;

addToCart({

id:selected.id,

...selected.data()

});

};

}catch(error){

console.error(error);

}

}

/*==================================
Page Ready
==================================*/

console.log("Details Page Ready ✅");
