const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController');
const adminRouter = require('./routes/adminRoutes');
const patientRouter = require('./routes/patientRoutes');
const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
app.use('/admins', adminRouter);
app.use('/pharmacist', pharmacistRouter);
app.use('/patients', patientRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});


app.use(globalErrorHandler);

module.exports = app;