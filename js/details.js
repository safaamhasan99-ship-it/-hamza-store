/*==================================
Hamza Store V6
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
} from "./utils.js";

/*==================================
Elements
==================================*/

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

/*==================================
Start
==================================*/

updateCartCount();

if(productId){

loadProduct();

}else if(productName){

productName.textContent="لم يتم تحديد المنتج";

}

/*==================================
Load Product
==================================*/

async function loadProduct(){

try{

const ref=doc(db,"products",productId);

const snap=await getDoc(ref);

if(!snap.exists()){

if(productName){

productName.textContent="المنتج غير موجود";

}

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

if(productName){

productName.textContent="حدث خطأ أثناء تحميل المنتج";

}

}

}
/*==================================
Render Product
==================================*/

function renderProduct(){

if(!productImage || !productName || !productPrice){

return;

}

productImage.src=imageOrDefault(product.image);

productImage.alt=product.name||"منتج";

productName.textContent=

product.name||"بدون اسم";

productPrice.textContent=

formatPrice(product.price);

if(productDescription){

productDescription.textContent=

product.description||

"لا يوجد وصف لهذا المنتج.";

}

if(isFavorite(product.id)){

favoriteBtn.classList.add("active");

favoriteBtn.innerHTML=`

<i class="fa-solid fa-heart"></i>

في المفضلة

`;

}

if(addCartBtn){

addCartBtn.onclick=()=>{

addToCart(product);

};

}

if(favoriteBtn){

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

}

}
/*==================================
Related Products
==================================*/

async function loadRelatedProducts(){

if(!relatedProducts) return;

try{

const snap=await getDocs(collection(db,"products"));

relatedProducts.innerHTML="";

let count=0;

snap.forEach(docItem=>{

if(count>=4) return;

const item={

id:docItem.id,

...docItem.data()

};

if(item.id===product.id) return;

count++;

relatedProducts.innerHTML+=`

<div class="product-card">

<div class="product-image">

<img
src="${imageOrDefault(item.image)}"
class="product-img"
alt="${item.name||''}"
loading="lazy">

</div>

<div class="product-content">

<h3 class="product-name">

${item.name||"بدون اسم"}

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

window.addRelatedToCart=(id)=>{

const selected=snap.docs.find(d=>d.id===id);

if(!selected) return;

addToCart({

id:selected.id,

...selected.data()

});

};

}catch(error){

console.error(error);

relatedProducts.innerHTML=`

<div class="empty-state">

<i class="fa-solid fa-box-open"></i>

<h2>تعذر تحميل المنتجات المشابهة</h2>

</div>

`;

}

}

/*==================================
Ready
==================================*/

console.log("Details Page Ready ✅");
