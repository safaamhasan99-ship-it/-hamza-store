// cart.js


let cart = JSON.parse(localStorage.getItem("cart")) || [];


// إصلاح بيانات السلة

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


        cartItems.innerHTML =
        "<h3>السلة فارغة 🛒</h3>";


        cartTotal.innerText = "0";

        return;

    }




    cart.forEach((item,index)=>{


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







// إرسال الطلب واتساب + حفظ الطلب

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






    // حفظ الطلب

    let orders =
    JSON.parse(localStorage.getItem("orders")) || [];



    let order = {


        name:name,


        phone:phone,


        address:address,


        products:cart,


        total:cart.reduce(
            (sum,item)=>
            sum + (item.price * item.qty),
            0
        ),


        date:new Date().toLocaleString()

    };



    orders.push(order);



    localStorage.setItem(

        "orders",

        JSON.stringify(orders)

    );






    // رسالة الواتساب


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




    let total =
    order.total;



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
