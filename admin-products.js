// admin-products.js


import { db } from "./firebase.js";


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



// متغير التعديل

let editId = null;



// تحميل المنتجات

async function loadProducts(){


    productsList.innerHTML = "";


    const snap = await getDocs(
        collection(db,"products")
    );


    snap.forEach((item)=>{


        const p = item.data();


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


        // تعديل منتج موجود

        if(editId){


            await updateDoc(

                doc(db,"products",editId),

                product

            );


            alert("تم تعديل المنتج بنجاح");


            editId = null;


            saveBtn.innerText = "💾 حفظ المنتج";


        }


        // إضافة منتج جديد

        else{


            await addDoc(

                collection(db,"products"),

                product

            );


            alert("تم إضافة المنتج بنجاح");


        }



        // تنظيف الحقول

        name.value = "";

        price.value = "";

        category.value = "";

        sizes.value = "";

        colors.value = "";

        quantity.value = "";

        description.value = "";

        image.value = "";

        offer.checked = false;



        loadProducts();



    }

    catch(error){


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



        alert("تم حذف المنتج بنجاح");



        loadProducts();



    }

    catch(error){


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


    }


    catch(error){


        console.log(error);


        alert("حدث خطأ بجلب المنتج");


    }


};
// حماية عند فتح الصفحة

window.addEventListener("DOMContentLoaded",()=>{


    if(!productsList){

        console.log("لم يتم العثور على قائمة المنتجات");

        return;

    }


});




// إعادة تحميل المنتجات عند الرجوع للصفحة

window.refreshProducts = function(){

    loadProducts();

};
