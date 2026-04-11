import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key) {
    this.key = key;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      return sum + item.FinalPrice * (item.quantity || 1);
    }, 0);

    document.getElementById("subtotal").textContent = this.itemTotal.toFixed(2);
  }

  calculateOrderTotal() {
    // TAX 6%
    this.tax = this.itemTotal * 0.06;

    // SHIPPING
    const totalItems = this.list.reduce((sum, item) => {
      return sum + (item.quantity || 1);
    }, 0);

    this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.getElementById("tax").textContent = this.tax.toFixed(2);
    document.getElementById("shipping").textContent = this.shipping.toFixed(2);
    document.getElementById("orderTotal").textContent =
      this.orderTotal.toFixed(2);
  }

    async checkout(form, services) {
    try {
      const data = formDataToJSON(form);

      const order = {
        ...data,
        orderDate: new Date().toISOString(),
        items: packageItems(this.list),
        orderTotal: this.orderTotal.toFixed(2),
        shipping: this.shipping,
        tax: this.tax.toFixed(2),
      };

      const result = await services.checkout(order);
      console.log("SERVER RESPONSE:", result);

      setLocalStorage(this.key, []);
      window.location.assign("/checkout/success.html");

      return result;
    } catch (err) {
      console.log("CHECKOUT ERROR:", err);
      console.log("ERROR MESSAGE:", err.message);

      let errorMessage = "There was a problem processing your order.";

      if (err.message) {
        if (typeof err.message === "string") {
          errorMessage = err.message;
        } else if (Array.isArray(err.message)) {
          errorMessage = err.message.join(", ");
        } else if (err.message.message) {
          errorMessage = err.message.message;
        } else {
          errorMessage = JSON.stringify(err.message);
        }
      }

      alertMessage(errorMessage);
    }
  }
}
