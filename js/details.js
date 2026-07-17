/*==================================
Hamza Store V7
Details Page
==================================*/


import { db } from "./firebase.js";


import {

doc,
getDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

addToCart,
toggleFavorite,
isFavorite,
formatPrice,
imageOrDefault,
updateCartCount

}

from "./utils.js";






const params = new URLSearchParams(location.search);


const id = params.get("id");



const image =

document.getElementById("productImage");


const name =

document.getElementById("productName");


const price =

document.getElementById("productPrice");


const description =

document.getElementById("productDescription");



const addBtn =

document.getElementById("addCartBtn");



const favBtn =

document.getElementById("favoriteBtn");




let product=null;



updateCartCount();



loadProduct();






async function loadProduct(){


try{


const ref=

doc(db,"products",id);



const snap=

await getDoc(ref);



if(!snap.exists()){


if(name)

name.textContent="المنتج غير موجود";


return;


}




product={

id:snap.id,

...snap.data()

};





showProduct();




}catch(error){


console.log(error);


}


}







function showProduct(){



if(image)

image.src=

imageOrDefault(product.image);





if(name)

name.textContent=

product.name || "منتج";





if(price)

price.textContent=

formatPrice(product.price);





if(description)

description.textContent=

product.description ||

"لا يوجد وصف";






if(isFavorite(product.id)){


favBtn.classList.add("active");


}





if(addBtn){


addBtn.onclick=()=>{


addToCart(product);


};


}







if(favBtn){


favBtn.onclick=()=>{


toggleFavorite(product);



favBtn.classList.toggle(

"active"

);



};


}





}



console.log("Details Ready ✅");
