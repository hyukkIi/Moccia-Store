let selectedProduct = null;

const whatsappProducts =
  document.getElementById("whatsapp-products");

const robloxProducts =
  document.getElementById("roblox-products");

const extraProducts =
  document.getElementById("extra-products");

const fakeNumberProducts =
  document.getElementById("fake-number-products");

const cartProducts = [
  "Painel de Números Fake",
  "Painel de Seguidores",
  "Fornecedor de Streaming no DC",
  "Fornecedor de Robux no DC"
];

async function loadProducts() {

  const response = await fetch("/api/products");

  const data = await response.json();

  renderProducts(
    data.products.filter(
      product => product.category === "whatsapp"
    ),
    whatsappProducts
  );

  renderProducts(
    data.products.filter(
      product => product.category === "roblox"
    ),
    robloxProducts
  );

  renderProducts(
    data.products.filter(
      product => product.category === "fake-number"
    ),
    fakeNumberProducts
  );

  renderExtraProducts(data.extraProducts);
}

function money(value) {

  return Number(value)
    .toFixed(2)
    .replace(".", ",");
}

function renderProducts(products, container) {

  container.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("div");

    card.className = "product-card";

    let tutorial = "";

    if (product.tutorialPrice) {

      tutorial = `
        <div class="tutorial">
          + tutorial:
          <strong>
            R$ ${money(product.tutorialPrice)}
          </strong>
        </div>
      `;
    }

    const canAddToCart =
      cartProducts.includes(product.name);

    card.innerHTML = `
      <div class="product-icon">
        (˵◝ ⩊ ◜˵マ
      </div>

      <h3>
        ${
          product.category === "fake-number"
            ? product.name
            : (product.quantity || product.name)
        }
      </h3>

      <div class="extra-price">
        R$ ${money(product.price)}
      </div>

      ${tutorial}

      ${
        canAddToCart
          ? `
            <button
              type="button"
              class="cart-heart"
              onclick='event.stopPropagation(); addToCart(${JSON.stringify(product)})'
              aria-label="Adicionar ao carrinho"
            >
              <span>+</span>
            </button>
          `
          : `
            <button
              type="button"
              class="buy-button"
              onclick='buyProduct(${JSON.stringify(product)})'
            >
              Comprar
            </button>
          `
      }
    `;

    container.appendChild(card);
  });
}

function renderExtraProducts(products) {

  extraProducts.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("div");

    card.className = "extra-card";

    let tutorial = "";

    if (product.tutorialPrice) {

      tutorial = `
        <div class="tutorial">
          + tutorial:
          <strong>
            R$ ${money(product.tutorialPrice)}
          </strong>
        </div>
      `;
    }

    card.innerHTML = `
      <h3>
        ${product.name}
      </h3>

      <div class="extra-price">
        R$ ${money(product.price)}
      </div>

      ${tutorial}

      <div class="product-actions">

        <button
          type="button"
          class="buy-button"
          onclick='buyProduct(${JSON.stringify(product)})'
        >
          Comprar
        </button>

        ${
          cartProducts.includes(product.name)
            ? `
              <button
                type="button"
                class="cart-heart"
                onclick='event.stopPropagation(); addToCart(${JSON.stringify(product)})'
                aria-label="Adicionar ao carrinho"
              >
                <span>+</span>
              </button>
            `
            : ""
        }

      </div>
    `;

    extraProducts.appendChild(card);
  });
}

function closePayment() {

  document
    .getElementById("payment-modal")
    .classList.add("hidden");

  document
    .getElementById("terms-content")
    .classList.add("hidden");

  document
    .getElementById("payment-content")
    .classList.remove("hidden");
}

function nextToPayment() {

  document
    .getElementById("terms-content")
    .classList.add("hidden");

  document
    .getElementById("payment-content")
    .classList.remove("hidden");

  document
    .getElementById("payment-product")
    .textContent =
      selectedProduct.quantity
        ? `Seguidores: ${selectedProduct.quantity}`
        : selectedProduct.name;

  document
    .getElementById("payment-price")
    .textContent =
      money(selectedProduct.price);
}

function addToCart(product) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

  cart.push(product);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  updateCartCount();

  renderCart();

  showCartNotification();
}

function showCartNotification() {

  const oldNotification =
    document.getElementById("cart-notification");

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification =
    document.createElement("div");

  notification.id = "cart-notification";

  notification.innerHTML = `
    <div class="cart-notification-title">
      Moccia Store
    </div>

    <div class="cart-notification-message">
      Produto adicionado ao carrinho
    </div>

    <button
      type="button"
      class="cart-notification-ok"
      onclick="document.getElementById('cart-notification').remove()"
    >
      ok
    </button>
  `;

  document.body.appendChild(notification);
}

