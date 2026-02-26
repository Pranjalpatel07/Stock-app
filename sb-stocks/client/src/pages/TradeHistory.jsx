import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTradeHistory } from '../redux/slices/tradeSlice';
import { formatCurrency, formatDate } from '../utils/helpers';
import { PageLoader } from '../components/common/Spinner';

export default function TradeHistory() {
  const dispatch = useDispatch();
  const { history, historyLoading } = useSelector((state) => state.trade);

  useEffect(() => {
    dispatch(fetchTradeHistory());
  }, [dispatch]);

  const totalBought = history.filter((t) => t.type === 'BUY').reduce((s, t) => s + t.total, 0);
  const totalSold = history.filter((t) => t.type === 'SELL').reduce((s, t) => s + t.total, 0);

  if (historyLoading) return <PageLoader text="Loading trade history..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trade History</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">All your buy and sell transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Trades', value: history.length, icon: '📜' },
          { label: 'Total Bought', value: formatCurrency(totalBought), icon: '🟢' },
          { label: 'Total Sold', value: formatCurrency(totalSold), icon: '🔴' },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="flex items-center gap-2 mb-1">
              <span>{s.icon}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">{s.label}</p>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      {history.length === 0 ? (
        <div className="card text-center py-20">
          <p className="text-4xl mb-4">📜</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Trades Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Your transaction history will appear here after your first trade.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                  {['Type', 'Symbol', 'Quantity', 'Price', 'Total', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {history.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        tx.type === 'BUY'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {tx.type === 'BUY' ? '🟢' : '🔴'} {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">{tx.symbol}</td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{tx.quantity}</td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-mono">{formatCurrency(tx.price)}</td>
                    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white font-mono">
                      {tx.type === 'SELL' ? '+' : '-'}{formatCurrency(tx.total)}
                    </td>
                    <td className="px-4 py-4 text-gray-500 dark:text-gray-400 text-sm">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
