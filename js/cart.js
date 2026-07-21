/*==================================
Hamza Store V13
Professional Cart JS
==================================*/

import {
  getCart,
  saveCart,
  removeFromCart,
  formatPrice,
  showToast,
  updateCartCount
} from "./utils.js";

import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*========================
FIREBASE
========================*/

const ordersRef = collection(db, "orders");

/*========================
ELEMENTS
========================*/

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const itemsCount = document.getElementById("itemsCount");
const checkoutBtn = document.getElementById("checkoutBtn");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerAddress = document.getElementById("customerAddress");

const customerCity = document.getElementById("customerCity");
const customerNotes = document.getElementById("customerNotes");

const loader = document.getElementById("loader");

/*========================
START
========================*/

document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

  renderCart();

  if (loader) {
    loader.style.display = "none";
  }

});

/*========================
RENDER CART
========================*/

function renderCart() {

  const cart = getCart();

  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  if (cart.length === 0) {

    const template = document.getElementById("emptyCartTemplate");

    if (template) {
      cartItems.appendChild(template.content.cloneNode(true));
    } else {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <h3>🛒 السلة فارغة</h3>
          <p>لم تقم بإضافة أي منتج بعد.</p>
        </div>
      `;
    }

    if (totalPrice) {
      totalPrice.textContent = formatPrice(0);
    }

    if (itemsCount) {
      itemsCount.textContent = "0";
    }

    return;
  }

  cart.forEach(item => {

    const qty = Number(item.qty) || 1;
    const price = Number(item.price) || 0;
    const subtotal = qty * price;

    total += subtotal;
    count += qty;

    cartItems.innerHTML += `

    <div class="cart-card">

      <div class="cart-image">

        <img
          src="${item.image}"
          alt="${item.name}"
          loading="lazy"
          onerror="this.src='images/no-image.png'">

      </div>

      <div class="cart-details">

        <h3>${item.name}</h3>

        ${item.size ? `<p>📏 ${item.size}</p>` : ""}

        ${item.color ? `<p>🎨 ${item.color}</p>` : ""}

        <div class="cart-price">
          ${formatPrice(price)}
        </div>

        <div class="cart-subtotal">
          المجموع: ${formatPrice(subtotal)}
        </div>

        <div class="cart-qty">

          <button
            class="qty-btn"
            onclick="changeQty('${item.id}',-1)">

            <i class="fa-solid fa-minus"></i>

          </button>

          <span>${qty}</span>

          <button
            class="qty-btn"
            onclick="changeQty('${item.id}',1)">

            <i class="fa-solid fa-plus"></i>

          </button>

        </div>

      </div>

      <button
        class="delete-btn"
        onclick="deleteItem('${item.id}')">

        <i class="fa-solid fa-trash"></i>

      </button>

    </div>

    `;

  });

  if (itemsCount) {
    itemsCount.textContent = count;
  }

  if (totalPrice) {
    totalPrice.textContent = formatPrice(total);
  }

}

/*========================
GLOBAL FUNCTIONS
========================*/

window.changeQty = function(id, value) {

  let cart = getCart();

  const item = cart.find(x => x.id === id);

  if (!item) return;

  item.qty = (Number(item.qty) || 1) + value;

  if (item.qty <= 0) {

    cart = cart.filter(x => x.id !== id);

  }

  saveCart(cart);

  updateCartCount();

  renderCart();

};

window.deleteItem = function(id) {

  if (!confirm("هل تريد حذف هذا المنتج من السلة؟")) return;

  removeFromCart(id);

  updateCartCount();

  renderCart();

  showToast("تم حذف المنتج من السلة");

};

/*========================
حساب إجمالي الطلب
========================*/

function getCartTotal() {

  const cart = getCart();

  let total = 0;

  cart.forEach(item => {

    const qty = Number(item.qty) || 1;

    const price = Number(item.price) || 0;

    total += qty * price;

  });

  return total;

}

/*========================
CHECKOUT
========================*/

if (checkoutBtn) {

  checkoutBtn.onclick = async () => {

    const name = customerName.value.trim();
    const phone = customerPhone.value.trim();
    const address = customerAddress.value.trim();
    const city = customerCity ? customerCity.value.trim() : "";
    const notes = customerNotes ? customerNotes.value.trim() : "";

    if (!name) {
      showToast("يرجى إدخال اسم الزبون");
      customerName.focus();
      return;
    }

    if (!phone) {
      showToast("يرجى إدخال رقم الهاتف");
      customerPhone.focus();
      return;
    }

    if (!address) {
      showToast("يرجى إدخال العنوان");
      customerAddress.focus();
      return;
    }

    const cart = getCart();

    if (cart.length === 0) {
      showToast("السلة فارغة");
      return;
    }

    const total = getCartTotal();

    let message = `🛍️ طلب جديد من مجمع حمزه الشطري

━━━━━━━━━━━━━━

👤 الاسم:
${name}

📞 الهاتف:
${phone}

🏙️ المحافظة:
${city || "-"}

📍 العنوان:
${address}

📝 الملاحظات:
${notes || "-"}

━━━━━━━━━━━━━━

`;

    cart.forEach(item => {

      const qty = Number(item.qty) || 1;
      const price = Number(item.price) || 0;

      message += `📦 ${item.name}
📏 ${item.size || "-"}
🎨 ${item.color || "-"}
🔢 الكمية: ${qty}
💰 السعر: ${formatPrice(price * qty)}

`;

    });

    message += `━━━━━━━━━━━━━━

💰 الإجمالي:
${formatPrice(total)}

شكراً لتسوقكم من
مجمع حمزه الشطري ❤️`;

    try {

      await addDoc(ordersRef, {
        name,
        phone,
        address,
        city,
        notes,
        items: cart,
        total,
        status: "جديد",
        createdAt: new Date().toLocaleString("ar-IQ"),
        createdServer: serverTimestamp()
      });

      saveCart([]);
      updateCartCount();
      renderCart();

      customerName.value = "";
      customerPhone.value = "";
      customerAddress.value = "";

      if (customerCity) customerCity.value = "";
      if (customerNotes) customerNotes.value = "";

      showToast("✅ تم إرسال الطلب بنجاح");

      window.open(
        "https://wa.me/9647813555538?text=" +
        encodeURIComponent(message),
        "_blank"
      );

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);

    } catch (error) {

      console.error(error);

      showToast("حدث خطأ أثناء إرسال الطلب");

    }

  };

}

/*==================================
END OF FILE
==================================*/
