import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStocks, setSearchQuery } from '../redux/slices/stockSlice';
import { fetchWatchlist, addToWatchlist } from '../redux/slices/watchlistSlice';
import Spinner from '../components/common/Spinner';

const TRENDING_SYMBOLS = ['TSLA', 'KVUE', 'JNJ', 'NIO', 'AMC', 'NU'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: stocks, loading, searchQuery } = useSelector((s) => s.stocks);
  const { items: watchlist } = useSelector((s) => s.watchlist);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchStocks());
    dispatch(fetchWatchlist());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => dispatch(fetchStocks()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const getStock = (sym) => stocks.find((s) => s.symbol === sym);

  const filteredStocks = stocks.filter((s) =>
    s.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
    s.symbol.toLowerCase().includes(searchText.toLowerCase())
  );

  const trendingData = TRENDING_SYMBOLS.map((sym, i) => {
    const s = getStock(sym);
    const names = {
      TSLA: 'Tesla, Inc.', KVUE: 'Kenvue Inc.', JNJ: 'Johnson & Johnson',
      NIO: 'NIO Inc.', AMC: 'AMC Entertainment Holdings, Inc.', NU: 'Nu Holdings Ltd.'
    };
    return {
      symbol: sym,
      name: names[sym] || sym,
      price: s ? s.price : (150 + i * 23.5).toFixed(2),
      change: s ? s.changePercent : (i % 2 === 0 ? -1.2 - i * 0.3 : 1.1 + i * 0.2).toFixed(2),
    };
  });

  if (loading && stocks.length === 0) return <Spinner />;

  return (
    <div className="home-grid">
      {/* Trending Sidebar */}
      <div className="trending-panel">
        <h3>Trending stocks</h3>
        {trendingData.map((t) => {
          const isPos = parseFloat(t.change) >= 0;
          return (
            <div
              key={t.symbol}
              className="trending-item"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/stocks/${t.symbol}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="t-label">Stock name</div>
                  <div className="t-name">{t.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <div>
                  <span className="t-label">Symbol </span>
                  <span className="t-symbol">{t.symbol}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="t-label">Price</div>
                  <div className="t-price">
                    $ {parseFloat(t.price).toFixed(2)}
                    <span className={isPos ? 'pos' : 'neg'}>
                      {' '}({isPos ? '+' : ''}{parseFloat(t.change).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Watchlist Area */}
      <div>
        <div className="sb-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1c2e42', margin: 0 }}>Watchlist</h2>
            <div className="search-wrap">
              <input
                className="sb-input"
                placeholder="Enter Stock Symbol..."
                style={{ width: '220px' }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value.toUpperCase())}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Stock table */}
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
                {(searchText ? filteredStocks : stocks).map((stock) => (
                  <tr key={stock.symbol}>
                    <td><span className="badge badge-nasdaq">NASDAQ</span></td>
                    <td style={{ color: '#1c2e42', fontWeight: 500 }}>
                      {getCompanyName(stock.symbol)}
                    </td>
                    <td style={{ fontWeight: 600 }}>{stock.symbol}</td>
                    <td style={{ color: '#555' }}>Common Stock</td>
                    <td>
                      <button
                        className="btn-blue"
                        style={{ padding: '0.35rem 1rem', fontSize: '0.8rem' }}
                        onClick={() => navigate(`/stocks/${stock.symbol}`)}
                      >
                        View Chart
                      </button>
                    </td>
                  </tr>
                ))}
                {stocks.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#8a96a3', padding: '2rem' }}>
                      No stocks available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCompanyName(symbol) {
  const map = {
    AAPL: 'Apple Inc.', GOOGL: 'Alphabet Inc.', MSFT: 'Microsoft Corporation',
    AMZN: 'Amazon.com Inc.', TSLA: 'Tesla, Inc.', META: 'Meta Platforms Inc.',
    NVDA: 'NVIDIA Corporation', NFLX: 'Netflix Inc.', AMD: 'Advanced Micro Devices',
    INTC: 'Intel Corporation', AACG: 'ATA Creativity Global',
    AACI: 'Armada Acquisition Corp. I', AACIU: 'Armada Acquisition Corp. I Unit',
    AACIW: 'Armada Acquisition Corp. I W', AACOU: 'Advancit Acquisition Corp. I',
  };
  return map[symbol] || symbol + ' Corporation';
}
