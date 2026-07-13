let cart = JSON.parse(localStorage.getItem("cart")) || [];


function showCart(){

    const cartList = document.getElementById("cartList");
    const totalBox = document.getElementById("total");
    const orderBtn = document.getElementById("orderWhatsapp");


    if(!cartList || !totalBox || !orderBtn){
        console.log("عناصر السلة غير موجودة");
        return;
    }


    cartList.innerHTML = "";


    let total = 0;

    let message = "السلام عليكم، أريد طلب:\n\n";



    if(cart.length === 0){

        cartList.innerHTML = `

        <div class="about-box">

            <h2>
            🛒 السلة فارغة
            </h2>

            <p>
            لم يتم إضافة منتجات
            </p>

        </div>

        `;


        totalBox.innerHTML = "0 د.ع";

        orderBtn.href = "#";

        return;

    }



    cart.forEach((item,index)=>{


        let price = Number(item.price) || 0;


        let quantity = Number(
            item.quantity || item.qty || 1
        );


        let itemTotal = price * quantity;


        total += itemTotal;



        message +=
        "• " + item.name + "\n" +
        "الكمية: " + quantity + "\n" +
        "السعر: " + price.toLocaleString() + " د.ع\n" +
        "--------------------\n";



        cartList.innerHTML += `


        <div class="product-card">


            <img src="${item.image}" alt="${item.name}">



            <div class="product-info">


                <h3>
                ${item.name}
                </h3>



                <p class="price">

                ${price.toLocaleString()} د.ع

                </p>



                <div class="quantity-box">


                    <button class="cart-btn"
                    onclick="changeQuantity(${index},-1)">
                    ➖
                    </button>



                    <span>
                    ${quantity}
                    </span>



                    <button class="cart-btn"
                    onclick="changeQuantity(${index},1)">
                    ➕
                    </button>


                </div>



                <p class="item-total">

                المجموع:
                ${itemTotal.toLocaleString()} د.ع

                </p>



                <button class="favorite"
                onclick="removeCart(${index})">

                🗑 حذف المنتج

                </button>


            </div>


        </div>


        `;


    });



    totalBox.innerHTML =
    total.toLocaleString()+" د.ع";



    message +=
    "\n💰 المجموع الكلي: " +
    total.toLocaleString() +
    " د.ع";



    orderBtn.href =
    "https://wa.me/9647813555538?text=" +
    encodeURIComponent(message);



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


}





function changeQuantity(index,value){


    let quantity = Number(
        cart[index].quantity ||
        cart[index].qty ||
        1
    );


    quantity += value;


    if(quantity <= 0){

        cart.splice(index,1);

    }else{

        cart[index].quantity = quantity;

    }



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );



    if(typeof updateCartCount === "function"){

        updateCartCount();

    }



    showCart();

}




function removeCart(index){


    cart.splice(index,1);



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );



    if(typeof updateCartCount === "function"){

        updateCartCount();

    }



    showCart();

}




document.addEventListener(
"DOMContentLoaded",
function(){

    showCart();

});
