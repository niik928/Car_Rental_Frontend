import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import userService from '../../services/userService';
import bookingService from '../../services/bookingService';
import { FaUsers, FaCar, FaBookOpen, FaMoneyBillWave, FaCalendarAlt, FaClock } from 'react-icons/fa';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalCars: 0,
    totalRevenue: 0.0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const statsData = await userService.getDashboardData();
      setStats(statsData);

      try {
        const bookings = await bookingService.getAllBookings();
        // Display top 5 recent bookings
        setRecentBookings(bookings.sort((a, b) => b.id - a.id).slice(0, 5));
      } catch (err) {
        console.warn('Could not fetch recent bookings for dashboard', err);
      }

    } catch (err) {
      console.error(err);
      setError('Could not retrieve dashboard statistics. Verify backend status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid animate-fade-in">
        <div className="row">
          <AdminSidebar />
          
          <div className="col-md-9 col-lg-10 p-4 p-md-5" style={{ minHeight: '90vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-white" style={{ fontWeight: 800 }}>Admin Dashboard</h2>
              <button onClick={fetchDashboardData} className="btn btn-dark btn-sm">Refresh Stats</button>
            </div>

            {error && (
              <div className="alert alert-danger border-0 px-3 py-2 text-center mb-4" style={{ backgroundColor: 'rgba(220,53,69,0.15)', color: '#ea868f' }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="text-muted mt-2">Summarizing business statistics...</p>
              </div>
            ) : (
              <>
                {/* Stats Cards Row */}
                <div className="row g-4 mb-5">
                  <div className="col-md-6 col-lg-3">
                    <div className="glass-card p-4 d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small d-block mb-1">Total Users</span>
                        <h3 className="text-white mb-0" style={{ fontWeight: 800 }}>{stats.totalUsers}</h3>
                      </div>
                      <div className="fs-1 text-warning p-2 rounded" style={{ background: 'rgba(245,166,35,0.08)' }}>
                        <FaUsers />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <div className="glass-card p-4 d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small d-block mb-1">Total Bookings</span>
                        <h3 className="text-white mb-0" style={{ fontWeight: 800 }}>{stats.totalBookings}</h3>
                      </div>
                      <div className="fs-1 text-warning p-2 rounded" style={{ background: 'rgba(245,166,35,0.08)' }}>
                        <FaBookOpen />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <div className="glass-card p-4 d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small d-block mb-1">Car Brands</span>
                        <h3 className="text-white mb-0" style={{ fontWeight: 800 }}>{stats.totalCars}</h3>
                      </div>
                      <div className="fs-1 text-warning p-2 rounded" style={{ background: 'rgba(245,166,35,0.08)' }}>
                        <FaCar />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <div className="glass-card p-4 d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small d-block mb-1">Gross Revenue</span>
                        <h3 className="text-warning mb-0" style={{ fontWeight: 800 }}>₹ {stats.totalRevenue || 0}</h3>
                      </div>
                      <div className="fs-1 text-warning p-2 rounded" style={{ background: 'rgba(245,166,35,0.08)' }}>
                        <FaMoneyBillWave />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings Section */}
                <div className="glass-card p-4">
                  <h4 className="text-white mb-4">Recent Bookings Log</h4>
                  
                  {recentBookings.length === 0 ? (
                    <p className="text-muted small mb-0">No booking requests have been recorded yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-dark table-hover mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Car Variant</th>
                            <th>Rental Dates</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map((b) => (
                            <tr key={b.id}>
                              <td>#{b.id}</td>
                              <td>
                                <div>
                                  <span className="text-white fw-bold">{b.userFullName}</span>
                                  <span className="text-muted small d-block">{b.userEmail}</span>
                                </div>
                              </td>
                              <td>{b.brandName} {b.variantName}</td>
                              <td>
                                <span className="small text-light">
                                  {b.pickupDate} to {b.returnDate}
                                </span>
                              </td>
                              <td className="text-warning fw-bold">₹ {b.totalAmount}</td>
                              <td>
                                <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success text-dark' : b.status === 'CANCELLED' ? 'bg-danger' : 'bg-secondary'}`}>
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
