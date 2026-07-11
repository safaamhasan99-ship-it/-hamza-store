let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const grandTotal = document.getElementById("grandTotal");


function renderCart(){

    if(!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;


    if(cart.length === 0){

        cartItems.innerHTML = `
        <tr>
        <td colspan="6">
        السلة فارغة
        </td>
        </tr>
        `;

    }


    cart.forEach((item,index)=>{


        let price = Number(item.price) || 0;

        let quantity = item.quantity || 1;

        let subtotal = price * quantity;


        total += subtotal;


        cartItems.innerHTML += `

        <tr>

        <td>
        <img src="${item.image}" width="70">
        </td>


        <td>
        ${item.name}
        </td>


        <td>
        ${price.toLocaleString()} د.ع
        </td>


        <td>

        <button onclick="changeQty(${index},-1)">
        -
        </button>

        ${quantity}

        <button onclick="changeQty(${index},1)">
        +
        </button>

        </td>


        <td>
        ${subtotal.toLocaleString()} د.ع
        </td>


        <td>

        <button onclick="removeItem(${index})">
        حذف
        </button>

        </td>

        </tr>

        `;

    });


    if(grandTotal){
        grandTotal.innerText =
        total.toLocaleString() + " د.ع";
    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}




function changeQty(index,value){

    cart[index].quantity += value;


    if(cart[index].quantity <= 0){

        cart.splice(index,1);

    }


    renderCart();

}



function removeItem(index){

    cart.splice(index,1);

    renderCart();

}



function sendOrder(){


    if(cart.length === 0){

        alert("السلة فارغة");

        return;

    }


    let name = document.getElementById("customerName").value;

    let phone = document.getElementById("customerPhone").value;

    let city = document.getElementById("customerCity").value;

    let address = document.getElementById("customerAddress").value;

    let notes = document.getElementById("customerNotes").value;



    if(name==="" || phone===""){

        alert("يرجى إدخال الاسم ورقم الهاتف");

        return;

    }



    let message =
    "🛒 طلب جديد من موقع مجمع حمزه الشطري\n\n";


    cart.forEach(item=>{

        message += 
        "• " + item.name +
        " × " + item.quantity +
        "\n";

    });



    message += "\nالاسم: "+name;
    message += "\nالهاتف: "+phone;
    message += "\nالمحافظة: "+city;
    message += "\nالعنوان: "+address;


    if(notes!==""){

        message += "\nملاحظات: "+notes;

    }



    window.open(
    "https://wa.me/9647813555538?text="+encodeURIComponent(message),
    "_blank"
    );

}



renderCart();
