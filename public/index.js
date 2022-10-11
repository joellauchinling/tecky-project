// const { path } = require("path");
// import { path } from "Path";

let content = document.querySelector("ion-content");
let cardTemplate = content.querySelector("ion-card");

cardTemplate.remove();

async function loadItem() {
  let res = await fetch("/homepage/item");
  let items = await res.json(); //items -> Array<object>
  for (let item of items) {
    let node = cardTemplate.cloneNode(true);
    node.querySelector("#card-name").textContent = item.name;
    node.querySelector("#card-price").textContent = item.price;
    let img = node.querySelector(".card-photo");
    if (item.photo) {
      img.src = "/itemPhoto/" + item.photo;
    } else {
      img.remove();
    }
    let cardBtn = node.querySelector(".card-button");
    cardBtn.addEventListener("click", () => {
      addToCart();
    });

    async function addToCart() {
      try {
        let res = await fetch(
          `/cart/${item.id}?count=` + (item.cart_quantity + 1),
          {
            method: "POST",
          }
        );
        console.log(res);

        if (res.ok) {
          //   item.cart_quantity++;
          let json = await res.json();
          item.cart_quantity = +json;
          node.querySelector(".cart_quantity").textContent = item.cart_quantity;
          return;
        }
      } catch (error) {}
    }
    // console.log(node.querySelector(".cart_quantity").textContent);

    node.querySelector(".cart_quantity").textContent = item.cart_quantity;
    content.appendChild(node);
  }
}

loadItem();
