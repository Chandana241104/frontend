import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testAPI } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/components/test-runner.css';

const TestList = ({ role }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTests();
  }, [role]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTestsByRole(role);
      setTests(response.data.data);
    } catch (err) {
      setError('Failed to load tests');
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading tests..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="test-list">
      <div className="test-list-header">
        <h2>Available Tests for {role === 'member' ? 'Members' : 'Mentors'}</h2>
        <p>Select a test to begin your assessment</p>
      </div>
      
      <div className="tests-grid">
        {tests.map(test => (
          <div key={test.id} className="test-card">
            <div className="test-card-header">
              <h3>{test.title}</h3>
              <span className="test-duration">
                {test.duration_minutes} mins
              </span>
            </div>
            <div className="test-card-body">
              <p>{test.description}</p>
              <div className="test-card-meta">
                <span className="test-created">
                  Created: {new Date(test.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="test-card-footer">
              {/* Updated: Link to authentication page instead of directly to test */}
              <Link 
                to={`/test-auth/${test.id}`} 
                className="start-test-btn"
              >
                Start Test
              </Link>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="no-tests">
          <p>No tests available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default TestList;