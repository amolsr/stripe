const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_PRIV_KEY);

const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.post("/pay", async (req, res) => {
  const { email } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000,
    currency: "usd",
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: "accept_a_payment" },
    receipt_email: email,
  });

  res.json({ client_secret: paymentIntent["client_secret"] });
});

app.post("/sub", async (req, res) => {
  const { email, payment_method } = req.body;

  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: process.env.PLAN_ID }],
    expand: ["latest_invoice.payment_intent"],
  });

  const status = subscription["latest_invoice"]["payment_intent"]["status"];
  const client_secret =
    subscription["latest_invoice"]["payment_intent"]["client_secret"];

  res.json({ client_secret: client_secret, status: status });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// const stripe = require("stripe")(process.env.STRIPE_PRIV_KEY);

// const createProduct = async () => {
//   const PRODUCT_NAME = "Monthly Subscription";
//   const PRODUCT_TYPE = "service";

//   const product = await stripe.products.create({
//     name: PRODUCT_NAME,
//     type: PRODUCT_TYPE,
//   });

//   console.log(product);
//   return product.id;
// };

// const createPlan = async (productId) => {
//   const PLAN_NICKNAME = "Monthly Subscription Plan";
//   const PLAN_INTERVAL = "month";
//   const CURRENCY = "usd";
//   const PLAN_PRICE = 200;

//   const plan = await stripe.plans.create({
//     product: productId,
//     nickname: PLAN_NICKNAME,
//     currency: CURRENCY,
//     interval: PLAN_INTERVAL,
//     amount: PLAN_PRICE,
//   });

//   console.log(plan);
//   return plan.id;
// };

// const createCustomer = async () => {
//   const CUSTOMER_EMAIl = "testemail@example.com";
//   const CUSTOMER_SOURCE = "tok_mastercard";

//   const customer = await stripe.customers.create({
//     email: CUSTOMER_EMAIl,
//     source: CUSTOMER_SOURCE,
//   });
//   console.log(customer);
//   return customer.id;
// };

// const subscribeCustomerToPlan = async (customerId, planId) => {
//     const subscription = await stripe.subscriptions.create({
//         customer: customerId,
//         items: [{plan: planId}],
//     });

//     console.log(subscription);
//     return subscription;
// }
