const express = require('express');
const router = express.Router();
const {
  getOrdersByPatientId,
  getOrderById,
  deleteOrder,
  changeOrderStatus,
  addOrder,
} = require('../controllers/orderController');

// Routes
router.get('/patient/:patientId', getOrdersByPatientId);
router.get('/:id', getOrderById);
router.delete('/:id', deleteOrder);
router.put('/:id', changeOrderStatus);
router.post('/', addOrder);

module.exports = router;
