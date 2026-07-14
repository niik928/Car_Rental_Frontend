import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationTriangle } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      
      // Check if admin and redirect accordingly
      const isAdminUser = user.role && user.role.some(r => r.name === 'ROLE_ADMIN' || r.name === 'ADMIN');
      if (isAdminUser) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #1b1c2b 0%, #0c0d12 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="text-center mb-4 animate-fade-in">
              <h2 className="text-warning display-6" style={{ fontWeight: 800 }}>CAR RENTAL</h2>
              <p className="text-muted">Welcome back! Please login to your account.</p>
            </div>

            <div className="glass-card p-4 p-md-5 animate-fade-in">
              <h3 className="text-center text-white mb-4">Login</h3>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0" style={{ backgroundColor: 'rgba(220,53,69,0.15)', color: '#ea868f' }}>
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label text-muted small">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      placeholder="••••••••"
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
                    <>
                      <FaSignInAlt /> Login
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-muted small">Don't have an account? </span>
                <Link to="/register" className="text-warning text-decoration-none small fw-bold hover-link">
                  Register
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-3">
              <Link to="/" className="text-muted text-decoration-none small">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;