const axios = require('axios');

const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';

// Popular US stocks for the dashboard
const DEFAULT_STOCKS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
  'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
];

// Helper: fetch quote from Alpha Vantage
const fetchQuote = async (symbol) => {
  const { data } = await axios.get(ALPHA_VANTAGE_BASE, {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol,
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });

  const quote = data['Global Quote'];
  if (!quote || !quote['05. price']) return null;

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    previousClose: parseFloat(quote['08. previous close']),
    change: parseFloat(quote['09. change']),
    changePercent: quote['10. change percent'].replace('%', ''),
    volume: parseInt(quote['06. volume']),
    latestTradingDay: quote['07. latest trading day'],
  };
};

// @desc    Get list of stocks with quotes
// @route   GET /api/stocks
// @access  Private
const getStocks = async (req, res) => {
  try {
    const symbols = req.query.symbols
      ? req.query.symbols.split(',')
      : DEFAULT_STOCKS;

    // Fetch quotes (Alpha Vantage free tier is rate-limited, so we use mock data as fallback)
    const quotes = await Promise.allSettled(
      symbols.map((s) => fetchQuote(s.trim().toUpperCase()))
    );

    const stocks = quotes
      .map((result, i) => {
        if (result.status === 'fulfilled' && result.value) {
          return result.value;
        }
        // Fallback mock data when API limit reached
        return generateMockQuote(symbols[i]);
      })
      .filter(Boolean);

    res.json({ success: true, stocks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch stocks' });
  }
};

// @desc    Get single stock detail with historical data
// @route   GET /api/stocks/:symbol
// @access  Private
const getStockBySymbol = async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    // Get current quote
    const quote = await fetchQuote(symbol);

    // Get daily historical OHLC
    const { data: histData } = await axios.get(ALPHA_VANTAGE_BASE, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact',
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      },
    });

    let historical = [];
    const timeSeries = histData['Time Series (Daily)'];

    if (timeSeries) {
      historical = Object.entries(timeSeries)
        .slice(0, 30)
        .map(([date, values]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }))
        .reverse();
    } else {
      // Fallback mock historical data
      historical = generateMockHistorical(symbol);
    }

    const stockData = quote || generateMockQuote(symbol);

    res.json({ success: true, stock: stockData, historical });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch stock data' });
  }
};

// Generate realistic mock quote for demo/rate-limit fallback
const generateMockQuote = (symbol) => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = ((change / basePrice) * 100).toFixed(2);
  return {
    symbol,
    price: parseFloat(basePrice.toFixed(2)),
    open: parseFloat((basePrice - Math.random() * 5).toFixed(2)),
    high: parseFloat((basePrice + Math.random() * 10).toFixed(2)),
    low: parseFloat((basePrice - Math.random() * 10).toFixed(2)),
    previousClose: parseFloat((basePrice - change).toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent,
    volume: Math.floor(Math.random() * 10000000),
    latestTradingDay: new Date().toISOString().split('T')[0],
    isMock: true,
  };
};

const generateMockHistorical = (symbol) => {
  const data = [];
  let price = Math.random() * 300 + 100;
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const change = (Math.random() - 0.48) * 10;
    price = Math.max(10, price + change);
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat((price - Math.random() * 3).toFixed(2)),
      high: parseFloat((price + Math.random() * 5).toFixed(2)),
      low: parseFloat((price - Math.random() * 5).toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000),
    });
  }
  return data;
};

module.exports = { getStocks, getStockBySymbol };
