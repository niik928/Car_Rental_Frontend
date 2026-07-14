import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import variantService from '../../services/variantService';
import carService from '../../services/carService';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCog } from 'react-icons/fa';

function AdminVariants() {
  const [variants, setVariants] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals / Input states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Fields
  const [carId, setCarId] = useState('');
  const [variantName, setVariantName] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');
  const [seatingCapacity, setSeatingCapacity] = useState(5);
  const [pricePerDay, setPricePerDay] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const variantData = await variantService.getAllVariants();
      const carData = await carService.getAllCars();
      setVariants(variantData);
      setCars(carData);
      if (carData.length > 0) setCarId(carData[0].id);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve catalog data from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!carId || !variantName || !pricePerDay) {
      setError('Please fill in all variant specs.');
      return;
    }

    try {
      const variantDto = {
        variantName,
        fuelType,
        transmission,
        seatingCapacity: Number(seatingCapacity),
        pricePerDay: Number(pricePerDay),
        imageUrl
      };

      await variantService.addVariant(carId, variantDto);
      setSuccess('Variant model created successfully.');
      resetForm();
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to create variant model.');
    }
  };

  const handleEditClick = (variant) => {
    setEditId(variant.id);
    setCarId(variant.carId || '');
    setVariantName(variant.variantName);
    setFuelType(variant.fuelType);
    setTransmission(variant.transmission);
    setSeatingCapacity(variant.seatingCapacity);
    setPricePerDay(variant.pricePerDay);
    setImageUrl(variant.imageUrl || '');
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!variantName || !pricePerDay) {
      setError('Please fill in all specs.');
      return;
    }

    try {
      const variantDto = {
        variantName,
        fuelType,
        transmission,
        seatingCapacity: Number(seatingCapacity),
        pricePerDay: Number(pricePerDay),
        imageUrl
      };

      await variantService.updateVariant(editId, variantDto);
      setSuccess('Variant model updated successfully.');
      resetForm();
      setShowEditForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to update variant.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deleting this model will delete all its registered physical vehicles. Proceed?')) return;
    setError('');
    setSuccess('');

    try {
      await variantService.deleteVariant(id);
      setSuccess('Variant model deleted successfully.');
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete variant.');
    }
  };

  const resetForm = () => {
    setVariantName('');
    setFuelType('Petrol');
    setTransmission('Automatic');
    setSeatingCapacity(5);
    setPricePerDay('');
    setImageUrl('');
    setEditId(null);
    if (cars.length > 0) setCarId(cars[0].id);
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid animate-fade-in">
        <div className="row">
          <AdminSidebar />

          <div className="col-md-9 col-lg-10 p-4 p-md-5" style={{ minHeight: '90vh' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <h2 className="text-white mb-0" style={{ fontWeight: 800 }}>Manage Model Variants</h2>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setShowEditForm(false);
                  resetForm();
                }}
                className="btn btn-warning d-flex align-items-center gap-2"
                disabled={cars.length === 0}
              >
                <FaPlus /> Add New Model
              </button>
            </div>

            {cars.length === 0 && !loading && (
              <div className="alert alert-info">
                Please create at least one Car Brand first before adding model variants.
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

            {/* Add Variant Form */}
            {showAddForm && (
              <div className="glass-card p-4 p-md-5 mb-4 animate-fade-in" style={{ borderLeft: '4px solid var(--primary)' }}>
                <h4 className="text-white mb-4">Add Model Variant</h4>
                <form onSubmit={handleAddSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label text-muted small">Car Brand</label>
                      <select
                        className="form-select"
                        value={carId}
                        onChange={(e) => setCarId(e.target.value)}
                        required
                      >
                        {cars.map(car => (
                          <option key={car.id} value={car.id}>{car.brandName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Model / Variant Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. X5, C-Class, Model S"
                        value={variantName}
                        onChange={(e) => setVariantName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Fuel Type</label>
                      <select
                        className="form-select"
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Transmission</label>
                      <select
                        className="form-select"
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value)}
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Seating Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        min="2"
                        max="10"
                        value={seatingCapacity}
                        onChange={(e) => setSeatingCapacity(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Price per Day (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 4500"
                        min="500"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label text-muted small">Car Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="text-end mt-4 d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-warning px-4">Save Model</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-dark">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Variant Form */}
            {showEditForm && (
              <div className="glass-card p-4 p-md-5 mb-4 animate-fade-in" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h4 className="text-white mb-4">Edit Model Variant</h4>
                <form onSubmit={handleEditSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label text-muted small">Car Brand (Read-only)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cars.find(c => c.id === Number(carId))?.brandName || ''}
                        disabled
                        style={{ opacity: 0.6 }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Model / Variant Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={variantName}
                        onChange={(e) => setVariantName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Fuel Type</label>
                      <select
                        className="form-select"
                        value={fuelType}
                        onChange={(e) => setFuelType(e.target.value)}
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Transmission</label>
                      <select
                        className="form-select"
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value)}
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Seating Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        min="2"
                        value={seatingCapacity}
                        onChange={(e) => setSeatingCapacity(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small">Price per Day (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="500"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label text-muted small">Car Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="text-end mt-4 d-flex justify-content-end gap-2">
                    <button type="submit" className="btn btn-warning px-4">Update Specs</button>
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
                <p className="text-muted mt-2">Loading variant catalog...</p>
              </div>
            ) : variants.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <FaCog className="text-muted display-4 mb-3 animate-spin" />
                <h4 className="text-white">No Model Variants Registered</h4>
                <p className="text-muted">Click "Add New Model" to populate the catalog.</p>
              </div>
            ) : (
              <div className="glass-card p-4">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Brand</th>
                        <th>Model Name</th>
                        <th>Fuel</th>
                        <th>Transmission</th>
                        <th>Seats</th>
                        <th>Price/Day</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v) => (
                        <tr key={v.id}>
                          <td>#{v.id}</td>
                          <td className="text-warning fw-bold">{v.brandName}</td>
                          <td className="text-white fw-bold">{v.variantName}</td>
                          <td>{v.fuelType}</td>
                          <td>{v.transmission}</td>
                          <td>{v.seatingCapacity} seats</td>
                          <td className="text-warning fw-bold">₹ {v.pricePerDay}</td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-2">
                              <button
                                onClick={() => handleEditClick(v)}
                                className="btn btn-dark btn-sm d-flex align-items-center gap-1"
                              >
                                <FaEdit /> Specs
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

export default AdminVariants;
