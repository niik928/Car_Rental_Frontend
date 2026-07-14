import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCar, FaUser, FaSignOutAlt, FaTachometerAlt, FaBookmark } from 'react-icons/fa';

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-3">
      <div className="container">
        <Link className="navbar-brand text-warning" to="/">
          <FaCar className="me-2 text-warning fs-3" />
          <span>CAR RENTAL</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/cars">
                Cars
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <li className="nav-item">
                    <Link className="btn btn-outline-warning btn-sm px-3 ms-2 me-1" to="/admin/dashboard">
                      <FaTachometerAlt className="me-2" /> Admin Panel
                    </Link>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/my-bookings">
                        <FaBookmark className="me-1" /> My Bookings
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/profile">
                        <FaUser className="me-1" /> Profile
                      </NavLink>
                    </li>
                  </>
                )}

                <li className="nav-item ms-2">
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted small d-none d-md-inline">
                      Hi, <strong className="text-warning">{user?.fullName?.split(' ')[0]}</strong>
                    </span>
                    <button onClick={handleLogout} className="btn btn-dark btn-sm d-flex align-items-center gap-2 px-3">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item ms-2">
                  <Link className="btn btn-warning btn-sm px-4" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;