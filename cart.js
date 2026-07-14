// cart.js


let cart = JSON.parse(localStorage.getItem("cart")) || [];


// إصلاح الكمية القديمة

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



const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");




// عرض السلة

function renderCart(){


    if(!cartItems) return;


    cartItems.innerHTML = "";


    let total = 0;



    if(cart.length === 0){


        cartItems.innerHTML = `
        <h3>السلة فارغة 🛒</h3>
        `;


        if(cartTotal){

            cartTotal.innerText="0";

        }


        return;

    }




    cart.forEach((item,index)=>{


        item.qty = item.qty || 1;


        let sum = item.price * item.qty;


        total += sum;



        cartItems.innerHTML += `


        <div class="cart-item">


            <img src="${item.image}">


            <div class="cart-info">


                <h3>
                ${item.name}
                </h3>


                <p class="price">

                ${Number(item.price).toLocaleString()} د.ع

                </p>



                <div class="qty">


                    <button 
                    class="qty-btn"
                    onclick="changeQty(${index},1)">
                    +
                    </button>



                    <span>
                    ${item.qty}
                    </span>



                    <button 
                    class="qty-btn"
                    onclick="changeQty(${index},-1)">
                    -
                    </button>


                </div>


            </div>



            <button 
            class="remove-btn"
            onclick="removeItem(${index})">

            🗑 حذف

            </button>


        </div>


        `;


    });



    cartTotal.innerText =
    total.toLocaleString();



    saveCart();


}




// زيادة ونقصان الكمية

function changeQty(index,amount){


    cart[index].qty =
    (cart[index].qty || 1) + amount;



    if(cart[index].qty < 1){

        cart[index].qty = 1;

    }



    saveCart();


    renderCart();


}



window.changeQty = changeQty;





// حذف المنتج

function removeItem(index){


    cart.splice(index,1);


    saveCart();


    renderCart();


}



window.removeItem = removeItem;





// حفظ السلة

function saveCart(){


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


}






// إرسال واتساب

window.sendWhatsAppOrder = function(){



    if(cart.length === 0){

        alert("السلة فارغة");

        return;

    }



    let name =
    document.getElementById("customerName").value;


    let phone =
    document.getElementById("customerPhone").value;


    let address =
    document.getElementById("customerAddress").value;



    let message = 
`🛒 طلب جديد - مجمع حمزه الشطري

👤 الاسم: ${name}

📱 الهاتف: ${phone}

📍 العنوان: ${address}

📦 المنتجات:
`;



    let total=0;



    cart.forEach(item=>{


        let price =
        item.price * item.qty;


        total += price;



        message += `

${item.name}

الكمية: ${item.qty}

السعر: ${price.toLocaleString()} د.ع

`;

    });



    message += `

💰 المجموع:
${total.toLocaleString()} د.ع
`;



    let link =
    "https://wa.me/9647813555538?text="
    + encodeURIComponent(message);



    window.open(link,"_blank");


};





renderCart();
