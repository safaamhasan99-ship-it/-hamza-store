// admin-auth.js

import { app } from "./firebase.js";

import {
getAuth,
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const auth = getAuth(app);



const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");



loginBtn.onclick = async function(){


const email = emailInput.value.trim();
const password = passwordInput.value.trim();



if(!email || !password){

message.innerHTML = "⚠️ اكتب البريد وكلمة المرور";

return;

}



try{


await signInWithEmailAndPassword(
auth,
email,
password
);



message.innerHTML =
"✅ تم تسجيل الدخول بنجاح";


setTimeout(()=>{

window.location.href = "admin.html";

},1000);



}


catch(error){


console.log(error);


message.innerHTML =
"❌ البريد أو كلمة المرور غير صحيحة";


}



};
