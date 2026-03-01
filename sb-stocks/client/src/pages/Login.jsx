import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login, clearError } from '../redux/slices/authSlice';

// Inline SVG illustration matching the screenshots
const TradingIllustration = () => (
  <svg viewBox="0 0 500 400" style={{maxWidth:'440px', width:'100%'}}>
    <ellipse cx="250" cy="370" rx="200" ry="20" fill="#d0e8f5" opacity="0.5"/>
    <rect x="80" y="200" width="55" height="150" rx="4" fill="#4a90c4" opacity="0.85"/>
    <rect x="150" y="150" width="55" height="200" rx="4" fill="#3a7fb5" opacity="0.9"/>
    <rect x="220" y="100" width="55" height="250" rx="4" fill="#1a56a0"/>
    <rect x="290" y="170" width="55" height="180" rx="4" fill="#2e7ab8" opacity="0.85"/>
    <polyline points="70,280 150,210 230,160 320,130 400,80" stroke="#1c3e6b" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <polygon points="400,80 388,95 408,90" fill="#1c3e6b"/>
    <circle cx="410" cy="180" r="22" fill="#ffd700" opacity="0.9"/>
    <text x="404" y="186" fontSize="18" fontWeight="bold" fill="#333">$</text>
    <circle cx="440" cy="220" r="15" fill="#ffd700" opacity="0.7"/>
    <text x="436" y="226" fontSize="12" fontWeight="bold" fill="#333">$</text>
    <circle cx="350" cy="250" r="15" fill="#f5a623"/>
    <rect x="340" y="265" width="20" height="35" rx="3" fill="#2c5fa8"/>
    <line x1="335" y1="275" x2="325" y2="295" stroke="#2c5fa8" strokeWidth="4" strokeLinecap="round"/>
    <line x1="360" y1="275" x2="375" y2="280" stroke="#2c5fa8" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="150" cy="310" r="12" fill="#e8956d"/>
    <rect x="142" y="322" width="16" height="28" rx="3" fill="#e67e22"/>
    <rect x="175" y="330" width="22" height="18" rx="3" fill="#8b4513"/>
    <rect x="173" y="326" width="26" height="6" rx="2" fill="#6b3410"/>
    <rect x="130" y="338" width="45" height="28" rx="3" fill="#ccc"/>
    <rect x="133" y="341" width="39" height="20" rx="2" fill="#1a56a0"/>
    <circle cx="100" cy="290" r="14" fill="#ffd700" opacity="0.8"/>
    <rect x="96" y="303" width="8" height="8" rx="1" fill="#ccc"/>
  </svg>
);

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    dispatch(login(form));
  };

  return (
    <div className="auth-page">
      <div className="sb-navbar">
        <Link to="/" className="brand">SB Stocks</Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/register">Join now</Link>
        </nav>
      </div>
      <div className="auth-content">
        <div className="auth-left">
          <h1>SB Stock Trading</h1>
          <p>
            Experience seamless stock market trading with our user-friendly platform,
            offering real-time data, advanced analytics, and swift execution to empower
            traders and investors alike.
          </p>
          <div className="auth-form-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <input
                  className="sb-input"
                  placeholder="Email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <input
                  className="sb-input"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-blue"
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <p className="auth-footer-link">
              Not registered? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
        <div className="auth-right">
          <TradingIllustration />
        </div>
      </div>
    </div>
  );
}
