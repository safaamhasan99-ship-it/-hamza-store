import { db } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.sendOrder = async function () {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!name || !phone || !address) {
        alert("يرجى ملء جميع الحقول");
        return;
    }

    if (cart.length === 0) {
        alert("السلة فارغة");
        return;
    }

    let total = 0;
    let message = "*طلب جديد من موقع مجمع حمزه الشطري*%0A%0A";

    message += "👤 الاسم: " + name + "%0A";
    message += "📞 الهاتف: " + phone + "%0A";
    message += "📍 العنوان: " + address + "%0A%0A";

    message += "📦 المنتجات:%0A";

    cart.forEach((item) => {

        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        const itemTotal = qty * price;

        total += itemTotal;

        message +=
            "• " +
            item.name +
            " × " +
            qty +
            " = " +
            itemTotal +
            " د.ع%0A";
    });

    message += "%0A💰 الإجمالي: " + total + " د.ع";

    try {

        await addDoc(collection(db, "orders"), {

            name: name,
            phone: phone,
            address: address,

            items: cart,

            total: total,

            status: "جديد",

            createdAt: serverTimestamp()

        });

        localStorage.removeItem("cart");

        alert("تم حفظ الطلب بنجاح");

        window.open(
            "https://wa.me/9647813555538?text=" + message,
            "_blank"
        );

        window.location.href = "index.html";

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء حفظ الطلب في قاعدة البيانات");

    }

};
