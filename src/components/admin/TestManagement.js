import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testAPI } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/components/admin-dashboard.css';

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const [memberResponse, mentorResponse] = await Promise.all([
        testAPI.getTestsByRole('member'),
        testAPI.getTestsByRole('mentor')
      ]);
      
      const allTests = [
        ...(memberResponse.data.data || []),
        ...(mentorResponse.data.data || [])
      ];
      
      setTests(allTests);
    } catch (err) {
      setError('Failed to load tests');
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (test) => {
    // Navigate to test details page
    navigate(`/admin/tests/${test.id}`, { state: { test } });
  };

  const getRoleBadge = (role) => {
    if (!role) {
      return (
        <span className={`role-badge unknown`}>
          Unknown
        </span>
      );
    }
    
    return (
      <span className={`role-badge ${role}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (published) => {
    const isPublished = Boolean(published);
    
    return isPublished ? (
      <span className="status-badge status-graded">Published</span>
    ) : (
      <span className="status-badge status-pending">Draft</span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) return <LoadingSpinner text="Loading tests..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="test-management">
      <div className="management-header">
        <h2>Test Management</h2>
        <p>View and manage all tests in the system</p>
      </div>

      <div className="tests-grid">
        {tests.map((test, index) => (
          <div key={test.id || `test-${index}`} className="test-management-card">
            <div className="test-card-header">
              <h3>{test.title || 'Untitled Test'}</h3>
              <div className="test-badges">
                {getRoleBadge(test.role)}
                {getStatusBadge(test.published)}
              </div>
            </div>
            
            <div className="test-card-body">
              <p className="test-description">
                {test.description || 'No description available.'}
              </p>
              
              <div className="test-meta">
                <div className="meta-item">
                  <span className="meta-label">Duration:</span>
                  <span className="meta-value">
                    {test.duration_minutes || 60} minutes
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">
                    {formatDate(test.created_at)}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">ID:</span>
                  <span className="meta-value">
                    #{test.id}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="test-card-footer">
              <button 
                className="view-btn" 
                onClick={() => handleViewDetails(test)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 && !loading && (
        <div className="no-data">
          <p>No tests found in the system</p>
          <button onClick={fetchTests} className="btn-primary" style={{marginTop: '1rem'}}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default TestManagement;