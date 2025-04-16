const express = require('express');
const { checkout } = require('../controllers/checkoutController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for Checkout - Save User Details for Payment
router.post('/', authMiddleware, checkout);

module.exports = router;