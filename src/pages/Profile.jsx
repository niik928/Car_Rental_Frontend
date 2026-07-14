import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import userService from '../services/userService';
import bookingService from '../services/bookingService';
import { FaUser, FaPhone, FaEnvelope, FaIdCard, FaClock, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';

function Profile() {
  const { user, refreshUser } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Driving License fields
  const [licenseNo, setLicenseNo] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [licenseImage, setLicenseImage] = useState('');

  // UI state
  const [hasLicense, setHasLicense] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingLicense, setUpdatingLicense] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      // Get driving license details
      try {
        const licenseData = await userService.getUserDrivingLicense(user.id);
        if (licenseData && licenseData.drivingLicense) {
          const dl = licenseData.drivingLicense;
          setLicenseNo(dl.licenseNo || '');
          setIssueDate(dl.issueDate || '');
          setExpiryDate(dl.expiryDate || '');
          setLicenseImage(dl.image || '');
          setHasLicense(true);
        }
      } catch (err) {
        // No license recorded, normal state
        setHasLicense(false);
      }

      // Get bookings count
      try {
        const bookings = await bookingService.getBookingsByUser(user.id);
        setBookingCount(bookings.length);
      } catch (err) {
        console.warn(err);
      }

    } catch (err) {
      console.error(err);
      setError('Could not retrieve complete profile metadata.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdatingProfile(true);

    try {
      const userDto = {
        fullName,
        phone,
        email: user.email // keep same
      };
      await userService.updateUser(user.id, userDto);
      setSuccess('Profile updated successfully.');
      await refreshUser();
    } catch (err) {
      console.error(err);
      setError('Failed to update profile details.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLicenseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdatingLicense(true);

    try {
      const dlDto = {
        licenseNo,
        issueDate,
        expiryDate,
        image: licenseImage || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300'
      };

      await userService.addDrivingLicense(user.id, dlDto);
      setSuccess('Driving license uploaded/updated successfully.');
      setHasLicense(true);
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      setError('Failed to register driving license in database.');
    } finally {
      setUpdatingLicense(false);
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
        <div className="text-center mb-5">
          <h2 className="display-5 text-white" style={{ fontWeight: 800 }}>Profile Settings</h2>
          <p className="text-muted">Manage your personal credentials, contact info, and rental documents.</p>
        </div>

        {success && (
          <div className="alert alert-success border-0 px-3 py-2 text-center mb-4" style={{ backgroundColor: 'rgba(25,135,84,0.15)', color: '#75b798' }}>
            {success}
          </div>
        )}

        {error && (
          <div className="alert alert-danger border-0 px-3 py-2 text-center mb-4" style={{ backgroundColor: 'rgba(220,53,69,0.15)', color: '#ea868f' }}>
            {error}
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Profile Card & Summary stats */}
          <div className="col-lg-4">
            <div className="glass-card p-4 text-center">
              <div className="d-inline-block p-4 rounded-circle bg-warning text-dark mb-3 fs-1" style={{ width: '90px', height: '90px' }}>
                <FaUser />
              </div>
              <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>{user?.fullName}</h3>
              <p className="text-muted small mb-3">{user?.email}</p>
              
              <div className="d-flex justify-content-center gap-2 mb-4">
                <span className="badge bg-warning text-dark">
                  {user?.role && user.role.some(r => r.name === 'ROLE_ADMIN' || r.name === 'ADMIN') ? 'Admin User' : 'Customer'}
                </span>
                <span className="badge bg-success text-dark">
                  {user?.status || 'ACTIVE'}
                </span>
              </div>

              <hr style={{ borderColor: 'var(--border-color)' }} />

              <div className="row text-center mt-3 g-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Trips Rented</span>
                  <strong className="text-white fs-4">{bookingCount}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Driving License</span>
                  {hasLicense ? (
                    <strong className="text-success small d-block mt-2"><FaCheckCircle /> Registered</strong>
                  ) : (
                    <strong className="text-danger small d-block mt-2"><FaExclamationTriangle /> Missing</strong>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editing Forms */}
          <div className="col-lg-8">
            <div className="row g-4">
              {/* Form 1: Profile Info */}
              <div className="col-12">
                <div className="glass-card p-4 p-md-5">
                  <h4 className="text-white mb-4"><FaUser className="text-warning me-2" /> Personal Contact Details</h4>
                  
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Full Name</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                            <FaUser />
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted small">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                            <FaPhone />
                          </span>
                          <input
                            type="tel"
                            className="form-control border-start-0"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <label className="form-label text-muted small">Registered Email Address (Non-editable)</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)', opacity: 0.5 }}>
                            <FaEnvelope />
                          </span>
                          <input
                            type="email"
                            className="form-control border-start-0"
                            value={user?.email || ''}
                            disabled
                            style={{ opacity: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-end mt-4">
                      <button type="submit" className="btn btn-warning px-4" disabled={updatingProfile}>
                        {updatingProfile ? 'Saving...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Form 2: Driving License */}
              <div className="col-12">
                <div className="glass-card p-4 p-md-5">
                  <h4 className="text-white mb-4"><FaIdCard className="text-warning me-2" /> Driving License Verification</h4>
                  
                  <form onSubmit={handleLicenseSubmit}>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label text-muted small">License Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                            <FaIdCard />
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="e.g. DL-142011002345"
                            value={licenseNo}
                            onChange={(e) => setLicenseNo(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted small">Issue Date</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                            <FaCalendarAlt />
                          </span>
                          <input
                            type="date"
                            className="form-control border-start-0"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted small">Expiry Date</label>
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                            <FaCalendarAlt />
                          </span>
                          <input
                            type="date"
                            className="form-control border-start-0"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <label className="form-label text-muted small">License Copy Photo URL (Simulated Upload)</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="e.g. https://domain.com/photo.jpg"
                          value={licenseImage}
                          onChange={(e) => setLicenseImage(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="text-end mt-4">
                      <button type="submit" className="btn btn-warning px-4" disabled={updatingLicense}>
                        {updatingLicense ? 'Registering...' : hasLicense ? 'Update Driving License' : 'Register Driving License'}
                      </button>
                    </div>
                  </form>
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

export default Profile;
