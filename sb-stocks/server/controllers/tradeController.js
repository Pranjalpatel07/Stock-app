const { validationResult } = require('express-validator');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const axios = require('axios');

// Helper: get current price from Alpha Vantage
const getCurrentPrice = async (symbol) => {
  try {
    const { data } = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      },
    });
    const price = parseFloat(data['Global Quote']?.['05. price']);
    return isNaN(price) ? null : price;
  } catch {
    return null;
  }
};

// @desc    Buy stock
// @route   POST /api/trade/buy
// @access  Private
const buyStock = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { symbol, quantity, price: clientPrice } = req.body;
  const sym = symbol.toUpperCase();

  try {
    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    // Use client price (from our own stock API) — server side fetched
    const price = clientPrice;
    if (!price || price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }

    const totalCost = price * quantity;

    // Get fresh user data
    const user = await User.findById(req.user._id);

    // Check balance
    if (user.balance < totalCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Required: $${totalCost.toFixed(2)}, Available: $${user.balance.toFixed(2)}`,
      });
    }

    // Deduct balance
    user.balance = parseFloat((user.balance - totalCost).toFixed(2));
    await user.save();

    // Update or create portfolio entry
    let portfolio = await Portfolio.findOne({ userId: req.user._id, symbol: sym });
    if (portfolio) {
      // Recalculate average price
      const newTotalQty = portfolio.quantity + quantity;
      const newAvgPrice = ((portfolio.avgPrice * portfolio.quantity) + (price * quantity)) / newTotalQty;
      portfolio.quantity = newTotalQty;
      portfolio.avgPrice = parseFloat(newAvgPrice.toFixed(4));
    } else {
      portfolio = new Portfolio({
        userId: req.user._id,
        symbol: sym,
        quantity,
        avgPrice: price,
      });
    }
    await portfolio.save();

    // Record transaction
    const transaction = await Transaction.create({
      userId: req.user._id,
      symbol: sym,
      quantity,
      price,
      type: 'BUY',
      total: totalCost,
    });

    res.json({
      success: true,
      message: `Successfully bought ${quantity} shares of ${sym}`,
      transaction,
      newBalance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Trade failed: ' + error.message });
  }
};

// @desc    Sell stock
// @route   POST /api/trade/sell
// @access  Private
const sellStock = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { symbol, quantity, price: clientPrice } = req.body;
  const sym = symbol.toUpperCase();

  try {
    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    const price = clientPrice;
    if (!price || price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }

    // Check portfolio
    const portfolio = await Portfolio.findOne({ userId: req.user._id, symbol: sym });
    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient shares. You own ${portfolio?.quantity || 0} shares of ${sym}`,
      });
    }

    const totalValue = price * quantity;

    // Update portfolio
    portfolio.quantity -= quantity;
    if (portfolio.quantity === 0) {
      await Portfolio.deleteOne({ _id: portfolio._id });
    } else {
      await portfolio.save();
    }

    // Add balance
    const user = await User.findById(req.user._id);
    user.balance = parseFloat((user.balance + totalValue).toFixed(2));
    await user.save();

    // Record transaction
    const transaction = await Transaction.create({
      userId: req.user._id,
      symbol: sym,
      quantity,
      price,
      type: 'SELL',
      total: totalValue,
    });

    res.json({
      success: true,
      message: `Successfully sold ${quantity} shares of ${sym}`,
      transaction,
      newBalance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Trade failed: ' + error.message });
  }
};

// @desc    Get trade history
// @route   GET /api/trade/history
// @access  Private
const getTradeHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { buyStock, sellStock, getTradeHistory };
