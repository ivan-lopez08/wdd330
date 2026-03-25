import {
  renderListWithTemplate,
  getLocalStorage,
  setLocalStorage,
} from "./utils.mjs";

function cartItemTemplate(item) {
  return `
  <li class="cart-card divider" data-id="${item.Id}">
    
    <!-- REMOVE BUTTON (mejorado) -->
    <button class="remove-item" data-id="${item.Id}" aria-label="Remove item">&times;</button>

    <a href="#" class="cart-card__image">
      <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
    </a>

    <div class="cart-card__info">
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">${item.Colors[0].ColorName}</p>

      <!-- QUANTITY CONTROL -->
      <div class="cart-quantity-control">
        <button class="qty-btn minus" data-id="${item.Id}">−</button>
        <span class="cart-qty">${item.quantity || 1}</span>
        <button class="qty-btn plus" data-id="${item.Id}">+</button>
      </div>

      <p class="cart-card__price">$${item.FinalPrice}</p>
    </div>

  </li>`;
}

export default class CartList {
  constructor(dataSource, listElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const cartItems = await this.dataSource.getData();
    this.renderCartContents(cartItems);
    this.renderCartTotal(cartItems);

    // CHANGED: agregamos listeners después de renderizar
    this.addRemoveListeners();
    this.addQuantityListeners();
  }

  renderCartContents(cartItems) {
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

  // CHANGED: método para refrescar lista + total + listeners
  refreshCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    this.renderCartContents(cartItems);
    this.renderCartTotal(cartItems);
    this.addRemoveListeners();
    this.addQuantityListeners();
  }

  // CHANGED: elimina un producto completamente del carrito
  removeItemFromCart(productId) {
    let cartItems = getLocalStorage("so-cart") || [];

    cartItems = cartItems.filter((item) => item.Id !== productId);

    setLocalStorage("so-cart", cartItems);
    this.refreshCart();
  }

  // CHANGED: listeners para la X
  addRemoveListeners() {
    const removeButtons = document.querySelectorAll(".remove-item");

    removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        this.removeItemFromCart(productId);
      });
    });
  }

  // CHANGED: cambia cantidad usando +1 o -1
  changeQuantity(productId, delta) {
    let cartItems = getLocalStorage("so-cart") || [];

    const product = cartItems.find((item) => item.Id === productId);

    if (!product) return;

    product.quantity = (product.quantity || 1) + delta;

    // CHANGED: si la cantidad llega a 0 o menos, quitamos el producto
    if (product.quantity <= 0) {
      cartItems = cartItems.filter((item) => item.Id !== productId);
    }

    setLocalStorage("so-cart", cartItems);
    this.refreshCart();
  }

  // CHANGED: listeners para botones + y -
  addQuantityListeners() {
    const plusButtons = document.querySelectorAll(".qty-btn.plus");
    const minusButtons = document.querySelectorAll(".qty-btn.minus");

    plusButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        this.changeQuantity(productId, 1);
      });
    });

    minusButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        this.changeQuantity(productId, -1);
      });
    });
  }
}