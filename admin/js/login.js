import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productsRef = collection(db,"products");

let editId = null;

export async function loadProducts(){

const container=document.getElementById("products");

if(!container) return;

container.innerHTML="";

const snapshot=await getDocs(productsRef);

snapshot.forEach((item)=>{

const p=item.data();

container.innerHTML+=`

<div class="card">

<img src="${p.image}" alt="${p.name}">

<div class="card-body">

<h3>${p.name}</h3>

<div class="price">${p.price} د.ع</div>

<div class="category">${p.category}</div>

<p>${p.description}</p>

<div class="actions">

<button class="edit" onclick="editProduct('${item.id}')">
تعديل
</button>

<button class="delete" onclick="removeProduct('${item.id}')">
حذف
</button>

</div>

</div>

</div>

`;

});

}

window.removeProduct=async(id)=>{

if(!confirm("هل تريد حذف المنتج؟")) return;

await deleteDoc(doc(db,"products",id));

loadProducts();

};

window.editProduct=async(id)=>{

const snap=await getDoc(doc(db,"products",id));

const p=snap.data();

editId=id;

document.getElementById("name").value=p.name;
document.getElementById("price").value=p.price;
document.getElementById("category").value=p.category;
document.getElementById("description").value=p.description;
document.getElementById("image").value=p.image;

document.getElementById("saveBtn").innerText="حفظ التعديلات";
// حفظ منتج جديد أو تحديث منتج

window.saveProduct = async function () {

    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").value.trim();

    if (!name || !price || !image) {
        alert("يرجى ملء جميع الحقول المطلوبة");
        return;
    }

    const product = {
        name,
        price: Number(price),
        category,
        description,
        image,
        updatedAt: new Date()
    };

    try {

        if (editId) {

            await updateDoc(doc(db, "products", editId), product);

            editId = null;

            document.getElementById("saveBtn").innerText = "إضافة المنتج";

            alert("تم تحديث المنتج بنجاح");

        } else {

            product.createdAt = new Date();

            await addDoc(productsRef, product);

            alert("تمت إضافة المنتج بنجاح");

        }

        clearForm();

        loadProducts();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء حفظ البيانات");

    }

};


// تنظيف الحقول

function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";
    document.getElementById("category").selectedIndex = 0;

}


// زر الحفظ

const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {

    saveBtn.addEventListener("click", saveProduct);

}


// تحميل المنتجات عند فتح الصفحة

loadProducts();
  
};
