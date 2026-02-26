import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchStockDetail } from '../redux/slices/stockSlice';
import { addToWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
import { formatCurrency, formatPercent, getPnLColor, formatNumber } from '../utils/helpers';
import StockChart from '../components/common/StockChart';
import TradeModal from '../components/common/TradeModal';
import { PageLoader } from '../components/common/Spinner';

export default function StockDetail() {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentStock: stock, historical, detailLoading } = useSelector((state) => state.stocks);
  const { items: watchlistItems } = useSelector((state) => state.watchlist);
  const { holdings } = useSelector((state) => state.portfolio);

  const [tradeMode, setTradeMode] = useState(null); // 'BUY' | 'SELL' | null

  const isWatched = watchlistItems.some((w) => w.symbol === symbol.toUpperCase());
  const holding = holdings.find((h) => h.symbol === symbol.toUpperCase());

  useEffect(() => {
    dispatch(fetchStockDetail(symbol));
    dispatch(fetchPortfolio());
  }, [dispatch, symbol]);

  const handleWatchlist = async () => {
    if (isWatched) {
      await dispatch(removeFromWatchlist(symbol.toUpperCase()));
      toast.info(`${symbol} removed from watchlist`);
    } else {
      await dispatch(addToWatchlist(symbol.toUpperCase()));
      toast.success(`${symbol} added to watchlist ⭐`);
    }
  };

  if (detailLoading) return <PageLoader text="Loading stock data..." />;
  if (!stock) return (
    <div className="card text-center py-20">
      <p className="text-2xl mb-2">😔</p>
      <p className="text-gray-500 dark:text-gray-400">Could not load stock data for {symbol}</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">← Back to Dashboard</button>
    </div>
  );

  const isPositive = parseFloat(stock.changePercent) >= 0;
  const pnl = holding ? (stock.price - holding.avgPrice) * holding.quantity : 0;
  const pnlPercent = holding ? ((stock.price - holding.avgPrice) / holding.avgPrice) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors text-sm font-medium"
      >
        ← Back to Dashboard
      </button>

      {/* Header Card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stock.symbol}</h1>
              {stock.isMock && (
                <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs px-2 py-1 rounded-lg font-medium">
                  DEMO DATA
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white font-mono">
                {formatCurrency(stock.price)}
              </span>
              <div className={`flex items-center gap-1 font-semibold ${getPnLColor(stock.change)}`}>
                <span>{isPositive ? '▲' : '▼'}</span>
                <span>{formatCurrency(Math.abs(stock.change))}</span>
                <span>({formatPercent(stock.changePercent)})</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              As of {stock.latestTradingDay}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleWatchlist}
              className={`btn-secondary flex items-center gap-2 ${isWatched ? 'text-yellow-500' : ''}`}
            >
              {isWatched ? '⭐ Watching' : '☆ Watch'}
            </button>
            <button onClick={() => setTradeMode('BUY')} className="btn-success px-6">
              🟢 Buy
            </button>
            <button
              onClick={() => setTradeMode('SELL')}
              disabled={!holding || holding.quantity === 0}
              className="btn-danger px-6 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🔴 Sell
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-dark-border">
          {[
            { label: 'Open', value: formatCurrency(stock.open) },
            { label: 'Previous Close', value: formatCurrency(stock.previousClose) },
            { label: 'Day High', value: formatCurrency(stock.high) },
            { label: 'Day Low', value: formatCurrency(stock.low) },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="font-semibold text-gray-900 dark:text-white font-mono">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Price History (30 Days)</h2>
        <StockChart historical={historical} symbol={stock.symbol} />
      </div>

      {/* Your Position */}
      {holding && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Position</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Shares Owned', value: holding.quantity },
              { label: 'Avg Buy Price', value: formatCurrency(holding.avgPrice) },
              { label: 'Current Value', value: formatCurrency(stock.price * holding.quantity) },
              { label: 'P&L', value: `${pnl >= 0 ? '+' : ''}${formatCurrency(pnl)} (${pnlPercent.toFixed(2)}%)`, color: getPnLColor(pnl) },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">{stat.label}</p>
                <p className={`font-bold text-lg ${stat.color || 'text-gray-900 dark:text-white'} font-mono`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {tradeMode && (
        <TradeModal
          stock={stock}
          mode={tradeMode}
          onClose={() => setTradeMode(null)}
        />
      )}
    </div>
  );
}
