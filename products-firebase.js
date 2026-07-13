import { db, storage } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
getDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const productsRef = collection(db,"products");

let editId = null;

async function loadProducts(){

const container=document.getElementById("productsList");

if(!container) return;

container.innerHTML="";

const snapshot=await getDocs(productsRef);

if(snapshot.empty){

container.innerHTML=`
<div class="about-box">
لا توجد منتجات
</div>
`;

return;

}

snapshot.forEach((item)=>{

const p=item.data();

container.innerHTML+=`

<div class="product-card">

<img src="${p.image || ''}" alt="${p.name}">

<div class="product-info">

<h3>${p.name}</h3>

<p class="price">
${Number(p.price).toLocaleString()} د.ع
</p>

<p>${p.category}</p>

<p>${p.description || ""}</p>

<button class="cart-btn"
onclick="editProduct('${item.id}')">

✏️ تعديل

</button>

<button class="favorite"
onclick="removeProduct('${item.id}')">

🗑 حذف

</button>

</div>

</div>

`;

});

}

window.removeProduct=async function(id){

if(!confirm("هل تريد حذف المنتج؟"))
return;

await deleteDoc(doc(db,"products",id));

alert("تم حذف المنتج");

loadProducts();

};

window.editProduct=async function(id){

const snap=await getDoc(doc(db,"products",id));

const p=snap.data();

editId=id;

document.getElementById("productName").value=p.name;

document.getElementById("productPrice").value=p.price;

document.getElementById("productCategory").value=p.category;

document.getElementById("productDescription").value=p.description || "";

};
window.saveProduct = async function () {

const name = document.getElementById("productName").value.trim();

const price = document.getElementById("productPrice").value.trim();

const category = document.getElementById("productCategory").value;

const description = document.getElementById("productDescription").value.trim();

if (!name || !price) {

alert("يرجى إدخال اسم المنتج والسعر");

return;

}

let product = {

name: name,

price: Number(price),

category: category,

description: description,

updatedAt: serverTimestamp()

};

const file = document.getElementById("imageFile")?.files[0];

if (file) {

const imageRef = ref(

storage,

"products/" + Date.now() + "_" + file.name

);

await uploadBytes(imageRef, file);

product.image = await getDownloadURL(imageRef);

}

try {

if (editId) {

await updateDoc(

doc(db, "products", editId),

product

);

alert("تم تعديل المنتج بنجاح ✅");

editId = null;

} else {

product.createdAt = serverTimestamp();

await addDoc(productsRef, product);

alert("تمت إضافة المنتج بنجاح ✅");

}

clearForm();

loadProducts();

const btn = document.getElementById("saveBtn");

if (btn) {

btn.innerText = "💾 حفظ المنتج";

}

} catch (error) {

console.error(error);

alert("حدث خطأ أثناء حفظ المنتج");

}

};

function clearForm() {

document.getElementById("productName").value = "";

document.getElementById("productPrice").value = "";

document.getElementById("productDescription").value = "";

document.getElementById("productCategory").selectedIndex = 0;

const image = document.getElementById("imageFile");

if (image) {

image.value = "";

}

}

window.refreshProducts = function () {

loadProducts();

};

const btn = document.getElementById("saveBtn");

if (btn) {

btn.addEventListener("click", saveProduct);

}

loadProducts();
