import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
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

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Get all users then get their orders via admin endpoint
      const { data } = await api.get('/admin/users');
      // Fetch all transactions - we'll use a combined approach
      // Since we need all transactions, use the admin endpoint
      const txRes = await api.get('/admin/transactions');
      setOrders(txRes.data.transactions || []);
    } catch (e) {
      // Fallback: try trade history
      try {
        const { data } = await api.get('/trade/history');
        setOrders(data.transactions || []);
      } catch { toast.error('Failed to load orders'); }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="sb-card">
      <h2 className="section-title">My Orders</h2>
      {orders.length === 0 ? (
        <p style={{ color: '#8a96a3', textAlign: 'center', padding: '2rem' }}>No orders found.</p>
      ) : (
        orders.map((tx) => (
          <div className="admin-user-row" key={tx._id}>
            <div className="fg">
              <div className="lbl">UserId</div>
              <div className="val" style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#1a56a0' }}>
                {tx.userId?._id || tx.userId || 'N/A'}
              </div>
            </div>
            <div className="fg">
              <div className="lbl">Order Type</div>
              <div className="val">Intraday</div>
            </div>
            <div className="fg">
              <div className="lbl">Stock name</div>
              <div className="val">{getCompanyName(tx.symbol)}</div>
            </div>
            <div className="fg">
              <div className="lbl">Symbol</div>
              <div className="val">{tx.symbol}</div>
            </div>
            <div className="fg">
              <div className="lbl">Order type</div>
              <div className="val" style={{ color: tx.type === 'BUY' ? '#1a56a0' : '#dc3545' }}>{tx.type === 'BUY' ? 'Buy' : 'Sell'}</div>
            </div>
            <div className="fg">
              <div className="lbl">Stocks</div>
              <div className="val">{tx.quantity}</div>
            </div>
            <div className="fg">
              <div className="lbl">order price</div>
              <div className="val">$ {parseFloat(tx.price).toFixed(2)}</div>
            </div>
            <div className="fg">
              <div className="lbl">order total value</div>
              <div className="val">$ {parseFloat(tx.total).toFixed(2)}</div>
            </div>
            <div className="fg">
              <div className="lbl">order status</div>
              <div className="badge-completed">Completed</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
