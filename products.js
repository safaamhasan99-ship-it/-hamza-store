import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productsBox = document.getElementById("productsList");

async function loadProducts() {

  if (!productsBox) return;

  productsBox.innerHTML = "<h3>جاري تحميل المنتجات...</h3>";

  try {

    const snapshot = await getDocs(collection(db, "products"));

    productsBox.innerHTML = "";

    // قراءة القسم من body أو من الرابط
    const category =
      document.body.dataset.category ||
      new URLSearchParams(window.location.search).get("category");

    let found = false;

    snapshot.forEach((doc) => {

      const product = doc.data();

      // عرض منتجات القسم فقط
      if (!category || product.category === category) {

        found = true;

        const name = product.name || "منتج";
        const price = Number(product.price) || 0;

        const image = product.image
          ? product.image.trim()
          : "./5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png";

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
          <img
            src="${image}"
            alt="${name}"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            crossorigin="anonymous"
            onerror="this.onerror=null;this.src='./5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png';">

          <div class="product-info">

            <h3>${name}</h3>

            <p class="price">
              ${price.toLocaleString()} د.ع
            </p>

            <button class="cart-btn">
              🛒 إضافة للسلة
            </button>

          </div>
        `;

        card.querySelector(".cart-btn").addEventListener("click", () => {

          if (typeof addToCart === "function") {

            addToCart(name, price, image);

          } else {

            alert("تعذر إضافة المنتج إلى السلة.");

          }

        });

        productsBox.appendChild(card);

      }

    });

    if (!found) {

      productsBox.innerHTML = "<h3>لا توجد منتجات في هذا القسم</h3>";

    }

  } catch (error) {

    console.error(error);

    productsBox.innerHTML = "<h3>حدث خطأ أثناء تحميل المنتجات</h3>";

  }

}

loadProducts();
