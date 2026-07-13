import { db, storage } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";



const saveBtn = document.getElementById("saveBtn");


saveBtn.onclick = async function(){


const name = document.getElementById("name").value;
const price = document.getElementById("price").value;
const category = document.getElementById("category").value;
const sizes = document.getElementById("sizes").value;
const colors = document.getElementById("colors").value;
const quantity = document.getElementById("quantity").value;
const description = document.getElementById("description").value;
const offer = document.getElementById("offer").checked;

const imageFile = document.getElementById("imageFile").files[0];


if(!name || !price){

alert("اكتب اسم المنتج والسعر");
return;

}


try{


let imageURL="";


if(imageFile){

const imageRef = ref(storage,"products/"+Date.now()+"_"+imageFile.name);

await uploadBytes(imageRef,imageFile);

imageURL = await getDownloadURL(imageRef);

}



await addDoc(collection(db,"products"),{

name,
price,
category,
sizes,
colors,
quantity,
description,
offer,
image:imageURL,
createdAt:serverTimestamp()

});


alert("تم إضافة المنتج بنجاح");


loadProducts();


}catch(error){

console.log(error);

alert("خطأ: "+error.message);

}


};





async function loadProducts(){


const box=document.getElementById("products");

box.innerHTML="";


const snap = await getDocs(collection(db,"products"));



if(snap.empty){

box.innerHTML="<h3>لا توجد منتجات</h3>";

return;

}



snap.forEach(doc=>{


let p=doc.data();


box.innerHTML += `

<div class="card">

<img src="${p.image}">

<div class="card-body">

<h3>${p.name}</h3>

<p>السعر: ${p.price}</p>

<p>${p.category}</p>

</div>

</div>

`;


});


}



loadProducts();
