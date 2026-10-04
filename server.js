const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const QRCode = require("qrcode");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


/* =========================
   PRODUTOS
========================= */

const products = [

  // WHATSAPP

  {
    id: "whatsapp-50",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "50",
    price: 1.50
  },

  {
    id: "whatsapp-70",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "70",
    price: 2.00
  },

  {
    id: "whatsapp-100",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "100",
    price: 3.90
  },

  {
    id: "whatsapp-200",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "200",
    price: 4.90
  },

  {
    id: "whatsapp-300",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "300",
    price: 5.90
  },

  {
    id: "whatsapp-400",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "400",
    price: 6.50
  },

  {
    id: "whatsapp-500",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "500",
    price: 7.50
  },

  {
    id: "whatsapp-600",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "600",
    price: 8.50
  },

  {
    id: "whatsapp-700",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "700",
    price: 9.50
  },

  {
    id: "whatsapp-800",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "800",
    price: 10.50
  },

  {
    id: "whatsapp-900",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "900",
    price: 12.50
  },

  {
    id: "whatsapp-1k",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "1K",
    price: 15.50
  },


  // ROBLOX

  {
    id: "roblox-50",
    name: "Robux",
    category: "roblox",
    quantity: "50",
    price: 1.60
  },

  {
    id: "roblox-70",
    name: "Robux",
    category: "roblox",
    quantity: "70",
    price: 2.00
  },

  {
    id: "roblox-100",
    name: "Robux",
    category: "roblox",
    quantity: "100",
    price: 3.00
  },

  {
    id: "roblox-200",
    name: "Robux",
    category: "roblox",
    quantity: "200",
    price: 3.80
  },

  {
    id: "roblox-300",
    name: "Robux",
    category: "roblox",
    quantity: "300",
    price: 4.50
  },

  {
    id: "roblox-400",
    name: "Robux",
    category: "roblox",
    quantity: "400",
    price: 5.50
  },

  {
    id: "roblox-500",
    name: "Robux",
    category: "roblox",
    quantity: "500",
    price: 7.50
  },

  {
    id: "roblox-600",
    name: "Robux",
    category: "roblox",
    quantity: "600",
    price: 8.50
  },

  {
    id: "roblox-700",
    name: "Robux",
    category: "roblox",
    quantity: "700",
    price: 9.50
  },

  {
    id: "roblox-800",
    name: "Robux",
    category: "roblox",
    quantity: "800",
    price: 10.50
  },

  {
    id: "roblox-900",
    name: "Robux",
    category: "roblox",
    quantity: "900",
    price: 11.50
  },

  {
    id: "roblox-1k",
    name: "Robux",
    category: "roblox",
    quantity: "1K",
    price: 13.00
  }

];


/* =========================
   PRODUTOS EXTRAS
========================= */

const extraProducts = [

  {
    id: "fornecedor-robux",
    name: "Fornecedor de Robux no DC",
    price: 2.00
  },

  {
    id: "fornecedor-streaming",
    name: "Fornecedor de Streaming no DC",
    price: 3.00
  },

  {
    id: "painel-seguidores",
    name: "Painel de Seguidores",
    price: 10.00,
    tutorialPrice: 13.00
  },

  {
    id: "painel-numeros",
    name: "Painel de Números Fake",
    price: 10.00,
    tutorialPrice: 13.00
  }

];


/* =========================
   API DE PRODUTOS
========================= */

app.get("/api/products", (req, res) => {

  res.json({
    products,
    extraProducts
  });

});


/* =========================
   PIX
========================= */

app.post("/api/pix", async (req, res) => {

  try {

    const { productId } = req.body;

    if (!productId) {

      return res.status(400).json({
        success: false,
        message: "Produto não informado."
      });

    }


    // Produtos válidos ficam no servidor.
    // O preço enviado pelo navegador NÃO é confiável.

    const allProducts = [
      ...products,
      ...extraProducts
    ];


    const product = allProducts.find(
      item => item.id === productId
    );


    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Produto não encontrado."
      });

    }


    const pixKey = process.env.PIX_KEY;


    if (!pixKey) {

      return res.status(500).json({
        success: false,
        message: "A chave Pix ainda não foi configurada."
      });

    }


    const whatsappNumber =
      process.env.WHATSAPP_NUMBER;


    const pixPayload = pixKey;


    const qrCode =
      await QRCode.toDataURL(pixPayload);


    res.json({

      success: true,

      qrCode,

      pixCode: pixPayload,

      whatsappNumber,

      amount: Number(product.price).toFixed(2)

    });


  } catch (error) {

    console.error(error);


    res.status(500).json({

      success: false,

      message: "Não foi possível gerar o pagamento."

    });

  }

});


/* =========================
   PÁGINA NÃO ENCONTRADA
========================= */

app.use((req, res) => {

  res.status(404).send("Página não encontrada.");

});


/* =========================
   SERVIDOR
========================= */

app.listen(PORT, () => {

  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );

});
