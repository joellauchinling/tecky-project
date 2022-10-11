let areaList = document.querySelector("ion-select#area");
let areaTemplate = areaList.querySelector(".areaName");
areaTemplate.remove();
// let districtList = document.querySelector("ion-select#district");
// let districtTemplate = districtList.querySelector(".districtName");
// districtTemplate.remove();

document.querySelector(".fee").textContent = "";
document.querySelector(".total").textContent = "";
let total_amount;
async function loadArea() {
  let res = await fetch("/shipment/area");
  let json = await res.json();
  //   areaTemplate.textContent = "";
  for (let area of json) {
    let node = areaTemplate.cloneNode(true);
    node.textContent = area.area;
    areaList.appendChild(node);
  }
}
loadArea();
let areaSelect = document.querySelector("ion-select#area");
areaSelect.addEventListener("ionChange", () => loadDistrict());

async function loadDistrict() {
  //   console.log(areaTemplate.textContent);
  //   console.log(area);
  console.log(areaList.value);
  let area = areaList.value;
  let res = await fetch(`/shipment/district?area=${area}`);
  let json = await res.json();
  console.log(json);

  let districtList = document.querySelector("ion-select#district");
  let districtTemplates = districtList.querySelectorAll(".districtName");
  let districtTemplate = districtList.querySelector(".districtName");
  for (let i of districtTemplates) {
    i.remove();
  }
  //   districtTemplates.remove();

  for (let district of json) {
    let node = districtTemplate.cloneNode(true);
    node.textContent = district.district;
    districtList.appendChild(node);
  }
}

let districtSelect = document.querySelector("ion-select#district");
districtSelect.addEventListener("ionChange", () => feeCalc());

async function feeCalc() {
  console.log(district.value);
  let res = await fetch("/cart/weight");
  let json = await res.json();
  console.log(json.weight);
  let weight = json.weight;
  document.querySelector(".fee").textContent = weight * 5;

  let amount = await fetch("/cart/amount");
  amount = await amount.json();
  amount = amount.amount;
  total_amount = amount + weight * 5;
  document.querySelector(".total").textContent = total_amount;

  return;
}

// let session = require("express-session");
// let districtList = document.querySelector("#district");

// for (let option of districtList.querySelectorAll("ion-select-option")) {
//   option.hidden = true;
// }

// switch (areaList.value) {
// }

// async function loadArea() {
//   let res = await fetch("/shipment/area");
//   let areas = await res.json();
//   for (let area of areas) {
//     let option = document.createElement("option");
//     option.text = result.area;
//     areaList.add(option);
//   }
// }

// loadArea();

// let districtList = document.querySelector("#district");

// async function loadDistrict() {
//   let area = areaList.value();
//   let json = await fetch(
//     "/shipment/area" +
//       new URLSearchParams({
//         area: area,
//       })
//   );
//   for (let result of json) {
//     let option = document.createElement("option");
//     option.text = result.district;
//     districtList.add(option);
//   }
// }

// loadDistrict();

async function addOrder(form) {
  console.log("here", form.address.value);
  // let formData = new FormData(form);
  // console.log(formData);

  //  create payment(user_id, payment_status) => return payment_id = payment.id
  let payment_id = await fetch("/receipt", { method: "POST" });
  payment_id = await payment_id.json();

  // //  create order(user_id, coupon_id? ,payment_id, amount, address) => order_id = order.id
  let order_id = await fetch("/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payment_id: payment_id,
      amount: total_amount,
      address: form.address.value,
      point: parseInt(total_amount / 100),
    }),
  });

  order_id = await order_id.json();

  // create orderItem(user_id, order_id, item_id, qty, amount) from cart
  let items = await fetch("/cart/item");
  items = await items.json();
  // console.log(items);

  itemKeys = Object.keys(items);
  // console.log(itemKeys);

  for (let item of itemKeys) {
    let item_id = item;
    let item_qty = items[item];

    let res = await fetch(`/cart/name/${item_id}`);
    itemData = await res.json();
    // let item_name = itemData.name;
    let item_price = itemData.price;
    let subtotal = item_qty * item_price;

    await fetch("/order/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: order_id,
        quantity: item_qty,
        amount: subtotal,
        item_id: item_id,
      }),
    });
  }
  window.location.href = "/orderdetails.html";

  // let res = await fetch("/order", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   // body: JSON.stringify({
  //   //   user_id: session.user.id,
  //   //   // TODO Confirm erd design of table order
  //   //   address: form.address.value,
  //   //   district: form.district.value,
  //   // }),
  // });
}
