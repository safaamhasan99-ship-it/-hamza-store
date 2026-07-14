// cart.js


let cart = JSON.parse(localStorage.getItem("cart")) || [];


// إصلاح الكمية والسعر

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



const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");




// عرض السلة

function renderCart(){


    if(!cartItems) return;


    cartItems.innerHTML = "";


    let total = 0;



    if(cart.length === 0){


        cartItems.innerHTML =
        "<h3>السلة فارغة 🛒</h3>";


        if(cartTotal){

            cartTotal.innerText="0";

        }


        return;

    }





    cart.forEach((item,index)=>{


        let sum =
        item.price * item.qty;


        total += sum;



        cartItems.innerHTML += `


        <div class="cart-item">


            <img src="${item.image}">


            <div class="cart-info">


                <h3>
                ${item.name}
                </h3>


                <p class="price">
                ${item.price.toLocaleString()} د.ع
                </p>



                <div class="qty">


                    <button onclick="changeQty(${index},1)">
                    +
                    </button>



                    <span>
                    ${item.qty}
                    </span>



                    <button onclick="changeQty(${index},-1)">
                    -
                    </button>


                </div>


            </div>




            <button class="remove-btn"
            onclick="removeItem(${index})">

            🗑 حذف

            </button>



        </div>


        `;


    });



    cartTotal.innerText =
    total.toLocaleString();



}





// تغيير الكمية

window.changeQty = function(index,amount){


    cart[index].qty += amount;



    if(cart[index].qty < 1){

        cart[index].qty = 1;

    }



    saveCart();

    renderCart();


};





// حذف المنتج

window.removeItem = function(index){


    cart.splice(index,1);


    saveCart();

    renderCart();


};






// حفظ السلة

function saveCart(){


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


}







// واتساب

window.sendWhatsAppOrder = function(){



    if(cart.length === 0){


        alert("السلة فارغة");


        return;

    }



    let message =

`🛒 طلب جديد - مجمع حمزه الشطري

📦 المنتجات:
`;



    let total = 0;



    cart.forEach(item=>{


        let sum =
        item.price * item.qty;


        total += sum;



        message += `

${item.name}

الكمية: ${item.qty}

السعر: ${sum.toLocaleString()} د.ع

`;

    });



    message += `

💰 المجموع:
${total.toLocaleString()} د.ع
`;



    let url =

    "https://wa.me/9647813555538?text="

    + encodeURIComponent(message);



    window.open(url,"_blank");


};





renderCart();
