// admin.js

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// حفظ المنتج
window.saveProduct = async function(){

    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const image = document.getElementById("image").value.trim();
    const category = document.getElementById("category").value.trim();


    if(!name || !price){

        alert("اكتب اسم المنتج والسعر");
        return;

    }


    try{

        await addDoc(collection(db,"products"),{

            name:name,
            price:Number(price),
            image:image,
            category:category,
            createdAt:serverTimestamp()

        });


        alert("تم حفظ المنتج بنجاح");


        document.getElementById("name").value="";
        document.getElementById("price").value="";
        document.getElementById("image").value="";
        document.getElementById("category").value="";


        loadProducts();


    }catch(error){

        console.log(error);
        alert("حدث خطأ في الحفظ");

    }

};



// عرض المنتجات
window.loadProducts = async function(){

    const box = document.getElementById("productsList");


    box.innerHTML="";


    const querySnapshot = await getDocs(collection(db,"products"));


    if(querySnapshot.empty){

        box.innerHTML="<h3>لا توجد منتجات</h3>";
        return;

    }



    querySnapshot.forEach((doc)=>{


        const product = doc.data();


        box.innerHTML += `

        <div class="product-admin">

            <img src="${product.image}" width="80">

            <h3>${product.name}</h3>

            <p>السعر: ${product.price}</p>

            <p>${product.category}</p>

        </div>

        `;


    });


};



// تشغيل التحميل عند فتح الصفحة
window.onload=function(){

    loadProducts();

};
