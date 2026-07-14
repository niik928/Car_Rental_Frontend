import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCar, FaKey, FaShieldAlt, FaClock, FaCheckCircle, FaStar } from 'react-icons/fa';

function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="py-5 text-center text-md-start animate-fade-in" style={{ padding: '80px 0', background: 'radial-gradient(circle at center, rgba(245,166,35,0.08) 0%, transparent 60%)' }}>
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-md-7 mb-4 mb-md-0">
              <span className="badge bg-warning text-dark mb-3">LUXURY & RELIABILITY</span>
              <h1 className="display-4 text-white mb-3" style={{ fontWeight: 800, lineHeight: 1.15 }}>
                Drive Your Dream Car <br/>
                <span className="text-warning">Redefined.</span>
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem' }}>
                Rent top-tier luxury, sports, and economy cars at flexible rates. Enjoy frictionless online booking, transparent pricing, and instant keys.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                <Link to="/cars" className="btn btn-warning btn-lg">
                  Explore Cars
                </Link>
                <Link to="/register" className="btn btn-dark btn-lg">
                  Sign Up Now
                </Link>
              </div>
            </div>
            <div className="col-md-5 text-center">
              <div className="p-4 glass-card d-inline-block position-relative" style={{ maxWidth: '400px' }}>
                <FaCar className="text-warning display-1 my-4 animate-bounce" />
                <h4 className="text-white">Frictionless Rental</h4>
                <p className="text-muted small">
                  Upload driving license, choose date, and collect keys in under 5 minutes.
                </p>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  10% OFF
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ background: '#0e0f14' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="text-white display-5 mb-2">Why Rent With Us?</h2>
            <p className="text-muted">Designed for convenience, safety, and ultimate comfort</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 text-center glass-card h-100">
                <div className="d-inline-block p-3 rounded-circle bg-warning text-dark mb-4 fs-3">
                  <FaShieldAlt />
                </div>
                <h4 className="text-white mb-3">Fully Insured Cars</h4>
                <p className="text-muted small">
                  Drive worry-free. Every vehicle in our fleet is covered by comprehensive insurance options.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="p-4 text-center glass-card h-100">
                <div className="d-inline-block p-3 rounded-circle bg-warning text-dark mb-4 fs-3">
                  <FaKey />
                </div>
                <h4 className="text-white mb-3">Easy Key Pickups</h4>
                <p className="text-muted small">
                  Self-service lockbox locations and app-enabled entry across key transit hubs.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="p-4 text-center glass-card h-100">
                <div className="d-inline-block p-3 rounded-circle bg-warning text-dark mb-4 fs-3">
                  <FaClock />
                </div>
                <h4 className="text-white mb-3">Flexible Booking</h4>
                <p className="text-muted small">
                  Modify or cancel booking dynamically. Set customized pickup and drop schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="text-white display-5 mb-2">What Drivers Say</h2>
            <p className="text-muted">Thousands of satisfied customers worldwide</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 glass-card">
                <div className="text-warning mb-3">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-muted italic mb-3">"The easiest car rental experience I have ever had. The BMW X5 was clean, fully refueled, and drove beautifully."</p>
                <h6 className="text-white mb-0">- Rahul S.</h6>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 glass-card">
                <div className="text-warning mb-3">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-muted italic mb-3">"Top notch service! The support team was super helpful when I had to extend my trip by two additional days."</p>
                <h6 className="text-white mb-0">- Priya K.</h6>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 glass-card">
                <div className="text-warning mb-3">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-muted italic mb-3">"Simulated booking was extremely quick, and the website's dark mode looks absolute premium. Highly recommended!"</p>
                <h6 className="text-white mb-0">- David M.</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;