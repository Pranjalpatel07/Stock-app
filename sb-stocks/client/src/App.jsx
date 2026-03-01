import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Portfolio from './pages/Portfolio';
import TradeHistory from './pages/TradeHistory';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminTransactions from './pages/AdminTransactions';
import Layout from './components/layout/Layout';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public */}
        {/* <Route path="/login" element={<Landing />} /> */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Landing />} />

        {/* User Protected */}
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/stocks/:symbol" element={<PrivateRoute><Layout><StockDetail /></Layout></PrivateRoute>} />
        <Route path="/portfolio" element={<PrivateRoute><Layout><Portfolio /></Layout></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><Layout><TradeHistory /></Layout></PrivateRoute>} />
        <Route path="/watchlist" element={<PrivateRoute><Layout><Watchlist /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin/users" element={<AdminRoute><Layout><AdminUsers /></Layout></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><Layout><AdminOrders /></Layout></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><Layout><AdminTransactions /></Layout></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
