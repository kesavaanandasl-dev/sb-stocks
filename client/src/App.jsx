import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadProfile } from './redux/authSlice.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from './components/layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Stocks from './pages/Stocks.jsx';
import StockDetails from './pages/StockDetails.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Watchlist from './pages/Watchlist.jsx';
import Transactions from './pages/Transactions.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

// Protected Route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadProfile());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout isDark={isDark} setIsDark={setIsDark} />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="stocks" element={<Stocks />} />
          <Route path="stocks/:symbol" element={<StockDetails />} />

          {/* Protected routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}
