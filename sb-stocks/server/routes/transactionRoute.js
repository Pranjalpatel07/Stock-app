const express = require("express");
const auth = require("../middlewares/authMiddleware.js");
const { deposit, withdraw, getTransactionById, transactions } = require("../controllers/transactionController.js")
const router = express.Router()

router.post('/deposit', auth, deposit)
router.post('/withdraw', auth, withdraw)
router.get('/transactions', auth, transactions)
router.get('/transactions/:id', auth, getTransactionById)

module.exports = router