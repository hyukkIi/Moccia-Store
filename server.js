const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const QRCode = require("qrcode");
const { Pool } = require("pg");
const session = require("express-session");
const crypto = require("crypto");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS store_visits (
    id SERIAL PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => {
  console.error("Erro ao criar tabela de visitas:", err);
});


const reviewsTableReady = pool.query(`
  CREATE TABLE IF NOT EXISTS store_reviews (
    id SERIAL PRIMARY KEY,
    visitor_token TEXT NOT NULL UNIQUE,
    nickname VARCHAR(30) NOT NULL,
    site_answer VARCHAR(500) NOT NULL,
    organization_answer VARCHAR(500) NOT NULL,
    prices_answer VARCHAR(500) NOT NULL,
    reliable_answer VARCHAR(500) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => {
  console.error("Avaliações indisponíveis: PostgreSQL não conectado.");
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
  secret: process.env.SESSION_SECRET || "moccia-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/visit", async (req, res) => {
  try {
if (!req.session.visitorId) {
  req.session.visitorId = crypto.randomUUID();
}

const visitorId = req.session.visitorId;

    await pool.query(
      "INSERT INTO store_visits (visitor_id) VALUES ($1)",
      [visitorId]
    );

    res.json({ success: true });

  } catch (error) {
    console.error("Erro ao registrar visita:", error);
    res.status(500).json({ error: "Erro ao registrar visita" });
  }
});

app.get("/api/visit-stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_views,
        COUNT(DISTINCT visitor_id) AS unique_visitors
      FROM store_visits
    `);

    res.json({
      totalViews: Number(result.rows[0].total_views),
      uniqueVisitors: Number(result.rows[0].unique_visitors)
    });

  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      error: "Erro ao buscar estatísticas"
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   PRODUTOS
========================= */

const products = [

  // WHATSAPP

  // WHATSAPP

  {
    id: "whatsapp-100",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "100",
    price: 1.90
  },

  {
    id: "whatsapp-200",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "200",
    price: 2.80
  },

  {
    id: "whatsapp-300",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "300",
    price: 3.80
  },

  {
    id: "whatsapp-400",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "400",
    price: 4.80
  },

  {
    id: "whatsapp-500",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "500",
    price: 5.80
  },

  {
    id: "whatsapp-600",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "600",
    price: 6.80
  },

  {
    id: "whatsapp-700",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "700",
    price: 7.80
  },

  {
    id: "whatsapp-800",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "800",
    price: 8.80
  },

  {
    id: "whatsapp-900",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "900",
    price: 9.80
  },

  {
    id: "whatsapp-1k",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "1K",
    price: 13.00
  },

  {
    id: "whatsapp-2k",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "2K",
    price: 17.00
  },

  {
    id: "whatsapp-3k",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "3K",
    price: 21.00
  },

  {
    id: "whatsapp-5k",
    name: "Seguidores WhatsApp",
    category: "whatsapp",
    quantity: "5K",
    price: 31.00
  },


  // SEGUIDORES BRASILEIROS PARA WHATSAPP

  {
    id: "whatsapp-br-100",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "100",
    price: 4.00
  },

  {
    id: "whatsapp-br-200",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "200",
    price: 6.00
  },

  {
    id: "whatsapp-br-300",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "300",
    price: 7.00
  },

  {
    id: "whatsapp-br-400",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "400",
    price: 9.50
  },

  {
    id: "whatsapp-br-500",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "500",
    price: 13.00
  },

  {
    id: "whatsapp-br-600",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "600",
    price: 16.00
  },

  {
    id: "whatsapp-br-700",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "700",
    price: 17.50
  },

  {
    id: "whatsapp-br-800",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "800",
    price: 19.00
  },

  {
    id: "whatsapp-br-900",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "900",
    price: 20.00
  },

  {
    id: "whatsapp-br-1k",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "1K",
    price: 25.00
  },

  {
    id: "whatsapp-br-2k",
    name: "Seguidores Brasileiros WhatsApp",
    category: "whatsapp-br",
    quantity: "2K",
    price: 45.00
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
  },

  // NÚMEROS FAKE

  {
    id: "fake-indonesia",
    name: "🇮🇩 Indonésia",
    category: "fake-number",
    quantity: "Número Fake",
    price: 6.00
  },



  {
    id: "fake-filipinas",
    name: "🇵🇭 Filipinas",
    category: "fake-number",
    quantity: "Número Fake",
    price: 6.00
  },

  {
    id: "fake-marrocos",
    name: "🇲🇦 Marrocos",
    category: "fake-number",
    quantity: "Número Fake",
    price: 9.50
  },




  {
    id: "fake-brasil",
    name: "🇧🇷 Brasil",
    category: "fake-number",
    quantity: "Número Fake",
    price: 27.50
  },




  {
    id: "fake-china",
    name: "🇨🇳 China",
    category: "fake-number",
    quantity: "Número Fake",
    price: 30.00
  }

];

