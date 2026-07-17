/*==================================
Hamza Store V13
Admin Products JS
Part 1
==================================*/

import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
deleteDoc,
updateDoc,
getDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*========================
ELEMENTS
========================*/

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const sizesInput = document.getElementById("sizes");
const colorsInput = document.getElementById("colors");
const quantityInput = document.getElementById("quantity");
const descriptionInput = document.getElementById("description");
const imageInput = document.getElementById("image");
const offerInput = document.getElementById("offer");

const saveBtn = document.getElementById("saveBtn");

/* إصلاح الخطأ */
const productsList = document.getElementById("productsList");

let editId = null;

/*========================
TOAST
========================*/

function showMessage(text, success = true) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.style.position = "fixed";
    toast.style.left = "20px";
    toast.style.bottom = "20px";
    toast.style.padding = "15px 22px";
    toast.style.borderRadius = "12px";
    toast.style.color = "#fff";
    toast.style.fontFamily = "Cairo";
    toast.style.fontWeight = "700";
    toast.style.zIndex = "999999";
    toast.style.background = success
        ? "#16a34a"
        : "#dc2626";

    toast.textContent = text;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}

/*========================
IMAGE
========================*/

function cleanImageUrl(url){

    if(!url) return "";

    url = String(url).trim();

    const html = url.match(/src=['"]([^'"]+)['"]/i);

    if(html){

        url = html[1];

    }

    if(url.startsWith("//")){

        url = "https:" + url;

    }

    return url;

}
/*========================
LOAD PRODUCTS
========================*/

async function loadProducts(){

    if(!productsList) return;

    productsList.innerHTML = "<p>جاري تحميل المنتجات...</p>";

    try{

        const snap = await getDocs(collection(db,"products"));

        productsList.innerHTML = "";

        if(snap.empty){

            productsList.innerHTML = `
            <div class="empty-products">
                لا توجد منتجات
            </div>`;
            return;
        }

        snap.forEach(item=>{

            const p = item.data();

            productsList.innerHTML += `

            <div class="product-box">

                <img
                    src="${cleanImageUrl(p.image)}"
                    style="
                        width:100%;
                        max-height:220px;
                        object-fit:cover;
                        border-radius:12px;
                    ">

                <h3>${p.name || "بدون اسم"}</h3>

                <p><b>السعر:</b> ${p.price || 0} د.ع</p>

                <p><b>القسم:</b> ${p.category || ""}</p>

                <p><b>الكمية:</b> ${p.quantity || ""}</p>

                <button onclick="editProduct('${item.id}')">
                    ✏️ تعديل
                </button>

                <button onclick="deleteProduct('${item.id}')">
                    🗑 حذف
                </button>

            </div>

            `;

        });

    }

    catch(error){

        console.error(error);

        productsList.innerHTML = `
        <div class="empty-products">
            ${error.message}
        </div>`;
    }

}

/*========================
SAVE PRODUCT
========================*/

if(saveBtn){

saveBtn.onclick = async ()=>{

    const product={

        name:nameInput.value.trim(),

        price:Number(priceInput.value)||0,

        category:categoryInput.value,

        sizes:sizesInput.value.trim(),

        colors:colorsInput.value.trim(),

        quantity:Number(quantityInput.value)||0,

        description:descriptionInput.value.trim(),

        image:cleanImageUrl(imageInput.value),

        offer:offerInput ? offerInput.checked : false

    };

    if(!product.name){

        showMessage("اكتب اسم المنتج",false);

        return;

    }

    try{

        if(editId){

            await updateDoc(

                doc(db,"products",editId),

                product

            );

            showMessage("✅ تم تعديل المنتج");

            editId=null;

            saveBtn.innerHTML="💾 حفظ المنتج";

        }

        else{

            await addDoc(

                collection(db,"products"),

                {

                    ...product,

                    time:serverTimestamp()

                }

            );

            showMessage("✅ تمت إضافة المنتج");

        }

        nameInput.value="";
        priceInput.value="";
        sizesInput.value="";
        colorsInput.value="";
        quantityInput.value="";
        descriptionInput.value="";
        imageInput.value="";

        if(offerInput){

            offerInput.checked=false;

        }

        categoryInput.selectedIndex=0;

        loadProducts();

    }

    catch(error){

        console.error(error);

        showMessage(error.message,false);

    }

};

}

/*========================
DELETE PRODUCT
========================*/

window.deleteProduct = async function(id){

    if(!confirm("هل تريد حذف المنتج؟")) return;

    try{

        await deleteDoc(doc(db,"products",id));

        showMessage("🗑 تم حذف المنتج");

        loadProducts();

    }

    catch(error){

        console.error(error);

        showMessage(error.message,false);

    }

};


/*========================
EDIT PRODUCT
========================*/

window.editProduct = async function(id){

    try{

        const ref = doc(db,"products",id);

        const snap = await getDoc(ref);

        if(!snap.exists()){

            showMessage("المنتج غير موجود",false);

            return;

        }

        const p = snap.data();

        nameInput.value = p.name || "";

        priceInput.value = p.price || "";

        categoryInput.value = p.category || "";

        sizesInput.value = p.sizes || "";

        colorsInput.value = p.colors || "";

        quantityInput.value = p.quantity || "";

        descriptionInput.value = p.description || "";

        imageInput.value = p.image || "";

        if(offerInput){

            offerInput.checked = p.offer || false;

        }

        editId = id;

        saveBtn.innerHTML = "💾 حفظ التعديلات";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        console.error(error);

        showMessage(error.message,false);

    }

};


/*========================
REFRESH
========================*/

window.refreshProducts = function(){

    loadProducts();

};


/*========================
START
========================*/

document.addEventListener("DOMContentLoaded",()=>{

    loadProducts();

});
