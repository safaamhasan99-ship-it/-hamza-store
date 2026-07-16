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

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const sizesInput = document.getElementById("sizes");
const colorsInput = document.getElementById("colors");
const quantityInput = document.getElementById("quantity");
const descriptionInput = document.getElementById("description");
const imageInput = document.getElementById("image");

const saveBtn = document.getElementById("saveBtn");

const productsList = document.getElementById("products");


let editId = null;



// رسالة

function showMessage(text){

const toast = document.createElement("div");

toast.innerHTML = text;

toast.style.position="fixed";
toast.style.bottom="30px";
toast.style.right="30px";
toast.style.background="#198754";
toast.style.color="#fff";
toast.style.padding="15px 25px";
toast.style.borderRadius="15px";
toast.style.zIndex="9999";
toast.style.fontFamily="Cairo";
toast.style.fontWeight="bold";

document.body.appendChild(toast);


setTimeout(()=>{

toast.remove();

},2500);


}




// تنظيف رابط الصورة

function cleanImageUrl(url){

if(!url) return "";

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



snap.forEach(item=>{


const p=item.data();



productsList.innerHTML += `


<div class="card">


<img src="${p.image || ''}">



<div class="card-body">


<h3>${p.name || ""}</h3>


<p>
السعر: ${p.price || 0}
</p>


<p>
القسم: ${p.category || ""}
</p>



<button onclick="editProduct('${item.id}')">

✏️ تعديل

</button>



<button onclick="deleteProduct('${item.id}')">

🗑 حذف

</button>



</div>


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
// حفظ وإضافة وتعديل المنتج

if(saveBtn){


saveBtn.onclick = async ()=>{


const product = {


name:nameInput.value.trim(),

price:priceInput.value.trim(),

category:categoryInput.value,

sizes:sizesInput.value.trim(),

colors:colorsInput.value.trim(),

quantity:quantityInput.value.trim(),

description:descriptionInput.value.trim(),

image:cleanImageUrl(imageInput.value)


};



try{


// تعديل منتج موجود

if(editId){


await updateDoc(

doc(db,"products",editId),

{

name:product.name,

price:product.price,

category:product.category,

sizes:product.sizes,

colors:product.colors,

quantity:product.quantity,

description:product.description,

image:product.image

}

);



showMessage("✅ تم تعديل المنتج بنجاح");


editId=null;


saveBtn.innerText="💾 حفظ المنتج";


}



// إضافة منتج جديد

else{


await addDoc(

collection(db,"products"),

{

...product,

time:serverTimestamp()

}

);



showMessage("✅ تم إضافة المنتج بنجاح");


}





// تفريغ الحقول


nameInput.value="";

priceInput.value="";

sizesInput.value="";

colorsInput.value="";

quantityInput.value="";

descriptionInput.value="";

imageInput.value="";

categoryInput.selectedIndex=0;



loadProducts();



}


catch(error){


console.log(error);


showMessage(
"❌ حدث خطأ أثناء الحفظ: "+error.message
);


}



};


}







// حذف المنتج


window.deleteProduct = async function(id){


if(!confirm("هل تريد حذف المنتج؟"))
return;



try{


await deleteDoc(

doc(db,"products",id)

);



showMessage("🗑 تم حذف المنتج بنجاح");


loadProducts();



}

catch(error){


console.log(error);


showMessage(
"❌ حدث خطأ أثناء الحذف"
);


}



};
// تعديل المنتج

window.editProduct = async function(id){


try{


const snap = await getDocs(
collection(db,"products")
);



snap.forEach(item=>{


if(item.id === id){


const p=item.data();



nameInput.value = p.name || "";

priceInput.value = p.price || "";

categoryInput.value = p.category || "";

sizesInput.value = p.sizes || "";

colorsInput.value = p.colors || "";

quantityInput.value = p.quantity || "";

descriptionInput.value = p.description || "";

imageInput.value = p.image || "";



editId = id;



saveBtn.innerText =
"💾 حفظ التعديلات";



window.scrollTo({

top:0,

behavior:"smooth"

});


}



});


}

catch(error){


console.log(error);


showMessage(
"❌ حدث خطأ بجلب المنتج"
);


}



};





// تحديث المنتجات يدوياً

window.refreshProducts = function(){

loadProducts();

};
