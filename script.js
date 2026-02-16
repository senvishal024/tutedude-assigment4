
// ================================
// 1. GLOBAL DATA (JS MEMORY)
// ================================

let cart = {}; // selected services
const currency = "₹";
let serviceCart = document.querySelector(".service-cart");
let buttons = document.querySelectorAll(".service-items button");

function updateSerialNumbers() {
  let rows = document.querySelectorAll(".right-box-top-details");

  rows.forEach((row, index) => {
    let serialSpan = row.querySelector(
      ".right-box-top-details-left span:first-child"
    );
    serialSpan.innerText = index + 1;
  });
}


//null value hone pr box design
function nullBoxValue(){
    if(Object.keys(cart).length === 0){
      serviceCart.innerHTML=`
      <div class="empty-box">
        <ion-icon name="alert-circle-outline"></ion-icon>
      </div>
      `
      serviceCart.classList.add("empty-active");
    
  }
  else{
    serviceCart.classList.remove("empty-active");
  }
}
 nullBoxValue();

// ================================
// 2. TOTAL UPDATE FUNCTION
// ================================

function updateTotal() {
  let sum = 0;

  for (let item in cart) {
    sum += cart[item];
  }

  let totalSpan =
    document.querySelector(".right-box-top-total span:last-child");

  totalSpan.innerText = `${currency} ${sum.toFixed(2)}`;
}

// ================================
// 3. BUTTON CLICK LOGIC
// ================================

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Service box
    let textSpan=btn.querySelector(".btn-text");
    let serviceBox = btn.closest(".service-items");

    // Service name (clean text)
    let serviceName =
      serviceBox.querySelector(".service-items-left span").innerText.replace(" -", "");

    // Price
    let priceText = serviceBox.querySelector(".rupee-num").innerText;
    let price = Number(priceText.replace(/[^0-9.]/g, ""));
    
    // ================================
    // REMOVE ITEM
    // ================================
    if (cart[serviceName]) {
      delete cart[serviceName];
      

      // remove row
      let rowToRemove = document.querySelector(
        `.right-box-top-details[data-service="${serviceName}"]`
      );
      
      if (rowToRemove)
         rowToRemove.remove();
        updateSerialNumbers(); 
       
      // button reset
      textSpan.innerText = "Add Item";
      btn.classList.toggle("active"); // add/remove active class

    }
    // ADD ITEM
    else {
      cart[serviceName] = price;
      serviceCart.innerHTML=" ";
      // create row
      let row = document.createElement("div");
      row.classList.add("right-box-top-details");
      row.setAttribute("data-service", serviceName);

      row.innerHTML = `
        <div class="right-box-top-details-left">
          <span></span>
          <span>${serviceName}</span>
        </div>
        <span>${currency} ${price.toFixed(2)}</span>
      `;

      document.querySelector(".service-cart").appendChild(row);
      updateSerialNumbers();

      // button update
      textSpan.innerText = "Remove Item";
      btn.classList.toggle("active"); // add/remove active class

    }

    // UPDATE TOTAL
    updateTotal();
    nullBoxValue();
    console.log(cart); // learning/debug
  });
});

function getServicesFromCart() {
  let text = "";
  let i = 1;

  for (let service in cart) {
    text += `${i}. ${service} - ₹${cart[service]}\n`;
    i++;
  }

  return text;
}

function getTotalFromCart() {
  let sum = 0;

  for (let item in cart) {
    sum += cart[item];
  }

  return sum.toFixed(2);
}

let bookingText=document.querySelector(".booking-text");
document.querySelector(".book-btn").addEventListener("click", function () {

  if (Object.keys(cart).length === 0) {
    alert("Please add at least one service");
    return;
  }

  let name = document.getElementById("fname").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;

  let params = {
    name: name,
    email: email,
    phone: phone,
    services: getServicesFromCart(),   
    total: getTotalFromCart()          
  };
 
  emailjs.send("service_8guc9tf", "template_ao6l1mv", params)
    .then(function () {
      bookingText.textContent = "Thank you For Booking the Service We will get back to you soon!";
    bookingText.style.display = "block";

    // 3 second baad hide
    setTimeout(() => {
      bookingText.style.display = "none";
      bookingText.textContent = " ";
      }, 3000);
     }, function (error) {
      alert("Failed to send email ❌");
      console.log(error);
      });

});

