import { renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const newItem = `
  <li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;

  return newItem;
}

export default class CartList {
    constructor(dataSource, listElement) {
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const cartItems = await this.dataSource.getData()
        this.renderCartContents(cartItems);
        this.renderCartTotal(cartItems);
    }

    renderCartContents(cartItems){
        const htmlItems = cartItems.map((item) => cartItemTemplate(item));
        this.listElement.innerHTML = htmlItems.join("");
    }

    renderCartTotal(cartItems) {
        const cartFooter = document.querySelector(".cart-footer");
        const cartTotal = document.querySelector(".cart-total");

        if (cartItems.length > 0) {
      cartFooter.classList.remove("hide");

      const total = cartItems.reduce((sum, item) => {
        return sum + item.FinalPrice * (item.quantity || 1);
      }, 0);

      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    } else {
      cartFooter.classList.add("hide");
      cartTotal.textContent = "";
    }
    }
}