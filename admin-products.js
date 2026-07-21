/*==================================
Hamza Store V19 Professional
Admin Products
Cloudflare R2 + Firestore
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

/*=========================
Cloudflare Worker
=========================*/

const UPLOAD_API =
"https://hamza-upload.safaahhh888.workers.dev";

/*=========================
Firestore
=========================*/

const productsRef =
collection(db, "products");

/*=========================
Elements
=========================*/

const form =
document.getElementById("productForm");

const nameInput =
document.getElementById("name");

const priceInput =
document.getElementById("price");

const descriptionInput =
document.getElementById("description");

const categoryInput =
document.getElementById("category");

const sizesInput =
document.getElementById("sizes");

const colorsInput =
document.getElementById("colors");

const quantityInput =
document.getElementById("quantity");

const imageInput =
document.getElementById("image");

const offerInput =
document.getElementById("offer");

const saveBtn =
document.getElementById("saveBtn");

const searchInput =
document.getElementById("search");

const productsContainer =
document.getElementById("productsContainer");

/*=========================
Variables
=========================*/

let editId = null;

let saving = false;

let currentImage = "";

console.log("✅ Admin Products V19 Started");

/*=========================
رفع الصورة إلى Cloudflare
=========================*/

async function uploadImage(file) {

  if (!file) return currentImage;

  const formData = new FormData();
  formData.append("file", file);

  try {

    const response = await fetch(UPLOAD_API, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("فشل الاتصال بخادم رفع الصور");
    }

    const result = await response.json();

    if (!result.success || !result.url) {
      throw new Error(result.message || "فشل رفع الصورة");
    }

    return result.url;

  } catch (err) {

    console.error(err);

    alert("❌ " + err.message);

    return "";

  }

}

/*=========================
تنظيف الرابط
=========================*/

function cleanImageUrl(url) {

  if (!url) return "";

  url = url.trim();

  if (url.startsWith("//")) {
    url = "https:" + url;
  }

  return url;

}

/*=========================
تفريغ النموذج
=========================*/

function clearForm() {

  form.reset();

  editId = null;

  currentImage = "";

  if (imageInput) {
    imageInput.value = "";
  }

  saveBtn.textContent = "💾 حفظ المنتج";

}

/*=========================
التمرير للأعلى
=========================*/

function scrollTopPage() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}

/*=========================
حفظ المنتج (إضافة / تعديل)
=========================*/

async function saveProduct() {

  if (saving) return;

  saving = true;

  saveBtn.disabled = true;
  saveBtn.textContent = "⏳ جاري الحفظ...";

  try {

    let imageUrl = currentImage;

    if (imageInput.files && imageInput.files.length > 0) {

      imageUrl = await uploadImage(imageInput.files[0]);

      if (!imageUrl) {
        throw new Error("تعذر رفع الصورة");
      }

    }

    const product = {

      name: nameInput.value.trim(),

      price: Number(priceInput.value),

      description: descriptionInput.value.trim(),

      category: categoryInput.value,

      sizes: sizesInput.value.trim(),

      colors: colorsInput.value.trim(),

      quantity: Number(quantityInput.value),

      image: cleanImageUrl(imageUrl),

      offer: offerInput.checked,

      updatedAt: serverTimestamp()

    };

    if (
      !product.name ||
      !product.price ||
      !product.category ||
      !product.image
    ) {
      throw new Error("يرجى إدخال جميع البيانات المطلوبة");
    }

    if (editId) {

      await updateDoc(
        doc(db, "products", editId),
        product
      );

      alert("✅ تم تعديل المنتج");

    } else {

      product.createdAt = serverTimestamp();

      await addDoc(productsRef, product);

      alert("✅ تم إضافة المنتج");

    }

    clearForm();

    await loadProducts();

  } catch (err) {

    console.error(err);

    alert("❌ " + err.message);

  } finally {

    saving = false;

    saveBtn.disabled = false;

    saveBtn.textContent = "💾 حفظ المنتج";

  }

}

/*=========================
إرسال النموذج
=========================*/

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  await saveProduct();

});

/*=========================
تحميل المنتجات
=========================*/

async function loadProducts() {

  productsContainer.innerHTML =
    "<p class='empty'>جاري تحميل المنتجات...</p>";

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

      card.dataset.id = docSnap.id;

      card.innerHTML = `

        <img src="${p.image}" alt="${p.name}">

        <h3>${p.name}</h3>

        <p><b>السعر:</b> ${p.price} د.ع</p>

        <p><b>القسم:</b> ${p.category}</p>

        <p><b>الكمية:</b> ${p.quantity}</p>

        <div class="admin-actions">

          <button class="edit-btn">
            ✏️ تعديل
          </button>

          <button class="delete-btn">
            🗑 حذف
          </button>

        </div>

      `;

      /*=========================
      تعديل
      =========================*/

      card.querySelector(".edit-btn").onclick = () => {

        editId = docSnap.id;

        currentImage = p.image || "";

        nameInput.value = p.name || "";

        priceInput.value = p.price || "";

        descriptionInput.value = p.description || "";

        categoryInput.value = p.category || "";

        sizesInput.value = p.sizes || "";

        colorsInput.value = p.colors || "";

        quantityInput.value = p.quantity || "";

        offerInput.checked = p.offer || false;

        saveBtn.textContent = "💾 حفظ التعديل";

        scrollTopPage();

      };

      /*=========================
      حذف
      =========================*/

      card.querySelector(".delete-btn").onclick = async () => {

        if (!confirm(`هل تريد حذف "${p.name}" ؟`))
          return;

        try {

          await deleteDoc(
            doc(db, "products", docSnap.id)
          );

          alert("🗑 تم حذف المنتج");

          await loadProducts();

        } catch (err) {

          console.error(err);

          alert("❌ فشل حذف المنتج");

        }

      };

      productsContainer.appendChild(card);

    });

  } catch (err) {

    console.error(err);

    productsContainer.innerHTML =
      "<p class='empty'>حدث خطأ أثناء تحميل المنتجات</p>";

  }

}

