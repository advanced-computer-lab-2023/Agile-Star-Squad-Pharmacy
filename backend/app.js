const express = require('express');
const dotenv = require('dotenv');
const env = require("dotenv").config({ path: "./config.env" });
const globalErrorHandler = require('./Controllers/errorController');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});
const { resolve } = require("path");
const AppError = require('./utils/appError');
const adminRouter = require('./routes/adminRoutes');
const patientRouter = require('./routes/patientRoutes');
const medicineRouter = require('./routes/medicineRoutes');
const pharmacistRouter = require('./routes/pharmacistRoutes');
const pharmacyRouter = require('./routes/pharmacyRoutes');
const authRouter = require('./routes/authRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes');
const addressRouter = require('./routes/addressRoutes');
const middleware = require('./middleware/middleware.js');




const app = express();

const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3002'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/cart', cartRouter);
app.use('/pharmacy', pharmacyRouter);
app.use('/orders', orderRouter);
app.use('/admins', adminRouter);
app.use('/pharmacist', pharmacistRouter);
app.use('/patients', patientRouter);
app.use('/medicine', medicineRouter);
app.use('/address', addressRouter);
app.use('/auth', authRouter);


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
    const data = req.body;  // Get the entire data object
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: data.price * 100,
      payment_method_types: ['card'],
      metadata: {
        patient_id: data.patient_id,
      },
    });


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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
