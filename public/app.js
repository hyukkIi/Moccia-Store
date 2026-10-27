
function showReceiveInstructions(product = selectedProduct) {
  const isWhatsapp = !!product && (
    product.category === "whatsapp" ||
    product.category === "whatsapp-br"
  );

  const noteIds = [
    "extra-receive-note",
    "followers-receive-note"
  ];

  const linkIds = [
    "extra-receive-link",
    "followers-receive-link"
  ];

  noteIds.forEach(function(id) {
    const note = document.getElementById(id);
    if (note) {
      note.textContent =
        "Depois de pagar, clique abaixo para enviar o comprovante e receber o produto";
      note.classList.toggle(
        "hidden",
        id === "followers-receive-note" ? !isWhatsapp : isWhatsapp
      );
      note.style.display = (
        id === "followers-receive-note" ? isWhatsapp : !isWhatsapp
      ) ? "block" : "none";
    }
  });

  linkIds.forEach(function(id) {
    const link = document.getElementById(id);
    if (link) {
      const show = (
        id === "followers-receive-link" ? isWhatsapp : !isWhatsapp
      );
      link.classList.toggle("hidden", !show);
      link.style.display = show ? "block" : "none";
    }
  });
}

const visitorId = localStorage.getItem("moccia_visitor_id") ||
  (() => {
    const id = crypto.randomUUID();
    localStorage.setItem("moccia_visitor_id", id);
    return id;
  })();

fetch("/api/visit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ visitorId })
});

let selectedProduct = null;

const whatsappProducts =
  document.getElementById("whatsapp-products");

const whatsappBrProducts =
  document.getElementById("whatsapp-br-products");

const robloxProducts =
  document.getElementById("roblox-products");

const extraProducts =
  document.getElementById("extra-products");

const fakeNumberProducts =
  document.getElementById("fake-number-products");

const tiktokProducts =
  document.getElementById("tiktok-products");

const instagramProducts =
  document.getElementById("instagram-products");

