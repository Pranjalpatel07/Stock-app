const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

let adminStockList = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
  'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
];

// GET /api/admin/users
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

// GET /api/admin/transactions - ALL transactions across all users
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/admin/add-stock
const addStock = async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ success: false, message: 'Symbol is required' });
  const sym = symbol.toUpperCase().trim();
  if (adminStockList.includes(sym)) return res.status(400).json({ success: false, message: 'Stock already in list' });
  adminStockList.push(sym);
  res.json({ success: true, message: `${sym} added`, stocks: adminStockList });
};

// DELETE /api/admin/delete-stock/:symbol
const deleteStock = async (req, res) => {
  const sym = req.params.symbol.toUpperCase();
  adminStockList = adminStockList.filter((s) => s !== sym);
  res.json({ success: true, message: `${sym} removed`, stocks: adminStockList });
};

// GET /api/admin/stocks
const getAdminStocks = async (req, res) => {
  res.json({ success: true, stocks: adminStockList });
};

// PUT /api/admin/users/:id/balance
const updateUserBalance = async (req, res) => {
  const { balance } = req.body;
  if (balance === undefined || balance < 0) return res.status(400).json({ success: false, message: 'Invalid balance' });
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { balance }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllUsers, getAllTransactions, addStock, deleteStock, getAdminStocks, updateUserBalance };
