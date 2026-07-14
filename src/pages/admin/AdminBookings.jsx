import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import bookingService from '../../services/bookingService';
import { FaBookOpen, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error(err);
      setError('Could not retrieve bookings log from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request? This will make the vehicle available again.')) return;
    setError('');
    setSuccess('');
    try {
      await bookingService.cancelBooking(bookingId);
      setSuccess('Booking request cancelled successfully.');
      fetchBookings();
    } catch (err) {
      console.error(err);
      setError('Could not cancel booking.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-success text-dark';
      case 'CANCELLED': return 'bg-danger';
      case 'COMPLETED': return 'bg-info text-dark';
      default: return 'bg-secondary';
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
              <h2 className="text-white" style={{ fontWeight: 800 }}>Manage Bookings</h2>
              <button onClick={fetchBookings} className="btn btn-dark btn-sm">Refresh List</button>
            </div>

            {success && (
              <div className="alert alert-success border-0 px-3 py-2 text-center mb-4" style={{ backgroundColor: 'rgba(25,135,84,0.15)', color: '#75b798' }}>
                {success}
              </div>
            )}

            {error && (
              <div className="alert alert-danger border-0 px-3 py-2 text-center mb-4" style={{ backgroundColor: 'rgba(220,53,69,0.15)', color: '#ea868f' }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="text-muted mt-2">Loading trip records...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <FaBookOpen className="text-muted display-4 mb-3" />
                <h4 className="text-white">No Bookings Recorded</h4>
                <p className="text-muted">Customer bookings will appear here.</p>
              </div>
            ) : (
              <div className="glass-card p-4">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer Details</th>
                        <th>Vehicle Details</th>
                        <th>Duration & Dates</th>
                        <th>Invoice Due</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id}>
                          <td>#{b.id}</td>
                          <td>
                            <div>
                              <span className="text-white fw-bold d-block">{b.userFullName || 'N/A'}</span>
                              <span className="text-muted small">{b.userEmail || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <span className="text-warning fw-bold d-block">
                                {b.brandName} {b.variantName}
                              </span>
                              <span className="text-muted small">Plate: {b.vehicleNo}</span>
                            </div>
                          </td>
                          <td>
                            <div className="small">
                              <span className="text-light d-block">
                                <FaCalendarAlt className="text-warning me-1" />
                                {b.pickupDate} to {b.returnDate}
                              </span>
                              <span className="text-muted">({b.totalDays} Days)</span>
                            </div>
                          </td>
                          <td className="text-warning fw-bold">₹ {b.totalAmount}</td>
                          <td>
                            <span className={`badge ${b.paymentStatus === 'SUCCESS' ? 'bg-success text-dark' : b.paymentStatus === 'PENDING' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                              {b.paymentStatus || 'UNPAID'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(b.status)}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="text-end">
                            {b.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleCancel(b.id)}
                                className="btn btn-dark btn-sm text-danger d-flex align-items-center gap-1 ms-auto"
                              >
                                <FaTimes /> Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminBookings;
