/*==================================
Hamza Store V14
Admin Products
Part 1
==================================*/

import { db } from "./js/firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const productsList = document.getElementById("productsList");

let editId = null;

/*========================
MESSAGE
========================*/

function showMessage(message, success = true){

    const toast = document.createElement("div");

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.left = "20px";
    toast.style.bottom = "20px";
    toast.style.padding = "14px 22px";
    toast.style.borderRadius = "12px";
    toast.style.background = success ? "#16a34a" : "#dc2626";
    toast.style.color = "#fff";
    toast.style.fontFamily = "Cairo";
    toast.style.fontWeight = "700";
    toast.style.zIndex = "999999";

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },2500);

}

/*========================
IMAGE
========================*/

function cleanImage(url){

    if(!url) return "";

    url = url.trim();

    const match = url.match(/src=['"]([^'"]+)['"]/i);

    if(match){

        url = match[1];

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

  alert("بدأ تحميل المنتجات");
  
    if(!productsList) return;

    productsList.innerHTML = "<p>جاري تحميل المنتجات...</p>";

    try{

        const snap = await getDocs(collection(db,"products"));

        productsList.innerHTML = "";

        if(snap.empty){

            productsList.innerHTML = `
            <div class="product-box">
                لا توجد منتجات
            </div>`;
            return;

        }

        snap.forEach(item=>{

            const p = item.data();

            const image = cleanImage(p.image || "");

            productsList.innerHTML += `

            <div class="product-box">

                <img
                    src="${image}"
                    alt="${p.name || ""}"
                    style="
                        width:100%;
                        height:220px;
                        object-fit:cover;
                        border-radius:12px;
                        margin-bottom:10px;
                    ">

                <h3>${p.name || "بدون اسم"}</h3>

                <p><strong>السعر:</strong> ${p.price || 0} د.ع</p>

                <p><strong>القسم:</strong> ${p.category || ""}</p>

                <p><strong>الكمية:</strong> ${p.quantity || ""}</p>

                <div style="display:flex;gap:10px;margin-top:15px;">

                    <button
                        onclick="editProduct('${item.id}')"
                        style="flex:1;background:#2563eb;color:#fff;">
                        ✏️ تعديل
                    </button>

                    <button
                        onclick="deleteProduct('${item.id}')"
                        style="flex:1;background:#dc2626;color:#fff;">
                        🗑 حذف
                    </button>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.error(error);

        productsList.innerHTML = `
        <div class="product-box">
            <b>حدث خطأ</b><br>
            ${error.message}
        </div>`;

    }

}
/*========================
SAVE PRODUCT
========================*/

if(saveBtn){

saveBtn.addEventListener("click", async()=>{

    const product={

        name:nameInput.value.trim(),

        price:Number(priceInput.value)||0,

        category:categoryInput.value,

        sizes:sizesInput.value.trim(),

        colors:colorsInput.value.trim(),

        quantity:Number(quantityInput.value)||0,

        description:descriptionInput.value.trim(),

        image:cleanImage(imageInput.value),

        offer:offerInput ? offerInput.checked : false

    };

    if(product.name===""){

        showMessage("يرجى إدخال اسم المنتج",false);

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

            saveBtn.textContent="💾 حفظ المنتج";

        }else{

            await addDoc(

                collection(db,"products"),

                {

                    ...product,

                    time:serverTimestamp()

                }

            );

            showMessage("✅ تم حفظ المنتج");

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

        await loadProducts();

    }

    catch(error){

        console.error(error);

        showMessage(error.message,false);

    }

});

}
/*========================
DELETE PRODUCT
========================*/

window.deleteProduct = async function(id){

    if(!confirm("هل تريد حذف المنتج؟")) return;

    try{

        await deleteDoc(doc(db,"products",id));

        showMessage("🗑 تم حذف المنتج");

        await loadProducts();

    }catch(error){

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

        saveBtn.textContent = "💾 حفظ التعديلات";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }catch(error){

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

document.addEventListener("DOMContentLoaded", () => {
    alert("admin-products.js يعمل");
    loadProducts();
});

});
