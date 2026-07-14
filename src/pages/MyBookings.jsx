import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bookingService from '../services/bookingService';
import { FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = await bookingService.getBookingsByUser(user.id);
      // Sort bookings: most recent first
      setBookings(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error(err);
      setError('Could not fetch your booking history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setError('');
    setSuccess('');
    try {
      await bookingService.cancelBooking(bookingId);
      setSuccess('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      console.error(err);
      setError('Could not cancel booking. It may have already been cancelled or processed.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-success text-dark';
      case 'CANCELLED': return 'bg-danger';
      case 'COMPLETED': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case 'SUCCESS': return 'bg-success text-dark';
      case 'FAILED': return 'bg-danger';
      case 'PENDING': return 'bg-warning text-dark';
      default: return 'bg-light text-dark';
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-5 animate-fade-in" style={{ minHeight: '80vh' }}>
        <div className="text-center mb-5">
          <h2 className="display-5 text-white" style={{ fontWeight: 800 }}>My Bookings</h2>
          <p className="text-muted">Review your active bookings, download receipts, and manage trips.</p>
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
            <p className="text-muted mt-2">Loading your trips...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card p-5 text-center my-4">
            <h4 className="text-white mb-2">No Bookings Yet</h4>
            <p className="text-muted">You haven't rented any cars yet. Ready to hit the road?</p>
            <Link to="/cars" className="btn btn-warning mt-3">Book a Car Now</Link>
          </div>
        ) : (
          <div className="row g-4">
            {bookings.map((booking) => (
              <div className="col-100" key={booking.id}>
                <div className="glass-card p-4">
                  <div className="row justify-content-between align-items-center g-3">
                    {/* Booking metadata */}
                    <div className="col-md-3">
                      <span className="text-warning text-uppercase fw-bold small">
                        Booking #{booking.id}
                      </span>
                      <h4 className="text-white my-1" style={{ fontWeight: 700 }}>
                        {booking.brandName} {booking.variantName}
                      </h4>
                      <p className="text-muted small mb-0">
                        Vehicle No: <strong className="text-light">{booking.vehicleNo}</strong>
                      </p>
                    </div>

                    {/* Rent Dates */}
                    <div className="col-md-3 d-flex align-items-center gap-3">
                      <FaCalendarAlt className="text-warning fs-4" />
                      <div>
                        <span className="text-muted small d-block">Duration ({booking.totalDays} Days)</span>
                        <span className="text-white small fw-bold">
                          {booking.pickupDate} <span className="text-warning">to</span> {booking.returnDate}
                        </span>
                      </div>
                    </div>

                    {/* Locations */}
                    <div className="col-md-3 d-flex align-items-center gap-3">
                      <FaMapMarkerAlt className="text-warning fs-4" />
                      <div>
                        <span className="text-muted small d-block">Pickup & Drop</span>
                        <span className="text-light small d-block">From: {booking.pickupLocation}</span>
                        <span className="text-light small d-block">To: {booking.dropLocation}</span>
                      </div>
                    </div>

                    {/* Price and Badges */}
                    <div className="col-md-3 d-flex flex-column align-items-md-end justify-content-between text-md-end">
                      <div className="mb-2">
                        <span className="text-muted small d-block">Total Cost</span>
                        <h4 className="text-warning mb-0" style={{ fontWeight: 700 }}>₹ {booking.totalAmount}</h4>
                      </div>

                      <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                          Trip: {booking.status}
                        </span>
                        
                        {booking.paymentStatus ? (
                          <span className={`badge ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                            Payment: {booking.paymentStatus}
                          </span>
                        ) : (
                          <span className="badge bg-secondary text-dark">
                            Unpaid
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-2 mt-3">
                        {booking.status === 'CONFIRMED' && (!booking.paymentStatus || booking.paymentStatus !== 'SUCCESS') && (
                          <Link to={`/payment/${booking.id}`} className="btn btn-warning btn-sm d-flex align-items-center gap-1">
                            <FaCreditCard /> Pay Now
                          </Link>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="btn btn-dark btn-sm d-flex align-items-center gap-1 text-danger"
                          >
                            <FaTrashAlt /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default MyBookings;
