function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // بيانات الدخول المؤقتة
    if (email === "admin@hamza.com" && password === "123456") {

        localStorage.setItem("adminLogin", "true");
        window.location.href = "dashboard.html";

    } else {

        alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");

    }

}
