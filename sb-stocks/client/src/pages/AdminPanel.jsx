import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { PageLoader } from '../components/common/Spinner';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');
  const [tab, setTab] = useState('users'); // users | stocks
  const [balanceEdit, setBalanceEdit] = useState({ userId: null, value: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, stocksRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stocks'),
      ]);
      setUsers(usersRes.data.users);
      setStats(usersRes.data.stats);
      setStocks(stocksRes.data.stocks);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    try {
      const { data } = await api.post('/admin/add-stock', { symbol: newSymbol.trim().toUpperCase() });
      setStocks(data.stocks);
      setNewSymbol('');
      toast.success(`${newSymbol.toUpperCase()} added to stock list`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add stock');
    }
  };

  const handleDeleteStock = async (symbol) => {
    try {
      const { data } = await api.delete(`/admin/delete-stock/${symbol}`);
      setStocks(data.stocks);
      toast.info(`${symbol} removed`);
    } catch (error) {
      toast.error('Failed to remove stock');
    }
  };

  const handleUpdateBalance = async (userId) => {
    if (!balanceEdit.value || isNaN(balanceEdit.value)) {
      toast.error('Enter a valid balance');
      return;
    }
    try {
      const { data } = await api.put(`/admin/users/${userId}/balance`, {
        balance: parseFloat(balanceEdit.value),
      });
      setUsers(users.map((u) => (u._id === userId ? { ...u, balance: data.user.balance } : u)));
      setBalanceEdit({ userId: null, value: '' });
      toast.success('Balance updated');
    } catch (error) {
      toast.error('Failed to update balance');
    }
  };

  if (loading) return <PageLoader text="Loading admin panel..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🛡️ Admin Panel</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage users and stocks</p>
        </div>
        <button onClick={loadData} className="btn-secondary text-sm">🔄 Refresh</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.userCount || 0, icon: '👥' },
          { label: 'Total Trades', value: stats.transactionCount || 0, icon: '📊' },
          { label: 'Tracked Stocks', value: stocks.length, icon: '📈' },
          { label: 'Platform Status', value: 'Live', icon: '🟢' },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="flex items-center gap-2 mb-1">
              <span>{s.icon}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">{s.label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-dark-card rounded-xl p-1 w-fit">
        {[['users', '👥 Users'], ['stocks', '📈 Stocks']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === key
                ? 'bg-white dark:bg-dark-border shadow-sm text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="card overflow-hidden p-0">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border">
            <h2 className="font-semibold text-gray-900 dark:text-white">Registered Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                  {['Name', 'Email', 'Role', 'Balance', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">{user.name}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400 text-sm">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {user.role === 'admin' ? '🛡️' : '👤'} {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-gray-900 dark:text-white">
                      {balanceEdit.userId === user._id ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={balanceEdit.value}
                            onChange={(e) => setBalanceEdit({ ...balanceEdit, value: e.target.value })}
                            className="input-field py-1 text-sm w-28"
                          />
                          <button
                            onClick={() => handleUpdateBalance(user._id)}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                          >✓</button>
                          <button
                            onClick={() => setBalanceEdit({ userId: null, value: '' })}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >✕</button>
                        </div>
                      ) : (
                        <span
                          onClick={() => setBalanceEdit({ userId: user._id, value: user.balance })}
                          className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          title="Click to edit"
                        >
                          {formatCurrency(user.balance)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-500 dark:text-gray-400 text-sm">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setBalanceEdit({ userId: user._id, value: user.balance })}
                        className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        Edit Balance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stocks Tab */}
      {tab === 'stocks' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add Stock Symbol</h2>
            <form onSubmit={handleAddStock} className="flex gap-3">
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. AAPL, GOOGL..."
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary px-6">+ Add</button>
            </form>
          </div>

          <div className="card overflow-hidden p-0">
            <div className="p-4 border-b border-gray-100 dark:border-dark-border">
              <h2 className="font-semibold text-gray-900 dark:text-white">Tracked Stocks ({stocks.length})</h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-dark-border">
              {stocks.map((symbol) => (
                <div key={symbol} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                  <span className="font-bold text-gray-900 dark:text-white">{symbol}</span>
                  <button
                    onClick={() => handleDeleteStock(symbol)}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
