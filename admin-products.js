// admin-products.js

import { db, storage } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const productsRef = collection(db,"products");

let editId = null;

/*==========================
تحميل المنتجات
==========================*/

async function loadProducts(){

const container=document.getElementById("products");

if(!container) return;

container.innerHTML="";

const snapshot=await getDocs(productsRef);

snapshot.forEach((item)=>{

const p=item.data();

container.innerHTML+=`

<div class="card">

<img src="${p.image || 'images/no-image.png'}">

<div class="card-body">

<h3>${p.name}</h3>

<div class="price">
${p.price} د.ع
</div>

<p>
القسم: ${p.category}
</p>

<p>
${p.description || ""}
</p>

<p>
المقاسات: ${p.sizes || "-"}
</p>

<p>
الألوان: ${p.colors || "-"}
</p>

<p>
الكمية: ${p.quantity || 0}
</p>

${p.offer ? '<span class="offer-badge">عرض</span>' : ''}

<div class="actions">

<button class="edit"
onclick="editProduct('${item.id}')">
تعديل
</button>

<button class="delete"
onclick="removeProduct('${item.id}')">
حذف
</button>

</div>

</div>

</div>

`;

});

}
/*==========================
حذف منتج
==========================*/

window.removeProduct = async function(id){

if(!confirm("هل تريد حذف المنتج؟")) return;

try{

await deleteDoc(
doc(db,"products",id)
);

alert("تم حذف المنتج");

loadProducts();

}catch(error){

console.error(error);

alert("تعذر حذف المنتج");

}

};

/*==========================
تعديل منتج
==========================*/

window.editProduct = async function(id){

try{

const snap = await getDoc(
doc(db,"products",id)
);

if(!snap.exists()){

alert("المنتج غير موجود");

return;

}

const p = snap.data();

editId = id;

document.getElementById("name").value = p.name || "";
document.getElementById("price").value = p.price || "";
document.getElementById("category").value = p.category || "";
document.getElementById("description").value = p.description || "";

if(document.getElementById("sizes"))
document.getElementById("sizes").value = p.sizes || "";

if(document.getElementById("colors"))
document.getElementById("colors").value = p.colors || "";

if(document.getElementById("quantity"))
document.getElementById("quantity").value = p.quantity || 0;

if(document.getElementById("offer"))
document.getElementById("offer").checked = p.offer || false;

document.getElementById("saveBtn").innerText = "حفظ التعديل";

window.scrollTo({
top:0,
behavior:"smooth"
});

}catch(error){

console.error(error);

alert("حدث خطأ أثناء تحميل بيانات المنتج");

}

};
/*==========================
حفظ المنتج
==========================*/

window.saveProduct = async function(){

const name = document.getElementById("name").value.trim();
const price = document.getElementById("price").value.trim();
const category = document.getElementById("category").value;
const description = document.getElementById("description").value.trim();

const sizes =
document.getElementById("sizes")?.value || "";

const colors =
document.getElementById("colors")?.value || "";

const quantity =
Number(document.getElementById("quantity")?.value || 0);

const offer =
document.getElementById("offer")?.checked || false;

if(!name || !price){

alert("يرجى إدخال اسم المنتج والسعر");

return;

}

let imageUrl = "";

const file =
document.getElementById("imageFile").files[0];

if(file){

const imageRef = ref(
storage,
"products/" + Date.now() + "_" + file.name
);

await uploadBytes(imageRef,file);

imageUrl = await getDownloadURL(imageRef);

}

const product={

name,

price:Number(price),

category,

description,

sizes,

colors,

quantity,

offer,

updatedAt:new Date()

};

if(imageUrl){

product.image=imageUrl;

}

try{

if(editId){

await updateDoc(
doc(db,"products",editId),
product
);

alert("تم تعديل المنتج بنجاح");

editId=null;

}else{

product.createdAt=new Date();

await addDoc(
productsRef,
product
);

alert("تمت إضافة المنتج بنجاح");

}

clearForm();

loadProducts();

document.getElementById("saveBtn").innerText="إضافة المنتج";

}catch(error){

console.error(error);

alert("حدث خطأ أثناء حفظ المنتج");

}

};
/*==========================
تنظيف الحقول
==========================*/

function clearForm(){

document.getElementById("name").value = "";

document.getElementById("price").value = "";

document.getElementById("description").value = "";

document.getElementById("imageFile").value = "";

document.getElementById("category").selectedIndex = 0;

if(document.getElementById("sizes"))
document.getElementById("sizes").value = "";

if(document.getElementById("colors"))
document.getElementById("colors").value = "";

if(document.getElementById("quantity"))
document.getElementById("quantity").value = "";

if(document.getElementById("offer"))
document.getElementById("offer").checked = false;

editId = null;

}

/*==========================
ربط زر الحفظ
==========================*/

const saveBtn = document.getElementById("saveBtn");

if(saveBtn){

saveBtn.addEventListener("click", saveProduct);

}

/*==========================
تحميل المنتجات عند فتح الصفحة
==========================*/

document.addEventListener("DOMContentLoaded", ()=>{

loadProducts();

});
