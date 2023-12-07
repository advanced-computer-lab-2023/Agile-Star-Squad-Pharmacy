const jwt = require('jsonwebtoken');

exports.patientAuth = (req, res, next) => {
  return next();
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (!err) {
        // res send status 401 you are not logged in
        if (decodedToken.role === 'patient') {
          next();
        } else {
          res
            .status(401)
            .json({ message: 'You are not logged in as a patient' });
        }
      }
    });
  } else {
    res.status(401).json({ message: 'You are not logged in.' });
  }
};

exports.pharmacistAuth = (req, res, next) => {
  return next();
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (!err) {
        // res send status 401 you are not logged in
        if (decodedToken.role === 'doctor') {
          next();
        } else {
          res
            .status(401)
            .json({ message: 'You are not logged in as a doctor' });
        }
      }
    });
  } else {
    res.status(401).json({ message: 'You are not logged in.' });
  }
};

exports.adminAuth = (req, res, next) => {
  return next();
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'supersecret', (err, decodedToken) => {
      if (!err) {
        // res send status 401 you are not logged in
        if (decodedToken.role === 'admin') {
          next();
        } else {
          res
            .status(401)
            .json({ message: 'You are not logged in as an admin' });
        }
      }
    });
  } else {
    res.status(401).json({ message: 'You are not logged in.' });
  }
};
