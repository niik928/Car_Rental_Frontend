import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import paymentService from '../../services/paymentService';
import { FaMoneyBillWave, FaCheck, FaTimes, FaExchangeAlt, FaExclamationTriangle } from 'react-icons/fa';

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await paymentService.getAllPayments();
      setPayments(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error(err);
      setError('Could not retrieve payment history ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Mark this payment transaction as ${status}?`)) return;
    
    setError('');
    setSuccess('');
    try {
      await paymentService.updatePaymentStatus(id, status);
      setSuccess(`Transaction status marked as ${status} successfully.`);
      fetchPayments();
    } catch (err) {
      console.error(err);
      setError('Failed to update transaction status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS': return 'bg-success text-dark';
      case 'FAILED': return 'bg-danger';
      case 'PENDING': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid animate-fade-in">
        <div className="row">
          <AdminSidebar />

          <div className="col-md-9 col-lg-10 p-4 p-md-5" style={{ minHeight: '90vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-white" style={{ fontWeight: 800 }}>Payments Ledger</h2>
              <button onClick={fetchPayments} className="btn btn-dark btn-sm">Refresh Transactions</button>
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

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="text-muted mt-2">Loading transactions...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <FaMoneyBillWave className="text-muted display-4 mb-3" />
                <h4 className="text-white">No Payment Records Found</h4>
                <p className="text-muted">Simulated payments from users will populate here.</p>
              </div>
            ) : (
              <div className="glass-card p-4">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Payment ID</th>
                        <th>Booking ID</th>
                        <th>Transaction Code</th>
                        <th>Customer</th>
                        <th>Method</th>
                        <th>Amount Paid</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td>#{p.id}</td>
                          <td>
                            <span className="fw-bold text-white">#{p.bookingId}</span>
                          </td>
                          <td>
                            <code className="text-light" style={{ fontSize: '12px' }}>{p.transactionId}</code>
                          </td>
                          <td>
                            <div>
                              <span className="text-white fw-bold d-block">{p.userFullName || 'Customer'}</span>
                              <span className="text-muted small">{p.userEmail || 'N/A'}</span>
                            </div>
                          </td>
                          <td>{p.paymentMethod}</td>
                          <td className="text-warning fw-bold">₹ {p.amount}</td>
                          <td className="small">{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : 'N/A'}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(p.status)}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="text-end">
                            {p.status === 'PENDING' && (
                              <div className="d-inline-flex gap-2">
                                <button
                                  onClick={() => handleUpdateStatus(p.id, 'SUCCESS')}
                                  className="btn btn-warning btn-sm d-flex align-items-center gap-1"
                                  title="Approve Payment"
                                >
                                  <FaCheck /> Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(p.id, 'FAILED')}
                                  className="btn btn-dark btn-sm text-danger d-flex align-items-center gap-1"
                                  title="Reject Payment"
                                >
                                  <FaTimes /> Fail
                                </button>
                              </div>
                            )}
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

export default AdminPayments;
