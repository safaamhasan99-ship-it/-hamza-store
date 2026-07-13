import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// العناصر
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

        alert("يرجى إدخال اسم المنتج والسعر");
        return;

    }


    try{


        await addDoc(
            collection(db,"products"),
            {

                name:name,

                price:price,

                image:"",

                category:category,

                createdAt:serverTimestamp()

            }
        );


        alert("تمت إضافة المنتج بنجاح ✅");


        productName.value="";
        productPrice.value="";


        loadProducts();


    }catch(error){

        console.log(error);

        alert("حدث خطأ أثناء إضافة المنتج");

    }


};



// عرض المنتجات
async function loadProducts(){


    if(!productsList) return;


    productsList.innerHTML="";


    try{


        const snapshot =
        await getDocs(
            collection(db,"products")
        );



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


                <div class="product-info">


                    <h3>
                    ${product.name}
                    </h3>


                    <p>
                    ${Number(product.price).toLocaleString()} د.ع
                    </p>


                    <p>
                    القسم: ${product.category}
                    </p>



                    <button
                    class="delete-btn"
                    onclick="deleteProduct('${item.id}')">

                    🗑 حذف

                    </button>


                </div>


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


    if(!confirm("هل تريد حذف المنتج؟"))
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



// تشغيل عند فتح الصفحة
loadProducts();
