import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await authService.register(fullName, email, phone, password);
      setSuccess('Account created successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #1b1c2b 0%, #0c0d12 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="text-center mb-4 animate-fade-in">
              <h2 className="text-warning display-6" style={{ fontWeight: 800 }}>CAR RENTAL</h2>
              <p className="text-muted">Create an account to start booking your rides.</p>
            </div>

            <div className="glass-card p-4 p-md-5 animate-fade-in">
              <h3 className="text-center text-white mb-4">Register</h3>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0" style={{ backgroundColor: 'rgba(220,53,69,0.15)', color: '#ea868f' }}>
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small border-0" style={{ backgroundColor: 'rgba(25,135,84,0.15)', color: '#75b798' }}>
                  <FaCheckCircle />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      className="form-control border-start-0"
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="Choose a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-warning w-100 py-2 d-flex align-items-center justify-content-center gap-2 fs-5"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Register'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-muted small">Already have an account? </span>
                <Link to="/login" className="text-warning text-decoration-none small fw-bold hover-link">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;