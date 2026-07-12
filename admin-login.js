// admin-login.js


import { auth } from "./firebase.js";


import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




const loginBtn = document.getElementById("loginBtn");



loginBtn.addEventListener("click", async ()=>{


const email =
document.getElementById("email").value.trim();



const password =
document.getElementById("password").value;



if(!email || !password){

alert("أدخل البريد وكلمة المرور");

return;

}




try{


await signInWithEmailAndPassword(
auth,
email,
password
);



alert("تم تسجيل الدخول");



window.location.href="admin-products.html";




}catch(error){


console.log(error);


alert("البريد أو كلمة المرور غير صحيحة");


}



});
