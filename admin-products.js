import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productImage = document.getElementById("productImage");
const productCategory = document.getElementById("productCategory");
const productsList = document.getElementById("productsList");

window.addProduct = async function () {

    const name = productName.value.trim();
    const price = Number(productPrice.value);
    const image = productImage.value.trim();
    const category = productCategory.value;

    if (!name || !price || !image) {
        alert("يرجى ملء جميع الحقول");
        return;
    }

    try {

        await addDoc(collection(db, "products"), {

            name: name,
            price: price,
            image: image,
            category: category,
            createdAt: serverTimestamp()

        });

        alert("تمت إضافة المنتج بنجاح ✅");

        productName.value = "";
        productPrice.value = "";
        productImage.value = "";

        loadProducts();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء الإضافة");

    }

};async function loadProducts() {

    if (!productsList) return;

    productsList.innerHTML = "";

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        if (snapshot.empty) {

            productsList.innerHTML = `
            <div class="empty-box">
                لا توجد منتجات حالياً
            </div>
            `;

            return;
        }

        snapshot.forEach((item) => {

            const product = item.data();

            productsList.innerHTML += `

            <div class="product-card">

                <img src="${product.image}" alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p class="price">
                        ${Number(product.price).toLocaleString()} د.ع
                    </p>

                    <p>
                        القسم:
                        ${product.category}
                    </p>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct('${item.id}')">

                        🗑 حذف

                    </button>

                </div>

            </div>

            `;

        });

    } catch (error) {

        console.error(error);

        productsList.innerHTML = `
        <div class="empty-box">
            حدث خطأ أثناء تحميل المنتجات
        </div>
        `;

    }

}// حذف منتج
window.deleteProduct = async function (id) {

    const ok = confirm("هل تريد حذف هذا المنتج؟");

    if (!ok) return;

    try {

        await deleteDoc(
            doc(db, "products", id)
        );

        alert("تم حذف المنتج بنجاح ✅");

        loadProducts();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء حذف المنتج");

    }

};


// إعادة تحميل المنتجات
window.refreshProducts = function () {

    loadProducts();

};


// تحميل المنتجات عند فتح الصفحة
loadProducts();
