/*==================================
Hamza Store V18
Admin Orders Pro
==================================*/

import { db, auth } from "./js/firebase.js";

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*=========================
الإعدادات
=========================*/

const ordersRef = collection(db, "orders");

onSnapshot(ordersRef, (snapshot) => {
  console.log("عدد الطلبات:", snapshot.size);
});
const ordersQuery = query(
    ordersRef,
    orderBy("createdAt", "desc")
);

const table = document.getElementById("ordersBody");

const totalOrdersEl = document.getElementById("totalOrders");
const newOrdersEl = document.getElementById("newOrders");
const totalSalesEl = document.getElementById("totalSales");

const notifySound = document.getElementById("notifySound");

let lastCount = 0;

/*=========================
تنسيق التاريخ
=========================*/

function formatDate(value) {

    if (!value) return "-";

    try {

        if (value.seconds) {

            return new Date(
                value.seconds * 1000
            ).toLocaleString("ar-IQ");

        }

        return value;

    } catch {

        return "-";

    }

}

/*=========================
تنسيق السعر
=========================*/

function formatPrice(price) {

    return Number(price || 0).toLocaleString() + " د.ع";

}

/*=========================
تحميل الطلبات مباشرة
=========================*/

onSnapshot(ordersQuery, (snapshot) => {

    table.innerHTML = "";

    let totalOrders = 0;
    let newOrders = 0;
    let totalSales = 0;

    if (snapshot.empty) {

        table.innerHTML = `
        <tr>
            <td colspan="9" style="text-align:center;padding:25px;">
                لا توجد طلبات
            </td>
        </tr>`;

        totalOrdersEl.textContent = "0";
        newOrdersEl.textContent = "0";
        totalSalesEl.textContent = "0";

        return;
    }

    snapshot.forEach((item, index) => {

        const order = item.data();

        totalOrders++;

        if (order.status === "جديد") {
            newOrders++;
        }

        totalSales += Number(order.total || 0);

        let productsHTML = "";
        let imagesHTML = "";

        (order.items || []).forEach((product) => {

            productsHTML += `
            <div style="margin-bottom:8px;">
                <strong>${product.name}</strong><br>
                الكمية: ${product.quantity || 1}
            </div>`;

            imagesHTML += `
            <img
                src="${product.image}"
                loading="lazy"
                style="
                    width:60px;
                    height:60px;
                    object-fit:cover;
                    border-radius:8px;
                    margin:2px;
                    border:1px solid #ddd;
                "
                onerror="this.src='./images/no-image.png'"
            >`;

        });

        table.innerHTML += `
        <tr>

            <td>${index + 1}</td>

            <td>${order.name || "-"}</td>

            <td>${order.phone || "-"}</td>

            <td>${productsHTML}</td>

            <td>${imagesHTML}</td>

            <td>${formatPrice(order.total)}</td>

            <td>${formatDate(order.createdAt)}</td>

            <td>

                <select onchange="changeStatus('${item.id}',this.value)">

                    <option value="جديد" ${order.status==="جديد"?"selected":""}>جديد</option>

                    <option value="قيد المراجعة" ${order.status==="قيد المراجعة"?"selected":""}>قيد المراجعة</option>

                    <option value="جاري التجهيز" ${order.status==="جاري التجهيز"?"selected":""}>جاري التجهيز</option>

                    <option value="تم الشحن" ${order.status==="تم الشحن"?"selected":""}>تم الشحن</option>

                    <option value="مكتمل" ${order.status==="مكتمل"?"selected":""}>مكتمل</option>

                    <option value="ملغي" ${order.status==="ملغي"?"selected":""}>ملغي</option>

                </select>

            </td>

            <td>

                <button
                    class="whatsapp"
                    onclick="openWhatsApp('${order.phone}')">
                    واتساب
                </button>

                <button
                    class="review"
                    onclick="showOrder('${item.id}')">
                    عرض
                </button>

                <button
                    class="delete"
                    onclick="removeOrder('${item.id}')">
                    حذف
                </button>

            </td>

        </tr>`;
    });

    totalOrdersEl.textContent = totalOrders;
    newOrdersEl.textContent = newOrders;
    totalSalesEl.textContent = Number(totalSales).toLocaleString();

    if (lastCount !== 0 && totalOrders > lastCount) {

        if (notifySound) {
            notifySound.play().catch(() => {});
        }

        alert("🔔 تم استلام طلب جديد");

    }

    lastCount = totalOrders;

});

