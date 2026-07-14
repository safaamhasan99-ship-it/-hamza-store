// cart.js


let cart = JSON.parse(localStorage.getItem("cart")) || [];


// إصلاح الكمية للمنتجات القديمة
cart = cart.map(item => {

    return {
        ...item,
        qty: item.qty || 1
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


        cartTotal.innerText = "0";

        return;

    }




    cart.forEach((item,index)=>{


        let itemTotal = item.price * item.qty;


        total += itemTotal;



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


                    <button onclick="changeQty(${index},1)">
                    +
                    </button>


                    <span>
                    ${item.qty}
                    </span>


                    <button onclick="change