const cartProducts = [
  "Painel de Números Fake",
  "Painel de Seguidores",
  "Fornecedor de Streaming no DC",
  "Fornecedor de Robux no DC",
  "APK Premium para Bot de Divulgação"
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
      product => product.category === "whatsapp-br"
    ),
    whatsappBrProducts
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

  renderProducts(
    data.products.filter(
      product => product.category === "tiktok"
    ),
    tiktokProducts
  );

  renderProducts(
    data.products.filter(
      product => product.category === "instagram"
    ),
    instagramProducts
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
  showReceiveInstructions();


  document
    .getElementById("terms-content")
    .classList.add("hidden");

  document
    .getElementById("payment-content")
    .classList.remove("hidden");

  const isWhatsapp =
    selectedProduct.category === "whatsapp" ||
    selectedProduct.category === "whatsapp-br";

  const receiveLink = document.getElementById("followers-receive-link");
  if (receiveLink) {
    receiveLink.classList.toggle("hidden", !isWhatsapp);
  }

  const extraReceiveLink = document.getElementById("extra-receive-link");
  const extraReceiveNote = document.getElementById("extra-receive-note");

  if (extraReceiveLink) {
    extraReceiveLink.classList.toggle("hidden", isWhatsapp);
  }

  if (extraReceiveNote) {
    extraReceiveNote.classList.toggle("hidden", isWhatsapp);
  }

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

function updateCartCount() {
  const cart = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const counter = document.getElementById("cart-count");

  if (counter) {
    counter.textContent = cart.length;
  }
}

function addToCart(product) {

  if (
    product.name === "Painel de Números Fake" ||
    product.name === "Painel de Seguidores"
  ) {

    showTutorialChoice(product);

    return;
  }

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

function showTutorialChoice(product) {

  const oldModal =
    document.getElementById("tutorial-choice-modal");

  if (oldModal) {
    oldModal.remove();
  }

  const modal =
    document.createElement("div");

  modal.id = "tutorial-choice-modal";

  modal.innerHTML = `
    <div class="tutorial-choice-box">

      <button
        type="button"
        class="tutorial-choice-close"
        onclick="document.getElementById('tutorial-choice-modal').remove()"
      >
        ×
      </button>

      <h2>
        Deseja comprar apenas o produto,
        ou o produto + vídeo tutorial?
      </h2>

      <div class="tutorial-choice-options">

        <button
          type="button"
          class="tutorial-choice-option"
          onclick='confirmTutorialChoice(${JSON.stringify(product)}, false)'
        >
          <span class="choice-icon">📦</span>

          <strong>
            Apenas o produto
          </strong>

          <span>
            R$ ${money(product.price)}
          </span>
        </button>

        <button
          type="button"
          class="tutorial-choice-option"
          onclick='confirmTutorialChoice(${JSON.stringify(product)}, true)'
        >
          <span class="choice-icon">🎥</span>

          <strong>
            Produto + tutorial
          </strong>

          <span>
            R$ ${money(product.tutorialPrice)}
          </span>
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);
}

function showTutorialChoiceBuy(product) {

  const oldModal =
    document.getElementById("tutorial-choice-modal");

  if (oldModal) {
    oldModal.remove();
  }

  const modal =
    document.createElement("div");

  modal.id = "tutorial-choice-modal";

  modal.innerHTML = `
    <div class="tutorial-choice-box">

      <button
        type="button"
        class="tutorial-choice-close"
        onclick="document.getElementById('tutorial-choice-modal').remove()"
      >
        ×
      </button>

      <h2>
        Deseja comprar apenas o produto,
        ou o produto + vídeo tutorial?
      </h2>

      <div class="tutorial-choice-options">

        <button
          type="button"
          class="tutorial-choice-option"
          onclick='confirmTutorialBuy(${JSON.stringify(product)}, false)'
        >
          <span class="choice-icon">📦</span>

          <strong>
            Apenas o produto
          </strong>

          <span>
            R$ ${money(product.price)}
          </span>
        </button>

        <button
          type="button"
          class="tutorial-choice-option"
          onclick='confirmTutorialBuy(${JSON.stringify(product)}, true)'
        >
          <span class="choice-icon">🎥</span>

          <strong>
            Produto + tutorial
          </strong>

          <span>
            R$ ${money(product.tutorialPrice)}
          </span>
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);
}

function confirmTutorialChoice(product, withTutorial) {

  const modal =
    document.getElementById("tutorial-choice-modal");

  if (modal) {
    modal.remove();
  }

  const selectedProduct = {
    ...product,
    price: withTutorial ? product.tutorialPrice : product.price,
    tutorialSelected: withTutorial
  };

  let cart =
    JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

  cart.push(selectedProduct);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  updateCartCount();

  renderCart();

  showCartNotification();
}

function confirmTutorialBuy(product, withTutorial) {

  const modal = document.getElementById("tutorial-choice-modal");

  if (modal) {
    modal.remove();
  }

  const selectedProduct = {
    ...product,
    price: withTutorial ? product.tutorialPrice : product.price,
    tutorialSelected: withTutorial
  };

  buyProduct(selectedProduct);
}

function showCartNotification() {

  const oldOverlay =
    document.getElementById("cart-notification-overlay");

  if (oldOverlay) {
    oldOverlay.remove();
  }

  const overlay =
    document.createElement("div");

  overlay.id = "cart-notification-overlay";

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
    >
      ok
    </button>
  `;

  overlay.appendChild(notification);

  document.body.appendChild(overlay);

  document.body.classList.add("notification-open");

  function closeNotification() {

    overlay.remove();

    document.body.classList.remove(
      "notification-open"
    );
  }

  notification
    .querySelector(".cart-notification-ok")
    .addEventListener(
      "click",
      closeNotification
    );

  overlay.addEventListener(
    "click",
    function(event) {

      if (event.target === overlay) {
        closeNotification();
      }

    }
  );
}

function showSocialWarning(onContinue) {
  const oldModal = document.getElementById("social-warning-modal");
  if (oldModal) oldModal.remove();

  const modal = document.createElement("div");
  modal.id = "social-warning-modal";
  modal.className = "modal";

  const box = document.createElement("div");
  box.className = "modal-box social-warning-box";

  const title = document.createElement("h2");
  title.textContent = "Aviso importante";
  box.appendChild(title);

  const content = document.createElement("div");
  content.className = "social-warning-text";

  const paragraphs = [
    "Após o pagamento, NÃO faço reembolso, independentemente da situação.",
    "🌺 Ao comprar, você está ciente de que existe uma chance de 40% a 50% de seus seguidores comprados caírem depois. Não acontece sempre, mas pode acontecer.",
    "🦩 Você está ciente de que nossa venda é terceirizada. Dependemos do nosso fornecedor para isso.",
    "🌺 Os seguidores (ou curtidas) começam a cair em cerca de 20 a 40 minutos, com prazo de até 48 horas. Tenha paciência.",
    "🦩 Não mude o @ da conta durante pelo menos 1 mês."
  ];

  paragraphs.forEach(function(text) {
    const p = document.createElement("p");
    p.textContent = text;
    content.appendChild(p);
  });

  box.appendChild(content);

  const actions = document.createElement("div");
  actions.className = "social-warning-actions";

  const back = document.createElement("button");
  back.type = "button";
  back.className = "social-warning-back";
  back.textContent = "Voltar";
  back.addEventListener("click", function() { modal.remove(); });

  const proceed = document.createElement("button");
  proceed.type = "button";
  proceed.className = "next-button";
  proceed.textContent = "Li e estou ciente, continuar";
  proceed.addEventListener("click", function() {
    modal.remove();
    onContinue();
  });

  actions.appendChild(back);
  actions.appendChild(proceed);
  box.appendChild(actions);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

async function buyProduct(product) {

  if (product.category === "tiktok" || product.category === "instagram") {
    showSocialWarning(function() {
      continueBuyProduct(product);
    });
    return;
  }

  continueBuyProduct(product);
}

async function continueBuyProduct(product) {



  if (
    (product.name === "Painel de Números Fake" ||
     product.name === "Painel de Seguidores") &&
    typeof product.tutorialSelected !== "boolean"
  ) {
    showTutorialChoiceBuy(product);
    return;
  }

  selectedProduct = product;
  showReceiveInstructions(product);
  showReceiveInstructions(product);

  const isWhatsapp =
    product.category === "whatsapp" ||
    product.category === "whatsapp-br";

  const extraReceiveLink = document.getElementById("extra-receive-link");
  const extraReceiveNote = document.getElementById("extra-receive-note");
  const followersReceiveLink = document.getElementById("followers-receive-link");
  const followersReceiveNote = document.getElementById("followers-receive-note");

  const showExtraLink = !isWhatsapp;
  const showFollowersLink = false;

  if (extraReceiveLink) {
    extraReceiveLink.classList.toggle("hidden", !showExtraLink);
  }
  if (extraReceiveNote) {
    extraReceiveNote.classList.toggle("hidden", !showExtraLink);
  }
  if (followersReceiveLink) {
    followersReceiveLink.classList.toggle("hidden", !showFollowersLink);
  }
  if (followersReceiveNote) {
    followersReceiveNote.classList.toggle("hidden", !showFollowersLink);
  }

  if (product.category === "whatsapp" || product.category === "whatsapp-br") {

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
  const email = "gojosatorunaomorreu@gmail.com";

  try {
    await navigator.clipboard.writeText(email);

    const oldToast = document.getElementById("pix-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.id = "pix-toast";
    toast.innerHTML = `
      <span class="pix-toast-icon">✓</span>
      <span>
        <strong>Chave Pix copiada!</strong>
        <small>Prontinha para você colar 🩵</small>
      </span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("pix-toast-hide");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  } catch (error) {
    alert("Não foi possível copiar a chave Pix.");
  }
}

