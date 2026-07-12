import { db } from "./firebase.js";

import {
collection,
getDocs,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ordersRef = collection(db, "orders");

async function loadOrders() {

    const table = document.getElementById("ordersTable");

    table.innerHTML = "";

    const snapshot = await getDocs(ordersRef);

    snapshot.forEach((order) => {

        const data = order.data();

        table.innerHTML += `

<tr>

<td>${order.id}</td>

<td>${data.customerName || "-"}</td>

<td>${data.total || 0} د.ع</td>

<td>

<select id="status-${order.id}">

<option value="جديد" ${data.status=="جديد"?"selected":""}>جديد</option>

<option value="قيد التجهيز" ${data.status=="قيد التجهيز"?"selected":""}>قيد التجهيز</option>

<option value="تم الشحن" ${data.status=="تم الشحن"?"selected":""}>تم الشحن</option>

<option value="مكتمل" ${data.status=="مكتمل"?"selected":""}>مكتمل</option>

<option value="ملغي" ${data.status=="ملغي"?"selected":""}>ملغي</option>

</select>

</td>

<td>

<button onclick="saveStatus('${order.id}')">

حفظ

</button>

</td>

</tr>

`;

    });

}

window.saveStatus = async function(id){

    const status = document.getElementById(`status-${id}`).value;

    await updateDoc(doc(db,"orders",id),{

        status:status

    });

    alert("تم تحديث حالة الطلب");

}

loadOrders();
