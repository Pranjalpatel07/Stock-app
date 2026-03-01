import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Spinner from '../components/common/Spinner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBalance, setEditBalance] = useState({});

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceUpdate = async (userId) => {
    const newBal = editBalance[userId];
    if (!newBal || isNaN(newBal)) { toast.error('Enter valid balance'); return; }
    try {
      await api.put(`/admin/users/${userId}/balance`, { balance: parseFloat(newBal) });
      toast.success('Balance updated');
      setEditBalance({ ...editBalance, [userId]: undefined });
      loadUsers();
    } catch { toast.error('Failed to update balance'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="sb-card">
      <h2 className="section-title">All users</h2>
      {users.map((u) => (
        <div className="admin-user-row" key={u._id}>
          <div className="fg">
            <div className="lbl">User id</div>
            <div className="val" style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#1a56a0' }}>{u._id}</div>
          </div>
          <div className="fg">
            <div className="lbl">Username</div>
            <div className="val">{u.name}</div>
          </div>
          <div className="fg">
            <div className="lbl">Email</div>
            <div className="val">{u.email}</div>
          </div>
          <div className="fg">
            <div className="lbl">Balance</div>
            {editBalance[u._id] !== undefined ? (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <input
                  className="sb-input"
                  style={{ width: '100px', padding: '0.3rem 0.6rem', fontSize: '0.82rem' }}
                  type="number"
                  value={editBalance[u._id]}
                  onChange={(e) => setEditBalance({ ...editBalance, [u._id]: e.target.value })}
                />
                <button
                  className="btn-blue"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                  onClick={() => handleBalanceUpdate(u._id)}
                >✓</button>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a96a3', fontSize: '0.85rem' }}
                  onClick={() => setEditBalance({ ...editBalance, [u._id]: undefined })}
                >✕</button>
              </div>
            ) : (
              <div
                className="val"
                style={{ cursor: 'pointer' }}
                title="Click to edit"
                onClick={() => setEditBalance({ ...editBalance, [u._id]: u.balance })}
              >
                {parseFloat(u.balance).toFixed(0)}
              </div>
            )}
          </div>
          <div className="fg">
            <div className="lbl">Role</div>
            <span className={u.role === 'admin' ? 'badge badge-nasdaq' : 'badge badge-green'}>{u.role}</span>
          </div>
        </div>
      ))}
      {users.length === 0 && (
        <p style={{ color: '#8a96a3', textAlign: 'center', padding: '2rem' }}>No users found.</p>
      )}
    </div>
  );
}
