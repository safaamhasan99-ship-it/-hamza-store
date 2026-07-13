// admin-orders.js

import { db } from "./firebase.js";

import {
collection,
getDocs,
deleteDoc,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ordersRef = collection(db,"orders");

async function loadOrders(){

const body = document.getElementById("ordersBody");

if(!body) return;

body.innerHTML = "";

const snapshot = await getDocs(ordersRef);

let ordersCount = 0;
let newOrders = 0;
let totalSales = 0;

snapshot.forEach((item)=>{

const order = item.data();

ordersCount++;

if(order.status==="جديد"){
newOrders++;
}

totalSales += Number(order.total || 0);

body.innerHTML += `

<tr>

<td>${order.name}</td>

<td>${order.phone}</td>

<td>${order.total} د.ع</td>

<td>

<select
onchange="changeStatus('${item.id}',this.value)">

<option value="جديد"
${order.status==="جديد"?"selected":""}>
جديد
</option>

<option value="جاري التجهيز"
${order.status==="جاري التجهيز"?"selected":""}>
جاري التجهيز
</option>

<option value="تم التسليم"
${order.status==="تم التسليم"?"selected":""}>
تم التسليم
</option>

</select>

</td>

<td>

<button class="edit"
onclick="showOrder('${item.id}')">
عرض
</button>

<button class="delete"
onclick="removeOrder('${item.id}')">
حذف
</button>

</td>

</tr>

`;

});

document.getElementById("ordersCount").textContent = ordersCount;
document.getElementById("newOrders").textContent = newOrders;
document.getElementById("totalSales").textContent = totalSales.toLocaleString();

}
/*==========================
تغيير حالة الطلب
==========================*/

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

/*==========================
حذف الطلب
==========================*/

window.removeOrder = async function(id){

if(!confirm("هل تريد حذف الطلب؟")) return;

try{

await deleteDoc(
doc(db,"orders",id)
);

loadOrders();

}catch(error){

console.error(error);

alert("تعذر حذف الطلب");

}

};

/*==========================
عرض تفاصيل الطلب
==========================*/

window.showOrder = async function(id){

const snapshot = await getDocs(ordersRef);

snapshot.forEach((item)=>{

if(item.id!==id) return;

const order=item.data();

let details="";

(order.items || []).forEach(product=>{

details +=
`${product.name}
الكمية: ${product.quantity || 1}
السعر: ${product.price} د.ع

`;

});

alert(

`العميل: ${order.name}

الهاتف: ${order.phone}

المحافظة: ${order.city || "-"}

العنوان:
${order.address}

الملاحظات:
${order.notes || "لا توجد"}

------------------------

${details}

------------------------

الإجمالي:
${order.total} د.ع`

);

});

};

/*==========================
البحث
==========================*/

const search=document.getElementById("searchOrder");

if(search){

search.addEventListener("input",()=>{

const value=search.value.toLowerCase();

document.querySelectorAll("#ordersBody tr").forEach(row=>{

row.style.display=
row.innerText.toLowerCase().includes(value)
?""
:"none";

});

});

}

/*==========================
تحميل الطلبات
==========================*/

document.addEventListener("DOMContentLoaded",()=>{

loadOrders();

});
