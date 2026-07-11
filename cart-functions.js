// إضافة منتج إلى السلة
function addToCart(name, price, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let product = cart.find(item => item.name === name);

    if (product) {
        product.quantity++;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("✅ تمت إضافة المنتج إلى السلة");
}


// تحديث عدد المنتجات في السلة
function updateCartCount() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    let counters = document.querySelectorAll(".cart-count");

    counters.forEach(counter => {
        counter.innerHTML = count;
    });
}


// عرض محتويات السلة
function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartBox = document.getElementById("cart-items");

    let totalBox = document.getElementById("cart-total");

    if (!cartBox) return;

    cartBox.innerHTML = "";

    let total = 0;


    cart.forEach((item, index) => {

        total += item.price * item.quantity;


        cartBox.innerHTML += `

        <div class="cart-product">

            <img src="${item.image}" width="80">

            <h3>${item.name}</h3>

            <p>
            السعر: ${item.price} د.ع
            </p>

            <p>
            الكمية: ${item.quantity}
            </p>

            <button onclick="removeFromCart(${index})">
            حذف
            </button>

        </div>

        `;

    });


    if(totalBox){
        totalBox.innerHTML = "المجموع: " + total + " د.ع";
    }

}


// حذف منتج من السلة
function removeFromCart(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index,1);

    localStorage.setItem("cart",JSON.stringify(cart));

    displayCart();

    updateCartCount();

}


// تفريغ السلة
function clearCart(){

    localStorage.removeItem("cart");

    displayCart();

    updateCartCount();

}


// تشغيل عند فتح الصفحة
document.addEventListener("DOMContentLoaded",function(){

    updateCartCount();

    displayCart();

});
