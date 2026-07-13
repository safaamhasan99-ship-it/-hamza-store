// admin-products.js

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



async function loadProducts(){


    const box = document.getElementById("products");


    if(!box) return;


    box.innerHTML = "";


    const snap = await getDocs(
        collection(db,"products")
    );


    if(snap.empty){

        box.innerHTML="<h3>لا توجد منتجات</h3>";
        return;

    }



    snap.forEach((doc)=>{


        const p = doc.data();


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




if(saveBtn){


saveBtn.onclick = async function(){



const name = document.getElementById("name").value.trim();

const price = document.getElementById("price").value.trim();

const category = document.getElementById("category").value;

const sizes = document.getElementById("sizes").value;

const colors = document.getElementById("colors").value;

const quantity = document.getElementById("quantity").value;

const description = document.getElementById("description").value;

const offer = document.getElementById("offer").checked;

const imageFile =
document.getElementById("imageFile").files[0];



if(!name || !price){

alert("اكتب اسم المنتج والسعر");
return;

}



try{


let imageURL="";


if(imageFile){


const imageRef = ref(
storage,
"products/"+Date.now()+"_"+imageFile.name
);


await uploadBytes(
imageRef,
imageFile
);


imageURL = await getDownloadURL(imageRef);


}



await addDoc(
collection(db,"products"),
{

name:name,

price:Number(price),

category:category,

sizes:sizes,

colors:colors,

quantity:Number(quantity),

description:description,

offer:offer,

image:imageURL,

createdAt:serverTimestamp()

}

);



alert("تم حفظ المنتج بنجاح");


loadProducts();



}catch(error){


console.log(error);


alert(error.message);


}



};


}



loadProducts();
