// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format large numbers
export const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num?.toString();
};

// Format percentage
export const formatPercent = (value) => {
  const num = parseFloat(value);
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

// Get color class based on positive/negative
export const getPnLColor = (value) => {
  const num = parseFloat(value);
  if (num > 0) return 'text-green-500';
  if (num < 0) return 'text-red-500';
  return 'text-gray-500 dark:text-gray-400';
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate portfolio profit/loss
export const calcPnL = (currentPrice, avgPrice, quantity) => {
  const pnl = (currentPrice - avgPrice) * quantity;
  const pnlPercent = ((currentPrice - avgPrice) / avgPrice) * 100;
  return { pnl, pnlPercent };
};
