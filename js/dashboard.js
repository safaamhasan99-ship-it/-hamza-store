// dashboard.js

import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadDashboard(){

try{

const productsSnapshot = await getDocs(
collection(db,"products")
);

const ordersSnapshot = await getDocs(
collection(db,"orders")
);

let productsCount = productsSnapshot.size;

let ordersCount = 0;

let totalSales = 0;

let newOrders = 0;

ordersSnapshot.forEach((doc)=>{

const order = doc.data();

ordersCount++;

totalSales += Number(order.total || 0);

if(order.status === "جديد"){

newOrders++;

}

});

document.getElementById("productsCount").textContent =
productsCount.toLocaleString();

document.getElementById("ordersCount").textContent =
ordersCount.toLocaleString();

document.getElementById("salesTotal").textContent =
totalSales.toLocaleString() + " د.ع";

document.getElementById("newOrders").textContent =
newOrders.toLocaleString();

}catch(error){

console.error(error);

alert("تعذر تحميل بيانات لوحة التحكم");

}

}

document.addEventListener("DOMContentLoaded",()=>{

loadDashboard();

});
