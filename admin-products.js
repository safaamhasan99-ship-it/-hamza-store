import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// إضافة منتج

window.addProduct = async function(){


let name =
document.getElementById("productName").value;


let price =
document.getElementById("productPrice").value;


let image =
document.getElementById("productImage").value;


let category =
document.getElementById("productCategory").value;



if(name==="" || price==="" || image===""){

alert("املأ جميع البيانات");

return;

}



await addDoc(
collection(db,"products"),
{

name:name,

price:Number(price),

image:image,

category:category,

createdAt:serverTimestamp()

}

);



alert("تم إضافة المنتج ✅");



document.getElementById("productName").value="";

document.getElementById("productPrice").value="";

document.getElementById("productImage").value="";


loadProducts();


};




// عرض المنتجات

async function loadProducts(){


const box =
document.getElementById("productsList");


if(!box) return;



box.innerHTML="";



const snapshot =
await getDocs(
collection(db,"products")
);



snapshot.forEach((item)=>{


let product=item.data();



box.innerHTML += `


<div class="product-card">


<img src="${product.image}">



<h3>
${product.name}
</h3>



<p>
${product.price} د.ع
</p>



<button onclick="deleteProduct('${item.id}')">

حذف

</button>


</div>


`;



});


}




// حذف منتج

window.deleteProduct = async function(id){


await deleteDoc(

doc(db,"products",id)

);



alert("تم حذف المنتج");


loadProducts();


};




loadProducts();
