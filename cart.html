// products.js

import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const productsBox = document.getElementById("productsList");



async function loadProducts(){


    if(!productsBox) return;


    productsBox.innerHTML =
    "جاري تحميل المنتجات...";



    try{


        const snapshot = await getDocs(
            collection(db,"products")
        );



        productsBox.innerHTML = "";



        if(snapshot.empty){


            productsBox.innerHTML =
            "<h3>لا توجد منتجات</h3>";

            return;

        }



        snapshot.forEach((item)=>{


            const product = item.data();


            const price =
            Number(product.price) || 0;



            productsBox.innerHTML += `


            <div class="product-card">


                <img src="${product.image || ''}">


                <div class="product-info">


                    <h3>
                    ${product.name || ''}
                    </h3>



                    <p class="price">
                    ${price.toLocaleString()} د.ع
                    </p>




                    <button class="cart-btn"
                    onclick="addToCart(
                    '${product.name}',
                    ${price},
                    '${product.image}'
                    )">

                    🛒 إضافة للسلة

                    </button>



                </div>


            </div>


            `;


        });



    }catch(error){


        console.log(error);


        productsBox.innerHTML =
        "<h3>حدث خطأ في تحميل المنتجات</h3>";


    }


}



loadProducts();
