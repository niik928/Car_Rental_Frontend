import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaTachometerAlt, FaCar, FaCogs, FaBarcode, FaBookOpen, FaMoneyBillWave, FaUsers, FaArrowLeft } from 'react-icons/fa';

function AdminSidebar() {
  return (
    <div className="col-md-3 col-lg-2 admin-sidebar p-3 d-flex flex-column h-100">
      <h5 className="text-warning text-center mb-4 mt-2" style={{ fontWeight: 800, letterSpacing: '1px' }}>
        ADMIN PANEL
      </h5>
      
      <div className="flex-grow-1">
        <NavLink 
          className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`} 
          to="/admin/dashboard"
        >
          <FaTachometerAlt /> Dashboard
        </NavLink>

        <NavLink 
          className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`} 
          to="/admin/cars"
        >
          <FaCar /> Car Brands
        </NavLink>

        <NavLink 
          className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`} 
          to="/admin/variants"
        >
          <FaCogs /> Model Variants
        </NavLink>

        <NavLink 
          className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`} 
          to="/admin/vehicles"
        >
          <FaBarcode /> Physical Fleets
        </NavLink>

        <NavLink 
          className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`} 
          to="/admin/bookings"
        >
          <FaBookOpen /> Bookings Log
        </NavLink>

        <NavLink 
          className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`} 
          to="/admin/payments"
        >
          <FaMoneyBillWave /> Payments
        </NavLink>

        <NavLink 
          className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`} 
          to="/admin/users"
        >
          <FaUsers /> Users Access
        </NavLink>
      </div>

      <div className="border-top pt-3 mt-4" style={{ borderColor: 'var(--border-color)' }}>
        <Link to="/" className="admin-link text-warning mb-0">
          <FaArrowLeft /> Exit to App
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;
