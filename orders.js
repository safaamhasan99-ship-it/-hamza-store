import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc,
orderBy,
query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = document.getElementById("ordersTable");

async function loadOrders(){

table.innerHTML = "";

const q = query(
collection(db,"orders"),
orderBy("date","desc")
);

const snapshot = await getDocs(q);

snapshot.forEach((document)=>{

const order = document.data();

table.innerHTML += `

<tr>

<td>${document.id}</td>

<td>${order.name || "-"}</td>

<td>${order.total || 0} د.ع</td>

<td>

<select id="status-${document.id}">

<option value="جديد" ${order.status=="جديد"?"selected":""}>جديد</option>

<option value="قيد التجهيز" ${order.status=="قيد التجهيز"?"selected":""}>قيد التجهيز</option>

<option value="تم الشحن" ${order.status=="تم الشحن"?"selected":""}>تم الشحن</option>

<option value="تم التسليم" ${order.status=="تم التسليم"?"selected":""}>تم التسليم</option>

<option value="ملغي" ${order.status=="ملغي"?"selected":""}>ملغي</option>

</select>

</td>

<td>

<button onclick="saveStatus('${document.id}')">

حفظ

</button>

<button onclick="removeOrder('${document.id}')">

حذف

</button>

</td>

</tr>

`;

});

}

window.saveStatus = async(id)=>{

const status = document.getElementById("status-"+id).value;

await updateDoc(doc(db,"orders",id),{

status:status

});

alert("تم تحديث الحالة");

};

window.removeOrder = async(id)=>{

if(!confirm("هل تريد حذف الطلب؟")) return;

await deleteDoc(doc(db,"orders",id));

loadOrders();

};

loadOrders();
