import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="mt-auto py-5" style={{ background: '#08090d', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
            <h5 className="text-warning mb-2" style={{ fontWeight: 700, letterSpacing: '0.5px' }}>
              <FaCar className="me-2" /> CAR RENTAL
            </h5>
            <p className="text-muted small">
              Experience the ease and luxury of renting cars with our state-of-the-art booking platform. Reliable, fast, and secure.
            </p>
          </div>
          
          <div className="col-md-4 text-center mb-4 mb-md-0">
            <div className="d-flex justify-content-center gap-4">
              <Link to="/" className="text-muted text-decoration-none hover-link">Home</Link>
              <Link to="/cars" className="text-muted text-decoration-none hover-link">Cars</Link>
              <Link to="/login" className="text-muted text-decoration-none hover-link">Login</Link>
              <Link to="/register" className="text-muted text-decoration-none hover-link">Register</Link>
            </div>
          </div>
          
          <div className="col-md-3 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-3">
              <a href="#" className="text-muted fs-5"><FaTwitter /></a>
              <a href="#" className="text-muted fs-5"><FaGithub /></a>
              <a href="#" className="text-muted fs-5"><FaLinkedin /></a>
            </div>
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} Car Rental. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;