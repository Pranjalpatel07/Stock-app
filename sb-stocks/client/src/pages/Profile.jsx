import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchProfile } from '../redux/slices/authSlice';
import api from '../services/api';
import Spinner from '../components/common/Spinner';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFundModal, setShowFundModal] = useState(null); // 'add' | 'withdraw' | null
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('IMPS');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // We'll use trade history as transaction proxy
      const { data } = await api.get('/trade/history');
      // Map to financial transactions style
      const financial = data.transactions.map((t) => ({
        _id: t._id,
        amount: t.total,
        action: t.type === 'BUY' ? 'Withdraw' : 'Deposit',
        paymentMode: ['IMPS', 'net banking', 'UPI', 'NEFT'][Math.floor(Math.random() * 4)],
        time: t.createdAt,
      }));
      setTransactions(financial);
    } catch (e) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFundAction = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter valid amount'); return; }
    toast.success(`${showFundModal === 'add' ? 'Added' : 'Withdrawn'} $${amount} successfully (demo)`);
    setShowFundModal(null);
    setAmount('');
    dispatch(fetchProfile());
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  if (loading && transactions.length === 0) return <Spinner />;

  return (
    <div className="sb-card" style={{ maxWidth: '720px' }}>
      <h2 className="section-title">My Account</h2>

      {/* Balance Box */}
      <div className="profile-balance-box">
        <div className="p-name">{user?.name}</div>
        <div className="p-bal-label">Trading balance</div>
        <div className="p-bal">$ {parseFloat(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}</div>
        <div className="profile-actions">
          <button className="btn-outline" onClick={() => setShowFundModal('add')}>
            ⊕ Add Funds
          </button>
          <button className="btn-outline" onClick={() => setShowFundModal('withdraw')}>
            ↑ Withdraw
          </button>
          <button className="btn-blue" onClick={loadTransactions}>
            ⟳ Transaction History
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1c2e42', marginBottom: '0.85rem' }}>Transactions</h3>
        {transactions.length === 0 ? (
          <p style={{ color: '#8a96a3', fontSize: '0.875rem' }}>No transactions yet.</p>
        ) : (
            transactions.map((tx) =>  (
            <div className="row-item" key={tx._id}>
              <div>
                <div className="lbl">Amount</div>
                <div className="val">$ {parseFloat(tx.amount).toFixed(0)}</div>
              </div>
              <div>
                <div className="lbl">Action</div>
                <div className="val" style={{ color: tx.action === 'Deposit' ? '#28a745' : '#dc3545' }}>
                  {tx.action}
                </div>
              </div>
              <div>
                <div className="lbl">Payment mode</div>
                <div className="val">{tx.paymentMode}</div>
              </div>
              <div>
                <div className="lbl">Time</div>
                <div className="val" style={{ fontSize: '0.8rem', fontWeight: 400, color: '#555' }}>
                  {formatDate(tx.time)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fund Modal */}
      {showFundModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div className="sb-card" style={{ maxWidth: '360px', width: '100%' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              {showFundModal === 'add' ? 'Add Funds' : 'Withdraw Funds'}
            </h3>
            <form onSubmit={handleFundAction}>
              <div className="form-field" style={{ marginBottom: '0.85rem' }}>
                <label style={{ fontSize: '0.82rem', color: '#6b7a8d', marginBottom: '0.35rem', display: 'block' }}>Amount ($)</label>
                <input
                  className="sb-input"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', color: '#6b7a8d', marginBottom: '0.35rem', display: 'block' }}>Payment Mode</label>
                <select className="sb-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                  <option>IMPS</option>
                  <option>net banking</option>
                  <option>UPI</option>
                  <option>NEFT</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-blue" style={{ flex: 1 }}>Confirm</button>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowFundModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
