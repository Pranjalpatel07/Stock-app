const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { buyStock, sellStock, getTradeHistory } = require('../controllers/tradeController');
const { protect } = require('../middleware/authMiddleware');

const tradeValidation = [
  body('symbol').notEmpty().withMessage('Symbol is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be positive'),
];

router.post('/buy', protect, tradeValidation, buyStock);
router.post('/sell', protect, tradeValidation, sellStock);
router.get('/history', protect, getTradeHistory);

module.exports = router;
