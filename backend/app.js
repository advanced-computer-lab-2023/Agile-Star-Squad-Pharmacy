const express = require("express");
const dotenv = require("dotenv");
const globalErrorHandler = require("./Controllers/errorController");
const env = require("dotenv").config({ path: "./config.env" });

const AppError = require("./utils/appError");
const adminRouter = require("./routes/adminRoutes");
const patientRouter = require("./routes/patientRoutes");
const medicineRouter = require("./routes/medicineRoutes");
const pharmacistRouter = require("./routes/pharmacistRoutes");
const pharmacyRouter = require("./routes/pharmacyRoutes");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});
app.use("/pharmacy", pharmacyRouter);
app.use("/admins", adminRouter);
app.use("/pharmacist", pharmacistRouter);
app.use("/patients", patientRouter);
app.use("/medicine", medicineRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
