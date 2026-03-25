import { ProductData } from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import { getParam } from "./utils.mjs";

const category = getParam('category')

const title = document.getElementById('category-title')
title.textContent = category

const dataSource = new ProductData();
const listElement = document.querySelector("#product-list");
const productList = new ProductList(category, dataSource, listElement);

productList.init();

loadHeaderFooter(); 