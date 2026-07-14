import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
deleteDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// وضع التعديل
let editId = null;

// عناصر الصفحة
const name = document.getElementById("name");
const price = document.getElementById("price");
const category = document.getElementById("category");
const sizes = document.getElementById("sizes");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const description = document.getElementById("description");
const image = document.getElementById("image");
const offer = document.getElementById("offer");

const saveBtn = document.getElementById("saveBtn");
const productsDiv = document.getElementById("products");
async function loadProducts() {

const snap = await getDocs(collection(db, "products"));

productsDiv.innerHTML = "";

snap.forEach((item) => {

const p = item.data();

productsDiv.innerHTML += `

<div class="card">

<img src="${p.image}" alt="">

<div class="card-body">

<h3>${p.name}</h3>

<p>السعر: ${Number(p.price).toLocaleString()} د.ع</p>

<p>القسم: ${p.category}</p>

<div class="actions">

<button class="edit"
onclick="editProduct('${item.id}')">

✏️ تعديل

</button>

<button class="delete"
onclick="deleteProduct('${item.id}')">

🗑 حذف

</button>

</div>

</div>

</div>

`;

});

}window.deleteProduct = async function(id){

if(!confirm("هل تريد حذف المنتج؟")) return;

try{

await deleteDoc(doc(db,"products",id));

alert("تم حذف المنتج");

loadProducts();

}catch(err){

alert(err.message);

}

}



window.editProduct = async function(id){

const snap = await getDocs(collection(db,"products"));

snap.forEach((item)=>{

if(item.id===id){

const p=item.data();

name.value=p.name;
price.value=p.price;
category.value=p.category;
sizes.value=p.sizes;
colors.value=p.colors;
quantity.value=p.quantity;
description.value=p.description;
image.value=p.image;
offer.checked=p.offer;

editId=id;

saveBtn.innerText="💾 حفظ التعديلات";

}

});

}
