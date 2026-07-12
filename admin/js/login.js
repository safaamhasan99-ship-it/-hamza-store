import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const productsRef = collection(db,"products");


let editId = null;


// تحميل المنتجات

export async function loadProducts(){

const container = document.getElementById("products");

if(!container) return;


container.innerHTML="";


const snapshot = await getDocs(productsRef);


snapshot.forEach((item)=>{

const p = item.data();


container.innerHTML += `

<div class="card">


<img src="${p.image}" alt="${p.name}">


<div class="card-body">


<h3>${p.name}</h3>


<div class="price">
${p.price} د.ع
</div>


<div class="category">
${p.category}
</div>


<p>
${p.description || ""}
</p>


<div class="actions">


<button class="edit" onclick="editProduct('${item.id}')">

تعديل

</button>



<button class="delete" onclick="removeProduct('${item.id}')">

حذف

</button>


</div>


</div>


</div>

`;

});


}



// حذف منتج

window.removeProduct = async function(id){


if(!confirm("هل تريد حذف المنتج؟")) return;


await deleteDoc(doc(db,"products",id));


alert("تم حذف المنتج");


loadProducts();


};




// فتح التعديل

window.editProduct = async function(id){


const snap = await getDoc(doc(db,"products",id));


const p = snap.data();


editId = id;



document.getElementById("name").value = p.name;

document.getElementById("price").value = p.price;

document.getElementById("category").value = p.category;

document.getElementById("description").value = p.description || "";

document.getElementById("image").value = p.image;



document.getElementById("saveBtn").innerText = "حفظ التعديلات";


};





// حفظ منتج أو تحديثه

window.saveProduct = async function(){


const name =
document.getElementById("name").value.trim();


const price =
document.getElementById("price").value.trim();


const category =
document.getElementById("category").value;


const description =
document.getElementById("description").value.trim();


const image =
document.getElementById("image").value.trim();



if(!name || !price || !image){

alert("يرجى ملء الحقول المطلوبة");

return;

}



const product = {


name:name,

price:Number(price),

category:category,

description:description,

image:image,

updatedAt:new Date()

};



try{


if(editId){


await updateDoc(
doc(db,"products",editId),
product
);


alert("تم تعديل المنتج");


editId=null;


document.getElementById("saveBtn").innerText="إضافة المنتج";


}else{


product.createdAt=new Date();


await addDoc(productsRef,product);


alert("تمت إضافة المنتج");


}



clearForm();


loadProducts();



}catch(error){


console.error(error);


alert("حدث خطأ بالحفظ");


}



};





// تنظيف الحقول

function clearForm(){


document.getElementById("name").value="";

document.getElementById("price").value="";

document.getElementById("description").value="";

document.getElementById("image").value="";


document.getElementById("category").selectedIndex=0;


}





// تشغيل زر الحفظ

const saveBtn=document.getElementById("saveBtn");


if(saveBtn){

saveBtn.addEventListener("click",saveProduct);

}




// تشغيل عند فتح الصفحة

loadProducts();
