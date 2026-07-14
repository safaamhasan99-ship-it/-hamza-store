import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const productsBox = document.getElementById("productsList");


async function loadProducts(){

    if(!productsBox) return;


    productsBox.innerHTML = `
    <h3>جاري تحميل المنتجات...</h3>
    `;


    try{

        const snapshot = await getDocs(
            collection(db,"products")
        );


        productsBox.innerHTML = "";


        let category = new URLSearchParams(
            window.location.search
        ).get("category");


        let found = false;


        snapshot.forEach((item)=>{


            const product = item.data();


            // عرض المنتجات حسب القسم
            if(
                !category ||
                product.category === category
            ){


                found = true;


                const name = product.name || "منتج";
                const price = Number(product.price) || 0;
                const image = product.image || 
                "5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png";


                productsBox.innerHTML += `

                <div class="product-card">


                    <img src="${image}" 
                    alt="${name}"
                    onerror="this.src='5FBF3B90-553B-424D-A9B1-1BE2F7F9362B.png'">


                    <div class="product-info">


                        <h3>
                        ${name}
                        </h3>


                        <p class="price">
                        ${price.toLocaleString()} د.ع
                        </p>



                        <button class="cart-btn"
                        onclick="addToCart(
                        '${name.replace(/'/g,"\\'")}',
                        ${price},
                        '${image}'
                        )">

                        🛒 إضافة للسلة

                        </button>


                    </div>


                </div>

                `;


            }


        });



        if(!found){

            productsBox.innerHTML = `
            <h3>
            لا توجد منتجات
            </h3>
            `;

        }



    }catch(error){

        console.log(error);


        productsBox.innerHTML = `
        <h3>
        حدث خطأ في تحميل المنتجات
        </h3>
        `;

    }


}


loadProducts();
