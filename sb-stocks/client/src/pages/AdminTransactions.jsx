import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Spinner from '../components/common/Spinner';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTx(); }, []);

  const loadTx = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/trade/history');
      setTransactions(data.transactions || []);
    } catch { toast.error('Failed to load transactions'); }
    finally { setLoading(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="sb-card">
      <h2 className="section-title">All Transactions</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="sb-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#1a56a0' }}>{tx._id}</td>
                <td style={{ fontWeight: 600 }}>{tx.symbol}</td>
                <td>
                  <span className={tx.type === 'BUY' ? 'badge badge-nasdaq' : 'badge badge-red'}>
                    {tx.type}
                  </span>
                </td>
                <td>{tx.quantity}</td>
                <td>$ {parseFloat(tx.price).toFixed(2)}</td>
                <td style={{ fontWeight: 600 }}>$ {parseFloat(tx.total).toFixed(2)}</td>
                <td style={{ fontSize: '0.8rem', color: '#6b7a8d' }}>
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#8a96a3', padding: '2rem' }}>No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
