let products = [];

const productsSection = document.querySelector("#products");

function handleButtonClick(event) {
  console.log(`You clicked ${event.target.innerText}`)
}

function renderProduct(product) {
  const html = `
  <div class="product">
  <h2>${product.name}</h2>
  <img src="${product.image}" alt="${product.name}"/>
  <button>
    Add $<span class="currency">${product.currency}</span> 
    ${(product.price_cents / 100).toFixed(2)}
  </button>
  </div>`;
  const fragment = document.createRange().createContextualFragment(html);
  const button = fragment.querySelector('button');
  button.addEventListener('click', handleButtonClick);
  return fragment;
}

async function fetchProducts() {
  const response = await fetch('/products');
  products = await response.json();
  const fragments = products.map(renderProduct);
  productsSection.innerHTML = '';
  productsSection.prepend(...fragments);
}

fetchProducts();