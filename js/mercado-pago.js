const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");

const app = express();
app.use(cors());
app.use(express.json());

// Substitua pelo SEU access_token real do Mercado Pago!
mercadopago.configure({
  access_token: "892232891593857"
});

app.post("/criar-preferencia", async (req, res) => {
  const { titulo, preco } = req.body;

  try {
    const preference = {
      items: [
        {
          title: titulo,
          unit_price: parseFloat(preco),
          quantity: 1
        }
      ],
      back_urls: {
        success: "https://seusite.com/sucesso",
        failure: "https://seusite.com/falha",
        pending: "https://seusite.com/pendente"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
