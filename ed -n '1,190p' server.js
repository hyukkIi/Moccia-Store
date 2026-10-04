[1mdiff --git a/server.js b/server.js[m
[1mindex 1460460..763fa28 100644[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@ -13,6 +13,174 @@[m [mapp.use(express.urlencoded({ extended: true }));[m
 [m
 app.use(express.static(path.join(__dirname, "public")));[m
 [m
[32m+[m[32m/* =========================[m
[32m+[m[32m   AVALIAÇÕES[m
[32m+[m[32m========================= */[m
[32m+[m
[32m+[m[32mconst fs = require("fs");[m
[32m+[m[32mconst crypto = require("crypto");[m
[32m+[m
[32m+[m[32mconst reviewsFile = path.join(__dirname, "reviews.json");[m
[32m+[m
[32m+[m[32mfunction loadReviews() {[m
[32m+[m
[32m+[m[32m  try {[m
[32m+[m
[32m+[m[32m    if (!fs.existsSync(reviewsFile)) {[m
[32m+[m[32m      return {};[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    return JSON.parse([m
[32m+[m[32m      fs.readFileSync(reviewsFile, "utf8")[m
[32m+[m[32m    );[m
[32m+[m
[32m+[m[32m  } catch (error) {[m
[32m+[m
[32m+[m[32m    console.error("Erro ao carregar avaliações:", error);[m
[32m+[m
[32m+[m[32m    return {};[m
[32m+[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction saveReviews(reviews) {[m
[32m+[m
[32m+[m[32m  fs.writeFileSync([m
[32m+[m[32m    reviewsFile,[m
[32m+[m[32m    JSON.stringify(reviews, null, 2)[m
[32m+[m[32m  );[m
[32m+[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction getClientId(req, res) {[m
[32m+[m
[32m+[m[32m  const cookies = req.headers.cookie || "";[m
[32m+[m
[32m+[m[32m  const match = cookies[m
[32m+[m[32m    .split(";")[m
[32m+[m[32m    .map(cookie => cookie.trim())[m
[32m+[m[32m    .find(cookie => cookie.startsWith("moccia_client_id="));[m
[32m+[m
[32m+[m[32m  if (match) {[m
[32m+[m[32m    return decodeURIComponent([m
[32m+[m[32m      match.substring("moccia_client_id=".length)[m
[32m+[m[32m    );[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  const clientId = crypto.randomUUID();[m
[32m+[m
[32m+[m[32m  res.setHeader([m
[32m+[m[32m    "Set-Cookie",[m
[32m+[m[32m    `moccia_client_id=${encodeURIComponent(clientId)}; Path=/; HttpOnly; SameSite=Lax`[m
[32m+[m[32m  );[m
[32m+[m
[32m+[m[32m  return clientId;[m
[32m+[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mapp.get("/api/reviews", (req, res) => {[m
[32m+[m
[32m+[m[32m  const reviews = loadReviews();[m
[32m+[m
[32m+[m[32m  const clientId = getClientId(req, res);[m
[32m+[m
[32m+[m[32m  const reviewList = Object.values(reviews);[m
[32m+[m
[32m+[m[32m  let confiavelTotal = 0;[m
[32m+[m[32m  let organizadoTotal = 0;[m
[32m+[m
[32m+[m[32m  reviewList.forEach(review => {[m
[32m+[m
[32m+[m[32m    confiavelTotal += Number(review.confiavel);[m
[32m+[m[32m    organizadoTotal += Number(review.organizado);[m
[32m+[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m  const totalReviews = reviewList.length;[m
[32m+[m
[32m+[m[32m  const confiavelPercent =[m
[32m+[m[32m    totalReviews > 0[m
[32m+[m[32m      ? Math.round([m
[32m+[m[32m          (confiavelTotal / (totalReviews * 5)) * 100[m
[32m+[m[32m        )[m
[32m+[m[32m      : 0;[m
[32m+[m
[32m+[m[32m  const organizadoPercent =[m
[32m+[m[32m    totalReviews > 0[m
[32m+[m[32m      ? Math.round([m
[32m+[m[32m          (organizadoTotal / (totalReviews * 5)) * 100[m
[32m+[m[32m        )[m
[32m+[m[32m      : 0;[m
[32m+[m
[32m+[m[32m  const geralPercent =[m
[32m+[m[32m    totalReviews > 0[m
[32m+[m[32m      ? Math.round([m
[32m+[m[32m        ((confiavelTotal + organizadoTotal) /[m
[32m+[m[32m          (totalReviews * 10)) * 100[m
[32m+[m[32m      )[m
[32m+[m[32m    : 0;[m
[32m+[m
[32m+[m[32mres.json({[m
[32m+[m
[32m+[m[32m  confiavel: confiavelPercent,[m
[32m+[m
[32m+[m[32m  organizado: organizadoPercent,[m
[32m+[m
[32m+[m[32m  geral: geralPercent,[m
[32m+[m
[32m+[m[32m  total: totalReviews,[m
[32m+[m
[32m+[m[32m  minhaAvaliacao: reviews[clientId] || null[m
[32m+[m
[32m+[m[32m});[m
[32m+[m
[32m+[m[32mapp.post("/api/reviews", (req, res) => {[m
[32m+[m
[32m+[m[32m  const { confiavel, organizado } = req.body;[m
[32m+[m
[32m+[m[32m  if ([m
[32m+[m[32m    !Number.isInteger(confiavel) ||[m
[32m+[m[32m    !Number.isInteger(organizado) ||[m
[32m+[m[32m    confiavel < 0 ||[m
[32m+[m[32m    confiavel > 5 ||[m
[32m+[m[32m    organizado < 0 ||[m
[32m+[m[32m    organizado > 5[m
[32m+[m[32m  ) {[m
[32m+[m
[32m+[m[32m    return res.status(400).json({[m
[32m+[m
[32m+[m[32m      success: false,[m
[32m+[m
[32m+[m[32m      message: "A avaliação deve ser de 0 a 5 estrelas."[m
[32m+[m
[32m+[m[32m    });[m
[32m+[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  const reviews = loadReviews();[m
[32m+[m
[32m+[m[32m  const clientId = getClientId(req, res);[m
[32m+[m
[32m+[m[32m  reviews[clientId] = {[m
[32m+[m
[32m+[m[32m    confiavel,[m
[32m+[m
[32m+[m[32m    organizado[m
[32m+[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  saveReviews(reviews);[m
[32m+[m
[32m+[m[32m  res.json({[m
[32m+[m
[32m+[m[32m    success: true,[m
[32m+[m
[32m+[m[32m    minhaAvaliacao: reviews[clientId][m
[32m+[m
[32m+[m[32m  });[m
[32m+[m
[32m+[m[32m});[m
 [m
 /* =========================[m
    PRODUTOS[m
