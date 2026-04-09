import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import { ProductData } from "./ProductData.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart");
const services = new ProductData();

checkout.init();

document.querySelector("input[name='zip']").addEventListener("change", () => {
  checkout.calculateOrderTotal();
});

// submit
document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  checkout.checkout(e.target, services);
});