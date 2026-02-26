import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
import { fetchStocks } from '../redux/slices/stockSlice';
import { formatCurrency, formatPercent, getPnLColor } from '../utils/helpers';
import TradeModal from '../components/common/TradeModal';
import { PageLoader } from '../components/common/Spinner';

export default function Portfolio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { holdings, loading } = useSelector((state) => state.portfolio);
  const { list: stocks } = useSelector((state) => state.stocks);
  const { user } = useSelector((state) => state.auth);

  const [selectedHolding, setSelectedHolding] = useState(null);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchStocks());
  }, [dispatch]);

  const getStockPrice = (symbol) => {
    const s = stocks.find((s) => s.symbol === symbol);
    return s?.price || null;
  };

  const enrichedHoldings = holdings.map((h) => {
    const currentPrice = getStockPrice(h.symbol) || h.avgPrice;
    const currentValue = currentPrice * h.quantity;
    const invested = h.avgPrice * h.quantity;
    const pnl = currentValue - invested;
    const pnlPercent = ((pnl / invested) * 100);
    return { ...h, currentPrice, currentValue, invested, pnl, pnlPercent };
  });

  const totalValue = enrichedHoldings.reduce((s, h) => s + h.currentValue, 0);
  const totalInvested = enrichedHoldings.reduce((s, h) => s + h.invested, 0);
  const totalPnL = totalValue - totalInvested;

  if (loading) return <PageLoader text="Loading portfolio..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Portfolio</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your stock holdings and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Portfolio Value', value: formatCurrency(totalValue), icon: '💼', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Total Invested', value: formatCurrency(totalInvested), icon: '💰', color: 'text-gray-800 dark:text-gray-200' },
          { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}${formatCurrency(totalPnL)}`, icon: '📊', color: getPnLColor(totalPnL) },
          { label: 'Holdings', value: holdings.length, icon: '📦', color: 'text-purple-600 dark:text-purple-400' },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span>{s.icon}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{s.label}</p>
            </div>
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Holdings Table */}
      {enrichedHoldings.length === 0 ? (
        <div className="card text-center py-20">
          <p className="text-4xl mb-4">💼</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Holdings Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Buy your first stock to start building your portfolio!
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Browse Stocks →
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border">
            <h2 className="font-semibold text-gray-900 dark:text-white">Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                  {['Symbol', 'Shares', 'Avg Price', 'Current Price', 'Value', 'P&L', 'P&L %', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {enrichedHoldings.map((h) => (
                  <tr key={h.symbol} className="hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => navigate(`/stocks/${h.symbol}`)}
                        className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {h.symbol}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-semibold">{h.quantity}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400 font-mono">{formatCurrency(h.avgPrice)}</td>
                    <td className="px-4 py-4 text-gray-900 dark:text-white font-mono font-semibold">{formatCurrency(h.currentPrice)}</td>
                    <td className="px-4 py-4 text-gray-900 dark:text-white font-mono">{formatCurrency(h.currentValue)}</td>
                    <td className={`px-4 py-4 font-mono font-semibold ${getPnLColor(h.pnl)}`}>
                      {h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl)}
                    </td>
                    <td className={`px-4 py-4 font-medium ${getPnLColor(h.pnlPercent)}`}>
                      {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedHolding(h)}
                        className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {selectedHolding && (
        <TradeModal
          stock={{ symbol: selectedHolding.symbol, price: selectedHolding.currentPrice }}
          mode="SELL"
          onClose={() => {
            setSelectedHolding(null);
            dispatch(fetchPortfolio());
          }}
        />
      )}
    </div>
  );
}
