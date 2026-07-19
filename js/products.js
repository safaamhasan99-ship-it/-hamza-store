/*==================================
Hamza Store V13
Products JS
==================================*/

import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
addToCart,
toggleFavorite,
isFavorite,
formatPrice,
safeImage,
updateCartCount
} from "./utils.js";

/*========================
ELEMENTS
========================*/

const productsContainer =
document.getElementById("productsContainer") ||
document.getElementById("latestProducts");

const bestProductsContainer =
document.getElementById("bestProducts");

const searchInput =
document.getElementById("searchInput");

const categoryFilter =
document.getElementById("categoryFilter");

const sortProducts =
document.getElementById("sortProducts");

let products = [];

/*========================
START
========================*/

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    loadProducts();

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterProducts);
    }

    if (sortProducts) {
        sortProducts.addEventListener("change", filterProducts);
    }

});

/*========================
LOAD PRODUCTS
========================*/

async function loadProducts() {

    try {

        const snap = await getDocs(collection(db, "products"));

        products = [];

        snap.forEach(doc => {

            products.push({
                id: doc.id,
                ...doc.data()
            });

        });

        filterProducts();

        renderBestProducts();

    } catch (error) {

        console.error(error);

        if (productsContainer) {

            productsContainer.innerHTML = `
            <div class="empty-products">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h3>تعذر تحميل المنتجات</h3>
                <p>تحقق من إعدادات Firebase.</p>
            </div>
            `;

        }

    } finally {

        const loader = document.getElementById("loader");

        if (loader) {
            loader.classList.add("hidden");
        }

    }

}

/*========================
CREATE PRODUCT CARD
========================*/

function createCard(product){

    const card = document.createElement("div");

    card.className = "product-card";

    const fav = isFavorite(product.id);

    card.innerHTML = `

    <div class="product-image">

        <img

src="${product.image}"
alt="${product.name || ''}"
loading="eager"
decoding="async"
referrerpolicy="no-referrer"
crossorigin="anonymous"
onerror="this.src='./IMG_5661.jpeg'">

        ${product.offer ? '<span class="product-badge">عرض</span>' : ''}

        <button class="favorite-btn">
            <i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i>
        </button>

    </div>

    <div class="product-info">

    <h3 class="product-title">
        ${product.name || 'بدون اسم'}
    </h3>

    <div class="product-price">
        ${formatPrice(product.price || 0)}
    </div>

    <div class="product-actions">

        <button class="add-cart">
            <i class="fa-solid fa-cart-shopping"></i>
            إضافة للسلة
        </button>

        <a href="details.html?id=${product.id}" class="details-btn">
            عرض التفاصيل
        </a>

    </div>

</div>



    </div>

    `;

    card.querySelector(".add-cart").onclick = () => {
        addToCart(product);
    };

    card.querySelector(".favorite-btn").onclick = (e) => {

        e.preventDefault();

        const active = toggleFavorite(product);

        e.currentTarget.innerHTML =
        `<i class="fa-${active ? 'solid' : 'regular'} fa-heart"></i>`;

    };

    return card;

}

/*========================
RENDER PRODUCTS
========================*/

function renderProducts(list){

    if(!productsContainer) return;

    productsContainer.innerHTML = "";

    if(!list.length){

        productsContainer.innerHTML = `
        <div class="empty-products">
            <i class="fa-solid fa-box-open"></i>
            <h3>لا توجد منتجات</h3>
            <p>لم يتم العثور على أي منتج.</p>
        </div>
        `;

        return;

    }

    list.forEach(product => {

        productsContainer.appendChild(
            createCard(product)
        );

    });

}

/*========================
FILTER PRODUCTS
========================*/

function filterProducts(){

    let list = [...products];

    // فلترة حسب القسم الموجود في الصفحة
    const pageCategory = document.body.dataset.category;

    if(pageCategory){

        list = list.filter(product =>

            (product.category || "").trim() === pageCategory.trim()

        );

    }

    // البحث
    if(searchInput){

        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        if(keyword){

            list = list.filter(product =>

                (product.name || "")
                .toLowerCase()
                .includes(keyword)

            );

        }

    }

    // فلترة من القائمة المنسدلة
    if(categoryFilter && categoryFilter.value){

        list = list.filter(product =>

            (product.category || "").trim() === categoryFilter.value.trim()

        );

    }

    // الترتيب
    if(sortProducts){

        switch(sortProducts.value){

            case "priceAsc":

                list.sort((a,b)=>

                    Number(a.price||0)-Number(b.price||0)

                );

                break;

            case "priceDesc":

                list.sort((a,b)=>

                    Number(b.price||0)-Number(a.price||0)

                );

                break;

            case "name":

                list.sort((a,b)=>

                    (a.name||"").localeCompare(
                        b.name||"",
                        "ar"
                    )

                );

                break;

            default:

                list.reverse();

        }

    }

    renderProducts(list);

}

/*========================
BEST PRODUCTS
========================*/

function renderBestProducts(){

    if(!bestProductsContainer) return;

    bestProductsContainer.innerHTML = "";

    const best = [...products].slice(0,8);

    best.forEach(product=>{

        bestProductsContainer.appendChild(

            createCard(product)

        );

    });

}

/*========================
REFRESH CART COUNT
========================*/

window.addEventListener("storage",()=>{

    updateCartCount();

});

/*========================
PRELOAD PRODUCT IMAGES
========================*/

function preloadImages(){

    products.forEach(product=>{

        if(product.image){

            const img = new Image();

            img.src = safeImage(product.image);

        }

    });

}

window.addEventListener("load", preloadImages);

/*========================
EXPORTS
========================*/

export {

    loadProducts,
    filterProducts,
    renderProducts,
    renderBestProducts

};
