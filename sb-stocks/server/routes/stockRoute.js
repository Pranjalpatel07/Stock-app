const express = require("express");
const auth = require("../middlewares/authMiddleware.js");
const { buyStock, sellStock, fetchStocks } = require("../controllers/stockController.js");
const router = express.Router()

router.post('/buyStock', auth, buyStock)
router.post('/sellStock', auth, sellStock)
router.get('/fetch-stocks', auth, fetchStocks)

module.exports = router