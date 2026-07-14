<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>الداخليات الرجالي | مجمع حمزه الشطري</title>

<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800&display=swap" rel="stylesheet">

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Cairo',sans-serif;
}

body{
background:#f5f7fb;
}

header{
background:#111;
color:#fff;
padding:18px;
text-align:center;
font-size:24px;
font-weight:bold;
}

.products{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
gap:15px;
padding:20px;
}

.card{
background:#fff;
border-radius:15px;
overflow:hidden;
box-shadow:0 5px 15px rgba(0,0,0,.08);
}

.card img{
width:100%;
height:220px;
object-fit:cover;
background:#eee;
}

.card h3{
padding:10px;
font-size:18px;
text-align:center;
}

.price{
text-align:center;
color:#c28b00;
font-size:20px;
font-weight:bold;
padding-bottom:15px;
}

.msg{
text-align:center;
padding:40px;
font-size:22px;
font-weight:bold;
}

</style>

</head>

<body>

<header>
قسم الداخليات الرجالي
</header>

<div id="products" class="products">
<div class="msg">جاري تحميل المنتجات...</div>
</div>

<script type="module">

import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const box=document.getElementById("products");

async function loadProducts(){

try{

const snap=await getDocs(collection(db,"products"));

console.log("عدد المنتجات:",snap.size);

box.innerHTML="";

if(snap.empty){

box.innerHTML="<div class='msg'>لا توجد أي منتجات داخل Firebase</div>";
return;

}

let found=false;

snap.forEach((doc)=>{

const p=doc.data();

console.log(p);

if(
p.category==="الداخليات الرجالي" ||
p.category==="داخليات"
){

found=true;

box.innerHTML+=`

<div class="card">

<img src="${p.image || ''}" alt="">

<h3>${p.name || "بدون اسم"}</h3>

<div class="price">
${Number(p.price||0).toLocaleString()} د.ع
</div>

</div>

`;

}

});

if(!found){

box.innerHTML="<div class='msg'>لا يوجد أي منتج ضمن قسم الداخليات الرجالي</div>";

}

}

catch(error){

console.error(error);

box.innerHTML=`
<div class="msg">
حدث خطأ<br><br>
${error.message}
</div>
`;

}

}

loadProducts();

</script>

</body>
</html>
