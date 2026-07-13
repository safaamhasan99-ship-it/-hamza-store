let cart = JSON.parse(localStorage.getItem("cart")) || [];


const cartItems = document.getElementById("cartItems");
const grandTotal = document.getElementById("grandTotal");


// إضافة للسلة
window.addToCart = function(name, price, image){

    let existing = cart.find(
        item => item.name === name
    );


    if(existing){

        existing.quantity += 1;

    }else{

        cart.push({

            name:name,

            price:Number(price),

            image:image,

            quantity:1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

    alert("تمت إضافة المنتج للسلة 🛒");

};




// عرض السلة
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
        total.toLocaleString()+" د.ع";

    }



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


}




// تغيير الكمية
window.changeQty = function(index,value){


    cart[index].quantity += value;



    if(cart[index].quantity <= 0){

        cart.splice(index,1);

    }



    renderCart();

    updateCartCount();

};




// حذف منتج
window.removeItem = function(index){

    cart.splice(index,1);


    renderCart();

    updateCartCount();

};




// عدد المنتجات في السلة
function updateCartCount(){

    let count =
    document.getElementById("cartCount");


    if(count){

        let total = cart.reduce(
            (sum,item)=>sum + item.quantity,
            0
        );


        count.innerText = total;

    }

}




// إرسال الطلب واتساب
window.sendOrder = function(){


    if(cart.length === 0){

        alert("السلة فارغة");

        return;

    }



    let name =
    document.getElementById("customerName").value;



    let phone =
    document.getElementById("customerPhone").value;



    let city =
    document.getElementById("customerCity").value;



    let address =
    document.getElementById("customerAddress").value;



    let notes =
    document.getElementById("customerNotes").value;




    if(name==="" || phone===""){

        alert("يرجى إدخال الاسم ورقم الهاتف");

        return;

    }



    let message =
    "🛒 طلب جديد من موقع مجمع حمزه الشطري\n\n";



    cart.forEach(item=>{


        message +=
        "• "+item.name+
        " × "+item.quantity+
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

    "https://wa.me/9647813555538?text="+
    encodeURIComponent(message),

    "_blank"

    );


};




// تشغيل عند فتح الصفحة
renderCart();

updateCartCount();
