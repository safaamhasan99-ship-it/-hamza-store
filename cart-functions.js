function addToCart(name, price, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let existing = cart.find(item => item.name === name);


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            name: name,
            price: price,
            image: image,
            quantity: 1

        });

    }


    localStorage.setItem("cart", JSON.stringify(cart));


    updateCartCount();


    alert("✅ تمت إضافة المنتج إلى السلة");

}




function updateCartCount(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = cart.reduce((total,item)=> total + item.quantity,0);


    let cartElements = document.querySelectorAll(".cart-count");


    cartElements.forEach(function(el){

        el.innerHTML = count;

    });

}



document.addEventListener("DOMContentLoaded",function(){

    updateCartCount();

});
