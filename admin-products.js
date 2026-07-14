import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
deleteDoc,
updateDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// عناصر الصفحة

const name = document.getElementById("name");
const price = document.getElementById("price");
const category = document.getElementById("category");
const sizes = document.getElementById("sizes");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const description = document.getElementById("description");
const image = document.getElementById("image");

const saveBtn = document.getElementById("saveBtn");
const productsList = document.getElementById("productsList");


let editId = null;



// رسالة نجاح تختفي تلقائياً

function showMessage(text){

let toast = document.createElement("div");

toast.innerHTML = text;

toast.style.position="fixed";
toast.style.bottom="30px";
toast.style.right="30px";
toast.style.background="#198754";
toast.style.color="#fff";
toast.style.padding="15px 25px";
toast.style.borderRadius="15px";
toast.style.fontFamily="Cairo";
toast.style.fontWeight="bold";
toast.style.fontSize="16px";
toast.style.zIndex="9999";
toast.style.boxShadow="0 5px 20px #0003";
toast.style.opacity="1";
toast.style.transition="0.5s";


document.body.appendChild(toast);


setTimeout(()=>{

toast.style.opacity="0";


setTimeout(()=>{

toast.remove();

},500);


},2000);


}



// تنظيف رابط الصورة

function cleanImageUrl(url){

if(!url) return "";


let match = url.match(/src="([^"]+)"/);


if(match){

return match[1];

}


return url.trim();

}
// تحميل المنتجات

async function loadProducts(){

if(!productsList) return;


productsList.innerHTML="جاري تحميل المنتجات...";


try{


const snap = await getDocs(
collection(db,"products")
);


productsList.innerHTML="";


if(snap.empty){

productsList.innerHTML="لا توجد منتجات";

return;

}



snap.forEach((item)=>{


const p=item.data();


productsList.innerHTML += `

<div class="product-box">


<img 
src="${p.image || ''}" 
width="120"
loading="lazy"
onerror="this.style.display='none'"
>


<h3>
${p.name || ''}
</h3>


<p>
السعر: ${p.price || 0}
</p>


<p>
القسم: ${p.category || ''}
</p>


<button onclick="editProduct('${item.id}')">
✏️ تعديل
</button>


<button onclick="deleteProduct('${item.id}')">
🗑 حذف
</button>


</div>

`;

});


}

catch(error){

console.log(error);

productsList.innerHTML="حدث خطأ في تحميل المنتجات";

}


}


loadProducts();





// حفظ المنتج

if(saveBtn){


saveBtn.onclick = async function(){


const product={


name:name.value.trim(),

price:price.value.trim(),

category:category.value,

sizes:sizes.value.trim(),

colors:colors.value.trim(),

quantity:quantity.value.trim(),

description:description.value.trim(),

image:cleanImageUrl(image.value),

time:serverTimestamp()


};



try{


if(editId){


await updateDoc(

doc(db,"products",editId),

product

);


showMessage("✅ تم تعديل المنتج بنجاح");


editId=null;


saveBtn.innerText="💾 حفظ المنتج";


}

else{


await addDoc(

collection(db,"products"),

product

);


showMessage("✅ تم إضافة المنتج بنجاح");


}


name.value="";
price.value="";
sizes.value="";
colors.value="";
quantity.value="";
description.value="";
image.value="";


loadProducts();


}


catch(error){


console.log(error);

showMessage("❌ حدث خطأ أثناء الحفظ");


}


};


}
// حذف منتج

window.deleteProduct = async function(id){


if(!confirm("هل تريد حذف المنتج؟")) return;


try{


await deleteDoc(

doc(db,"products",id)

);


showMessage("🗑 تم حذف المنتج بنجاح");


loadProducts();


}

catch(error){

console.log(error);

showMessage("❌ حدث خطأ أثناء الحذف");

}


};







// تعديل منتج

window.editProduct = async function(id){


try{


const snap = await getDocs(
collection(db,"products")
);



snap.forEach((item)=>{


if(item.id===id){


const p=item.data();



name.value=p.name || "";

price.value=p.price || "";

category.value=p.category || "";

sizes.value=p.sizes || "";

colors.value=p.colors || "";

quantity.value=p.quantity || "";

description.value=p.description || "";

image.value=p.image || "";



editId=id;


saveBtn.innerText="💾 حفظ التعديلات";



window.scrollTo({

top:0,

behavior:"smooth"

});


}


});


}

catch(error){


console.log(error);

showMessage("❌ حدث خطأ بجلب المنتج");


}


};






// تحديث المنتجات يدوياً

window.refreshProducts=function(){

loadProducts();

};
