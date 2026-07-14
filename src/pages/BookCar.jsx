import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import variantService from '../services/variantService';
import vehicleService from '../services/vehicleService';
import bookingService from '../services/bookingService';
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle, FaChevronRight } from 'react-icons/fa';

function BookCar() {
  const { id } = useParams(); // variant ID
  const { user } = useAuth();
  const navigate = useNavigate();

  const [variant, setVariant] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');

  // Calculations
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const variantData = await variantService.getVariantById(id);
      setVariant(variantData);

      const allVehicles = await vehicleService.getAllVehicles();
      const available = allVehicles.filter(
        v => v.variantId === Number(id) && v.status === 'AVAILABLE'
      );
      setAvailableVehicles(available);

      if (available.length === 0) {
        setError('No available fleets left for this car model currently.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve vehicle information.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Date Changes to calculate total days and total cost
  useEffect(() => {
    if (pickupDate && returnDate) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
        setTotalDays(diffDays);
        setTotalAmount(diffDays * (variant?.pricePerDay || 0));
        setError('');
      } else {
        setTotalDays(0);
        setTotalAmount(0);
        setError('Return date must be after or equal to the pickup date.');
      }
    }
  }, [pickupDate, returnDate, variant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!pickupDate || !returnDate || !pickupLocation || !dropLocation) {
      setError('Please fill in all booking fields.');
      return;
    }

    if (totalDays <= 0) {
      setError('Invalid date configuration.');
      return;
    }

    if (availableVehicles.length === 0) {
      setError('No physical vehicle is available for this variant.');
      return;
    }

    setSubmitting(true);
    try {
      // Pick first available physical vehicle instance
      const selectedVehicle = availableVehicles[0];
      
      const bookingDto = {
        pickupLocation,
        dropLocation,
        pickupDate,
        returnDate
      };

      const createdBooking = await bookingService.createBooking(
        user.id,
        selectedVehicle.id,
        bookingDto
      );

      // Redirect directly to the checkout/payment page for this booking
      navigate(`/payment/${createdBooking.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
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

  return (
    <>
      <Navbar />

      <div className="container py-5 animate-fade-in" style={{ minHeight: '80vh' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="glass-card p-4 p-md-5">
              <h2 className="text-white mb-4 text-center" style={{ fontWeight: 800 }}>Book Your Car</h2>
              
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-4" style={{ backgroundColor: 'rgba(220,53,69,0.15)', color: '#ea868f' }}>
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </div>
              )}

              {/* Summary of Chosen Variant */}
              {variant && (
                <div className="p-3 mb-4 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                      <span className="text-warning text-uppercase fw-bold small">{variant.brandName}</span>
                      <h4 className="text-white mb-1">{variant.variantName}</h4>
                      <span className="text-muted small">
                        {variant.fuelType} • {variant.transmission} • {variant.seatingCapacity} seats
                      </span>
                    </div>
                    <div className="text-end mt-2 mt-md-0">
                      <span className="text-muted small d-block">Price Per Day</span>
                      <strong className="text-white fs-5">₹ {variant.pricePerDay}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Dates */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Pickup Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                        <FaCalendarAlt />
                      </span>
                      <input
                        type="date"
                        className="form-control border-start-0"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small">Return Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                        <FaCalendarAlt />
                      </span>
                      <input
                        type="date"
                        className="form-control border-start-0"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Pickup Location</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                        <FaMapMarkerAlt />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="e.g. Airport Terminus 2"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small">Drop Location</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                        <FaMapMarkerAlt />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="e.g. Downtown Office Mall"
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Bill Breakup */}
                {totalDays > 0 && (
                  <div className="my-4 p-4 rounded animate-fade-in" style={{ background: 'rgba(245,166,35,0.04)', border: '1px dashed rgba(245,166,35,0.2)' }}>
                    <h5 className="text-white mb-3">Cost Summary</h5>
                    <div className="d-flex justify-content-between mb-2 text-muted small">
                      <span>Rate Per Day</span>
                      <span>₹ {variant.pricePerDay}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 text-muted small">
                      <span>Total Days</span>
                      <span>{totalDays} days</span>
                    </div>
                    <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                    <div className="d-flex justify-content-between text-white fw-bold">
                      <span>Estimated Amount</span>
                      <span className="text-warning">₹ {totalAmount}</span>
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting || availableVehicles.length === 0 || totalDays <= 0}
                  >
                    {submitting ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        Confirm Booking & Pay <FaChevronRight />
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-3">
                <Link to={`/car-details/${id}`} className="text-muted text-decoration-none small">
                  Cancel and Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookCar;