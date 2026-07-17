/*==================================
Hamza Store V8
Products JS
==================================*/

import { db } from "../firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  addToCart,
  toggleFavorite,
  formatPrice,
  safeImage
} from "./utils.js";

const latestContainer = document.getElementById("latestProducts");
const bestContainer = document.getElementById("bestProducts");

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

/*========================
LOAD PRODUCTS
========================*/

async function loadProducts() {

  try {

    const snap = await getDocs(collection(db, "products"));

    const products = [];

    snap.forEach(doc => {

      products.push({
        id: doc.id,
        ...doc.data()
      });

    });

    renderLatest(products);

    renderBest(products);

  } catch (err) {

    console.error("Products Error:", err);

  }

}

/*========================
PRODUCT CARD
========================*/

function createCard(product) {

  const card = document.createElement("div");

  card.className = "product-card";

  card.innerHTML = `

<div class="product-image">

<img src="${safeImage(product.image)}"
alt="${product.name}"
loading="lazy">

${product.offer ? '<span class="product-badge">عرض</span>' : ''}

<button class="favorite-btn">

<i class="fa-regular fa-heart"></i>

</button>

</div>

<div class="product-info">

<h3 class="product-title">

${product.name || ""}

</h3>

<div class="product-price">

${formatPrice(product.price || 0)}

</div>

<div class="product-actions">

<button class="add-cart">

أضف للسلة

</button>

<a
href="details.html?id=${product.id}"
class="details-btn">

التفاصيل

</a>

</div>

</div>

`;

  card.querySelector(".add-cart").onclick = () => {

    addToCart(product);

  };

  card.querySelector(".favorite-btn").onclick = () => {

    toggleFavorite(product);

  };

  return card;

}

/*========================
LATEST
========================*/

function renderLatest(products) {

  if (!latestContainer) return;

  latestContainer.innerHTML = "";

  products.slice(0, 8).forEach(product => {

    latestContainer.appendChild(createCard(product));

  });

}

/*========================
BEST
========================*/

function renderBest(products) {

  if (!bestContainer) return;

  bestContainer.innerHTML = "";

  products.slice(0, 8).forEach(product => {

    bestContainer.appendChild(createCard(product));

  });

}
