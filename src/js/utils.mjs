// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderWithTemplate(template, parentElement, data, callback) {

  parentElement.innerHTML = template;
  if (callback) {
    callback(data)
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template; 
}

export async function loadHeaderFooter(){
  const header_template = await loadTemplate('../partials/header.html');
  const footer_template = await loadTemplate('../partials/footer.html');

  const header = document.getElementById('main-header');
  const footer = document.getElementById('main-footer');

  renderWithTemplate(header_template,header);
  renderWithTemplate(footer_template, footer);
}

export function alertMessage(message, scroll = true) {
  const main = document.querySelector("main");

  const existingAlert = main.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.classList.add("alert");

  alert.innerHTML = `
    <p>${message}</p>
    <span class="alert-close">X</span>
  `;

  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("alert-close")) {
      main.removeChild(alert);
    }
  });

  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}