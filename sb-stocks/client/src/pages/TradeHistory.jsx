import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTradeHistory } from '../redux/slices/tradeSlice';
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

export default function TradeHistory() {
  const dispatch = useDispatch();
  const { history, historyLoading } = useSelector((s) => s.trade);

  useEffect(() => { dispatch(fetchTradeHistory()); }, [dispatch]);

  if (historyLoading) return <Spinner />;

  return (
    <div className="sb-card">
      <h2 className="section-title">My Orders</h2>
      <div style={{ overflowX: 'auto' }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#8a96a3', padding: '3rem 1rem', fontSize: '0.9rem' }}>
            No orders yet. Start trading to see your history here!
          </div>
        ) : (
          history.map((tx) => (
            <div className="row-item" key={tx._id}>
              <div>
                <span className={tx.type === 'BUY' ? 'badge badge-intraday' : 'badge badge-delivery'}>
                  Intraday
                </span>
              </div>
              <div>
                <div className="lbl">Stock name</div>
                <div className="val">{getCompanyName(tx.symbol)}</div>
              </div>
              <div>
                <div className="lbl">Symbol</div>
                <div className="val">{tx.symbol}</div>
              </div>
              <div>
                <div className="lbl">Order type</div>
                <div className="val" style={{ color: tx.type === 'BUY' ? '#1a56a0' : '#dc3545' }}>{tx.type === 'BUY' ? 'Buy' : 'Sell'}</div>
              </div>
              <div>
                <div className="lbl">Stocks</div>
                <div className="val">{tx.quantity}</div>
              </div>
              <div>
                <div className="lbl">order price</div>
                <div className="val">$ {parseFloat(tx.price).toFixed(2)}</div>
              </div>
              <div>
                <div className="lbl">order total value</div>
                <div className="val">$ {parseFloat(tx.total).toFixed(2)}</div>
              </div>
              <div>
                <div className="lbl">order status</div>
                <div className="badge-completed">Completed</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
