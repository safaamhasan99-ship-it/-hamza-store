let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const grandTotal = document.getElementById("grandTotal");

function renderCart() {

cartItems.innerHTML = "";

let total = 0;

cart.forEach((item,index)=>{

let subtotal = item.price * item.quantity;

total += subtotal;

cartItems.innerHTML += `

<tr>

<td>
<img src="${item.image}" width="70">
</td>

<td>${item.name}</td>

<td>${item.price} د.ع</td>

<td>

<button onclick="changeQty(${index},-1)">-</button>

${item.quantity}

<button onclick="changeQty(${index},1)">+</button>

</td>

<td>${subtotal} د.ع</td>

<td>

<button onclick="removeItem(${index})">

حذف

</button>

</td>

</tr>

`;

});

grandTotal.innerText = total;

localStorage.setItem("cart",JSON.stringify(cart));

}
function changeQty(index, value) {

    cart[index].quantity += value;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    renderCart();

}

function removeItem(index) {

    cart.splice(index, 1);

    renderCart();

}

function sendOrder() {

    let name = document.getElementById("customerName").value;
    let phone = document.getElementById("customerPhone").value;
    let city = document.getElementById("customerCity").value;
    let address = document.getElementById("customerAddress").value;
    let notes = document.getElementById("customerNotes").value;

    if (name == "" || phone == "") {
        alert("يرجى إدخال الاسم ورقم الهاتف");
        return;
    }

    let message = "🛒 طلب جديد من موقع مجمع حمزه الشطري\n\n";

    cart.forEach(item => {
        message += `• ${item.name} × ${item.quantity}\n`;
    });

    message += "\n";
    message += "الاسم: " + name + "\n";
    message += "الهاتف: " + phone + "\n";
    message += "المحافظة: " + city + "\n";
    message += "العنوان: " + address + "\n";

    if (notes !== "") {
        message += "ملاحظات: " + notes + "\n";
    }

    window.open(
        "https://wa.me/9647813555538?text=" + encodeURIComponent(message),
        "_blank"
    );
}

renderCart();
