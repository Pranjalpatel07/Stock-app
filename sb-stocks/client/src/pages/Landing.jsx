import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Landing() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  return (
    <div className="auth-page">
      <div className="sb-navbar">
        <span className="brand">SB Stocks</span>
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
            <div className="form-field">
              <input className="sb-input" placeholder="Email address" type="email" disabled />
            </div>
            <div className="form-field">
              <input className="sb-input" placeholder="Password" type="password" disabled />
            </div>
            <Link to="/login">
              <button className="btn-blue" style={{width:"100%",marginTop:"0.5rem"}}>Sign in</button>
            </Link>
            <p className="auth-footer-link" style={{marginTop:"0.75rem"}}>
              Not registered? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
        <div className="auth-right">
          <img
            src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4c8.png"
            alt="Trading illustration"
            style={{opacity:0}}
          />
          <svg viewBox="0 0 500 400" style={{maxWidth:"440px",width:"100%"}}>
            <defs>
              <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8f4fd"/>
                <stop offset="100%" stopColor="#c5e3f7"/>
              </linearGradient>
            </defs>
            {/* Floor */}
            <ellipse cx="250" cy="370" rx="200" ry="20" fill="#d0e8f5" opacity="0.5"/>
            {/* Bar chart blocks */}
            <rect x="80" y="200" width="55" height="150" rx="4" fill="#4a90c4" opacity="0.85"/>
            <rect x="150" y="150" width="55" height="200" rx="4" fill="#3a7fb5" opacity="0.9"/>
            <rect x="220" y="100" width="55" height="250" rx="4" fill="#1a56a0"/>
            <rect x="290" y="170" width="55" height="180" rx="4" fill="#2e7ab8" opacity="0.85"/>
            {/* Arrow */}
            <polyline points="70,280 150,210 230,160 320,130 400,80" stroke="#1c3e6b" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <polygon points="400,80 388,95 408,90" fill="#1c3e6b"/>
            {/* Dollar signs */}
            <circle cx="410" cy="180" r="22" fill="#ffd700" opacity="0.9"/>
            <text x="404" y="186" fontSize="18" fontWeight="bold" fill="#333">$</text>
            <circle cx="440" cy="220" r="15" fill="#ffd700" opacity="0.7"/>
            <text x="436" y="226" fontSize="12" fontWeight="bold" fill="#333">$</text>
            {/* Person 1 */}
            <circle cx="350" cy="250" r="15" fill="#f5a623"/>
            <rect x="340" y="265" width="20" height="35" rx="3" fill="#2c5fa8"/>
            <line x1="335" y1="275" x2="325" y2="295" stroke="#2c5fa8" strokeWidth="4" strokeLinecap="round"/>
            <line x1="360" y1="275" x2="375" y2="280" stroke="#2c5fa8" strokeWidth="4" strokeLinecap="round"/>
            {/* Person 2 */}
            <circle cx="150" cy="310" r="12" fill="#e8956d"/>
            <rect x="142" y="322" width="16" height="28" rx="3" fill="#e67e22"/>
            {/* Coffee cup */}
            <rect x="175" y="330" width="22" height="18" rx="3" fill="#8b4513"/>
            <rect x="173" y="326" width="26" height="6" rx="2" fill="#6b3410"/>
            <path d="M183,320 Q185,314 187,320" stroke="#8b4513" strokeWidth="1.5" fill="none"/>
            {/* Laptop */}
            <rect x="130" y="338" width="45" height="28" rx="3" fill="#ccc"/>
            <rect x="133" y="341" width="39" height="20" rx="2" fill="#1a56a0"/>
            {/* Lightbulb */}
            <circle cx="100" cy="290" r="14" fill="#ffd700" opacity="0.8"/>
            <rect x="96" y="303" width="8" height="8" rx="1" fill="#ccc"/>
            <line x1="100" y1="272" x2="100" y2="265" stroke="#ffd700" strokeWidth="2"/>
            <line x1="115" y1="278" x2="120" y2="273" stroke="#ffd700" strokeWidth="2"/>
            <line x1="85" y1="278" x2="80" y2="273" stroke="#ffd700" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
