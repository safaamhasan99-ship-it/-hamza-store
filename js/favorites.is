/*==================================
Hamza Store V11
Favorites JS
==================================*/

import {
    getFavorites,
    saveFavorites,
    addToCart,
    updateCartCount,
    formatPrice,
    safeImage
} from "./utils.js";

const container = document.getElementById("favoritesContainer");

let favorites = [];

/*========================
INIT
========================*/

document.addEventListener("DOMContentLoaded", () => {

    try {

        favorites = getFavorites() || [];

        updateCartCount();

        renderFavorites();

    } catch (error) {

        console.error("Favorites Error:", error);

        if (container) {
            container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h2>حدث خطأ أثناء تحميل المفضلة</h2>
                <p>حاول تحديث الصفحة.</p>
            </div>`;
        }

    } finally {

        hideLoader();

    }

});

/*========================
RENDER FAVORITES
========================*/

function renderFavorites() {

    if (!container) {
        hideLoader();
        return;
    }

    if (!favorites || favorites.length === 0) {

        const template = document.getElementById("emptyFavoritesTemplate");

        if (template) {
            container.innerHTML = template.innerHTML;
        } else {
            container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-heart-crack"></i>
                <h2>لا توجد منتجات في المفضلة</h2>
            </div>`;
        }

        hideLoader();
        return;
    }

    container.innerHTML = "";

    favorites.forEach(product => {

        container.appendChild(createCard(product));

    });

    hideLoader();

}

/*========================
CREATE CARD
========================*/

function createCard(product) {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

    <div class="product-image">
        <img
            src="${safeImage(product.image)}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.src='./IMG_5661.jpeg'">
    </div>

    <div class="product-info">

        <h3 class="product-title">
            ${product.name || ""}
        </h3>

        <div class="product-price">
            ${formatPrice(product.price)}
        </div>

        <div class="product-actions">

            <button class="add-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                إضافة للسلة
            </button>

            <a href="details.html?id=${product.id}"
               class="details-btn">
                التفاصيل
            </a>

        </div>

        <button class="remove-favorite">
            <i class="fa-solid fa-trash"></i>
            إزالة من المفضلة
        </button>

    </div>

    `;

    card.querySelector(".add-cart").addEventListener("click", () => {

        addToCart(product);

        updateCartCount();

    });

    card.querySelector(".remove-favorite").addEventListener("click", () => {

        removeFavorite(product.id);

    });

    return card;

}

/*========================
REMOVE FAVORITE
========================*/

function removeFavorite(id) {

    favorites = favorites.filter(item => item.id !== id);

    saveFavorites(favorites);

    renderFavorites();

}

/*========================
HIDE LOADER
========================*/

function hideLoader() {

    const loader = document.getElementById("loader");

    if (!loader) return;

    loader.style.opacity = "0";

    loader.style.pointerEvents = "none";

    setTimeout(() => {

        loader.style.display = "none";

    }, 250);

}
