/*==================================
Hamza Store V8
Details JS
==================================*/

import { db } from "../firebase.js";

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

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let currentProduct = null;

document.addEventListener("DOMContentLoaded", async ()=>{

    updateCartCount();

    if(!productId) return;

    await loadProduct();

    await loadRelated();

});


/*========================
LOAD PRODUCT
========================*/

async function loadProduct(){

    try{

        const ref = doc(db,"products",productId);

        const snap = await getDoc(ref);

        if(!snap.exists()){

            document.getElementById("productName").textContent="المنتج غير موجود";

            return;

        }

        currentProduct = {

            id:snap.id,

            ...snap.data()

        };

        renderProduct();

    }catch(err){

        console.error(err);

    }

}

/*========================
RENDER PRODUCT
========================*/

function renderProduct(){

document.getElementById("productImage").src =
safeImage(currentProduct.image);

document.getElementById("productImage").alt =
currentProduct.name;

document.getElementById("productName").textContent =
currentProduct.name || "";

document.getElementById("productCategory").textContent =
currentProduct.category || "";

document.getElementById("productPrice").textContent =
formatPrice(currentProduct.price || 0);

document.getElementById("productDescription").textContent =
currentProduct.description || "لا يوجد وصف.";

document.getElementById("productSizes").textContent =
currentProduct.sizes || "غير محدد";

document.getElementById("productColors").textContent =
currentProduct.colors || "غير محدد";

document.getElementById("productQty").textContent =
currentProduct.quantity || 0;



document.getElementById("addCartBtn").onclick = ()=>{

addToCart(currentProduct);

};



document.getElementById("favoriteBtn").onclick = ()=>{

toggleFavorite(currentProduct);

};



const msg = `مرحباً، أرغب بطلب المنتج:

${currentProduct.name}

السعر: ${formatPrice(currentProduct.price)}

`;

document.getElementById("whatsappBtn").href =

`https://wa.me/9647813555538?text=${encodeURIComponent(msg)}`;

}/*========================
RELATED PRODUCTS
========================*/

async function loadRelated(){

    if(!currentProduct) return;

    const snap = await getDocs(collection(db,"products"));

    const container = document.getElementById("relatedProducts");

    container.innerHTML = "";

    snap.forEach(docSnap=>{

        if(docSnap.id===currentProduct.id) return;

        const p={

            id:docSnap.id,

            ...docSnap.data()

        };

        if(p.category!==currentProduct.category) return;

        container.appendChild(createRelatedCard(p));

    });

}



/*========================
RELATED CARD
========================*/

function createRelatedCard(product){

    const card=document.createElement("div");

    card.className="product-card";

    card.innerHTML=`

    <div class="product-image">

        <img src="${safeImage(product.image)}" alt="${product.name}">

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

                إضافة للسلة

            </button>

            <a
                href="details.html?id=${product.id}"
                class="details-btn">

                التفاصيل

            </a>

        </div>

    </div>

    `;

    card.querySelector(".add-cart").onclick=()=>{

        addToCart(product);

    };

    return card;

}
