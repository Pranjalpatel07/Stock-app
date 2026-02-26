const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

// In-memory list of tracked symbols (in production use a DB collection)
let adminStockList = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
  'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
];

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const userCount = await User.countDocuments();
    const transactionCount = await Transaction.countDocuments();

    res.json({ success: true, users, stats: { userCount, transactionCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add stock to tracked list
// @route   POST /api/admin/add-stock
// @access  Admin
const addStock = async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ success: false, message: 'Symbol is required' });
  }
  const sym = symbol.toUpperCase().trim();
  if (adminStockList.includes(sym)) {
    return res.status(400).json({ success: false, message: 'Stock already in list' });
  }
  adminStockList.push(sym);
  res.json({ success: true, message: `${sym} added`, stocks: adminStockList });
};

// @desc    Remove stock from tracked list
// @route   DELETE /api/admin/delete-stock/:symbol
// @access  Admin
const deleteStock = async (req, res) => {
  const sym = req.params.symbol.toUpperCase();
  adminStockList = adminStockList.filter((s) => s !== sym);
  res.json({ success: true, message: `${sym} removed`, stocks: adminStockList });
};

// @desc    Get tracked stocks list
// @route   GET /api/admin/stocks
// @access  Admin
const getAdminStocks = async (req, res) => {
  res.json({ success: true, stocks: adminStockList });
};

// @desc    Update user balance (admin override)
// @route   PUT /api/admin/users/:id/balance
// @access  Admin
const updateUserBalance = async (req, res) => {
  const { balance } = req.body;
  if (balance === undefined || balance < 0) {
    return res.status(400).json({ success: false, message: 'Invalid balance' });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { balance }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllUsers, addStock, deleteStock, getAdminStocks, updateUserBalance };
