let tableTemplate = document.querySelector("#cartTable tbody");
// let productTable = tableTemplate.rows[0];
// productTable.remove();

let productTable = document.querySelector("#cartTable tbody tr.product");
productTable.remove();
let giftTable = document.querySelector("#cartTable tbody tr.gift");
giftTable.remove();

let total = 0;

async function loadCartList() {
  try {
    let res = await fetch("/cart/item");
    let items = await res.json();
    tableTemplate.textContent = "";
    for (let id in items) {
      //item -> qty
      let subtotal = 0;
      let node = productTable.cloneNode(true);
      console.log("item id:", id);
      let qty = items[id];
      console.log("item qty:", qty);
      let res = await fetch(`/cart/name/${id}`);
      let item = await res.json();
      let name = item.name;
      let price = item.price;
      node.querySelector("[class='item_name']").textContent = name;
      node.querySelector("[class='unit_price']").textContent = price;
      node.querySelector("[class='quantity']").textContent = qty;
      let minusOne = node.querySelector("[class='minusOne']");
      let plusOne = node.querySelector("[class='plusOne']");
      subtotal += price * qty;
      node.querySelector("[class='item_total_price']").textContent = subtotal;

      minusOne.addEventListener("click", () => editQty("minus"));
      plusOne.addEventListener("click", () => editQty("plus"));

      async function editQty(condition) {
        try {
          let res;
          switch (condition) {
            case "minus":
              res = await fetch("/cart/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: id,
                  operation: "reduce",
                }),
              });
              break;
            case "plus":
              res = await fetch("/cart/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: id,
                  operation: "add",
                }),
              });
              break;
            default:
              return;
          }
          let json = await res.json();
          if (json.error) {
            let toast = await toastController.create({
              message: json.error,
              color: "danger",
              duration: 4000,
            });
            toast.present();
            return;
          }
          qty = json.count;
          node.querySelector("[class='quantity']").textContent = qty;
          subtotal = price * qty;
          node.querySelector("[class='item_total_price']").textContent =
            subtotal;
          countTotal();
          return;
        } catch (error) {
          let toast = await toastController.create({
            message: "載入失敗",
            color: "danger",
            duration: 4000,
          });
          toast.present();
          return;
        }
      }
      tableTemplate.appendChild(node);

      //   if (items.item > 0) {
      //     productBody.appendChild(node);
      //   } else {
      //     // If any quantity of session.item[id] hits zero, remove it from session.item and add it to session.inactive_item
      //     await fetch("/inactive_cart", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         id: id,
      //         name: name,
      //         price: number,
      //       }),
      //     });
      //   }
    }
  } catch (error) {
    let toast = await toastController.create({
      message: "載入失敗",
      color: "danger",
      duration: 4000,
    });
    toast.present();
    return;
  }

  // document.querySelector("#total").textContent = `總計：${sum}`;
  // loadAddBackList();
}
loadCartList();

async function loadDiscount() {
  try {
    let vip_discount = document.querySelector(".vip_discount");
    let res = await fetch("/vip");
    let json = await res.json();
    let is_vip = json.is_vip;
    if (is_vip == true) {
      vip_discount.textContent = "10% off";
    } else {
      vip_discount.textContent = "0";
    }
  } catch (error) {
    let toast = await toastController.create({
      message: "載入失敗",
      color: "danger",
      duration: 4000,
    });
    toast.present();
    return;
  }
}
loadDiscount();

async function loadRefund() {
  try {
    let credit = document.querySelector(".credit");
    let res = await fetch("/cart/credit");
    let json = await res.json();
    if (json.credit) {
      credit.textContent = json.credit;
    } else {
      credit.textContent = 0;
    }
    return;
  } catch (error) {
    let toast = await toastController.create({
      message: "載入失敗",
      color: "danger",
      duration: 4000,
    });
    toast.present();
    return;
  }
}
loadRefund();

async function countTotal() {
  try {
    let total_amount = document.querySelector(".total_amount");
    let res = await fetch("/cart/amount");
    let json = await res.json();
    let amount = json.amount;
    console.log(amount);
    total_amount.textContent = amount;
  } catch (error) {
    let toast = await toastController.create({
      message: "載入失敗",
      color: "danger",
      duration: 4000,
    });
    toast.present();
    return;
  }
}
countTotal();

async function checkCart() {
  try {
    let res = await fetch("/cart/item");
    let json = await res.json();
    // console.log(Object.keys(json).length);
    if (Object.keys(json).length == 0) {
      let toast = await toastController.create({
        message: "購物車內未有商品",
        color: "danger",
        duration: 4000,
      });
      toast.present();
      return;
    }
    location.href = "/shipment.html";
  } catch (error) {
    let toast = await toastController.create({
      message: "購物車內未有商品",
      color: "danger",
      duration: 4000,
    });
    toast.present();
    return;
  }
}

// let addBackTable = document.querySelector("#addBack");
// let addBackBody = addBackTable.rows[0];
// addBackTable.remove();

// Display all items in session.inactive_item
// async function loadAddBackList() {
//   let items = await fetch("/inactive_cart");
//   for (let item of items) {
//     let node = addBackBody.cloneNode(true);
//     node.cells[0].textContent = item.name;
//     node.cells[1].textContent = item.price;
//     node.cells[2].innerHTML = `
//         <ion-buttons  style="justify-content: center;">
//         <ion-button onclick="addBack(${item})">
//             <ion-icon name="add-outline"></ion-icon>
//         </ion-button>
//         </ion-buttons>
//         `;
//   }
// }

// async function addBack(index) {
//   let id = session.inactive_item[index].id;
//   await fetch("/cart", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       id: id,
//     }),
//   });
//   await fetch("/inactive_cart", {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       index: index,
//       operation: "remove",
//     }),
//   });
//   loadCartList();
// }

// async function sum() {
//   await fetch("/cart/sum", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       sum: total,
//     }),
//   });
// }
