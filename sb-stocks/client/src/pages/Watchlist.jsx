import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { fetchStocks } from '../redux/slices/stockSlice';
import Spinner from '../components/common/Spinner';

function getCompanyName(symbol) {
  const map = {
    AAPL: 'Apple Inc.', GOOGL: 'Alphabet Inc.', MSFT: 'Microsoft Corporation',
    AMZN: 'Amazon.com Inc.', TSLA: 'Tesla, Inc.', META: 'Meta Platforms Inc.',
    NVDA: 'NVIDIA Corporation', NFLX: 'Netflix Inc.', AMD: 'Advanced Micro Devices',
    INTC: 'Intel Corporation',
  };
  return map[symbol] || symbol + ' Corporation';
}

export default function Watchlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.watchlist);
  const { list: stocks } = useSelector((s) => s.stocks);
  const [search, setSearch] = useState('');
  const [newSym, setNewSym] = useState('');

  useEffect(() => {
    dispatch(fetchWatchlist());
    dispatch(fetchStocks());
  }, [dispatch]);

  const getStock = (sym) => stocks.find((s) => s.symbol === sym);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSym.trim()) return;
    const res = await dispatch(addToWatchlist(newSym.trim().toUpperCase()));
    if (!res.error) { toast.success(`${newSym.toUpperCase()} added`); setNewSym(''); }
    else toast.error(res.payload);
  };

  const handleRemove = async (sym) => {
    await dispatch(removeFromWatchlist(sym));
    toast.info(`${sym} removed`);
  };

  const filtered = items.filter((i) =>
    i.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="sb-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1c2e42', margin: 0 }}>Watchlist</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="sb-input"
              placeholder="Add symbol (e.g. AAPL)"
              style={{ width: '180px' }}
              value={newSym}
              onChange={(e) => setNewSym(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn-blue" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>+ Add</button>
          </form>
          <div className="search-wrap">
            <input
              className="sb-input"
              placeholder="Enter Stock Symbol..."
              style={{ width: '200px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="sb-table">
          <thead>
            <tr>
              <th>Exchange</th>
              <th>Stock name</th>
              <th>Symbol</th>
              <th>Stock Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.symbol}>
                <td><span className="badge badge-nasdaq">NASDAQ</span></td>
                <td style={{ fontWeight: 500, color: '#1c2e42' }}>{getCompanyName(item.symbol)}</td>
                <td style={{ fontWeight: 600 }}>{item.symbol}</td>
                <td style={{ color: '#555' }}>Common Stock</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-blue"
                      style={{ padding: '0.35rem 1rem', fontSize: '0.8rem' }}
                      onClick={() => navigate(`/stocks/${item.symbol}`)}
                    >
                      View Chart
                    </button>
                    <button
                      className="btn-red"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => handleRemove(item.symbol)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#8a96a3', padding: '2.5rem' }}>
                  {items.length === 0 ? 'Your watchlist is empty. Add stocks above!' : 'No matches found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
