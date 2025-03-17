require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

app.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount, currency } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe usa centavos
            currency,
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));
