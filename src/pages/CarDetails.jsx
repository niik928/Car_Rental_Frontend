import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import variantService from '../services/variantService';
import vehicleService from '../services/vehicleService';
import { FaGasPump, FaCog, FaUserFriends, FaCalendarAlt, FaPalette, FaCheckCircle, FaCar, FaExclamationTriangle } from 'react-icons/fa';

function CarDetails() {
  const { id } = useParams();
  const [variant, setVariant] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const variantData = await variantService.getVariantById(id);
      setVariant(variantData);

      try {
        const allVehicles = await vehicleService.getAllVehicles();
        const variantVehicles = allVehicles.filter(v => v.variantId === Number(id));
        setVehicles(variantVehicles);
      } catch (err) {
        console.warn('Could not load physical vehicles for details page', err);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve car information from server.');
    } finally {
      setLoading(false);
    }
  };

  const getCarImage = (brand) => {
    const brandName = String(brand || '').toLowerCase();
    if (brandName.includes('bmw')) {
      return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800';
    } else if (brandName.includes('audi')) {
      return 'https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&q=80&w=800';
    } else if (brandName.includes('mercedes')) {
      return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800';
    } else if (brandName.includes('tesla') || brandName.includes('ev')) {
      return 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800';
    } else if (brandName.includes('hyundai')) {
      return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800';
    }
    return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
  };

  const isAvailable = vehicles.some(v => v.status === 'AVAILABLE');

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

  if (error || !variant) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
          <div className="glass-card p-5 my-5 d-inline-block">
            <FaExclamationTriangle className="text-danger display-4 mb-3" />
            <h4 className="text-white">{error || 'Car variant not found.'}</h4>
            <Link to="/cars" className="btn btn-warning mt-3">Back to Catalog</Link>
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
        <div className="row g-5">
          {/* Left Column - Large Image */}
          <div className="col-lg-7">
            <div className="glass-card p-2" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <img
                src={variant.imageUrl || getCarImage(variant.brandName)}
                alt={`${variant.brandName} ${variant.variantName}`}
                className="img-fluid w-100"
                style={{ borderRadius: '18px', objectFit: 'cover', maxHeight: '450px' }}
              />
            </div>
            
            {/* Fleet Fleet instances */}
            <div className="glass-card p-4 mt-4">
              <h4 className="text-white mb-4">Available Physical Fleets</h4>
              {vehicles.length === 0 ? (
                <p className="text-muted small mb-0">No physical vehicle instances registered under this model yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Vehicle Number</th>
                        <th>Color</th>
                        <th>Model Year</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((v) => (
                        <tr key={v.id}>
                          <td className="fw-bold">{v.vehicleNo}</td>
                          <td>
                            <span className="d-inline-flex align-items-center gap-2">
                              <FaPalette style={{ color: v.color?.toLowerCase() || 'gray' }} />
                              {v.color || 'Unspecified'}
                            </span>
                          </td>
                          <td>{v.manufacturingYear || 'N/A'}</td>
                          <td>
                            <span className={`badge ${v.status === 'AVAILABLE' ? 'bg-success' : v.status === 'BOOKED' ? 'bg-danger' : 'bg-secondary'}`}>
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Spec Card */}
          <div className="col-lg-5">
            <div className="glass-card p-4 p-md-5 h-100 d-flex flex-column">
              <div>
                <span className="text-warning text-uppercase fw-bold letter-spacing-1 small">
                  {variant.brandName}
                </span>
                <h2 className="text-white display-6 mb-3" style={{ fontWeight: 800 }}>
                  {variant.variantName}
                </h2>
                
                <h3 className="text-warning mb-4" style={{ fontWeight: 700 }}>
                  ₹ {variant.pricePerDay} <span className="text-muted fs-6 font-normal">/ day</span>
                </h3>

                <p className="text-muted mb-4 small" style={{ lineHeight: '1.6' }}>
                  The {variant.brandName} {variant.variantName} matches powerful performance with ultimate passenger comfort. Perfect for long weekend getaways or official corporate travel.
                </p>

                <hr style={{ borderColor: 'var(--border-color)' }} />

                {/* Spec List */}
                <div className="my-4">
                  <div className="d-flex align-items-center justify-content-between mb-3 text-muted">
                    <span className="d-flex align-items-center gap-2"><FaGasPump className="text-warning" /> Fuel Type</span>
                    <span className="text-white fw-bold">{variant.fuelType}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3 text-muted">
                    <span className="d-flex align-items-center gap-2"><FaCog className="text-warning" /> Transmission</span>
                    <span className="text-white fw-bold">{variant.transmission}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3 text-muted">
                    <span className="d-flex align-items-center gap-2"><FaUserFriends className="text-warning" /> Seating Capacity</span>
                    <span className="text-white fw-bold">{variant.seatingCapacity} Persons</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3 text-muted">
                    <span className="d-flex align-items-center gap-2"><FaCar className="text-warning" /> Total Fleet</span>
                    <span className="text-white fw-bold">{vehicles.length} Units</span>
                  </div>
                </div>

                <hr style={{ borderColor: 'var(--border-color)' }} />
              </div>

              {/* CTAs */}
              <div className="mt-auto pt-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <span className="text-muted small">Status:</span>
                  {isAvailable ? (
                    <span className="text-success fw-bold d-flex align-items-center gap-1">
                      <FaCheckCircle /> Available to Book
                    </span>
                  ) : (
                    <span className="text-danger fw-bold">
                      Sold Out / Booked
                    </span>
                  )}
                </div>

                {isAvailable ? (
                  <Link to={`/book-car/${variant.id}`} className="btn btn-warning btn-lg w-100 py-3">
                    Book This Car
                  </Link>
                ) : (
                  <button className="btn btn-dark btn-lg w-100 py-3" disabled>
                    Not Available
                  </button>
                )}
                
                <div className="text-center mt-3">
                  <Link to="/cars" className="text-muted text-decoration-none small">
                    Back to Catalog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CarDetails;