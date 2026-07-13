import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", saveProduct);

async function saveProduct() {

  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const sizes = document.getElementById("sizes").value.trim();
  const colors = document.getElementById("colors").value.trim();
  const quantity = Number(document.getElementById("quantity").value);
  const description = document.getElementById("description").value.trim();
  const image = document.getElementById("image").value.trim();
  const offer = document.getElementById("offer").checked;

  if (!name || !price) {
    alert("يرجى إدخال اسم المنتج والسعر");
    return;
  }

  try {

    await addDoc(collection(db, "products"), {
      name,
      price,
      category,
      sizes,
      colors,
      quantity,
      description,
      image,
      offer,
      createdAt: serverTimestamp()
    });

    alert("✅ تم حفظ المنتج");

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("sizes").value = "";
    document.getElementById("colors").value = "";
    document.getElementById("quantity").value = "0";
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";
    document.getElementById("offer").checked = false;

    loadProducts();

  } catch (e) {
    console.error(e);
    alert("خطأ: " + e.message);
  }
}

async function loadProducts() {

  const box = document.getElementById("products");

  box.innerHTML = "جاري التحميل...";

  try {

    const snap = await getDocs(collection(db, "products"));

    if (snap.empty) {
      box.innerHTML = "<h3>لا توجد منتجات</h3>";
      return;
    }

    box.innerHTML = "";

    snap.forEach(doc => {

      const p = doc.data();

      box.innerHTML += `
      <div class="card">
        <img src="${p.image || 'images/no-image.png'}">
        <div class="card-body">
          <h3>${p.name}</h3>
          <p>السعر: ${Number(p.price).toLocaleString()} د.ع</p>
          <p>القسم: ${p.category}</p>
        </div>
      </div>
      `;

    });

  } catch (e) {

    console.error(e);

    box.innerHTML = "<h3>حدث خطأ في تحميل المنتجات</h3>";

  }

}

loadProducts();
