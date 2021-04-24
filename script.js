const fetchAPI = () => { // requisito 1
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return new Promise((resolve) => {
    fetch(endpoint)
    .then((response) => {
      response.json().then((computers) => {
          resolve(computers.results);
        });
      });
  });
};

const fetchItem = (idItem) => { // requisito 2
  const endpointItem = `https://api.mercadolibre.com/items/${idItem}`;
  return new Promise((resolve) => {
    fetch(endpointItem)
      .then((response) => {
        response.json().then((item) => {
          resolve(item);
        });
      });
  });
};
  
function createProductImageElement(imageSource) { // requisito 1
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // requisito 1
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) { // requisito 2
  return item.querySelector('span.item__sku').innerText;
}

const saveItens = () => { // requisito 4
  const itemCart = document.querySelectorAll('.cart__item');
  const newArr = [];
  itemCart.forEach((element) => newArr.push(element.outerHTML));
  localStorage.setItem('itensList', newArr);
};

const cartItemClickListener = (event) => { // requisito 3
  const eventListItem = event.target;
  eventListItem.remove();
  saveItens(); // requisito 4
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => { // requisito 2
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // requisito 3
  return li;
};

const addItem = () => { // requisito 2
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', async (event) => {
    const addEvent = event.target;
    const skulId = getSkuFromProductItem(addEvent.parentElement);
    const data = await fetchItem(skulId);
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.appendChild(createCartItemElement(data));
    saveItens(); // requisito 4
  }));
};

const clearButton = () => { // requisito 6
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.innerHTML = '';
    saveItens(); // requisito 4
  });
};

const addEventClickCart = () => { // requisito 4
  const lis = document.querySelectorAll('.cart__item');
  lis.forEach((elemento) => {
    elemento.addEventListener('click', cartItemClickListener);
  });
};

const getItens = () => { // requisito 4
  if (localStorage.getItem('itensList')) {
    const itemsCart = document.querySelector('ol');
    const arrayStorage = localStorage.getItem('itensList').split(',');
    arrayStorage.forEach((elemento) => {
      itemsCart.innerHTML += elemento;
    });
    addEventClickCart();
  }
};

const msgLoading = () => { // requisito 7
  const loading = document.querySelector('.loading');
  loading.remove();
};

const createProductItemElement = async () => { // requisito 1
  const computers = await fetchAPI();
  msgLoading(); // requisito 7

  computers.forEach(({ id, title, thumbnail }) => {
    const section = document.createElement('section');
    const sectionItems = document.querySelector('.items');
    section.className = 'item';
  
    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    sectionItems.appendChild(section);
  });
  addItem(); // requisito 2
  clearButton(); // requisito 6
};

window.onload = function onload() {
  fetchAPI(); // requisito 1
  createProductItemElement(); // requisito 1
  getItens(); // requisito 4
};