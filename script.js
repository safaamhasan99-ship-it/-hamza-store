let cart = JSON.parse(localStorage.getItem("cart")) || [];


function addCart(product){

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("تم إضافة المنتج إلى السلة 🛒");

}



function showCart(){

    let list = document.getElementById("cartItems");

    if(!list) return;

    list.innerHTML="";


    if(cart.length === 0){

        list.innerHTML="<p>السلة فارغة</p>";

        return;

    }


    cart.forEach((item,index)=>{

        list.innerHTML += `
        <div class="card">
        <h3>${item}</h3>
        <button onclick="removeCart(${index})">
        حذف
        </button>
        </div>
        `;

    });

}



function removeCart(index){

    cart.splice(index,1);

    localStorage.setItem("cart", JSON.stringify(cart));

    showCart();

}



function sendWhatsApp(){

    if(cart.length === 0){

        alert("السلة فارغة");

        return;

    }


    let message =
    "طلب جديد من مجمع حمزه الشطري:%0A%0A"
    + cart.join("%0A");


    window.open(
    "https://wa.me/9647813555538?text="+message
    );

}
