import { getLocalStorage } from "./utils.mjs";

export class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }

  async getData() {
    const res = await fetch(this.path);

    if (!res.ok) {
      throw new Error("Bad Response");
    }

    const data = await res.json();
    return data;
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
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
