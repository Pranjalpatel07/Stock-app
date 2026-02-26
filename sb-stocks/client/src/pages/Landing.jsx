import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FEATURES = [
  { icon: '💰', title: '$100,000 Virtual Capital', desc: 'Start with $100K paper money to practice trading risk-free.' },
  { icon: '📈', title: 'Real Market Data', desc: 'Powered by Alpha Vantage API for accurate US stock prices.' },
  { icon: '📊', title: 'Portfolio Analytics', desc: 'Track P&L, average price, and performance in real-time.' },
  { icon: '⭐', title: 'Watchlist', desc: 'Monitor your favorite stocks with a custom watchlist.' },
  { icon: '📜', title: 'Trade History', desc: 'Full transaction log with buy/sell records.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'JWT authentication with bcrypt password hashing.' },
];

export default function Landing() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">📈</span>
            <span className="text-primary-400">SB</span>
            <span>Stocks</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg font-semibold transition-colors">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg font-semibold transition-colors">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-900/30 border border-primary-700/50 text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
          🚀 Paper Trading Platform — No Real Money at Risk
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-primary-300 bg-clip-text text-transparent leading-tight">
          Trade Stocks.<br />Without the Risk.
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          SB Stocks is a paper trading simulator powered by real US market data.
          Practice your investment strategy with $100,000 virtual capital.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-primary-900/50"
          >
            Start Trading Free →
          </Link>
          <Link
            to="/login"
            className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-white/5"
          >
            Sign In
          </Link>
        </div>

        {/* Mock stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[['$100K', 'Starting Balance'], ['10+', 'US Stocks'], ['Real-time', 'Market Data']].map(([value, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-white">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Trade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-primary-900/50 to-blue-900/50 border border-primary-700/30 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-400 mb-8">Join and practice trading US stocks with no financial risk.</p>
          <Link
            to="/register"
            className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all inline-block"
          >
            Create Free Account →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>© 2025 SB Stocks. Paper trading for educational purposes only.</p>
      </footer>
    </div>
  );
}
