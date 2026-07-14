import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import { FaCreditCard, FaLock, FaCheckCircle, FaExclamationTriangle, FaUniversity, FaMobileAlt } from 'react-icons/fa';

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // UPI Inputs
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve booking details for checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (paymentMethod === 'Credit Card' && (!cardNumber || !expiry || !cvv || !cardName)) {
      setError('Please fill in all card details.');
      return;
    }
    
    if (paymentMethod === 'UPI' && !upiId) {
      setError('Please enter your VPA / UPI ID.');
      return;
    }

    setSubmitting(true);
    try {
      // Create payment in backend (which defaults to PENDING status)
      await paymentService.createPayment(bookingId, {
        paymentMethod: paymentMethod === 'Credit Card' ? 'Credit Card' : `UPI: ${upiId}`
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment simulation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <div className="spinner-border text-warning" role="status"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
          <div className="glass-card p-5 my-5 d-inline-block">
            <FaExclamationTriangle className="text-danger display-4 mb-3" />
            <h4 className="text-white">{error || 'Booking details not found.'}</h4>
            <Link to="/my-bookings" className="btn btn-warning mt-3">Back to Bookings</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container py-5 animate-fade-in" style={{ minHeight: '80vh' }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {success ? (
              <div className="glass-card p-5 text-center my-5 mx-auto animate-fade-in" style={{ maxWidth: '600px' }}>
                <FaCheckCircle className="text-success display-1 mb-4" />
                <h2 className="text-white mb-3" style={{ fontWeight: 800 }}>Payment Initiated!</h2>
                <p className="text-muted mb-4">
                  Your transaction has been recorded as <strong className="text-warning">PENDING</strong> verification. 
                  An administrator will review and approve the payment details shortly to mark it <strong className="text-success">SUCCESS</strong>.
                </p>
                <div className="spinner-grow text-warning spinner-grow-sm me-2" role="status"></div>
                <span className="text-muted small">Redirecting to your dashboard...</span>
              </div>
            ) : (
              <div className="row g-4">
                {/* Left Side: Summary */}
                <div className="col-md-5">
                  <div className="glass-card p-4 h-100">
                    <h4 className="text-white mb-4">Rental Invoice Summary</h4>
                    
                    <div className="mb-4">
                      <span className="text-warning text-uppercase fw-bold small">Booking ID: #{booking.id}</span>
                      <h3 className="text-white mt-1" style={{ fontWeight: 700 }}>
                        {booking.brandName} {booking.variantName}
                      </h3>
                      <p className="text-muted small mb-0">Vehicle Number: {booking.vehicleNo}</p>
                    </div>

                    <hr style={{ borderColor: 'var(--border-color)' }} />

                    <div className="my-4 small text-muted">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Pickup Location:</span>
                        <span className="text-light">{booking.pickupLocation}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Drop Location:</span>
                        <span className="text-light">{booking.dropLocation}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Duration:</span>
                        <span className="text-light">{booking.totalDays} Days</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Rent Interval:</span>
                        <span className="text-light">{booking.pickupDate} to {booking.returnDate}</span>
                      </div>
                    </div>

                    <hr style={{ borderColor: 'var(--border-color)' }} />

                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <h5 className="text-white mb-0">Total Due:</h5>
                      <h3 className="text-warning mb-0" style={{ fontWeight: 800 }}>₹ {booking.totalAmount}</h3>
                    </div>
                  </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="col-md-7">
                  <div className="glass-card p-4 p-md-5">
                    <h4 className="text-white mb-4">Choose Payment Method</h4>
                    
                    {error && (
                      <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-4" style={{ backgroundColor: 'rgba(220,53,69,0.15)', color: '#ea868f' }}>
                        <FaExclamationTriangle />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Method SelectorTabs */}
                    <div className="d-flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Credit Card')}
                        className={`btn flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2 ${paymentMethod === 'Credit Card' ? 'btn-warning' : 'btn-dark'}`}
                      >
                        <FaCreditCard /> Card Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`btn flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2 ${paymentMethod === 'UPI' ? 'btn-warning' : 'btn-dark'}`}
                      >
                        <FaMobileAlt /> UPI / VPA
                      </button>
                    </div>

                    <form onSubmit={handlePaymentSubmit}>
                      {paymentMethod === 'Credit Card' ? (
                        <div className="row g-3 animate-fade-in">
                          <div className="col-12">
                            <label className="form-label text-muted small">Cardholder Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. Johnathan Doe"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label text-muted small">Card Number</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="16-digit card number"
                              maxLength="16"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                              required
                            />
                          </div>

                          <div className="col-6">
                            <label className="form-label text-muted small">Expiry Date</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="MM/YY"
                              maxLength="5"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-6">
                            <label className="form-label text-muted small">CVV Code</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="3 digits"
                              maxLength="3"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                              required
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="col-12 animate-fade-in mb-3">
                          <label className="form-label text-muted small">UPI Address (VPA)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="username@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required
                          />
                          <p className="text-muted small mt-2">Enter your UPI ID linked to GPay, PhonePe, or Paytm.</p>
                        </div>
                      )}

                      <div className="d-flex align-items-center gap-2 mt-4 text-muted small">
                        <FaLock className="text-success" />
                        <span>Secured 256-Bit SSL Payment gateway simulation.</span>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-warning w-100 py-3 mt-4 d-flex align-items-center justify-content-center gap-2 fs-5"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          `Pay ₹ ${booking.totalAmount}`
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Payment;
