const express = require('express');
const router = express.Router();
const {
  getAllUsers, getAllTransactions, addStock, deleteStock, getAdminStocks, updateUserBalance
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/transactions', getAllTransactions);
router.get('/stocks', getAdminStocks);
router.post('/add-stock', addStock);
router.delete('/delete-stock/:symbol', deleteStock);
router.put('/users/:id/balance', updateUserBalance);

module.exports = router;
