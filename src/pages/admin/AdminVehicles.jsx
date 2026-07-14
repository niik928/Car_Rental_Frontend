import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import vehicleService from '../../services/vehicleService';
import variantService from '../../services/variantService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBarcode } from 'react-icons/fa';

function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals / Input states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Fields
  const [variantId, setVariantId] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [color, setColor] = useState('');
  const [manufacturingYear, setManufacturingYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('AVAILABLE');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const vehicleData = await vehicleService.getAllVehicles();
      const variantData = await variantService.getAllVariants();
      setVehicles(vehicleData);
      setVariants(variantData);
      if (variantData.length > 0) setVariantId(variantData[0].id);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve vehicle logs from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!variantId || !vehicleNo || !color || !manufacturingYear) {
      setError('Please fill in all vehicle parameters.');
      return;
    }

    try {
      const vehicleDto = {
        vehicleNo,
        color,
        manufacturingYear: Number(manufacturingYear),
        status
      };

      await vehicleService.addVehicle(variantId, vehicleDto);
      setSuccess('Vehicle unit added to inventory successfully.');
      resetForm();
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to add vehicle unit.');
    }
  };

  const handleEditClick = (vehicle) => {
    setEditId(vehicle.id);
    setVariantId(vehicle.variantId || '');
    setVehicleNo(vehicle.vehicleNo);
    setColor(vehicle.color);
    setManufacturingYear(vehicle.manufacturingYear);
    setStatus(vehicle.status);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!vehicleNo || !color || !manufacturingYear) {
      setError('Please fill in all parameters.');
      return;
    }

    try {
      const vehicleDto = {
        vehicleNo,
        color,
        manufacturingYear: Number(manufacturingYear),
        status
      };

      await vehicleService.updateVehicle(editId, vehicleDto);
      setSuccess('Vehicle information modified successfully.');
      resetForm();
      setShowEditForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to update vehicle details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle unit from system logs?')) return;
    setError('');
    setSuccess('');

    try {
      await vehicleService.deleteVehicle(id);
      setSuccess('Vehicle unit deleted successfully.');
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete vehicle.');
    }
  };

  const resetForm = () => {
    setVehicleNo('');
    setColor('');
    setManufacturingYear(new Date().getFullYear());
    setStatus('AVAILABLE');
    setEditId(null);
    if (variants.length > 0) setVariantId(variants[0].id);
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid animate-fade-in">
        <div className="row">
          <AdminSidebar />

          <div className="col-md-9 col-lg-10 p-4 p-md-5" style={{ minHeight: '90vh' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <h2 className="text-white mb-0" style={{ fontWeight: 800 }}>Manage Physical Fleets</h2>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setShowEditForm(false);
                  resetForm();
                }}
                className="btn btn-warning d-flex align-items-center gap-2"
                disabled={variants.length === 0}
              >
                <FaPlus /> Add Fleet Unit
              </button>
            </div>

            {variants.length === 0 && !loading && (
              <div className="alert alert-info">
                Please create at least one Model Variant first before adding physical vehicles.
              </div>
            )}

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

            {/* Add Vehicle Form */}
            {showAddForm && (
              <div className="glass-card p-4 p-md-5 mb-4 animate-fade-in" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h4 className="text-white mb-4">Add Physical Fleet Unit</h4>
                <form onSubmit={handleAddSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small">Model Variant Spec</label>
                      <select
                        className="form-select"
                        value={variantId}
                        onChange={(e) => setVariantId(e.target.value)}
                        required
                      >
                        {variants.map(v => (
                          <option key={v.id} value={v.id}>{v.brandName} {v.variantName} ({v.transmission})</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Vehicle Plate Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. MH31AB1234"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Body Color</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. White, Black, Red"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Manufacturing Year</label>
                      <input
                        type="number"
                        className="form-control"
                        min="2010"
                        max={new Date().getFullYear() + 1}
                        value={manufacturingYear}
                        onChange={(e) => setManufacturingYear(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Status</label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-end mt-4 d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-warning px-4">Save Unit</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-dark">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Vehicle Form */}
            {showEditForm && (
              <div className="glass-card p-4 p-md-5 mb-4 animate-fade-in" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h4 className="text-white mb-4">Edit Fleet Unit</h4>
                <form onSubmit={handleEditSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small">Model Spec (Read-only)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={variants.find(v => v.id === Number(variantId)) ? `${variants.find(v => v.id === Number(variantId)).brandName} ${variants.find(v => v.id === Number(variantId)).variantName}` : ''}
                        disabled
                        style={{ opacity: 0.6 }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Vehicle Plate Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Body Color</label>
                      <input
                        type="text"
                        className="form-control"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Manufacturing Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={manufacturingYear}
                        onChange={(e) => setManufacturingYear(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Status</label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="BOOKED">BOOKED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-end mt-4 d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-warning px-4">Update Details</button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        resetForm();
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
                <p className="text-muted mt-2">Loading inventory logs...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <FaBarcode className="text-muted display-4 mb-3" />
                <h4 className="text-white">No Vehicles Registered</h4>
                <p className="text-muted">Register physical cars with plate numbers and colors.</p>
              </div>
            ) : (
              <div className="glass-card p-4">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Unit ID</th>
                        <th>Plate No.</th>
                        <th>Model Specs</th>
                        <th>Color</th>
                        <th>Year</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((v) => (
                        <tr key={v.id}>
                          <td>#{v.id}</td>
                          <td className="text-white fw-bold">{v.vehicleNo}</td>
                          <td>
                            <div>
                              <span className="text-warning fw-bold">{v.brandName}</span>{' '}
                              <span className="text-light fw-bold">{v.variantName}</span>
                            </div>
                          </td>
                          <td>{v.color}</td>
                          <td>{v.manufacturingYear}</td>
                          <td>
                            <span className={`badge ${v.status === 'AVAILABLE' ? 'bg-success text-dark' : v.status === 'BOOKED' ? 'bg-danger' : 'bg-secondary'}`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <button
                                onClick={() => handleEditClick(v)}
                                className="btn btn-dark btn-sm d-flex align-items-center gap-1"
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(v.id)}
                                className="btn btn-dark btn-sm d-flex align-items-center gap-1 text-danger"
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

export default AdminVehicles;