/*=========================
البحث الفوري
=========================*/

if (searchInput) {

  searchInput.addEventListener("input", () => {

    const keyword = searchInput.value
      .trim()
      .toLowerCase();

    document
      .querySelectorAll(".admin-product-card")
      .forEach(card => {

        const text = card.textContent.toLowerCase();

        card.style.display =
          text.includes(keyword)
            ? ""
            : "none";

      });

  });

}

/*=========================
تحديث المنتجات يدوياً
=========================*/

window.loadProducts = loadProducts;

/*=========================
تحميل أول مرة
=========================*/

document.addEventListener("DOMContentLoaded", async () => {

  await loadProducts();

});

/*=========================
منع الضغط المتكرر
=========================*/

saveBtn.addEventListener("dblclick", (e) => {

  e.preventDefault();

});

/*=========================
اختصار Ctrl + S
=========================*/

document.addEventListener("keydown", (e) => {

  if (
    e.ctrlKey &&
    e.key.toLowerCase() === "s"
  ) {

    e.preventDefault();

    form.requestSubmit();

  }

});

console.log("✅ Search & Startup Ready");

/*=========================
معالجة أخطاء الصور
=========================*/

document.addEventListener("error", (e) => {

  if (e.target.tagName === "IMG") {

    e.target.src = "./images/no-image.png";

  }

}, true);

/*=========================
تحميل كسول للصور
=========================*/

function optimizeImages() {

  document
    .querySelectorAll(".admin-product-card img")
    .forEach(img => {

      img.loading = "lazy";
      img.decoding = "async";

    });

}

/*=========================
مراقبة تحديث المنتجات
=========================*/

const observer = new MutationObserver(() => {

  optimizeImages();

});

observer.observe(productsContainer, {
  childList: true,
  subtree: true
});

/*=========================
رسائل التشغيل
=========================*/

console.log("🖼️ Image Optimization Ready");

console.log("🔥 Firebase Connected");

console.log("🚀 Admin Products Ready");

/*=========================
إلغاء وضع التعديل
=========================*/

function cancelEdit() {

  editId = null;

  currentImage = "";

  form.reset();

  if (imageInput) {
    imageInput.value = "";
  }

  saveBtn.textContent = "💾 حفظ المنتج";

}

/*=========================
تنظيف النموذج بعد الحفظ
=========================*/

function resetAfterSave() {

  cancelEdit();

  nameInput.focus();

}

/*=========================
زر ESC لإلغاء التعديل
=========================*/

document.addEventListener("keydown", (e) => {

  if (e.key === "Escape" && editId) {

    if (confirm("إلغاء تعديل المنتج؟")) {

      cancelEdit();

    }

  }

});

/*=========================
معالجة الصور المفقودة
=========================*/

productsContainer.addEventListener("error", (e) => {

  if (e.target.tagName === "IMG") {

    e.target.src = "./images/no-image.png";

  }

}, true);

/*=========================
تحديث حالة الزر
=========================*/

function updateSaveButton(edit = false) {

  saveBtn.textContent = edit
    ? "💾 حفظ التعديل"
    : "💾 حفظ المنتج";

}

console.log("✅ Edit Mode Ready");

/*==================================
Hamza Store V19
Final Initialization
==================================*/

/*=========================
إعادة تحميل المنتجات بعد الحفظ
=========================*/

const oldSaveProduct = saveProduct;

saveProduct = async function () {

  await oldSaveProduct();

  resetAfterSave();

  await loadProducts();

};

/*=========================
التركيز على أول حقل
=========================*/

window.addEventListener("load", () => {

  nameInput.focus();

});

/*=========================
فحص العناصر الأساسية
=========================*/

const requiredElements = [
  form,
  nameInput,
  priceInput,
  categoryInput,
  saveBtn,
  productsContainer
];

requiredElements.forEach((el) => {

  if (!el) {
    console.error("❌ عنصر مفقود في الصفحة");
  }

});

/*=========================
تشغيل أول مرة
=========================*/

(async () => {

  try {

    await loadProducts();

    console.log("✅ تم تحميل المنتجات");

  } catch (err) {

    console.error(err);

    alert("❌ تعذر تحميل المنتجات");

  }

})();

/*=========================
الإصدار
=========================*/

console.log("🏪 Hamza Store V19");
console.log("☁️ Cloudflare R2 Ready");
console.log("🔥 Firestore Ready");
console.log("✅ Admin Products Loaded Successfully");
