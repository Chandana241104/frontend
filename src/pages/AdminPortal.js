import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from '../components/auth/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import TestManagement from '../components/admin/TestManagement';
import '../styles/pages/admin.css';

const AdminPortal = () => {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard');

  if (!admin) {
    return <AdminLogin />;
  }

  return (
    <div className="admin-portal-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-welcome">
            <h1>Admin Portal</h1>
            <p>Welcome back, {admin.name}</p>
          </div>
          <div className="admin-nav">
            <button 
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-tab ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              📝 Test Management
            </button>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'tests' && <TestManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;