function closeCart() {
  document
    .getElementById("cart-modal")
    .classList.add("hidden");
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
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (cart.length === 0) return;

  if (cart.some(function(product) {
    return product.category === "tiktok" ||
           product.category === "instagram";
  })) {
    showSocialWarning(function() {
      processCartPurchase();
    });
    return;
  }

  processCartPurchase();
}

function processCartPurchase() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (cart.length === 0) return;

  const total = cart.reduce(
    (sum, product) => sum + Number(product.price),
    0
  );

  selectedProduct = {
    name: "Compra do carrinho",
    price: total,
    category: cart.some(product =>
      product.category === "whatsapp" ||
      product.category === "whatsapp-br"
    ) ? "whatsapp" : "cart"
  };

  showReceiveInstructions(selectedProduct);

  showReceiveInstructions(selectedProduct);

  document.getElementById("payment-product").textContent =
    `${cart.length} produto(s) no carrinho`;

  document.getElementById("payment-price").textContent = money(total);

  closeCart();

  const hasWhatsAppFollowers = cart.some(product =>
    product.category === "whatsapp" ||
    product.category === "whatsapp-br"
  );

  document.getElementById("payment-modal").classList.remove("hidden");
  document.getElementById("terms-content").classList.toggle("hidden", !hasWhatsAppFollowers);
  document.getElementById("payment-content").classList.toggle("hidden", hasWhatsAppFollowers);
}

loadProducts();

updateCartCount();

// Efeito de toque duplo rápido
let lastTap = 0;

document.addEventListener(
  "pointerup",
  function(event) {

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
  }
);

const welcomeCharacter =
  document.querySelector(".welcome-character");

