import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaGasPump, FaCog, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function CarCard({ car }) {
  // Map brand to high-quality unsplash images for premium presentation
  const getCarImage = (brand) => {
    const brandName = String(brand || '').toLowerCase();
    if (brandName.includes('bmw')) {
      return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600';
    } else if (brandName.includes('audi')) {
      return 'https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&q=80&w=600';
    } else if (brandName.includes('mercedes')) {
      return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600';
    } else if (brandName.includes('tesla') || brandName.includes('ev')) {
      return 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600';
    } else if (brandName.includes('hyundai')) {
      return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600';
    } else if (brandName.includes('tata') || brandName.includes('mahindra') || brandName.includes('thar')) {
      return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600';
    }
    return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=600';
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="glass-card car-card-new h-100 p-3">
        {/* Car Image Container */}
        <div className="img-container">
          <img src={car.imageUrl || getCarImage(car.brandName)} alt={`${car.brandName} ${car.variantName}`} />
          <span className="price-tag">
            ₹ {car.pricePerDay} <span style={{ fontSize: '11px', fontWeight: 'normal' }}>/ day</span>
          </span>
        </div>

        {/* Card Header Info */}
        <div className="mt-3">
          <span className="text-warning text-uppercase fw-bold small" style={{ letterSpacing: '1px' }}>
            {car.brandName || 'CAR'}
          </span>
          <h4 className="text-white mb-2" style={{ fontWeight: 700 }}>
            {car.variantName || 'Model'}
          </h4>
        </div>

        {/* Specs Grid */}
        <div className="row g-2 my-2 text-muted small">
          <div className="col-4 d-flex align-items-center gap-1">
            <FaGasPump className="text-warning" />
            <span>{car.fuelType || 'Petrol'}</span>
          </div>
          <div className="col-4 d-flex align-items-center gap-1">
            <FaCog className="text-warning" />
            <span>{car.transmission || 'Auto'}</span>
          </div>
          <div className="col-4 d-flex align-items-center gap-1">
            <FaUserFriends className="text-warning" />
            <span>{car.seatingCapacity || 5} Seats</span>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />

        {/* Booking Footer */}
        <div className="d-flex align-items-center justify-content-between mt-auto">
          <div className="d-flex align-items-center gap-1">
            {car.available ? (
              <span className="text-success small d-flex align-items-center gap-1">
                <FaCheckCircle /> Available
              </span>
            ) : (
              <span className="text-danger small d-flex align-items-center gap-1">
                <FaTimesCircle /> Booked
              </span>
            )}
          </div>

          <div className="d-flex gap-2">
            <Link to={`/car-details/${car.id}`} className="btn btn-dark btn-sm px-3">
              Details
            </Link>
            <Link
              to={car.available ? `/book-car/${car.id}` : '#'}
              className={`btn btn-warning btn-sm px-3 ${!car.available ? 'disabled opacity-50' : ''}`}
              style={!car.available ? { pointerEvents: 'none' } : {}}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarCard;