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
const authController = require('./controllers/authController');
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
