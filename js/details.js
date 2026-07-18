/*==================================
Hamza Store V17
Professional Details JS
==================================*/

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    addToCart,
    toggleFavorite,
    formatPrice,
    safeImage,
    updateCartCount
} from "./utils.js";

/*========================
ELEMENTS
========================*/

const productId = new URLSearchParams(window.location.search).get("id");

let currentProduct = null;

const image = document.getElementById("productImage");
const nameEl = document.getElementById("productName");
const categoryEl = document.getElementById("productCategory");
const priceEl = document.getElementById("productPrice");
const oldPriceEl = document.getElementById("oldPrice");
const discountBadge = document.getElementById("discountBadge");
const descEl = document.getElementById("productDescription");
const sizesEl = document.getElementById("productSizes");
const colorsEl = document.getElementById("productColors");
const qtyEl = document.getElementById("productQty");

const addCartBtn = document.getElementById("addCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const shareBtn = document.getElementById("shareBtn");
const whatsappBtn = document.getElementById("whatsappBtn");

const relatedContainer =
document.getElementById("relatedProducts");

const loader =
document.getElementById("loader");

/*========================
START
========================*/

document.addEventListener("DOMContentLoaded", init);

async function init(){

    updateCartCount();

    if(!productId){

        hideLoader();

        if(nameEl){

            nameEl.textContent="المنتج غير موجود";

        }

        return;

    }

    try{

        await loadProduct();

        if(currentProduct){

            await loadRelated();

        }

    }catch(error){

        console.error(error);

        if(nameEl){

            nameEl.textContent="حدث خطأ أثناء تحميل المنتج";

        }

    }

    hideLoader();

}

function hideLoader(){

    if(!loader) return;

    loader.classList.add("hidden");

    setTimeout(()=>{

        loader.remove();

    },300);

}

/*========================
LOAD PRODUCT
========================*/

async function loadProduct(){

    const ref = doc(db,"products",productId);

    const snap = await getDoc(ref);

    if(!snap.exists()){

        throw new Error("Product not found");

    }

    currentProduct={

        id:snap.id,

        ...snap.data()

    };

    renderProduct();

}

/*========================
RENDER PRODUCT
========================*/

function renderProduct(){

    if(!currentProduct) return;

    image.src=safeImage(currentProduct.image);

    image.alt=currentProduct.name || "";

    nameEl.textContent=currentProduct.name || "";

    categoryEl.textContent=currentProduct.category || "";

    priceEl.textContent=formatPrice(currentProduct.price || 0);

    descEl.textContent=
    currentProduct.description ||
    "لا يوجد وصف";

    qtyEl.textContent=
    currentProduct.quantity || 0;

    sizesEl.innerHTML="";

    colorsEl.innerHTML="";

/*========================
SIZES
========================*/

    if(currentProduct.sizes){

        currentProduct.sizes
        .toString()
        .split(",")
        .map(x=>x.trim())
        .filter(Boolean)
        .forEach(size=>{

            const span=document.createElement("span");

            span.textContent=size;

            sizesEl.appendChild(span);

        });

    }else{

        sizesEl.textContent="غير محدد";

    }

/*========================
COLORS
========================*/

    if(currentProduct.colors){

        currentProduct.colors
        .toString()
        .split(",")
        .map(x=>x.trim())
        .filter(Boolean)
        .forEach(color=>{

            const span=document.createElement("span");

            span.textContent=color;

            colorsEl.appendChild(span);

        });

    }else{

        colorsEl.textContent="غير محدد";

    }

/*========================
OLD PRICE
========================*/

    if(
        currentProduct.oldPrice &&
        Number(currentProduct.oldPrice)>
        Number(currentProduct.price)
    ){

        oldPriceEl.textContent=
        formatPrice(currentProduct.oldPrice);

        const discount=Math.round(

            (1-
            Number(currentProduct.price)/
            Number(currentProduct.oldPrice))*100

        );

        discountBadge.style.display="inline-flex";

        discountBadge.textContent=`خصم ${discount}%`;

    }else{

        oldPriceEl.textContent="";

        discountBadge.style.display="none";

    }

}

/*========================
BUTTONS
========================*/

addCartBtn?.addEventListener("click",()=>{

    if(!currentProduct) return;

    addToCart(currentProduct);

    updateCartCount();

});

buyNowBtn?.addEventListener("click",()=>{

    if(!currentProduct) return;

    addToCart(currentProduct);

    updateCartCount();

    location.href="cart.html";

});

favoriteBtn?.addEventListener("click",()=>{

    if(!currentProduct) return;

    toggleFavorite(currentProduct);

});

shareBtn?.addEventListener("click",async()=>{

    if(!currentProduct) return;

    const data={

        title:currentProduct.name,

        text:currentProduct.description || "",

        url:location.href

    };

    if(navigator.share){

        try{

            await navigator.share(data);

        }catch(e){}

    }else{

        try{

            await navigator.clipboard.writeText(location.href);

            alert("تم نسخ الرابط");

        }catch(e){}

    }

});

whatsappBtn?.addEventListener("click",(e)=>{

    e.preventDefault();

    if(!currentProduct) return;

    const message=`مرحباً،

أرغب بطلب المنتج:

${currentProduct.name}

السعر:
${formatPrice(currentProduct.price)}

الرابط:
${location.href}`;

    window.open(

`https://wa.me/9647813555538?text=${encodeURIComponent(message)}`,

"_blank"

    );

});

image?.addEventListener("click",()=>{

    if(!currentProduct) return;

    window.open(

safeImage(currentProduct.image),

"_blank"

    );

});

/*========================
LOAD RELATED PRODUCTS
========================*/

async function loadRelated() {

    if (!relatedContainer || !currentProduct) return;

    relatedContainer.innerHTML = "";

    try {

        const snapshot = await getDocs(collection(db, "products"));

        let count = 0;

        snapshot.forEach((docSnap) => {

            const product = {
                id: docSnap.id,
                ...docSnap.data()
            };

            if (product.id === currentProduct.id) return;

            if (product.category !== currentProduct.category) return;

            if (count >= 8) return;

            relatedContainer.appendChild(
                createRelatedCard(product)
            );

            count++;

        });

        if (count === 0) {

            relatedContainer.innerHTML = `
                <div class="empty-products">
                    <i class="fa-solid fa-box-open"></i>
                    <h3>لا توجد منتجات مشابهة</h3>
                </div>
            `;

        }

    } catch (error) {

        console.error("Related Products:", error);

        relatedContainer.innerHTML = `
            <div class="empty-products">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h3>تعذر تحميل المنتجات المشابهة</h3>
            </div>
        `;

    }

}

/*========================
RELATED CARD
========================*/

function createRelatedCard(product) {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

        <div class="product-image">

            <img
                src="${safeImage(product.image)}"
                alt="${product.name}"
                loading="lazy">

        </div>

        <div class="product-info">

            <h3 class="product-title">

                ${product.name}

            </h3>

            <div class="product-price">

                ${formatPrice(product.price)}

            </div>

            <div class="product-actions">

                <button class="add-cart">

                    <i class="fa-solid fa-cart-shopping"></i>

                    إضافة

                </button>

                <a
                    href="details.html?id=${product.id}"
                    class="details-btn">

                    <i class="fa-solid fa-eye"></i>

                    التفاصيل

                </a>

            </div>

        </div>

    `;

    card.querySelector(".add-cart").onclick = () => {

        addToCart(product);

        updateCartCount();

    };

    return card;

}

/*========================
END
========================*/

window.addEventListener("storage", () => {

    updateCartCount();

});
