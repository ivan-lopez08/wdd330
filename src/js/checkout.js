import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import { ExternalServices } from "./ExternalServices.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart");
const services = new ExternalServices();

checkout.init();

document.querySelector("input[name='zip']").addEventListener("change", () => {
  checkout.calculateOrderTotal();
});

// submit
document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const myForm = e.target;
  const isValid = myForm.checkValidity();
  myForm.reportValidity();

  if (isValid) {
    checkout.checkout(myForm, services);
  }
});