//==================================
// مجمع حمزه الشطري
// Professional Cart JS
//==================================


let cart = JSON.parse(localStorage.getItem("cart")) || [];


// تنظيف بيانات السلة

cart = cart.map(item => ({

    name: item.name || "",

    price: Number(item.price) || 0,

    image: item.image || "",

    qty: Number(item.qty || item.quantity || 1)

}));


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

        <div class="empty-cart">

        <h3>
        السلة فارغة 🛒
        </h3>

        </div>

        `;


        if(cartTotal){

            cartTotal.innerText = "0 د.ع";

        }


        return;

    }





    cart.forEach((item,index)=>{


        let sum = item.price * item.qty;


        total += sum;




        cartItems.innerHTML += `


        <div class="cart-item">



            <img 
            class="cart-image"
            src="${item.image}"
            >




            <div class="cart-info">



                <h3>
                ${item.name}
                </h3>




                <p class="cart-price">

                ${item.price.toLocaleString()} د.ع

                </p>




                <div class="qty-box">



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




                <button 
                class="delete-cart"
                onclick="removeItem(${index})">

                🗑 حذف

                </button>




            </div>



        </div>


        `;



    });




    if(cartTotal){

        cartTotal.innerText =
        total.toLocaleString() + " د.ع";

    }


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







// إرسال الطلب واتساب

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





    if(!name || !phone || !address){


        alert("اكمل معلومات الزبون");


        return;

    }







    let orders =

    JSON.parse(localStorage.getItem("orders")) || [];





    let order = {


        name:name,


        phone:phone,


        address:address,


        products:cart,


        total:cart.reduce(

        (sum,item)=>{

        return sum + (item.price * item.qty);

        },0),


        date:new Date().toLocaleString()


    };





    orders.push(order);



    localStorage.setItem(

        "orders",

        JSON.stringify(orders)

    );








    let message =

`🛒 طلب جديد - مجمع حمزه الشطري


👤 الاسم:
${name}


📱 الهاتف:
${phone}


📍 العنوان:
${address}


📦 المنتجات:
`;





    cart.forEach(item=>{


        message += `


${item.name}

الكمية: ${item.qty}

السعر:
${(item.price * item.qty).toLocaleString()} د.ع


`;

    });





    message += `


💰 المجموع:

${order.total.toLocaleString()} د.ع

`;






    let url =

    "https://wa.me/9647813555538?text="

    + encodeURIComponent(message);





    window.open(url,"_blank");



};







renderCart();
