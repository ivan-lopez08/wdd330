import { loadHeaderFooter } from "./utils.mjs";
import { CartProductsData } from "./ProductData.mjs";
import CartList from "./ShoppingCart.mjs";

const dataSource = new CartProductsData();
const listElement = document.querySelector(".product-list-cart");
const cartList = new CartList(dataSource, listElement);

cartList.init();
loadHeaderFooter();
