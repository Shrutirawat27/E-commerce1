const express = require('express');
const router = express.Router();
const { getOrders, createOrder } = require('./orders.controller');

router.get('/', getOrders);  // Fetch orders
router.post('/create', createOrder); // Place an order

module.exports = router;
