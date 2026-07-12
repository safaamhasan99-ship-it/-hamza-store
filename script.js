/*==================================
   مجمع حمزه الشطري
==================================*/

// ===============================
// السلة والمفضلة
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ===============================
// تحديث عداد السلة
// ===============================

function updateCartCount() {

    const count = document.getElementById("cartCount");

    if (count) {

        let total = 0;

        cart.forEach(item => {
            total += item.quantity || 1;
        });

        count.textContent = total;

    }

}

updateCartCount();

// ===============================
// إضافة إلى السلة
// ===============================

function addToCart(name, price, image) {

    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {

        cart[index].quantity++;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            image: image,
            quantity: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("✅ تمت إضافة المنتج إلى السلة");

}

// ===============================
// إضافة إلى المفضلة
// ===============================

function addToFavorites(name, price, image) {

    const exists = favorites.find(item => item.name === name);

    if (exists) {

        alert("❤️ المنتج موجود بالفعل في المفضلة");
        return;

    }

    favorites.push({
        name: name,
        price: Number(price),
        image: image
    });

    localStorage.setItem("favorites", JSON.stringify(favorites));

    alert("❤️ تمت إضافة المنتج إلى المفضلة");

}

// ===============================
// صفحة التفاصيل
// ===============================

function openProduct(name, price, image) {

    const product = {
        name: name,
        price: Number(price),
        image: image
    };

    localStorage.setItem("product", JSON.stringify(product));

    window.location.href = "details.html";

}

// ===============================
// السلايدر
// ===============================

const slides = document.querySelectorAll(".hero-slide");

let current = 0;

function slider() {

    if (!slides.length) return;

    slides.forEach(slide => {

        slide.classList.remove("active");

    });

    slides[current].classList.add("active");

    current++;

    if (current >= slides.length) {

        current = 0;

    }

}

if (slides.length) {

    slider();

    setInterval(slider, 4000);

}

// ===============================
// البحث
// ===============================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll(".product-card").forEach(product => {

            const title = product.querySelector("h3").textContent.toLowerCase();

            if (title.includes(value)) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });

    });

}

// ===============================
// الوضع الليلي
// ===============================

const darkBtn = document.getElementById("darkBtn");

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

}

if (darkBtn) {

    darkBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

        } else {

            localStorage.setItem("theme", "light");

        }

    });

}

// ===============================
// تشغيل عند فتح الصفحة
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

});
