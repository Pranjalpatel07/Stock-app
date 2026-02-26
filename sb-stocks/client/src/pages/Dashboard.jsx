import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, setSearchQuery } from '../redux/slices/stockSlice';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
import { formatCurrency, formatPercent, getPnLColor } from '../utils/helpers';
import StockCard from '../components/common/StockCard';
import { PageLoader } from '../components/common/Spinner';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: stocks, loading, searchQuery } = useSelector((state) => state.stocks);
  const { user } = useSelector((state) => state.auth);
  const { holdings } = useSelector((state) => state.portfolio);

  const [view, setView] = useState('grid'); // grid | table

  useEffect(() => {
    dispatch(fetchStocks());
    dispatch(fetchPortfolio());
  }, [dispatch]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => dispatch(fetchStocks()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const filteredStocks = stocks.filter((s) =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const portfolioValue = holdings.reduce((sum, h) => {
    const stock = stocks.find((s) => s.symbol === h.symbol);
    return sum + (stock ? stock.price * h.quantity : h.avgPrice * h.quantity);
  }, 0);

  const totalInvested = holdings.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0);
  const totalPnL = portfolioValue - totalInvested;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's your market overview</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cash Balance', value: formatCurrency(user?.balance || 0), icon: '💵', color: 'text-green-600 dark:text-green-400' },
          { label: 'Portfolio Value', value: formatCurrency(portfolioValue), icon: '💼', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}${formatCurrency(totalPnL)}`, icon: '📊', color: getPnLColor(totalPnL) },
          { label: 'Net Worth', value: formatCurrency((user?.balance || 0) + portfolioValue), icon: '🏆', color: 'text-purple-600 dark:text-purple-400' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
            </div>
            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Stocks Section */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Market Stocks</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search symbol..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="input-field pl-9 w-44 text-sm py-2"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-dark-card rounded-lg p-1 gap-1">
              {[['grid', '⊞'], ['table', '☰']].map(([v, icon]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    view === v
                      ? 'bg-white dark:bg-dark-border shadow-sm text-gray-800 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <button
              onClick={() => dispatch(fetchStocks())}
              className="btn-secondary text-sm py-2 px-3"
              title="Refresh"
            >
              🔄
            </button>
          </div>
        </div>

        {loading ? (
          <PageLoader text="Fetching market data..." />
        ) : filteredStocks.length === 0 ? (
          <div className="card text-center py-16 text-gray-500 dark:text-gray-400">
            No stocks found for "{searchQuery}"
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    {['Symbol', 'Price', 'Change', '% Change', 'High', 'Low', 'Volume'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                  {filteredStocks.map((stock) => (
                    <tr
                      key={stock.symbol}
                      onClick={() => navigate(`/stocks/${stock.symbol}`)}
                      className="hover:bg-gray-50 dark:hover:bg-dark-border cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900 dark:text-white">{stock.symbol}</span>
                        {stock.isMock && <span className="ml-1.5 text-[10px] text-orange-400">(demo)</span>}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(stock.price)}
                      </td>
                      <td className={`px-4 py-3 font-mono font-medium ${getPnLColor(stock.change)}`}>
                        {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                      </td>
                      <td className={`px-4 py-3 font-medium ${getPnLColor(stock.changePercent)}`}>
                        {formatPercent(stock.changePercent)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-sm">
                        {formatCurrency(stock.high)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-sm">
                        {formatCurrency(stock.low)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                        {(stock.volume / 1e6).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
