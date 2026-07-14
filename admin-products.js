// admin-products.js

import { db, storage } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
doc,
deleteDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// عناصر الصفحة

const name = document.getElementById("name");
const price = document.getElementById("price");
const category = document.getElementById("category");
const sizes = document.getElementById("sizes");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const description = document.getElementById("description");
const image = document.getElementById("image");
const offer = document.getElementById("offer");

const saveBtn = document.getElementById("saveBtn");
const productsList = document.getElementById("productsList");


// رقم المنتج عند التعديل

let editId = null;


// تحميل المنتجات

async function loadProducts(){

    productsList.innerHTML="";

    const snap = await getDocs(collection(db,"products"));


    snap.forEach((item)=>{

        const p=item.data();


        productsList.innerHTML += `

        <div class="product-box">

        <img src="${p.image}" width="100">

        <h3>${p.name}</h3>

        <p>السعر: ${p.price}</p>

        <p>القسم: ${p.category}</p>


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


loadProducts();
// حفظ المنتج

saveBtn.onclick = async function(){


    const product = {

        name: name.value.trim(),

        price: price.value.trim(),

        category: category.value,

        sizes: sizes.value.trim(),

        colors: colors.value.trim(),

        quantity: quantity.value.trim(),

        description: description.value.trim(),

        image: image.value.trim(),

        offer: offer.checked,

        time: serverTimestamp()

    };



    try{


        // إذا يوجد رقم تعديل

        if(editId){


            await updateDoc(
                doc(db,"products",editId),
                product
            );


            alert("تم تعديل المنتج بنجاح");


            editId=null;


            saveBtn.innerText="💾 حفظ المنتج";


        }

        else{


            await addDoc(
                collection(db,"products"),
                product
            );


            alert("تم إضافة المنتج بنجاح");


        }



        // تفريغ الحقول

        name.value="";
        price.value="";
        category.value="";
        sizes.value="";
        colors.value="";
        quantity.value="";
        description.value="";
        image.value="";
        offer.checked=false;



        loadProducts();



    }catch(error){


        console.log(error);

        alert("حدث خطأ أثناء الحفظ");


    }


};
// حذف منتج

window.deleteProduct = async function(id){

    if(!confirm("هل تريد حذف المنتج؟")) return;


    try{


        await deleteDoc(
            doc(db,"products",id)
        );


        alert("تم حذف المنتج");


        loadProducts();



    }catch(error){


        console.log(error);

        alert("حدث خطأ أثناء الحذف");


    }


};




// تعديل منتج

window.editProduct = async function(id){


    try{


        const snap = await getDocs(
            collection(db,"products")
        );



        snap.forEach((item)=>{


            if(item.id === id){


                const p = item.data();



                name.value = p.name || "";

                price.value = p.price || "";

                category.value = p.category || "";

                sizes.value = p.sizes || "";

                colors.value = p.colors || "";

                quantity.value = p.quantity || "";

                description.value = p.description || "";

                image.value = p.image || "";

                offer.checked = p.offer || false;



                editId = id;


                saveBtn.innerText = "💾 حفظ التعديلات";



                window.scrollTo({

                    top:0,

                    behavior:"smooth"

                });



            }


        });



    }catch(error){


        console.log(error);

        alert("حدث خطأ بجلب المنتج");


    }


};
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>إدارة المنتجات</title>

<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800&display=swap" rel="stylesheet">


<style>

body{

font-family:Cairo;
background:#f5f5f5;
padding:20px;

}


.container{

max-width:900px;
margin:auto;
background:white;
padding:20px;
border-radius:15px;

}


input,textarea,select{

width:100%;
padding:12px;
margin:8px 0;
border:1px solid #ddd;
border-radius:8px;
font-family:Cairo;

}


button{

padding:12px 20px;
border:0;
border-radius:8px;
cursor:pointer;
background:#c99700;
color:white;
font-weight:bold;

}


.product-box{

background:#fafafa;
padding:15px;
margin-top:15px;
border-radius:10px;
border:1px solid #ddd;

}


.product-box img{

border-radius:10px;

}


</style>

</head>


<body>


<div class="container">


<h2>🛒 إدارة المنتجات</h2>


<input id="name" placeholder="اسم المنتج">


<input id="price" placeholder="السعر">


<select id="category">

<option value="">اختر القسم</option>

<option>رجالي</option>

<option>نسائي</option>

<option>ولادي</option>

<option>بناتي</option>

<option>جوارب</option>

</select>


<input id="sizes" placeholder="القياسات">


<input id="colors" placeholder="الألوان">


<input id="quantity" placeholder="الكمية">


<textarea id="description" placeholder="وصف المنتج"></textarea>


<input id="image" placeholder="رابط صورة المنتج">


<label>

<input type="checkbox" id="offer">

عرض خاص

</label>


<br><br>


<button id="saveBtn">
💾 حفظ المنتج
</button>



<hr>


<h3>المنتجات</h3>


<div id="productsList"></div>



</div>



<script type="module" src="admin-products.js"></script>


</body>

</html>
