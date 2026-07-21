/*==================================
Hamza Store V20 Professional
Admin Orders
==================================*/

import { db } from "./js/firebase.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*=========================
Firestore
=========================*/

const ordersRef = collection(db, "orders");

const ordersQuery = query(
  ordersRef,
  orderBy("createdAt", "desc")
);

/*=========================
Elements
=========================*/

const table = document.getElementById("ordersTable");
const totalOrdersEl = document.getElementById("totalOrders");
const newOrdersEl = document.getElementById("newOrders");
const totalSalesEl = document.getElementById("totalSales");
const searchInput = document.getElementById("searchInput");

/*=========================
Notification
=========================*/

let initialized = false;

function playNotification() {

    try {

        const audio = new Audio("./notification.mp3");

        audio.preload = "auto";
        audio.volume = 1;
        audio.currentTime = 0;

        audio.play()
            .then(() => {

                console.log("🔔 Notification Played");

            })
            .catch((err) => {

                console.error("❌ Notification Error", err);

            });

    } catch (err) {

        console.error(err);

    }

}

/*=========================
Format Date
=========================*/

function formatDate(value){

    if(!value) return "-";

    try{

        if(value.seconds){

            return new Date(
                value.seconds * 1000
            ).toLocaleString("ar-IQ");

        }

        return value;

    }catch{

        return "-";

    }

}

/*=========================
Format Price
=========================*/

function formatPrice(price){

    return Number(price || 0)
        .toLocaleString("ar-IQ") + " د.ع";

}

/*=========================
Order Total
=========================*/

function getOrderTotal(order){

    if(Number.isFinite(Number(order.total))){
        return Number(order.total);
    }

    let total = 0;

    (order.items || []).forEach(item=>{

        total +=
            Number(item.price || 0) *
            Number(item.quantity || 1);

    });

    return total;

}

function getOrderStatus(order){

    return order.status || "جديد";

}

/*=========================
Load Orders
=========================*/

onSnapshot(ordersQuery, (snapshot) => {

    table.innerHTML = "";

    let totalOrders = 0;
    let newOrders = 0;
    let totalSales = 0;

    /* إشعار الطلبات الجديدة */
    if (initialized) {

        snapshot.docChanges().forEach((change) => {

            if (change.type === "added") {

                playNotification();

                alert("🔔 تم استلام طلب جديد");

            }

        });

    }

    initialized = true;

    if (snapshot.empty) {

        table.innerHTML = `
        <tr>
            <td colspan="10">
                لا توجد طلبات حالياً
            </td>
        </tr>`;

        totalOrdersEl.textContent = "0";
        newOrdersEl.textContent = "0";
        totalSalesEl.textContent = "0";

        return;

    }

    snapshot.forEach((docSnap, index) => {

        const order = docSnap.data();

        totalOrders++;

        const status = getOrderStatus(order);

        if (status === "جديد") {
            newOrders++;
        }

        const orderTotal = getOrderTotal(order);

        totalSales += orderTotal;

        let productsHTML = "";
        let imagesHTML = "";

        (order.items || []).forEach((item) => {

            productsHTML += `
            <div style="margin-bottom:8px">
                <strong>${item.name || "-"}</strong><br>
                الكمية : ${item.quantity || 1}
            </div>`;

            imagesHTML += `
            <img
                src="${item.image || "./images/no-image.png"}"
                class="product-img"
                onerror="this.src='./images/no-image.png'">
            `;

        });

        table.innerHTML += `
        <tr>

            <td>${index + 1}</td>

            <td>${order.name || "-"}</td>

            <td>${order.phone || "-"}</td>

            <td>${productsHTML}</td>

            <td>${imagesHTML}</td>

            <td>${formatPrice(orderTotal)}</td>

            <td>${formatDate(order.createdAt)}</td>

            <td>${status}</td>

            <td>
                <button
                    class="whatsapp"
                    onclick="openWhatsApp('${order.phone || ""}')">
                    واتساب
                </button>
            </td>

            <td>

                <button
                    class="review"
                    onclick="showOrder('${docSnap.id}')">
                    عرض
                </button>

                <button
                    class="delete"
                    onclick="removeOrder('${docSnap.id}')">
                    حذف
                </button>

            </td>

        </tr>
        `;

    });

    totalOrdersEl.textContent = totalOrders;
    newOrdersEl.textContent = newOrders;
    totalSalesEl.textContent = formatPrice(totalSales);

}, (error) => {

    console.error(error);

    alert("خطأ في تحميل الطلبات:\n" + error.message);

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

        console.log("✅ تم تحديث حالة الطلب");

    } catch (err) {

        console.error(err);

        alert("❌ تعذر تحديث حالة الطلب");

    }

};

