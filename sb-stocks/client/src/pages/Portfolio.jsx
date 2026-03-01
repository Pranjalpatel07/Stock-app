import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
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

export default function Portfolio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { holdings, loading } = useSelector((s) => s.portfolio);
  const { list: stocks } = useSelector((s) => s.stocks);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchStocks());
  }, [dispatch]);

  const getPrice = (sym) => {
    const s = stocks.find((x) => x.symbol === sym);
    return s ? s.price : null;
  };

  const enriched = holdings.map((h) => {
    const price = getPrice(h.symbol) || h.avgPrice;
    return { ...h, currentPrice: price, totalValue: price * h.quantity };
  });

  const filtered = search
    ? enriched.filter((h) => h.symbol.toLowerCase().includes(search.toLowerCase()))
    : enriched;

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="sb-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>My Portfolio</h2>
          <div className="search-wrap">
            <input
              className="sb-input"
              placeholder="Enter Stock Symbol..."
              style={{ width: '220px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="sb-table">
            <thead>
              <tr>
                <th>Exchange</th>
                <th>Stock name</th>
                <th>Symbol</th>
                <th>Stocks</th>
                <th>Stock price</th>
                <th>Total value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.symbol}>
                  <td><span className="badge badge-nasdaq">NASDAQ</span></td>
                  <td style={{ fontWeight: 500, color: '#1c2e42' }}>{getCompanyName(h.symbol)}</td>
                  <td style={{ fontWeight: 600 }}>{h.symbol}</td>
                  <td>{h.quantity}</td>
                  <td>$ {parseFloat(h.currentPrice).toFixed(2)}</td>
                  <td>$ {parseFloat(h.totalValue).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn-blue"
                      style={{ padding: '0.35rem 1rem', fontSize: '0.8rem' }}
                      onClick={() => navigate(`/stocks/${h.symbol}`)}
                    >
                      View Chart
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#8a96a3', padding: '2.5rem' }}>
                    {search ? `No stocks matching "${search}"` : 'No holdings yet. Buy some stocks!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