async function buyProduct(product) {

  selectedProduct = product;

  if (product.category === "whatsapp") {

    document
      .getElementById("payment-content")
      .classList.add("hidden");

    document
      .getElementById("terms-content")
      .classList.remove("hidden");

    document
      .getElementById("payment-modal")
      .classList.remove("hidden");

    return;
  }

  document
    .getElementById("payment-product")
    .textContent =
      product.quantity
        ? `Seguidores: ${product.quantity}`
        : product.name;

  document
    .getElementById("payment-price")
    .textContent =
      money(product.price);

  document
    .getElementById("pix-code")
    .value =
      "gojosatorunaomorreu@gmail.com";

  document
    .getElementById("payment-modal")
    .classList.remove("hidden");
}

async function copyPix() {

  const email =
    "gojosatorunaomorreu@gmail.com";

  await navigator.clipboard.writeText(email);

  alert("Chave PIX copiada!");
}

function closeCart() {

  document
    .getElementById("cart-modal")
    .classList.add("hidden");
}

function updateCartCount() {

  const cart =
    JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

  const count =
    document.getElementById("cart-count");

  if (count) {
    count.textContent = cart.length;
  }
}

function renderCart() {

  const cart =
    JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

  const container =
    document.getElementById("cart-items");

  const totalElement =
    document.getElementById("cart-total");

  const buyButton =
    document.querySelector(".cart-buy");

  if (!container || !totalElement) {
    return;
  }

  container.innerHTML = "";

  let total = 0;

  if (buyButton) {
    buyButton.disabled =
      cart.length === 0;
  }

  cart.forEach((product, index) => {

    total += Number(product.price);

    const item =
      document.createElement("div");

    item.className = "cart-item";

    item.innerHTML = `
      <div>
        <strong>
          ${
            product.quantity
              ? `Seguidores: ${product.quantity}`
              : product.name
          }
        </strong>

        <div>
          R$ ${money(product.price)}
        </div>
      </div>

      <button
        type="button"
        class="remove-cart-item"
      >
        ×
      </button>
    `;

    container.appendChild(item);

    item
      .querySelector(".remove-cart-item")
      .addEventListener(
        "click",
        (event) => {
          event.stopPropagation();
          removeFromCart(index);
        }
      );
  });

  totalElement.textContent =
    money(total);
}

function removeFromCart(index) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

  cart.splice(index, 1);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  updateCartCount();

  renderCart();
}

function openCart() {

  renderCart();

  document
    .getElementById("cart-modal")
    .classList.remove("hidden");
}

function buyCart() {

  const cart =
    JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

  if (cart.length === 0) {
    return;
  }

  const total =
    cart.reduce(
      (sum, product) =>
        sum + Number(product.price),
      0
    );

  selectedProduct = {
    name: "Compra do carrinho",
    price: total
  };

  document
    .getElementById("payment-product")
    .textContent =
      `${cart.length} produto(s) no carrinho`;

  document
    .getElementById("payment-price")
    .textContent =
      money(total);

  closeCart();

  document
    .getElementById("payment-modal")
    .classList.remove("hidden");

  document
    .getElementById("terms-content")
    .classList.remove("hidden");

  document
    .getElementById("payment-content")
    .classList.add("hidden");
}

loadProducts();
updateCartCount();

// Efeito de toque duplo rápido
let lastTap = 0;

document.addEventListener("pointerup", function (event) {

  const now = Date.now();

  if (now - lastTap < 250) {

    const img =
      document.createElement("img");

    img.src = "/efeito.png";

    img.className =
      "double-click-effect";

    const offsetX =
      Math.random() * 30 - 15;

    const offsetY =
      Math.random() * 30 - 15;

    const rotation =
      Math.random() * 50 - 25;

    img.style.left =
      `${event.clientX + offsetX}px`;

    img.style.top =
      `${event.clientY + offsetY}px`;

    img.style.setProperty(
      "--rotation",
      `${rotation}deg`
    );

    document.body.appendChild(img);

    setTimeout(() => {
      img.remove();
    }, 450);
  }

  lastTap = now;
});

const welcomeCharacter = document.querySelector(".welcome-character");

if (welcomeCharacter) {

  welcomeCharacter.addEventListener("click", () => {

    const colors = [
      "#4da6ff",
      "#ff69b4",
      "#7dc8ff",
      "#ff9bd2"
    ];

    const rect = welcomeCharacter.getBoundingClientRect();

    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < 18; i++) {

      const confetti = document.createElement("span");

      confetti.className = "confetti";

      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      confetti.style.left = `${originX}px`;
      confetti.style.top = `${originY}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = 35 + Math.random() * 55;

      confetti.style.setProperty(
        "--x",
        `${Math.cos(angle) * distance}px`
      );

      confetti.style.setProperty(
        "--y",
        `${Math.sin(angle) * distance}px`
      );

      confetti.style.setProperty(
        "--r",
        `${Math.random() * 720 - 360}deg`
      );

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 650);
    }

  });

}
