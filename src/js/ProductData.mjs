const baseURL = import.meta.env.VITE_SERVER_URL;

import { getLocalStorage } from "./utils.mjs";

export class ProductData {
  constructor() {
  }

  async getData(category) {
    const res = await fetch(`${baseURL}products/search/${category}`);

    if (!res.ok) {
      throw new Error("Bad Response");
    }

    const data = await res.json();
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await response.json();
    console.log(data.Result);
    return data.Result;
  }
}


export class CartProductsData {
  constructor() {
    this.cartItems = getLocalStorage("so-cart") || [];
  }

  async getData(){
    return this.cartItems;
  }
}
