/*==================================
مجمع حمزه الشطري
Admin Guard
==================================*/

import { auth } from "./firebase.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "admin-login.html";
        return;

    }

    console.log("✅ تم تسجيل الدخول:", user.email);

});
