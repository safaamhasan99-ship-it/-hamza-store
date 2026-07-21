/*==================================
Hamza Store V18
Professional Cart
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
ORDER SETTINGS
========================*/

let sendingOrder = false;

function generateOrderNumber() {

  return "HS-" + Date.now().toString().slice(-8);

}

function prepareItems(cart) {

  return cart.map(item => ({

    id: item.id || "",

    name: item.name || "",

    image: item.image || "",

    price: Number(item.price) || 0,

    quantity: Number(item.qty) || 1,

    size: item.size || "",

    color: item.color || ""

  }));

}

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

            cartItems.appendChild(
                template.content.cloneNode(true)
            );

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
                −
            </button>

            <span>${qty}</span>

            <button
                class="qty-btn"
                onclick="changeQty('${item.id}',1)">
                +
            </button>

        </div>

    </div>

    <button
        class="delete-btn"
        onclick="deleteItem('${item.id}')">

        🗑️

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

window.changeQty = function (id, value) {

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

window.deleteItem = function (id) {

    if (!confirm("هل تريد حذف هذا المنتج من السلة؟")) return;

    removeFromCart(id);

    updateCartCount();

    renderCart();

    showToast("✅ تم حذف المنتج من السلة");

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
التحقق من البيانات
========================*/

function validateCheckout(name, phone, address, cart) {

    if (!name) {
        showToast("يرجى إدخال اسم الزبون");
        customerName.focus();
        return false;
    }

    if (!phone) {
        showToast("يرجى إدخال رقم الهاتف");
        customerPhone.focus();
        return false;
    }

    if (!/^0\d{10}$/.test(phone)) {
        showToast("رقم الهاتف غير صحيح");
        customerPhone.focus();
        return false;
    }

    if (!address) {
        showToast("يرجى إدخال العنوان");
        customerAddress.focus();
        return false;
    }

    if (cart.length === 0) {
        showToast("السلة فارغة");
        return false;
    }

    return true;

}

/*========================
CHECKOUT
========================*/

if (checkoutBtn) {

    checkoutBtn.onclick = async () => {

        if (sendingOrder) return;

        sendingOrder = true;

        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "جاري إرسال الطلب...";

        try {

            const name = customerName.value.trim();
            const phone = customerPhone.value.trim();
            const address = customerAddress.value.trim();
            const city = customerCity ? customerCity.value.trim() : "";
            const notes = customerNotes ? customerNotes.value.trim() : "";

            const cart = getCart();

            if (!validateCheckout(name, phone, address, cart)) {

                sendingOrder = false;
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = "إرسال الطلب";

                return;
            }

            const total = getCartTotal();

            const orderData = {

                orderNumber: generateOrderNumber(),

                name,

                phone,

                address,

                city,

                notes,

                items: prepareItems(cart),

                total,

                status: "جديد",

                createdAt: serverTimestamp()

            };

            await addDoc(ordersRef, orderData);

                  let message = `🛍️ طلب جديد من مجمع حمزه الشطري

━━━━━━━━━━━━━━

🆔 رقم الطلب:
${orderData.orderNumber}

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

            saveCart([]);

            updateCartCount();

            renderCart();

            customerName.value = "";
            customerPhone.value = "";
            customerAddress.value = "";

            if (customerCity) customerCity.value = "";
            if (customerNotes) customerNotes.value = "";

            showToast("✅ تم إرسال الطلب بنجاح");

            sendingOrder = false;

            checkoutBtn.disabled = false;
            checkoutBtn.textContent = "إرسال الطلب";

            window.open(
                "https://wa.me/9647813555538?text=" +
                encodeURIComponent(message),
                "_blank"
            );

            setTimeout(() => {

                window.location.href = "index.html";

            }, 1500);

        } catch (error) {

            console.error(error);

            sendingOrder = false;

            checkoutBtn.disabled = false;

            checkoutBtn.textContent = "إرسال الطلب";

            showToast("❌ حدث خطأ أثناء إرسال الطلب");

        }

    };

}

/*==================================
END OF FILE
==================================*/
