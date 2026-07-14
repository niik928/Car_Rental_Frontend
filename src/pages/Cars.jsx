import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCard from '../components/CarCard';
import variantService from '../services/variantService';
import vehicleService from '../services/vehicleService';
import { FaSearch, FaFilter, FaRedo } from 'react-icons/fa';

function Cars() {
  const [variants, setVariants] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const variantData = await variantService.getAllVariants();
      let vehicleData = [];
      try {
        vehicleData = await vehicleService.getAllVehicles();
      } catch (err) {
        console.warn('Could not load physical vehicles, using default availability logic', err);
      }
      setVariants(variantData);
      setVehicles(vehicleData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch cars database. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Find unique brands for filter dropdown
  const uniqueBrands = ['All', ...new Set(variants.map(v => v.brandName).filter(Boolean))];

  // Helper function to check if a variant is available
  const isVariantAvailable = (variantId) => {
    const variantVehicles = vehicles.filter(v => v.variantId === variantId);
    // If no physical vehicles are registered, consider unavailable
    if (variantVehicles.length === 0) return false;
    // Check if at least one vehicle is AVAILABLE
    return variantVehicles.some(v => v.status === 'AVAILABLE');
  };

  // Filter Logic
  const filteredVariants = variants.filter(variant => {
    const matchesSearch = 
      (variant.brandName && variant.brandName.toLowerCase().includes(search.toLowerCase())) ||
      (variant.variantName && variant.variantName.toLowerCase().includes(search.toLowerCase()));

    const matchesBrand = selectedBrand === 'All' || variant.brandName === selectedBrand;
    const matchesFuel = selectedFuel === 'All' || variant.fuelType === selectedFuel;
    const matchesTransmission = selectedTransmission === 'All' || variant.transmission === selectedTransmission;
    
    const available = isVariantAvailable(variant.id);
    const matchesAvailability = 
      selectedAvailability === 'All' ||
      (selectedAvailability === 'Available' && available) ||
      (selectedAvailability === 'Booked' && !available);

    return matchesSearch && matchesBrand && matchesFuel && matchesTransmission && matchesAvailability;
  });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setSelectedAvailability('All');
  };

  return (
    <>
      <Navbar />

      <div className="container py-5 animate-fade-in" style={{ minHeight: '80vh' }}>
        <div className="text-center mb-5">
          <h2 className="display-5 text-white" style={{ fontWeight: 800 }}>Explore Our Fleet</h2>
          <p className="text-muted">Find and book the perfect car for your next journey.</p>
        </div>

        {/* Filter Section */}
        <div className="glass-card p-4 mb-4">
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search brand or model..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="All">All Brands</option>
                {uniqueBrands.filter(b => b !== 'All').map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Fuel Filter */}
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
              >
                <option value="All">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Transmission Filter */}
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
              >
                <option value="All">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
              >
                <option value="All">Availability</option>
                <option value="Available">Available Only</option>
                <option value="Booked">Out of Stock</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="col-md-1">
              <button
                className="btn btn-dark w-100 h-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleResetFilters}
                title="Reset Filters"
              >
                <FaRedo />
              </button>
            </div>
          </div>
        </div>

        {/* Catalog List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="text-muted mt-2">Loading fleet database...</p>
          </div>
        ) : error ? (
          <div className="glass-card p-5 text-center my-4">
            <p className="text-danger mb-3">{error}</p>
            <button className="btn btn-warning" onClick={fetchData}>Try Again</button>
          </div>
        ) : filteredVariants.length === 0 ? (
          <div className="glass-card p-5 text-center my-4">
            <h4 className="text-white mb-2">No Cars Found</h4>
            <p className="text-muted">Try resetting your filters or adjusting your search queries.</p>
            <button className="btn btn-warning mt-3" onClick={handleResetFilters}>Reset Filters</button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredVariants.map((variant) => (
              <CarCard
                key={variant.id}
                car={{
                  ...variant,
                  available: isVariantAvailable(variant.id)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Cars;