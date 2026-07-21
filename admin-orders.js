// admin-orders.js

import { db } from "./firebase.js";

import {
collection,
doc,
deleteDoc,
updateDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ordersRef = collection(db, "orders");

const table = document.getElementById("ordersBody");

let lastCount = 0;

/*=========================
تحميل الطلبات مباشرة
=========================*/

onSnapshot(ordersRef, (snapshot) => {

table.innerHTML = "";

let totalOrders = 0;
let newOrders = 0;
let totalSales = 0;

/* سيكمل في الجزء الثاني */

snapshot.forEach((item) => {

const order = item.data();

totalOrders++;

if (order.status === "جديد") newOrders++;

totalSales += Number(order.total || 0);

let images = "";
let names = "";

(order.items || []).forEach((product) => {

images += `
<img
src="${product.image}"
style="
width:60px;
height:60px;
object-fit:cover;
border-radius:8px;
margin:2px;
">
`;

names += `
<div>
${product.name}
<br>
الكمية: ${product.quantity || 1}
</div>
`;

});

table.innerHTML += `
<tr>

<td>${totalOrders}</td>

<td>${order.name}</td>

<td>${order.phone}</td>

<td>${names}</td>

<td>${images}</td>

<td>${Number(order.total).toLocaleString()} د.ع</td>

<td>
${order.createdAt || "-"}
</td>

<td>

<select
onchange="changeStatus('${item.id}',this.value)">

<option value="جديد" ${order.status==="جديد"?"selected":""}>
جديد
</option>

<option value="قيد المراجعة" ${order.status==="قيد المراجعة"?"selected":""}>
قيد المراجعة
</option>

<option value="جاري التجهيز" ${order.status==="جاري التجهيز"?"selected":""}>
جاري التجهيز
</option>

<option value="تم الشحن" ${order.status==="تم الشحن"?"selected":""}>
تم الشحن
</option>

<option value="مكتمل" ${order.status==="مكتمل"?"selected":""}>
مكتمل
</option>

<option value="ملغي" ${order.status==="ملغي"?"selected":""}>
ملغي
</option>

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

</tr>
`;

});

/* تحديث الإحصائيات */

document.getElementById("totalOrders").textContent = totalOrders;
document.getElementById("newOrders").textContent = newOrders;
document.getElementById("totalSales").textContent =
Number(totalSales).toLocaleString();

/* إشعار عند وصول طلب جديد */

if(lastCount!==0 && totalOrders>lastCount){

const audio=document.getElementById("notifySound");

if(audio){
audio.play().catch(()=>{});
}

alert("🔔 وصل طلب جديد");

}

lastCount=totalOrders;

});

/*=========================
تغيير حالة الطلب
=========================*/

window.changeStatus = async function(id,status){

try{

await updateDoc(
doc(db,"orders",id),
{
status:status
}
);

}catch(error){

console.error(error);
alert("تعذر تحديث حالة الطلب");

}

};

/*=========================
حذف الطلب
=========================*/

window.removeOrder = async function(id){

if(!confirm("هل تريد حذف هذا الطلب؟")) return;

try{

await deleteDoc(
doc(db,"orders",id)
);

}catch(error){

console.error(error);
alert("تعذر حذف الطلب");

}

};

/*=========================
فتح واتساب
=========================*/

window.openWhatsApp=function(phone){

let number=(phone||"").replace(/\D/g,"");

if(number.startsWith("0")){
number="964"+number.substring(1);
}

window.open(
`https://wa.me/${number}`,
"_blank"
);

};

/*=========================
عرض تفاصيل الطلب
=========================*/

window.showOrder=function(id){

alert("سيتم في الجزء القادم عرض نافذة احترافية تحتوي على جميع تفاصيل الطلب وصور المنتجات.");

};
/*=========================
عرض تفاصيل الطلب
=========================*/

window.showOrder = async function(id){

    const snapshot = await getDocs(ordersRef);

    snapshot.forEach((docItem)=>{

        if(docItem.id !== id) return;

        const order = docItem.data();

        let productsHTML = "";

        (order.items || []).forEach((product)=>{

            productsHTML += `
━━━━━━━━━━━━━━━━━━━━━━

🛍️ ${product.name}

📏 المقاس : ${product.size || "-"}

🎨 اللون : ${product.color || "-"}

🔢 الكمية : ${product.quantity || 1}

💰 السعر : ${Number(product.price || 0).toLocaleString()} د.ع

`;
        });

        alert(`

👤 العميل : ${order.name}

📞 الهاتف : ${order.phone}

🏙️ المحافظة : ${order.city || "-"}

📍 العنوان :

${order.address || "-"}

📝 الملاحظات :

${order.notes || "لا توجد"}

━━━━━━━━━━━━━━━━━━━━━━

${productsHTML}

━━━━━━━━━━━━━━━━━━━━━━

💵 المجموع :

${Number(order.total || 0).toLocaleString()} د.ع

`);

    });

};

/*=========================
البحث
=========================*/

const search=document.getElementById("searchInput");

if(search){

search.addEventListener("input",()=>{

const value=search.value.toLowerCase();

document.querySelectorAll("#ordersBody tr").forEach(row=>{

row.style.display=row.innerText.toLowerCase().includes(value)
?""
:"none";

});

});

}
