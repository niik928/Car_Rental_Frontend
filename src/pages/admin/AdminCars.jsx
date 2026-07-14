import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import carService from '../../services/carService';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaCar } from 'react-icons/fa';

function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals / Inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await carService.getAllCars();
      setCars(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve car brands from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!brandName) return;

    try {
      await carService.addCar({ brandName });
      setSuccess('Brand added successfully.');
      setBrandName('');
      setShowAddForm(false);
      fetchCars();
    } catch (err) {
      console.error(err);
      setError('Failed to create car brand.');
    }
  };

  const handleEditClick = (car) => {
    setEditId(car.id);
    setBrandName(car.brandName);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!brandName || !editId) return;

    try {
      await carService.updateCar(editId, { brandName });
      setSuccess('Brand updated successfully.');
      setBrandName('');
      setEditId(null);
      setShowEditForm(false);
      fetchCars();
    } catch (err) {
      console.error(err);
      setError('Failed to update brand.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deleting this brand will delete all its sub-variants and vehicles. Proceed?')) return;
    setError('');
    setSuccess('');

    try {
      await carService.deleteCar(id);
      setSuccess('Brand deleted successfully.');
      fetchCars();
    } catch (err) {
      console.error(err);
      setError('Failed to delete car brand.');
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid animate-fade-in">
        <div className="row">
          <AdminSidebar />

          <div className="col-md-9 col-lg-10 p-4 p-md-5" style={{ minHeight: '90vh' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <h2 className="text-white mb-0" style={{ fontWeight: 800 }}>Manage Car Brands</h2>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setShowEditForm(false);
                  setBrandName('');
                }}
                className="btn btn-warning d-flex align-items-center gap-2"
              >
                <FaPlus /> Add New Brand
              </button>
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

            {/* Add Brand Form */}
            {showAddForm && (
              <div className="glass-card p-4 mb-4 animate-fade-in" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h4 className="text-white mb-3">Add Car Brand</h4>
                <form onSubmit={handleAddSubmit} className="row g-3 align-items-end">
                  <div className="col-md-8">
                    <label className="form-label text-muted small">Brand Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. BMW, Mercedes, Tesla"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 d-flex gap-2">
                    <button type="submit" className="btn btn-warning flex-grow-1">Save Brand</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-dark"><FaTimes /></button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Brand Form */}
            {showEditForm && (
              <div className="glass-card p-4 mb-4 animate-fade-in" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h4 className="text-white mb-3">Edit Car Brand</h4>
                <form onSubmit={handleEditSubmit} className="row g-3 align-items-end">
                  <div className="col-md-8">
                    <label className="form-label text-muted small">Brand Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 d-flex gap-2">
                    <button type="submit" className="btn btn-warning flex-grow-1">Update Brand</button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        setBrandName('');
                        setEditId(null);
                      }}
                      className="btn btn-dark"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Data Table */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="text-muted mt-2">Loading brand list...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <FaCar className="text-muted display-4 mb-3" />
                <h4 className="text-white">No Car Brands Registered</h4>
                <p className="text-muted">Click "Add New Brand" to get started.</p>
              </div>
            ) : (
              <div className="glass-card p-4">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Brand ID</th>
                        <th>Brand Name</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.map((car) => (
                        <tr key={car.id}>
                          <td>#{car.id}</td>
                          <td className="fw-bold text-white">{car.brandName}</td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <button
                                onClick={() => handleEditClick(car)}
                                className="btn btn-dark btn-sm d-flex align-items-center gap-1"
                                title="Edit Brand Name"
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(car.id)}
                                className="btn btn-dark btn-sm d-flex align-items-center gap-1 text-danger"
                                title="Delete Brand"
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminCars;
