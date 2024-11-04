const container = document.querySelector(".desserts-container");
const cartEmpty = document.querySelector(".cart-empty");
const cartActive = document.querySelector(".cart-full");
const cartList = document.querySelector(".cart-list");
const cartsPrice = document.querySelector(".order.total-price");
const cartCheckout = document.querySelector(".cart-checkout");
const expenseModel = document.querySelector(".expense-model");
const checkedCartsList = document.querySelector(".checked-carts");
const checkedCartsPrice = document.querySelector(".confirmed-order.total-price");
const newOrder = document.querySelector(".new-order");
const numOfCarts = document.querySelector(".number-of-carts");


let currentScreen = "desktop";
let windowWidth = window.innerWidth;
switch (true) {
  case windowWidth >= 375 && windowWidth < 980:
    currentScreen = "tablet";
    break;
  case windowWidth >= 320 && windowWidth < 375:
    currentScreen = "mobile";
    break;
  case windowWidth < 320:
    currentScreen = "thumbnail";
    break;
  default:
    currentScreen = "desktop";
}

let allDessertes = [];
async function loadData() {
  const res = await fetch("./data.json");
  const data = await res.json();
  if (data) {
    allDessertes = data;
    displayDesserts(data);
  }
}

let carts = [];
loadData().then(function () {
  if (localStorage.getItem("carts") != null) {
    carts = JSON.parse(localStorage.getItem("carts"));
    updateCart();
  }
});

function displayDesserts(data) {
  for (let p of data) {
    const product = document.createElement("div");
    product.classList.add("product");
    product.dataset.id = p.category + "/" + p.name;
    product.innerHTML = `           <div class="product-img">
                                        <img src='${
                                          p.image[currentScreen]
                                        }' alt="${p.name}"/>
                                    </div>
                                    <div class='cart-controller-container'>
                                        <button class='add-new-cart cart-controller show center'>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z"/></clipPath></defs></svg>                                            <p>Add To Cart</p>
                                        </button>
                                        <div class='change-amount cart-controller hidden center'>
                                          <button class="decrement-amount center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
                                          </button>
                                          <p class="product-amount"></p>
                                          <button class="increment-amount center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
                                          </button>
                                        </div>
                                    </div>
                                    <div class="product-details">
                                        <span class="product-category thin">${
                                          p.category
                                        }</span>
                                        <p class="product-name bold">${p.name}</p>
                                        <span class="product-price">$${parseFloat(
                                          p.price
                                        ).toFixed(2)}</span>
                                    </div>`;

    container.append(product);
  }
}

function updateCart() {
  localStorage.setItem("carts", JSON.stringify(carts));

  if (carts.length < 1) {
    cartCheckout.classList.remove("show");
    cartEmpty.classList.remove("hidden");
    cartList.innerHTML = "";
    return;
  }

  if (carts.length > 0 && !cartEmpty.classList.contains("hidden")) {
    cartEmpty.classList.add("hidden");
    cartCheckout.classList.add("show");
  }

  let result = "";
  let price = 0
  let allAmount = 0 
  carts.forEach((cart) => {
    container
      .querySelector(`[data-id ='${cart.productId}']`)
      .classList.add("exist");
    container
      .querySelector(`[data-id ='${cart.productId}']`)
      .querySelector(".product-amount").innerHTML = cart.amount;
    const currentCart = allDessertes.find((c) => {
      const [_, cartName] = cart.productId.split("/");
      return cartName == c.name;
    });
    allAmount += cart.amount
    price += cart.amount * currentCart.price
    result += `
    <div class='cart' data-id='${cart.productId}'>
        <div class='cart-details'>
          <p class='cart-name'>${currentCart.name}</p>
          <div class='cart-fees'>
            <span class='cart-amount'>${cart.amount}x</span>
            <p class='basic-price'>@ $${parseFloat(currentCart.price).toFixed(
              2
            )}</p>
            <p class='cart-price bold'>$${parseFloat(
              currentCart.price * cart.amount
            ).toFixed(2)}</p>
          </div>
        </div>
        <button class='remove-cart center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
        </button>
      </div>
    `;
  });
  numOfCarts.innerHTML = allAmount
  cartsPrice.innerHTML = `$${parseFloat(price).toFixed(2)}`
  cartList.innerHTML = result;
}

function addCart(id) {
  const cart = { productId: id, amount: 1 };
  carts.push(cart);
}

function removeCart(id) {
  const p = document.querySelector(`[data-id ='${id}']`);
  p.classList.remove("exist");
  carts = carts.filter((c) => c.productId != id);
}

function displayOrder(){
  let list = ''
  let price = 0
  carts.forEach(cart =>{
    const checkedCart = allDessertes.find(p => {
                          let id = p.category + "/" + p.name
                          return id == cart.productId
                        })
    price += cart.amount * checkedCart.price
    list += `
            <div class='cart checked'>
              <img src=${checkedCart.image.thumbnail} alt='${checkedCart.name}'/>
              <div class='details'>
                <h4 class='cart-name'>${checkedCart.name}</h4>
                <span class='amount'>${cart.amount}x</span>
                <span class='basic-price thin'>@ $${parseFloat(checkedCart.price).toFixed(2)}</span>
              </div>
              <p class='cart-price'>$${parseFloat(cart.amount * checkedCart.price).toFixed(2)}</p>
            </div>
    `
  })
  checkedCartsList.innerHTML = list
  checkedCartsPrice.innerHTML = `$${parseFloat(price).toFixed(2)}`
  expenseModel.classList.add('show');
}

container.addEventListener("click", (e) => {
  const currentEle = e.target;
  const p = currentEle.closest(".product");

  if (currentEle.classList.contains("add-new-cart")) {
    if (carts.find((c) => c.productId == p.dataset.id)) return;
    addCart(p.dataset.id);
  }
  if (currentEle.classList.contains("decrement-amount")) {
    carts = carts.map((c) => {
      if (c.productId == p.dataset.id) --c.amount;
      return c;
    });

    let amountOfProduct = carts.find((c) => c.productId == p.dataset.id).amount;
    if (amountOfProduct < 1) {
      removeCart(p.dataset.id);
    }
  }
  if (currentEle.classList.contains("increment-amount")) {
    carts = carts.map((c) => {
      if (c.productId == p.dataset.id) ++c.amount;
      return c;
    });
  }
    updateCart();
});

cartList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-cart")) {
    removeCart(e.target.closest(".cart").dataset.id);
  }
  updateCart();
});

cartCheckout.addEventListener('click' , (e)=>{
  if(e.target.classList.contains('checkout'))
    displayOrder()
})

newOrder.addEventListener('click' ,()=>{
  carts.map(cart => removeCart(cart.productId))
  updateCart()
  expenseModel.classList.remove('show');
})
