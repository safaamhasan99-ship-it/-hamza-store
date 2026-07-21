// admin-login.js

import { auth } from "./js/firebase.js";

import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
alert("admin-login.js loaded");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorBox = document.getElementById("error");

function showError(message){

if(errorBox){
errorBox.style.display="block";
errorBox.textContent=message;
}else{
alert(message);
}

}

loginBtn.addEventListener("click", async ()=>{

if(errorBox){
errorBox.style.display="none";
}

const email=emailInput.value.trim();
const password=passwordInput.value;

if(!email || !password){

showError("يرجى إدخال البريد الإلكتروني وكلمة المرور");

return;

}

loginBtn.disabled=true;
loginBtn.textContent="جاري تسجيل الدخول...";

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

window.location.href="admin-products.html";

}catch(error){

console.error(error);

switch(error.code){

case "auth/invalid-email":
showError("البريد الإلكتروني غير صحيح");
break;

case "auth/user-not-found":
case "auth/invalid-credential":
showError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
break;

case "auth/wrong-password":
showError("كلمة المرور غير صحيحة");
break;

case "auth/too-many-requests":
showError("تم إيقاف المحاولات مؤقتًا، حاول لاحقًا");
break;

default:
showError("حدث خطأ أثناء تسجيل الدخول");
break;

}

loginBtn.disabled=false;
loginBtn.textContent="تسجيل الدخول";

}

});