if (welcomeCharacter) {

  welcomeCharacter.addEventListener(
    "click",
    () => {

      const colors = [
        "#4da6ff",
        "#ff69b4",
        "#7dc8ff",
        "#ff9bd2"
      ];

      const rect =
        welcomeCharacter.getBoundingClientRect();

      const originX =
        rect.left + rect.width / 2;

      const originY =
        rect.top + rect.height / 2;

      for (let i = 0; i < 18; i++) {

        const confetti =
          document.createElement("span");

        confetti.className =
          "confetti";

        confetti.style.background =
          colors[
            Math.floor(
              Math.random() * colors.length
            )
          ];

        confetti.style.left =
          `${originX}px`;

        confetti.style.top =
          `${originY}px`;

        const angle =
          Math.random() * Math.PI * 2;

        const distance =
          35 + Math.random() * 55;

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

    }
  );
}

// =========================


// CALCULADORA DE VOTOS MOCCIA
(() => {
  const quantityInput = document.getElementById('votes-quantity');
  const priceDisplay = document.getElementById('votes-price');
  const errorDisplay = document.getElementById('votes-error');
  const buyButton = document.getElementById('votes-buy');
  const paymentPanel = document.getElementById('votes-payment');
  const copyButton = document.getElementById('votes-copy-pix');
  const copyStatus = document.getElementById('votes-copy-status');

  if (!quantityInput || !priceDisplay || !buyButton || !paymentPanel) return;

  const prices = [
    80,110,140,150,160,180,200,220,250,280,
    290,300,310,320,330,340,350,360,370,380,
    390,400,410,420,430,440,450,460,470,480,
    490,500,510,520,530,540,550,560,570,580,
    590,600,610,620,630,640,650,660,670,680,
    690,700,710,720,730,740,750,760,770,780,
    790,800,810,820,830,840,850,860,870,880,
    890,900,910,920,930,940,950,960,970,980,
    990,1000,1010,1020,1030,1040,1050,1060,1070,1080,
    1090,1100,1110,1120,1130,1140,1150,1160,1170,1180
  ];

  function getPriceCents(quantity) {
    const lowerQuantity = Math.floor(quantity / 10) * 10;
    const upperQuantity = Math.ceil(quantity / 10) * 10;

    const lowerIndex = lowerQuantity / 10 - 1;
    const upperIndex = upperQuantity / 10 - 1;

    if (quantity % 10 === 0) {
      return prices[lowerIndex];
    }

    if (lowerIndex < 0 || upperIndex >= prices.length) {
      return null;
    }

    const lowerPrice = prices[lowerIndex];
    const upperPrice = prices[upperIndex];

    return Math.round(
      lowerPrice + (upperPrice - lowerPrice) *
      ((quantity - lowerQuantity) / 10)
    );
  }

  function formatPrice(cents) {
    return 'R$ ' + (cents / 100).toFixed(2).replace('.', ',');
  }

  function updatePrice() {
    const quantity = Number(quantityInput.value);
    const valid = Number.isInteger(quantity) &&
      quantity >= 10 && quantity <= 5000;

    paymentPanel.hidden = true;
    copyStatus.textContent = '';

    if (!valid) {
      errorDisplay.textContent = 'Escolha uma quantidade inteira de 10 a 5.000.';
      priceDisplay.textContent = '—';
      buyButton.disabled = true;
      return false;
    }

    const price = getPriceCents(quantity);

    if (price === null || price === undefined) {
      errorDisplay.textContent =
        'Ainda não há preço cadastrado para essa quantidade.';
      priceDisplay.textContent = '—';
      buyButton.disabled = true;
      return false;
    }

    errorDisplay.textContent = '';
    priceDisplay.textContent = formatPrice(price);
    buyButton.disabled = false;
    return true;
  }

  quantityInput.addEventListener('input', updatePrice);

  buyButton.addEventListener('click', () => {
    if (!updatePrice()) return;
    paymentPanel.hidden = false;
    paymentPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  copyButton.addEventListener('click', async () => {
    const pixKey = 'gojosatorunaomorreu@gmail.com';

    try {
      await navigator.clipboard.writeText(pixKey);
      copyStatus.textContent = 'Chave Pix copiada!';
    } catch {
      const temp = document.createElement('textarea');
      temp.value = pixKey;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      const copied = document.execCommand('copy');
      temp.remove();
      copyStatus.textContent = copied
        ? 'Chave Pix copiada!'
        : 'Não foi possível copiar. Copie a chave manualmente.';
    }
  });

  updatePrice();
})();


// =========================
// REVIEWS_API_MOCCIA
// =========================
(() => {
  const form = document.getElementById("review-form");
  const list = document.getElementById("reviews-list");
  const loading = document.getElementById("reviews-loading");
  const status = document.getElementById("review-status");
  const submitButton = document.getElementById("review-submit");
  const editButton = document.getElementById("review-edit");

  if (!form || !list || !loading || !status || !submitButton) return;

  const fields = {
    nickname: document.getElementById("review-nickname"),
    siteAnswer: document.getElementById("review-site"),
    organizationAnswer: document.getElementById("review-organization"),
    pricesAnswer: document.getElementById("review-prices"),
    reliableAnswer: document.getElementById("review-reliable")
  };

  const tokenKey = "moccia_store_review_token_v1";
  let visitorToken = null;

  try {
    visitorToken = localStorage.getItem(tokenKey);
    if (!visitorToken) {
      visitorToken = crypto.randomUUID();
      localStorage.setItem(tokenKey, visitorToken);
    }
  } catch {
    status.textContent =
      "Seu navegador bloqueou o armazenamento local. Ative-o para publicar e editar avaliações.";
    submitButton.disabled = true;
    return;
  }

  function addText(parent, tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value == null ? "" : String(value);
    parent.appendChild(element);
    return element;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR");
  }

  function renderReviews(reviews) {
    list.replaceChildren();

    if (!reviews.length) {
      addText(list, "div", "review-empty",
        "Ainda não há avaliações publicadas. Seja a primeira pessoa a avaliar! 💙");
      return;
    }

    for (const review of reviews) {
      const card = document.createElement("article");
      card.className = "review-card";

      const header = document.createElement("div");
      header.className = "review-card-header";
      addText(header, "h4", "", review.nickname);
      addText(header, "span", "review-card-rating",
        "★".repeat(Number(review.rating)) +
        "☆".repeat(5 - Number(review.rating)));

      card.appendChild(header);
      addText(card, "div", "review-card-date",
        "Publicado em " + formatDate(review.created_at));

      const answers = [
        ["O que achou do site?", review.site_answer],
        ["Organização", review.organization_answer],
        ["Preços", review.prices_answer],
        ["Confiável?", review.reliable_answer]
      ];

      for (const [label, answer] of answers) {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = label + " ";
        paragraph.appendChild(strong);
        paragraph.appendChild(document.createTextNode(String(answer || "")));
        card.appendChild(paragraph);
      }

      list.appendChild(card);
    }
  }

  async function loadReviews() {
    loading.hidden = false;
    loading.textContent = "Carregando avaliações...";
    try {
      const response = await fetch("/api/reviews");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível carregar as avaliações.");
      }
      renderReviews(Array.isArray(data.reviews) ? data.reviews : []);
      loading.hidden = true;
    } catch (error) {
      loading.hidden = false;
      loading.textContent =
        error.message || "Não foi possível carregar as avaliações.";
    }
  }

  editButton?.addEventListener("click", () => {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    fields.nickname.focus();
    status.textContent = "Edite os campos e publique novamente para atualizar sua avaliação.";
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "";

    const ratingInput = form.querySelector('input[name="rating"]:checked');
    if (!ratingInput) {
      status.textContent = "Escolha uma nota de 1 a 5 estrelas.";
      return;
    }

    const payload = {
      visitorToken,
      nickname: fields.nickname.value.trim(),
      siteAnswer: fields.siteAnswer.value.trim(),
      organizationAnswer: fields.organizationAnswer.value.trim(),
      pricesAnswer: fields.pricesAnswer.value.trim(),
      reliableAnswer: fields.reliableAnswer.value.trim(),
      rating: Number(ratingInput.value)
    };

    if (
      payload.nickname.length < 2 ||
      payload.nickname.length > 30 ||
      !payload.siteAnswer ||
      !payload.organizationAnswer ||
      !payload.pricesAnswer ||
      !payload.reliableAnswer
    ) {
      status.textContent = "Preencha o apelido e todas as quatro respostas.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Publicando...";

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível publicar.");
      }

      status.textContent = "Avaliação publicada com sucesso! 💙";
      submitButton.textContent = "Atualizar avaliação";
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      await loadReviews();
    } catch (error) {
      status.textContent =
        error.message || "Erro ao publicar. Tente novamente.";
    } finally {
      submitButton.disabled = false;
      if (submitButton.textContent === "Publicando...") {
        submitButton.textContent = "Publicar avaliação";
      }
    }
  });

  loadReviews();
})();
