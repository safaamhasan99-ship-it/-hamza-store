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
