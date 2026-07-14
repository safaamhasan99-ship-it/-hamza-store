/*==================================
   مجمع حمزه الشطري
==================================*/


// ===============================
// السلة والمفضلة
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];



// إصلاح المنتجات القديمة

cart = cart.map(item => {

    return {
        ...item,
        qty: item.qty || item.quantity || 1
    };

});


localStorage.setItem(
    "cart",
    JSON.stringify(cart)
);




// ===============================
// تحديث عداد السلة
// ===============================

function updateCartCount() {


    const count = document.getElementById("cartCount");


    if(count){


        let total = 0;


        cart.forEach(item=>{

            total += item.qty || 1;

        });


        count.textContent = total;


    }


}


updateCartCount();




// ===============================
// إضافة إلى السلة
// ===============================

window.addToCart = function(name, price, image){


    const index = cart.findIndex(
        item => item.name === name
    );



    if(index !== -1){


        cart[index].qty++;


    }else{


        cart.push({

            name:name,

            price:Number(price),

            image:image,

            qty:1

        });


    }




    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );



    updateCartCount();



    alert("✅ تمت إضافة المنتج إلى السلة");


};




// ===============================
// إضافة إلى المفضلة
// ===============================

window.addToFavorites = function(name,price,image){


    const exists =
    favorites.find(
        item=>item.name===name
    );



    if(exists){


        alert("❤️ المنتج موجود بالفعل");


        return;

    }



    favorites.push({

        name:name,

        price:Number(price),

        image:image

    });



    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    alert("❤️ تمت الإضافة للمفضلة");


};




// ===============================
// صفحة التفاصيل
// ===============================

window.openProduct = function(name,price,image){


    const product={

        name:name,

        price:Number(price),

        image:image

    };


    localStorage.setItem(
        "product",
        JSON.stringify(product)
    );


    window.location.href="details.html";


};




// ===============================
// السلايدر
// ===============================

const slides =
document.querySelectorAll(".hero-slide");


let current=0;



function slider(){


    if(!slides.length) return;



    slides.forEach(slide=>{

        slide.classList.remove("active");

    });



    slides[current].classList.add("active");



    current++;



    if(current>=slides.length){

        current=0;

    }


}



if(slides.length){


    slider();


    setInterval(slider,4000);


}




// ===============================
// البحث
// ===============================

const searchInput =
document.getElementById("searchInput");



if(searchInput){


searchInput.addEventListener("keyup",function(){


const value=this.value.toLowerCase();



document.querySelectorAll(".product-card")
.forEach(product=>{


const title =
product.querySelector("h3").textContent.toLowerCase();



if(title.includes(value)){


product.style.display="";


}else{


product.style.display="none";


}



});



});


}




// ===============================
// الوضع الليلي
// ===============================

const darkBtn =
document.getElementById("darkBtn");



if(localStorage.getItem("theme")==="dark"){


document.body.classList.add("dark");


}



if(darkBtn){


darkBtn.addEventListener("click",function(){


document.body.classList.toggle("dark");



if(document.body.classList.contains("dark")){


localStorage.setItem("theme","dark");


}else{


localStorage.setItem("theme","light");


}



});


}




// ===============================
// تشغيل عند فتح الصفحة
// ===============================

document.addEventListener("DOMContentLoaded",function(){


updateCartCount();


});




// ===============================
// شاشة التحميل
// ===============================

window.addEventListener("load",function(){


const loader =
document.getElementById("loader");



if(loader){


setTimeout(function(){


loader.classList.add("hide");


},1200);


}


});
