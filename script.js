/* ==================================
   Hamza Store - script.js
================================== */

// الوضع الليلي
const darkBtn = document.getElementById("darkBtn");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

if (darkBtn) {
    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
}

// تحديث عداد السلة
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let count = 0;

    cart.forEach(item => {
        count += Number(item.qty || 1);
    });

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

updateCartCount();

// إخفاء اللودر
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.display = "none";
    }
});
