/*==================================
مجمع حمزه الشطري
Details JS
==================================*/

import { db } from "./firebase.js";

import {
doc,
getDoc,
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params=new URLSearchParams(location.search);

const id=params.get("id");

const productImage=document.getElementById("productImage");
const productName=document.getElementById("productName");
const productPrice=document.getElementById("productPrice");
const productDescription=document.getElementById("productDescription");

const addCartBtn=document.getElementById("addCartBtn");
const favoriteBtn=document.getElementById("favoriteBtn");

const relatedProducts=document.getElementById("relatedProducts");

let product=null;

let cart=
JSON.parse(localStorage.getItem("cart"))||[];

let favorites=
JSON.parse(localStorage.getItem("favorites"))||[];

loadProduct();

/*====================
تحميل المنتج
====================*/

async function loadProduct(){

try{

const ref=doc(db,"products",id);

const snap=await getDoc(ref);

if(!snap.exists()){

productName.textContent="المنتج غير موجود";

return;

}

product={
id:snap.id,
...snap.data()
};

showProduct();

loadRelated();

}catch(err){

console.log(err);

}

}
/*====================
عرض المنتج
====================*/

function showProduct(){

productImage.src=
product.image||"images/no-image.png";

productName.textContent=
product.name||"بدون اسم";

productPrice.textContent=
`${Number(product.price||0).toLocaleString()} د.ع`;

productDescription.textContent=
product.description||
"لا يوجد وصف لهذا المنتج.";

addCartBtn.onclick=()=>{

addToCart(product);

};

favoriteBtn.onclick=()=>{

toggleFavorite(product.id);

};

if(favorites.includes(product.id)){

favoriteBtn.innerHTML=`
<i class="fa-solid fa-heart"></i>
المفضلة
`;

favoriteBtn.classList.add("active");

}

}

/*====================
إضافة للسلة
====================*/

function addToCart(product){

const index=
cart.findIndex(i=>i.id===product.id);

if(index>-1){

cart[index].qty++;

}else{

cart.push({

id:product.id,

name:product.name,

price:Number(product.price||0),

image:product.image,

qty:1

});

}

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

showToast("تمت إضافة المنتج إلى السلة");

}

/*====================
المفضلة
====================*/

function toggleFavorite(id){

const index=favorites.indexOf(id);

if(index>-1){

favorites.splice(index,1);

favoriteBtn.classList.remove("active");

favoriteBtn.innerHTML=`
<i class="fa-regular fa-heart"></i>
المفضلة
`;

showToast("تمت إزالة المنتج من المفضلة");

}else{

favorites.push(id);

favoriteBtn.classList.add("active");

favoriteBtn.innerHTML=`
<i class="fa-solid fa-heart"></i>
المفضلة
`;

showToast("تمت إضافة المنتج إلى المفضلة");

}

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

}

/*====================
Toast
====================*/

function showToast(message){

let toast=document.querySelector(".toast");

if(!toast){

toast=document.createElement("div");

toast.className="toast";

document.body.appendChild(toast);

}

toast.textContent=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

/*====================
منتجات مشابهة
====================*/

async function loadRelated(){

const snap=
await getDocs(collection(db,"products"));

relatedProducts.innerHTML="";

snap.forEach(doc=>{

if(doc.id===id) return;

const p={
id:doc.id,
...doc.data()
};

relatedProducts.innerHTML+=`

<div class="product-card">

<div class="product-image">

<img src="${p.image||''}">

</div>

<div class="product-content">

<h3>${p.name||''}</h3>

<div class="price">

${Number(p.price||0).toLocaleString()} د.ع

</div>

<button
class="cart-btn"

onclick="location.href='details.html?id=${p.id}'">

عرض المنتج

</button>

</div>

</div>

`;

});

}
