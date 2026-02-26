import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { fetchStocks } from '../redux/slices/stockSlice';
import { formatCurrency, formatPercent, getPnLColor } from '../utils/helpers';
import { PageLoader } from '../components/common/Spinner';

export default function Watchlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.watchlist);
  const { list: stocks } = useSelector((state) => state.stocks);

  const [newSymbol, setNewSymbol] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchWatchlist());
    dispatch(fetchStocks());
  }, [dispatch]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    setAdding(true);
    const result = await dispatch(addToWatchlist(newSymbol.trim().toUpperCase()));
    if (!result.error) {
      toast.success(`${newSymbol.toUpperCase()} added to watchlist ⭐`);
      setNewSymbol('');
    } else {
      toast.error(result.payload);
    }
    setAdding(false);
  };

  const handleRemove = async (symbol) => {
    await dispatch(removeFromWatchlist(symbol));
    toast.info(`${symbol} removed from watchlist`);
  };

  const getStockData = (symbol) => stocks.find((s) => s.symbol === symbol);

  if (loading) return <PageLoader text="Loading watchlist..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Watchlist</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track stocks you're interested in</p>
      </div>

      {/* Add Stock */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add Symbol</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="e.g. AAPL, TSLA..."
            className="input-field flex-1"
            maxLength={10}
          />
          <button type="submit" disabled={adding || !newSymbol} className="btn-primary px-6">
            {adding ? '...' : '+ Add'}
          </button>
        </form>
      </div>

      {/* Watchlist */}
      {items.length === 0 ? (
        <div className="card text-center py-20">
          <p className="text-4xl mb-4">⭐</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Your Watchlist is Empty</h3>
          <p className="text-gray-500 dark:text-gray-400">Add stock symbols above to track them here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                  {['Symbol', 'Price', 'Change', '% Change', 'High', 'Low', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {items.map((item) => {
                  const stock = getStockData(item.symbol);
                  return (
                    <tr key={item.symbol} className="hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                      <td className="px-4 py-4">
                        <button
                          onClick={() => navigate(`/stocks/${item.symbol}`)}
                          className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {item.symbol}
                        </button>
                      </td>
                      {stock ? (
                        <>
                          <td className="px-4 py-4 font-mono font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(stock.price)}
                          </td>
                          <td className={`px-4 py-4 font-mono font-medium ${getPnLColor(stock.change)}`}>
                            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                          </td>
                          <td className={`px-4 py-4 font-medium ${getPnLColor(stock.changePercent)}`}>
                            {formatPercent(stock.changePercent)}
                          </td>
                          <td className="px-4 py-4 text-gray-500 dark:text-gray-400 font-mono text-sm">
                            {formatCurrency(stock.high)}
                          </td>
                          <td className="px-4 py-4 text-gray-500 dark:text-gray-400 font-mono text-sm">
                            {formatCurrency(stock.low)}
                          </td>
                        </>
                      ) : (
                        <td colSpan={5} className="px-4 py-4 text-gray-400 dark:text-gray-500 text-sm">
                          Loading data...
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/stocks/${item.symbol}`)}
                            className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleRemove(item.symbol)}
                            className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
