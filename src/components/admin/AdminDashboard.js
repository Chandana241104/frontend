import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import StatsCards from './StatsCards';
import SubmissionTable from './SubmissionTable';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/components/admin-dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to load dashboard stats');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage tests and review submissions</p>
      </div>

      {stats && <StatsCards stats={stats} />}
      
      <div className="dashboard-content">
        <SubmissionTable />
      </div>
    </div>
  );
};

export default AdminDashboard;