/*==================================
Hamza Store V18 Professional
Admin Products + Cloudflare R2
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

const productsRef = collection(db, "products");

/*=========================
Elements
=========================*/

const saveBtn =
document.getElementById("saveBtn");

const productsList =
document.getElementById("productsList");

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

/*=========================
Variables
=========================*/

let editId = null;

let saving = false;

/*=========================
رفع الصورة إلى Cloudflare
=========================*/

async function uploadImage(file) {

  if (!file) return "";

  const formData = new FormData();
  formData.append("file", file);

  try {

    const response = await fetch(UPLOAD_API, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upload Failed");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Upload Error");
    }

    return result.url;

  } catch (err) {

    console.error(err);

    alert("❌ فشل رفع الصورة");

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
حفظ المنتج
=========================*/

async function saveProduct() {

  if (saving) return;

  saving = true;

  saveBtn.disabled = true;
  saveBtn.textContent = "⏳ جاري الحفظ...";

  try {

    let imageUrl = "";

    if (imageInput.files.length > 0) {

      imageUrl = await uploadImage(imageInput.files[0]);

      if (!imageUrl) {
        throw new Error("Image Upload Failed");
      }

    }

    const product = {

      name: nameInput.value.trim(),

      price: Number(priceInput.value),

      image: cleanImageUrl(imageUrl),

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

      alert("يرجى إدخال جميع البيانات المطلوبة");

      return;

    }

    if (editId) {

      await updateDoc(
        doc(db, "products", editId),
        product
      );

      alert("✅ تم تعديل المنتج");

      editId = null;

    } else {

      product.createdAt = serverTimestamp();

      await addDoc(productsRef, product);

      alert("✅ تم حفظ المنتج");

    }

    document.getElementById("productForm").reset();

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
تحميل المنتجات
=========================*/

async function loadProducts() {

  productsList.innerHTML =
  "<p class='empty'>جاري تحميل المنتجات...</p>";

  try {

    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {

      productsList.innerHTML =
      "<p class='empty'>لا توجد منتجات</p>";

      return;

    }

    productsList.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const p = docSnap.data();

      const card = document.createElement("div");

      card.className = "admin-product-card";

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

      /*==================
      تعديل
      ==================*/

      card.querySelector(".edit-btn").onclick = () => {

        editId = docSnap.id;

        nameInput.value = p.name || "";

        priceInput.value = p.price || "";

        descriptionInput.value =
        p.description || "";

        categoryInput.value =
        p.category || "";

        sizesInput.value =
        p.sizes || "";

        colorsInput.value =
        p.colors || "";

        quantityInput.value =
        p.quantity || "";

        offerInput.checked =
        p.offer || false;

        window.scrollTo({

          top:0,

          behavior:"smooth"

        });

      };

                           /*==================
      حذف المنتج
      ==================*/

      card.querySelector(".delete-btn").onclick = async () => {

        if (!confirm(`هل تريد حذف "${p.name}" ؟`)) return;

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

      productsList.appendChild(card);

    });

  } catch (err) {

    console.error(err);

    productsList.innerHTML = `
      <p class="empty">
      حدث خطأ أثناء تحميل المنتجات
      </p>
    `;

  }

}

/*=========================
حفظ المنتج
=========================*/

saveBtn.addEventListener("click", async () => {

  await saveProduct();

});

/*=========================
بحث فوري
=========================*/

const searchInput =
document.getElementById("search");

if (searchInput) {

  searchInput.addEventListener("input", () => {

    const value =
    searchInput.value.toLowerCase();

    document
    .querySelectorAll(".admin-product-card")
    .forEach(card => {

      const text =
      card.textContent.toLowerCase();

      card.style.display =
      text.includes(value)
      ? ""
      : "none";

    });

  });

}

/*=========================
تحديث يدوي
=========================*/

window.refreshProducts = async () => {

  await loadProducts();

};

/*=========================
تحميل أول مرة
=========================*/

await loadProducts();

/*=========================
معالجة أخطاء الصور
=========================*/

document.addEventListener("error", (e) => {

  if (e.target.tagName === "IMG") {

    e.target.src = "./images/no-image.png";

  }

}, true);

/*=========================
اختصارات لوحة المفاتيح
=========================*/

document.addEventListener("keydown", (e) => {

  if (
    e.ctrlKey &&
    e.key.toLowerCase() === "s"
  ) {

    e.preventDefault();

    saveProduct();

  }

});

/*=========================
منع النقر المزدوج
=========================*/

saveBtn.addEventListener("dblclick", (e) => {

  e.preventDefault();

});

/*=========================
رسالة التشغيل
=========================*/

console.log(
  "✅ Hamza Store Admin V18 Ready"
);

/*=========================
تهيئة الحقول بعد الحفظ
=========================*/

function clearForm() {

  editId = null;

  document.getElementById("productForm").reset();

  imageInput.value = "";

}

/*=========================
إعادة تهيئة بعد النجاح
=========================*/

const originalSaveProduct = saveProduct;

saveProduct = async function () {

  await originalSaveProduct();

  clearForm();

};

/*=========================
التأكد من اتصال Firebase
=========================*/

try {

  console.log("🔥 Firebase Connected");

} catch (err) {

  console.error("Firebase Error:", err);

}

/*=========================
انتهاء تحميل لوحة الإدارة
=========================*/

console.log("🚀 Admin Products Ready");
