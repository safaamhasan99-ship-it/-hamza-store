/*==================================
Hamza Store V17
Admin Products
==================================*/

import { db } from "./js/firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productsRef = collection(db, "products");

const form = document.getElementById("productForm");
const productsContainer = document.getElementById("productsContainer");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const categoryInput = document.getElementById("category");
const colorsInput = document.getElementById("colors");
const sizesInput = document.getElementById("sizes");
const quantityInput = document.getElementById("quantity");
const descriptionInput = document.getElementById("description");
const offerInput = document.getElementById("offer");

let editId = null;

function cleanImageUrl(url) {

    if (!url) return "";

    url = url.trim();

    if (url.includes('src="')) {
        const match = url.match(/src="([^"]+)"/);
        if (match) url = match[1];
    }

    if (url.startsWith("//")) {
        url = "https:" + url;
    }

    return url;
}

async function saveProduct() {

    const product = {
        name: nameInput.value.trim(),
        price: Number(priceInput.value),
        image: cleanImageUrl(imageInput.value),
        category: categoryInput.value,
        colors: colorsInput.value.trim(),
        sizes: sizesInput.value.trim(),
        quantity: Number(quantityInput.value),
        description: descriptionInput.value.trim(),
        offer: offerInput.checked,
        updatedAt: serverTimestamp()
    };

    if (
        !product.name ||
        !product.price ||
        !product.image ||
        !product.category
    ) {
        alert("يرجى ملء جميع الحقول المطلوبة");
        return;
    }

    try {

        if (editId) {

            await updateDoc(doc(db, "products", editId), product);

            alert("✅ تم تعديل المنتج");

            editId = null;

        } else {

            product.createdAt = serverTimestamp();

            await addDoc(productsRef, product);

            alert("✅ تم إضافة المنتج");

        }

        form.reset();

        loadProducts();

    } catch (err) {

        console.error(err);

        alert("حدث خطأ أثناء الحفظ");

    }
}

form.addEventListener("submit", (e) => {

    e.preventDefault();

    saveProduct();

});

async function loadProducts() {

    productsContainer.innerHTML = "<p>جاري تحميل المنتجات...</p>";

    try {

        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) {
            productsContainer.innerHTML =
                "<p class='empty'>لا توجد منتجات</p>";
            return;
        }

        productsContainer.innerHTML = "";

        snapshot.forEach((docSnap) => {

            const p = docSnap.data();

            const card = document.createElement("div");
            card.className = "admin-product-card";

            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>السعر: ${p.price} د.ع</p>
                <p>القسم: ${p.category}</p>
                <p>الكمية: ${p.quantity}</p>

                <div class="admin-actions">
                    <button class="edit-btn">✏️ تعديل</button>
                    <button class="delete-btn">🗑 حذف</button>
                </div>
            `;

            // تعديل
            card.querySelector(".edit-btn").onclick = () => {

                editId = docSnap.id;

                nameInput.value = p.name || "";
                priceInput.value = p.price || "";
                imageInput.value = p.image || "";
                categoryInput.value = p.category || "";
                colorsInput.value = p.colors || "";
                sizesInput.value = p.sizes || "";
                quantityInput.value = p.quantity || "";
                descriptionInput.value = p.description || "";
                offerInput.checked = p.offer || false;

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            };

            // حذف
            card.querySelector(".delete-btn").onclick = async () => {

                if (!confirm(`هل تريد حذف "${p.name}" ؟`)) return;

                try {

                    await deleteDoc(doc(db, "products", docSnap.id));

                    loadProducts();

                } catch (err) {

                    console.error(err);

                    alert("فشل حذف المنتج");

                }

            };

            productsContainer.appendChild(card);

        });

    } catch (err) {

        console.error(err);

        productsContainer.innerHTML =
            "<p>حدث خطأ أثناء تحميل المنتجات.</p>";

    }

}

loadProducts();

/*==================================
Hamza Store V17
Extra Features
==================================*/

// إعادة تحميل تلقائية كل 30 ثانية
setInterval(() => {
    loadProducts();
}, 30000);

// منع الضغط المتكرر على زر الحفظ
let saving = false;

async function saveProductSafe() {

    if (saving) return;

    saving = true;

    try {
        await saveProduct();
    } finally {
        saving = false;
    }

}

// استبدال حدث الحفظ
form.removeEventListener("submit", saveProduct);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveProductSafe();
});

// بحث فوري
const searchInput = document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".admin-product-card").forEach(card => {

            const text = card.textContent.toLowerCase();

            card.style.display =
                text.includes(value) ? "" : "none";

        });

    });

}

// تحسين تحميل الصور
document.addEventListener("error", (e) => {

    if (e.target.tagName === "IMG") {

        e.target.src = "./images/no-image.png";

    }

}, true);

console.log("Hamza Store Admin V17 Ready");
