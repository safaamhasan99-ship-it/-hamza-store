/*==================================
   مجمع حمزه الشطري
==================================*/


let cart = JSON.parse(localStorage.getItem("cart")) || [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// إصلاح بيانات السلة القديمة

cart = cart.map(item => {

    return {

        name: item.name || "",

        price: Number(item.price) || 0,

        image: item.image || "",

        qty: Number(item.qty || item.quantity || 1)

    };

});


localStorage.setItem(
    "cart",
    JSON.stringify(cart)
);




// تحديث عداد السلة

function updateCartCount(){


    const count = document.getElementById("cartCount");


    if(count){


        let total = 0;


        cart.forEach(item=>{

            total += item.qty || 1;

        });


        count.innerText = total;


    }

}


updateCartCount();





// إضافة للسلة

window.addToCart = function(name,price,image){


    const index = cart.findIndex(
        item => item.name === name
    );



    if(index !== -1){


        cart[index].qty =
        (cart[index].qty || 1) + 1;


        cart[index].price =
        Number(price);


        cart[index].image =
        image;


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






// إضافة للمفضلة

window.addToFavorites = function(name,price,image){


    let exists =
    favorites.find(
        item=>item.name === name
    );



    if(exists){

        alert("❤️ المنتج موجود");

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






// تفاصيل المنتج

window.openProduct = function(name,price,image){


    localStorage.setItem(

        "product",

        JSON.stringify({

            name:name,

            price:Number(price),

            image:image

        })

    );


    window.location.href="details.html";


};






// البحث

const searchInput =
document.getElementById("searchInput");


if(searchInput){


searchInput.addEventListener("keyup",function(){


let value =
this.value.toLowerCase();



document.querySelectorAll(".product-card")
.forEach(product=>{


let title =
product.querySelector("h3")
.textContent
.toLowerCase();



product.style.display =
title.includes(value)
? ""
: "none";



});


});


}






// الوضع الليلي

const darkBtn =
document.getElementById("darkBtn");



if(localStorage.getItem("theme") === "dark"){

document.body.classList.add("dark");

}



if(darkBtn){


darkBtn.onclick=function(){


document.body.classList.toggle("dark");



localStorage.setItem(

"theme",

document.body.classList.contains("dark")
? "dark"
: "light"

);



};


}






// شاشة التحميل

window.addEventListener("load",function(){


const loader =
document.getElementById("loader");


if(loader){


setTimeout(()=>{

loader.classList.add("hide");

},1200);


}


});
