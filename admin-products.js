import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// تشغيل بعد تحميل الصفحة
window.addEventListener("DOMContentLoaded", ()=>{


const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productsList = document.getElementById("productsList");



// إضافة منتج
window.addProduct = async function(){


    const name = productName.value.trim();

    const price = Number(productPrice.value);

    const category = productCategory.value;



    if(!name || !price){


        alert("اكتب اسم المنتج والسعر");

        return;

    }



    try{


        await addDoc(
            collection(db,"products"),
            {

                name:name,

                price:price,

                category:category,

                image:"",

                createdAt:serverTimestamp()

            }
        );



        alert("تمت إضافة المنتج بنجاح ✅");



        productName.value="";

        productPrice.value="";



        loadProducts();



    }catch(error){


        console.log(error);

        alert("خطأ في إضافة المنتج");


    }



};





// عرض المنتجات
async function loadProducts(){


    if(!productsList) return;



    productsList.innerHTML="جاري التحميل...";



    try{


        const snapshot =
        await getDocs(
            collection(db,"products")
        );



        productsList.innerHTML="";



        if(snapshot.empty){


            productsList.innerHTML=`

            <div class="empty-box">
            لا توجد منتجات
            </div>

            `;


            return;

        }




        snapshot.forEach((item)=>{


            const product=item.data();



            productsList.innerHTML += `


            <div class="product-card">


                <h3>
                ${product.name}
                </h3>


                <p>
                السعر:
                ${product.price} د.ع
                </p>


                <p>
                القسم:
                ${product.category}
                </p>


                <button
                onclick="deleteProduct('${item.id}')">

                🗑 حذف

                </button>



            </div>


            `;



        });



    }catch(error){


        console.log(error);


        productsList.innerHTML=
        "حدث خطأ أثناء تحميل المنتجات";


    }


}




// حذف منتج
window.deleteProduct = async function(id){


    if(!confirm("حذف المنتج؟"))
    return;



    try{


        await deleteDoc(
            doc(db,"products",id)
        );


        alert("تم الحذف ✅");


        loadProducts();



    }catch(error){


        console.log(error);


    }


};




// زر تحديث
window.refreshProducts=function(){

    loadProducts();

};




// تشغيل العرض
loadProducts();


});
