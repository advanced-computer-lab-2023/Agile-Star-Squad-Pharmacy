const express = require('express');
const dotenv = require('dotenv');
const globalErrorHandler = require('./Controllers/errorController');

const AppError = require('./utils/appError');
const adminRouter = require('./routes/adminRoutes');
const patientRouter = require('./routes/patientRoutes');
const medicineRouter = require('./routes/medicineRoutes');
const pharmacistRouter = require('./routes/pharmacistRoutes');
const pharmacyRouter = require('./routes/pharmacyRoutes');
const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //to allow sending cookies if any
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/pharmacy', pharmacyRouter);
app.use('/admins', adminRouter);
app.use('/pharmacist', pharmacistRouter);
app.use('/patients', patientRouter);
app.use('/medicine', medicineRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