/*=========================
تغيير حالة الطلب
=========================*/

window.changeStatus = async function (id, status) {

    try {

        await updateDoc(
            doc(db, "orders", id),
            {
                status: status
            }
        );

    } catch (error) {

        console.error(error);

        alert("تعذر تحديث حالة الطلب");

    }

};

/*=========================
حذف الطلب
=========================*/

window.removeOrder = async function (id) {

    if (!confirm("هل تريد حذف هذا الطلب نهائياً؟")) return;

    try {

        await deleteDoc(
            doc(db, "orders", id)
        );

        alert("✅ تم حذف الطلب");

    } catch (error) {

        console.error(error);

        alert("تعذر حذف الطلب");

    }

};

/*=========================
فتح واتساب
=========================*/

window.openWhatsApp = function (phone) {

    let number = String(phone || "").replace(/\D/g, "");

    if (number.startsWith("0")) {
        number = "964" + number.substring(1);
    }

    if (!number.startsWith("964")) {
        number = "964" + number;
    }

    window.open(
        `https://wa.me/${number}`,
        "_blank"
    );

};

/*=========================
عرض تفاصيل الطلب
=========================*/

window.showOrder = async function (id) {

    try {

        const orderDoc = await getDoc(
            doc(db, "orders", id)
        );

        if (!orderDoc.exists()) {

            alert("الطلب غير موجود");

            return;

        }

        const order = orderDoc.data();

        let details = "";

        (order.items || []).forEach((item, index) => {

            details += `

━━━━━━━━━━━━━━━━━━━━━━

🛍 المنتج ${index + 1}

الاسم : ${item.name}

الكمية : ${item.quantity || 1}

المقاس : ${item.size || "-"}

اللون : ${item.color || "-"}

السعر : ${formatPrice(item.price)}

`;

        });

        alert(`

👤 العميل : ${order.name || "-"}

📞 الهاتف : ${order.phone || "-"}

🏙 المحافظة : ${order.city || "-"}

📍 العنوان :

${order.address || "-"}

📝 الملاحظات :

${order.notes || "لا توجد"}

━━━━━━━━━━━━━━━━━━━━━━

${details}

━━━━━━━━━━━━━━━━━━━━━━

💵 المجموع :

${formatPrice(order.total)}

📦 الحالة :

${order.status || "جديد"}

`);

    } catch (error) {

        console.error(error);

        alert("تعذر عرض تفاصيل الطلب");

    }

};

/*=========================
البحث في الطلبات
=========================*/

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.trim().toLowerCase();

        document.querySelectorAll("#ordersBody tr").forEach((row) => {

            const text = row.textContent.toLowerCase();

            row.style.display = text.includes(value)
                ? ""
                : "none";

        });

    });

}

/*=========================
تحديث الصفحة
=========================*/

window.refreshOrders = function () {

    location.reload();

};

/*=========================
طباعة الطلب
=========================*/

window.printOrder = function () {

    window.print();

};

/*=========================
اختصارات لوحة المفاتيح
=========================*/

document.addEventListener("keydown", (e) => {

    // Ctrl + F للبحث
    if (e.ctrlKey && e.key.toLowerCase() === "f") {

        e.preventDefault();

        if (searchInput) {
            searchInput.focus();
        }

    }

    // F5 تحديث
    if (e.key === "F5") {

        e.preventDefault();

        refreshOrders();

    }

});

/*=========================
جاهزية الصفحة
=========================*/

console.log("✅ Hamza Store Admin Orders V18 Ready");
