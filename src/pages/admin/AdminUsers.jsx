import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import userService from '../../services/userService';
import { FaUsers, FaUserSlash, FaUserCheck, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve user directory from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to change this user's account status to ${nextStatus}?`)) return;

    setError('');
    setSuccess('');
    try {
      await userService.updateUserStatus(userId, nextStatus);
      setSuccess(`User status changed to ${nextStatus} successfully.`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to modify user access status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deleting this user will delete all their bookings and records. Proceed?')) return;
    
    setError('');
    setSuccess('');
    try {
      await userService.deleteUser(id);
      setSuccess('User account removed successfully.');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete user account.');
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
              <h2 className="text-white" style={{ fontWeight: 800 }}>Manage Users Directory</h2>
              <button onClick={fetchUsers} className="btn btn-dark btn-sm">Refresh Directory</button>
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
                <p className="text-muted mt-2">Loading user entries...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <FaUsers className="text-muted display-4 mb-3" />
                <h4 className="text-white">No Users Registered</h4>
                <p className="text-muted">Users listing directory is empty.</p>
              </div>
            ) : (
              <div className="glass-card p-4">
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th>Phone Number</th>
                        <th>Access Roles</th>
                        <th>Account Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => {
                        const rolesList = u.role ? u.role.map(r => r.name.replace('ROLE_', '')).join(', ') : 'N/A';
                        return (
                          <tr key={u.id}>
                            <td>#{u.id}</td>
                            <td className="fw-bold text-white">{u.fullName}</td>
                            <td>{u.email}</td>
                            <td>{u.phone || 'N/A'}</td>
                            <td>
                              <span className={`badge ${rolesList.includes('ADMIN') ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                {rolesList}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${u.status === 'ACTIVE' ? 'bg-success text-dark' : u.status === 'BLOCKED' ? 'bg-danger' : 'bg-dark'}`}>
                                {u.status || 'ACTIVE'}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="d-inline-flex gap-2">
                                <button
                                  onClick={() => handleToggleStatus(u.id, u.status || 'ACTIVE')}
                                  className="btn btn-dark btn-sm d-flex align-items-center gap-1"
                                >
                                  {u.status === 'BLOCKED' ? (
                                    <><FaUserCheck className="text-success" /> Activate</>
                                  ) : (
                                    <><FaUserSlash className="text-danger" /> Block</>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDelete(u.id)}
                                  className="btn btn-dark btn-sm d-flex align-items-center gap-1 text-danger"
                                  disabled={u.email === 'admin@carrental.com'} // Protect initial seeder admin
                                >
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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

export default AdminUsers;
