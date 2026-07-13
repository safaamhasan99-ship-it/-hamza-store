// products.js

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const productsBox = document.getElementById("productsList");


// قراءة القسم إذا كانت الصفحة خاصة بقسم معين
const category = document.body.getAttribute("data-category");




async function loadProducts(){


    if(!productsBox) return;


    productsBox.innerHTML = "جاري تحميل المنتجات...";



    try {


        const productsRef = collection(db,"products");


        let q;



        if(category){


            q = query(
                productsRef,
                where("category","==",category)
            );


        }else{


            q = productsRef;


        }



        const snapshot = await getDocs(q);



        productsBox.innerHTML = "";



        if(snapshot.empty){


            productsBox.innerHTML = `

            <h3>
            لا توجد منتجات
            </h3>

            `;

            return;


        }





        snapshot.forEach((item)=>{


            const product = item.data();



            productsBox.innerHTML += `


            <div class="product-card"
            onclick="openProduct(
            '${product.name}',
            ${product.price},
            '${product.image}'
            )">


                <img src="${product.image}" alt="${product.name}">



                <div class="product-info">


                    <h3>
                    ${product.name}
                    </h3>



                    <p class="price">
                    ${Number(product.price).toLocaleString()} د.ع
                    </p>



                    <button class="cart-btn"

                    onclick="event.stopPropagation();

                    addToCart(
                    '${product.name}',
                    ${product.price},
                    '${product.image}'
                    )">

                    🛒 إضافة للسلة

                    </button>



                </div>


            </div>


            `;



        });



    } catch(error){


        console.log(error);



        productsBox.innerHTML = `

        <h3>
        حدث خطأ في تحميل المنتجات
        </h3>

        `;


    }


}




loadProducts();
