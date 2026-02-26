const Portfolio = require('../models/Portfolio');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user._id });
    res.json({ success: true, portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getPortfolio };
