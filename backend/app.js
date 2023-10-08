const express = require('express');
const dotenv = require('dotenv');
const globalErrorHandler = require('./Controllers/errorController')

const AppError = require('./utils/appError')
const adminRouter = require('./routes/adminRoutes');
const patientRouter = require('./routes/patientRoutes');
const medicineRouter = require('./routes/medicineRoutes');
const pharmacistRouter = require('./routes/pharmacistRoutes');
const app = express();

app.use(express.json());

app.use('/admins', adminRouter);
app.use('/pharmacist', pharmacistRouter);
app.use('/patients', patientRouter);
app.use('/medicine', medicineRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});


app.use(globalErrorHandler);

module.exports = app;