/* =========================
   PRODUTOS EXTRAS
========================= */

const extraProducts = [

  {
    id: "fornecedor-robux",
    name: "Fornecedor de Robux no DC",
    price: 1.50
  },

  {
    id: "fornecedor-streaming",
    name: "Fornecedor de Streaming no DC",
    price: 1.50
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
  },
  {
    id: "apk-premium-divulgacao",
    name: "APK Premium para Bot de Divulgação",
    price: 9.00
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
   PAINEL DE ESTATÍSTICAS
========================= */

app.get("/admin", async (req, res) => {

  const senha = req.query.senha;

  if (senha !== process.env.ADMIN_PASSWORD) {
    return res.status(401).send("Acesso negado.");
  }

  try {

    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_views,
        COUNT(DISTINCT visitor_id) AS unique_visitors
      FROM store_visits
    `);

    const totalViews = Number(result.rows[0].total_views);
    const uniqueVisitors = Number(result.rows[0].unique_visitors);

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Painel Moccia Store</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            padding: 30px;
            text-align: center;
          }

          .card {
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,.1);
          }

          .stat {
            margin: 20px 0;
            padding: 20px;
            border-radius: 15px;
            background: #eee;
          }

          .number {
            font-size: 40px;
            font-weight: bold;
          }
        </style>
      </head>

      <body>

        <div class="card">

          <h1>📊 Moccia Store</h1>

          <div class="stat">
            <div>👥 Visitantes únicos</div>
            <div class="number">${uniqueVisitors}</div>
          </div>

          <div class="stat">
            <div>👁️ Visualizações</div>
            <div class="number">${totalViews}</div>
          </div>

        </div>

      </body>
      </html>
    `);

  } catch (error) {

    console.error("Erro no painel:", error);

    res.status(500).send("Erro ao carregar estatísticas.");

  }

});


/* =========================
   REVIEWS_API_MOCCIA
========================= */

app.get("/api/reviews", async (req, res) => {
  try {
    await reviewsTableReady;
    const result = await pool.query(`
      SELECT id, nickname, site_answer, organization_answer,
             prices_answer, reliable_answer, rating, created_at, updated_at
      FROM store_reviews
      ORDER BY updated_at DESC
      LIMIT 100
    `);
    res.json({ reviews: result.rows });
  } catch (error) {
    console.error("Erro ao listar avaliações:", error);
    res.status(500).json({ error: "Não foi possível carregar as avaliações." });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    await reviewsTableReady;

    const {
      visitorToken, nickname, siteAnswer, organizationAnswer,
      pricesAnswer, reliableAnswer, rating
    } = req.body || {};

    const fields = [
      [nickname, 2, 30],
      [siteAnswer, 1, 500],
      [organizationAnswer, 1, 500],
      [pricesAnswer, 1, 500],
      [reliableAnswer, 1, 500]
    ];

    if (
      typeof visitorToken !== "string" ||
      visitorToken.length < 20 ||
      visitorToken.length > 100 ||
      fields.some(([value, min, max]) =>
        typeof value !== "string" ||
        value.trim().length < min ||
        value.trim().length > max
      ) ||
      !Number.isInteger(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        error: "Confira o apelido, as quatro respostas e a nota de 1 a 5."
      });
    }

    const result = await pool.query(`
      INSERT INTO store_reviews
        (visitor_token, nickname, site_answer, organization_answer,
         prices_answer, reliable_answer, rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (visitor_token) DO UPDATE SET
        nickname = EXCLUDED.nickname,
        site_answer = EXCLUDED.site_answer,
        organization_answer = EXCLUDED.organization_answer,
        prices_answer = EXCLUDED.prices_answer,
        reliable_answer = EXCLUDED.reliable_answer,
        rating = EXCLUDED.rating,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, nickname, site_answer, organization_answer,
                prices_answer, reliable_answer, rating, created_at, updated_at
    `, [
      visitorToken,
      nickname.trim(),
      siteAnswer.trim(),
      organizationAnswer.trim(),
      pricesAnswer.trim(),
      reliableAnswer.trim(),
      Number(rating)
    ]);

    res.json({ success: true, review: result.rows[0] });
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    res.status(500).json({ error: "Não foi possível salvar sua avaliação." });
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
