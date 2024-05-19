const cart = [];
const cartItemNumber = document.getElementById("cart-item-number");
const cartAddedMessage = document.getElementById("added-cart-message");
const updateCartItemNumber = () => {
  cartItemNumber.textContent = cart.reduce(
    (count, item) => count + item.quantity,
    0
  );
};
const addToCart = (event) => {
  document.querySelectorAll(".product-cart").forEach((element, index) => {
    element.id = `${index}`;
  });
  event.preventDefault();

  const productCart = event.currentTarget.closest(".product-cart");
  const productId = productCart.id;
  const productName = productCart.querySelector(".name").textContent.trim();
  const productPrice = productCart
    .querySelector(".price-value")
    .textContent.trim();
  const imgElement = productCart.querySelector("img");
  const url = new URL(imgElement.src);
  const imagePath = url.pathname;
  console.log(imagePath);

  const existingProduct = cart.find((item) => item.id === productId);
  if (!existingProduct) {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: imagePath,
      quantity: 1,
    });
  }
  updateCartItemNumber();
  localStorage.setItem("cart", JSON.stringify(cart)); // Store updated cart in local storage
  console.log("stored", JSON.parse(localStorage.getItem("cart")));
};

const addToCartButtons = document.querySelectorAll(".product-cart button");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart);
});

document.querySelectorAll(".product-cart").forEach((card) => {
  card.addEventListener("productAdded", (event) => {
    const { message, duration } = event.detail;
    event.stopPropagation(); // Prevent the event from bubbling further
    cartAddedMessage.textContent = message; // Update the message content
    setTimeout(() => {
      cartAddedMessage.textContent = ""; // Clear the message after the specified duration
    }, duration);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const totalOrderPriceContainer = document.getElementById("total-order-price");

  const renderCart = () => {
    console.log("rendering");
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (!storedCart || !Array.isArray(storedCart)) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalOrderPriceContainer.innerHTML = "";
      return;
    }
    console.log("rendered", JSON.parse(localStorage.getItem("cart")));
    cartItemsContainer.innerHTML = `<div class="title">Shopping Cart</div>`;
    let totalOrderPrice = 0;
    storedCart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("item");
      cartItem.setAttribute("data-id", item.id);
      cartItem.innerHTML = `
        <div class="buttons">
          <span class="delete-btn" data-id="${item.id}"><i class="fa-solid fa-xmark"></i></span>
        </div>
        <div class="image" >
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="description">
          <span class="name">${item.name}</span>
        </div>
        <div class="quantity">
          <button class="plus-btn" type="button" name="button">
            <img src="./images/plus.svg" alt="Increase quantity" />
          </button>
          <input type="text" name="name" value="${item.quantity}" />
          <button class="minus-btn" type="button" name="button">
            <img src="./images/minus.svg" alt="Decrease quantity" />
          </button>
        </div>
        <div class="total-price">${item.price}</div>
      `;
      cartItemsContainer.appendChild(cartItem);
      const itemTotalPrice = parseInt(item.quantity) * parseFloat(item.price);
      totalOrderPrice += itemTotalPrice;
    });

    totalOrderPriceContainer.innerHTML =
      storedCart
        .map(
          (item) =>
            `<div>
         <span>${item.name}</span>
         <span class="calculated-value">${item.quantity} x ${item.price} = ${
              parseInt(item.quantity) * parseFloat(item.price)
            }</span>
       </div>`
        )
        .join("") +
      `<div class="calculated-value">Total: ${totalOrderPrice}</div>`;

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.currentTarget.getAttribute("data-id");
        deleteCartItem(itemId);
      });
    });
    document.querySelectorAll(".plus-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.currentTarget
          .closest(".item")
          .getAttribute("data-id");
        updateCartItemQuantity(itemId, 1);
      });
    });

    document.querySelectorAll(".minus-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.currentTarget
          .closest(".item")
          .getAttribute("data-id");
        updateCartItemQuantity(itemId, -1);
      });
    });
  };

  const deleteCartItem = (itemId) => {
    let storedCart = JSON.parse(localStorage.getItem("cart"));
    if (!storedCart || !Array.isArray(storedCart)) {
      return;
    }

    storedCart = storedCart.filter((item) => item.id !== itemId);

    localStorage.setItem("cart", JSON.stringify(storedCart));

    renderCart();
  };
  const updateCartItemQuantity = (itemId, change) => {
    let storedCart = JSON.parse(localStorage.getItem("cart"));
    if (!storedCart || !Array.isArray(storedCart)) {
      return;
    }

    const item = storedCart.find((item) => item.id === itemId);
    if (item) {
      item.quantity += change;

      if (item.quantity < 1) {
        item.quantity = 1;
      }

      localStorage.setItem("cart", JSON.stringify(storedCart));

      renderCart();
    }
  };

  renderCart();
});
