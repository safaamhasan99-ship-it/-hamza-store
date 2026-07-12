import { db } from "./firebase.js";


import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// جلب رقم الطلب من الرابط

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");



async function loadOrder(){


if(!orderId){

alert("لا يوجد رقم طلب");

return;

}



const snap = await getDoc(
doc(db,"orders",orderId)
);



if(!snap.exists()){

alert("الطلب غير موجود");

return;

}



const order = snap.data();




// بيانات الزبون

document.getElementById("customer").innerHTML = `

<h2>
بيانات الزبون
</h2>

<p>
الاسم: ${order.customerName || "-"}
</p>

<p>
الهاتف: ${order.phone || "-"}
</p>

<p>
العنوان: ${order.address || "-"}
</p>

<p>
المجموع: ${order.total || 0} د.ع
</p>

<p>
الحالة: ${order.status || "جديد"}
</p>

`;




// المنتجات

const box = document.getElementById("products");


box.innerHTML = `

<h2>
المنتجات
</h2>

`;



if(order.items && order.items.length){



order.items.forEach((item)=>{


box.innerHTML += `

<div class="item">


<img src="${item.image || ''}">


<h3>

${item.name}

</h3>


<p>

الكمية: ${item.quantity || 1}

</p>


<p class="price">

${item.price || 0} د.ع

</p>


</div>

`;

});


}else{


box.innerHTML += "

<p>لا توجد منتجات</p>

";

}



}


loadOrder();
