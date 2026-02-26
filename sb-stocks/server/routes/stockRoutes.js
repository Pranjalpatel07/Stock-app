const express = require('express');
const router = express.Router();
const { getStocks, getStockBySymbol } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getStocks);
router.get('/:symbol', protect, getStockBySymbol);

module.exports = router;