/*=========================
حذف الطلب
=========================*/

window.removeOrder = async function (id) {

    if (!confirm("هل تريد حذف هذا الطلب؟")) return;

    try {

        await deleteDoc(
            doc(db, "orders", id)
        );

        alert("✅ تم حذف الطلب");

    } catch (err) {

        console.error(err);

        alert("❌ تعذر حذف الطلب");

    }

};

/*=========================
فتح واتساب
=========================*/

window.openWhatsApp = function (phone) {

    let number = String(phone || "")
        .replace(/\D/g, "");

    if (number.startsWith("0")) {
        number = "964" + number.substring(1);
    }

    if (number && !number.startsWith("964")) {
        number = "964" + number;
    }

    if (!number) {
        alert("لا يوجد رقم هاتف");
        return;
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

        const snap = await getDoc(doc(db, "orders", id));

        if (!snap.exists()) {
            alert("الطلب غير موجود");
            return;
        }

        const order = snap.data();

        let products = "";

        (order.items || []).forEach((item, index) => {

            products += `
━━━━━━━━━━━━━━━━━━━━━━

${index + 1}- ${item.name || "-"}

الكمية : ${item.quantity || 1}

السعر : ${formatPrice(item.price || 0)}

المقاس : ${item.size || "-"}

اللون : ${item.color || "-"}

`;

        });

        alert(`

رقم العميل:
${order.phone || "-"}

اسم العميل:
${order.name || "-"}

المحافظة:
${order.city || "-"}

العنوان:
${order.address || "-"}

━━━━━━━━━━━━━━━━━━━━━━

${products}

━━━━━━━━━━━━━━━━━━━━━━

الإجمالي:

${formatPrice(getOrderTotal(order))}

الحالة:

${getOrderStatus(order)}

`);

    } catch (err) {

        console.error(err);

        alert("❌ تعذر فتح الطلب");

    }

};

/*=========================
البحث داخل الطلبات
=========================*/

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const value = this.value.trim().toLowerCase();

        const rows = table.querySelectorAll("tr");

        rows.forEach((row) => {

            const text = row.textContent.toLowerCase();

            row.style.display =
                text.includes(value)
                    ? ""
                    : "none";

        });

    });

}

/*==================================
Hamza Store V20
Finish
==================================*/

// جعل بعض الدوال متاحة من Console
window.formatPrice = formatPrice;
window.formatDate = formatDate;
window.getOrderTotal = getOrderTotal;
window.getOrderStatus = getOrderStatus;

// التحقق من وجود جدول الطلبات
if (!table) {
    console.error("❌ لم يتم العثور على #ordersTable");
}

// تفعيل الصوت بعد أول نقرة من المستخدم
// (مهم لبعض المتصفحات مثل Chrome و Safari)
document.addEventListener("click", () => {

    try {

        const audio = new Audio("./notification.mp3");
        audio.volume = 0;
        audio.play()
            .then(() => {
                audio.pause();
                audio.currentTime = 0;
                console.log("🔔 Notification Ready");
            })
            .catch(() => {});

    } catch (e) {}

}, { once: true });

console.log("✅ Admin Orders V20 Loaded Successfully");
