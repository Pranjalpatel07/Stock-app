const Watchlist = require('../models/Watchlist');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, watchlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add symbol to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ success: false, message: 'Symbol is required' });
  }

  try {
    const existing = await Watchlist.findOne({ userId: req.user._id, symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Stock already in watchlist' });
    }

    const watchlistItem = await Watchlist.create({
      userId: req.user._id,
      symbol: symbol.toUpperCase(),
    });

    res.status(201).json({ success: true, watchlistItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Remove symbol from watchlist
// @route   DELETE /api/watchlist/:symbol
// @access  Private
const removeFromWatchlist = async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const item = await Watchlist.findOneAndDelete({ userId: req.user._id, symbol });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Symbol not found in watchlist' });
    }
    res.json({ success: true, message: `${symbol} removed from watchlist` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
