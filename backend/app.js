const express = require('express');
const dotenv = require('dotenv');
const globalErrorHandler = require('./Controllers/errorController');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const adminRouter = require('./routes/adminRoutes');
const patientRouter = require('./routes/patientRoutes');
const medicineRouter = require('./routes/medicineRoutes');
const pharmacistRouter = require('./routes/pharmacistRoutes');
const pharmacyRouter = require('./routes/pharmacyRoutes');
const authRouter = require('./routes/authRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes');
const middleware = require('./middleware/middleware.js');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
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
app.use('/auth', authRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
