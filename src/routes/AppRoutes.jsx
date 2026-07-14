import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Home from '../pages/Home';
import Cars from '../pages/Cars';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CarDetails from '../pages/CarDetails';
import BookCar from '../pages/BookCar';
import MyBookings from '../pages/MyBookings';
import Payment from '../pages/Payment';
import Profile from '../pages/Profile';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCars from '../pages/admin/AdminCars';
import AdminVariants from '../pages/admin/AdminVariants';
import AdminVehicles from '../pages/admin/AdminVehicles';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminUsers from '../pages/admin/AdminUsers';

// Helper component for user-only pages
const UserRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#16171d' }}>
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Helper component for admin-only pages
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#16171d' }}>
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }
  return isAuthenticated && isAdmin ? children : <Navigate to={isAuthenticated ? '/' : '/login'} replace />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/car-details/:id" element={<CarDetails />} />

        {/* Protected User Routes */}
        <Route
          path="/book-car/:id"
          element={
            <UserRoute>
              <BookCar />
            </UserRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <UserRoute>
              <MyBookings />
            </UserRoute>
          }
        />
        <Route
          path="/payment/:bookingId"
          element={
            <UserRoute>
              <Payment />
            </UserRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cars"
          element={
            <AdminRoute>
              <AdminCars />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/variants"
          element={
            <AdminRoute>
              <AdminVariants />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <AdminRoute>
              <AdminVehicles />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <AdminPayments />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;