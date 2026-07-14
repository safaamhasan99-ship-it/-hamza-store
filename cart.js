// cart.js


let cart = JSON.parse(localStorage.getItem("cart")) || [];



const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");




// عرض السلة

function renderCart(){


    if(!cartItems) return;


    cartItems.innerHTML = "";



    let total = 0;



    if(cart.length === 0){


        cartItems.innerHTML = `

        <h3>
        السلة فارغة 🛒
        </h3>

        `;


        cartTotal.innerText = "0";

        return;


    }





    cart.forEach((item,index)=>{


        total += item.price * item.qty;



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

        🗑

        </button>



        </div>


        `;


    });



    cartTotal.innerText =
    total.toLocaleString();


}



renderCart();
// تغيير كمية المنتج

window.changeQty = function(index, amount){


    cart[index].qty += amount;



    if(cart[index].qty <= 0){

        cart[index].qty = 1;

    }



    saveCart();


    renderCart();


};




// حذف منتج من السلة

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
// تغيير كمية المنتج

window.changeQty = function(index, amount){


    cart[index].qty += amount;



    if(cart[index].qty <= 0){

        cart[index].qty = 1;

    }



    saveCart();


    renderCart();


};




// حذف منتج من السلة

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
