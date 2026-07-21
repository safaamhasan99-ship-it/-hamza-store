/*==================================
Hamza Store V18
Professional Utils
==================================*/

/*========================
CART
========================*/

export function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

    } catch {

        return [];

    }

}

export function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart || [])
    );

    updateCartCount();

    window.dispatchEvent(
        new CustomEvent("cartUpdated")
    );

}

export function addToCart(product) {

    let cart = getCart();

    const index = cart.findIndex(
        item => item.id === product.id
    );

    if (index > -1) {

        cart[index].qty =
            Number(cart[index].qty || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            image: product.image,

            price: Number(product.price) || 0,

            size: product.size || "",

            color: product.color || "",

            qty: 1

        });

    }

    saveCart(cart);

    showToast("✅ تمت إضافة المنتج إلى السلة");

}

export function removeFromCart(id) {

    const cart = getCart().filter(
        item => item.id !== id
    );

    saveCart(cart);

    showToast("🗑️ تم حذف المنتج من السلة");

}

/*========================
CHANGE QTY
========================*/

export function changeQty(id, value) {

    const cart = getCart();

    const item = cart.find(
        p => p.id === id
    );

    if (!item) return;

    item.qty = Number(item.qty || 1) + value;

    if (item.qty <= 0) {

        removeFromCart(id);

        return;

    }

    saveCart(cart);

}

/*========================
CLEAR CART
========================*/

export function clearCart() {

    localStorage.removeItem("cart");

    updateCartCount();

    window.dispatchEvent(
        new CustomEvent("cartUpdated")
    );

}

/*========================
CART COUNT
========================*/

export function updateCartCount() {

    const badge = document.getElementById("cartCount");

    if (!badge) return;

    const total = getCart().reduce(
        (sum, item) => sum + Number(item.qty || 1),
        0
    );

    badge.textContent = total;

    badge.style.display =
        total > 0 ? "flex" : "none";

}

/*========================
LISTEN CART CHANGES
========================*/

window.addEventListener("storage", () => {

    updateCartCount();

});

window.addEventListener("cartUpdated", () => {

    updateCartCount();

});

/*========================
FAVORITES
========================*/

export function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

    } catch {

        return [];

    }

}

export function saveFavorites(list) {

    localStorage.setItem(
        "favorites",
        JSON.stringify(list || [])
    );

    window.dispatchEvent(
        new CustomEvent("favoritesUpdated")
    );

}

export function toggleFavorite(product) {

    let list = getFavorites();

    const index = list.findIndex(
        item => item.id === product.id
    );

    if (index > -1) {

        list.splice(index, 1);

        saveFavorites(list);

        showToast("💔 تمت إزالة المنتج من المفضلة");

        return false;

    }

    list.push({

        id: product.id,

        name: product.name,

        image: product.image,

        price: Number(product.price) || 0

    });

    saveFavorites(list);

    showToast("❤️ تمت إضافة المنتج إلى المفضلة");

    return true;

}

/*========================
CHECK FAVORITE
========================*/

export function isFavorite(id) {

    return getFavorites().some(
        item => item.id === id
    );

}

/*========================
CLEAR FAVORITES
========================*/

export function clearFavorites() {

    localStorage.removeItem("favorites");

    window.dispatchEvent(
        new CustomEvent("favoritesUpdated")
    );

}

/*========================
SAFE IMAGE V18
========================*/

export function safeImage(url) {

    const fallback = "./IMG_5661.jpeg";

    try {

        if (!url) return fallback;

        url = String(url).trim();

        if (url === "") return fallback;

        // استخراج الرابط إذا تم لصق HTML
        const html = url.match(/src=['"]([^'"]+)['"]/i);

        if (html) {
            url = html[1];
        }

        // إزالة المحارف المخفية
        url = url
            .replace(/\u200B/g, "")
            .replace(/\u200C/g, "")
            .replace(/\u200D/g, "")
            .replace(/\uFEFF/g, "")
            .trim();

        // إزالة الفراغات الزائدة
        url = url.replace(/\s+/g, "");

        // إزالة النقطة أو الفراغ بنهاية الرابط
        url = url.replace(/[.\s]+$/, "");

        // تحويل // إلى https://
        if (url.startsWith("//")) {
            url = "https:" + url;
        }

        // Google Drive
        if (url.includes("drive.google.com/file/d/")) {

            const id = url.split("/d/")[1]?.split("/")[0];

            if (id) {
                url = `https://drive.google.com/uc?export=view&id=${id}`;
            }

        }

        // Dropbox
        if (url.includes("dropbox.com")) {
            url = url.replace("?dl=0", "?raw=1");
        }

        // منع روابط صفحة ImgBB
        if (
            url.includes("https://ibb.co/") ||
            url.includes("https://www.ibb.co/")
        ) {
            return fallback;
        }

        // السماح فقط بالرابط المباشر
        if (
            !url.startsWith("https://") &&
            !url.startsWith("http://")
        ) {
            return fallback;
        }

        // ترميز الرابط
        return encodeURI(url);

    } catch (error) {

        console.error(error);

        return fallback;

    }

}

/*========================
PRELOAD IMAGE
========================*/

export function preloadImage(url) {

    const img = new Image();

    img.src = safeImage(url);

}

/*========================
PRICE
========================*/

export function formatPrice(price) {

    const value = Number(price);

    if (isNaN(value)) {
        return "0 د.ع";
    }

    return value.toLocaleString("ar-IQ") + " د.ع";

}

/*========================
NUMBER
========================*/

export function formatNumber(number) {

    const value = Number(number);

    if (isNaN(value)) {
        return "0";
    }

    return value.toLocaleString("ar-IQ");

}

/*========================
DATE
========================*/

export function formatDate(date) {

    try {

        if (!date) return "";

        // Firestore Timestamp
        if (date.seconds) {

            return new Date(
                date.seconds * 1000
            ).toLocaleString("ar-IQ");

        }

        return new Date(date).toLocaleString("ar-IQ");

    } catch {

        return "";

    }

}

/*========================
TIME
========================*/

export function formatTime(date) {

    try {

        if (!date) return "";

        if (date.seconds) {

            return new Date(
                date.seconds * 1000
            ).toLocaleTimeString("ar-IQ");

        }

        return new Date(date).toLocaleTimeString("ar-IQ");

    } catch {

        return "";

    }

}

/*========================
TOAST
========================*/

let toastTimer = null;

export function showToast(message, type = "success") {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";
        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.remove(
        "success",
        "error",
        "warning",
        "show"
    );

    toast.classList.add(type);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

/*========================
HELPERS
========================*/

export function isMobile() {

    return /Android|iPhone|iPad|iPod|Mobile/i.test(
        navigator.userAgent
    );

}

export function scrollTopSmooth() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

export function generateId() {

    return Date.now().toString(36) +
        Math.random().toString(36).substring(2, 8);

}

/*==================================
END OF FILE
==================================*/
