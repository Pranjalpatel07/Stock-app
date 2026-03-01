import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const active = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sb-navbar">
      <Link to={user ? '/dashboard' : '/'} className="brand">
        SB Stocks{isAdmin ? ' (Admin)' : ''}
      </Link>
      <nav>
        {user ? (
          isAdmin ? (
            <>
              <Link to="/dashboard" className={active('/dashboard')}>Home</Link>
              <Link to="/admin/users" className={active('/admin/users')}>Users</Link>
              <Link to="/admin/orders" className={active('/admin/orders')}>Orders</Link>
              <Link to="/admin/transactions" className={active('/admin/transactions')}>Transactions</Link>
              <a href="#" onClick={handleLogout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={active('/dashboard')}>Home</Link>
              <Link to="/portfolio" className={active('/portfolio')}>Portfolio</Link>
              <Link to="/history" className={active('/history')}>History</Link>
              <Link to="/profile" className={active('/profile')}>Profile</Link>
              <a href="#" onClick={handleLogout}>Logout</a>
            </>
          )
        ) : (
          <>
            <Link to="/" className={active('/')}>Home</Link>
            <Link to="/about">About</Link>
            <Link to="/register">Join now</Link>
          </>
        )}
      </nav>
    </div>
  );
}
