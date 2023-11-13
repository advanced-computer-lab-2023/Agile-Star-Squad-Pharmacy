const express = require('express');
const dotenv = require('dotenv');
const globalErrorHandler = require('./Controllers/errorController');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const adminRouter = require('./routes/adminRoutes');
const patientRouter = require('./routes/patientRoutes');
const medicineRouter = require('./routes/medicineRoutes');
const pharmacistRouter = require('./routes/pharmacistRoutes');
const pharmacyRouter = require('./routes/pharmacyRoutes');
const authController = require('./controllers/authController');
const middleware = require('./middleware/middleware.js');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.get('/resetPassword', authController.getOTP);
app.post('/resetPassword/:email', authController.forgotPassword);
app.get('/resetPassword/:email', authController.getUserByEmail);
app.patch('/resetPassword/:id', authController.updatePassword);
app.get('/:username/:password', authController.logIn);

app.get('/role', authController.getRole);

app.use('/pharmacy', pharmacyRouter);
app.use('/admins', middleware.adminAuth, adminRouter);
app.use('/pharmacist', pharmacistRouter);
app.use('/patients', patientRouter);
app.use('/medicine', medicineRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
