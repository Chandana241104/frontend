import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { testAPI } from '../utils/api'; // Fixed import path
import LoadingSpinner from '../components/common/LoadingSpinner'; // Fixed import path
import '../styles/components/admin-dashboard.css'; // Fixed import path

const TestDetails = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get test data from navigation state or fetch from API
  const testFromState = location.state?.test;

  useEffect(() => {
    if (testFromState) {
      // If we have test data from navigation state, use it
      setTestDetails(testFromState);
      setLoading(false);
    } else {
      // Otherwise fetch from API
      fetchTestDetails();
    }
  }, [testId, testFromState]);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTestById(testId);
      setTestDetails(response.data.data);
    } catch (err) {
      setError('Failed to load test details');
      console.error('Error fetching test details:', err);
    } finally {
      setLoading(false);
    }
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

  const getQuestionTypeLabel = (type) => {
    const typeMap = {
      'short': 'Short Answer',
      'mcq': 'Multiple Choice',
      'multi': 'Multiple Select',
      'tf': 'True/False'
    };
    return typeMap[type] || type;
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (loading) return <LoadingSpinner text="Loading test details..." />;
  if (error) return <div className="error-message">{error}</div>;
  if (!testDetails) return <div className="error-message">Test not found</div>;

  return (
    <div className="test-details-page">
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Tests
        </button>
        <h1>Test Details</h1>
      </div>

      <div className="test-details-container">
        <div className="test-details-card">
          <div className="test-details-header">
            <h2>{testDetails.title}</h2>
            <div className="test-details-badges">
              {getRoleBadge(testDetails.role)}
              {getStatusBadge(testDetails.published)}
            </div>
          </div>
          
          <div className="test-details-info">
            <div className="info-grid">
              <div className="info-item">
                <label>Description:</label>
                <p>{testDetails.description || 'No description available'}</p>
              </div>
              <div className="info-item">
                <label>Duration:</label>
                <span>{testDetails.duration_minutes || 60} minutes</span>
              </div>
              <div className="info-item">
                <label>Created:</label>
                <span>{formatDate(testDetails.created_at)}</span>
              </div>
              <div className="info-item">
                <label>Test ID:</label>
                <span>#{testDetails.id}</span>
              </div>
              <div className="info-item">
                <label>Total Questions:</label>
                <span>{testDetails.questions?.length || 0}</span>
              </div>
              <div className="info-item">
                <label>Total Marks:</label>
                <span>
                  {testDetails.questions?.reduce((total, q) => total + (q.marks || 4), 0) || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Questions List */}
          {testDetails.questions && testDetails.questions.length > 0 && (
            <div className="questions-section">
              <h3>Questions ({testDetails.questions.length})</h3>
              <div className="questions-list">
                {testDetails.questions.map((question, index) => (
                  <div key={question.id || index} className="question-item">
                    <div className="question-header">
                      <span className="question-number">Question {index + 1}</span>
                      <span className="question-type">
                        {getQuestionTypeLabel(question.type)}
                      </span>
                      <span className="question-marks">{question.marks || 4} marks</span>
                    </div>
                    <div className="question-text">
                      {question.text}
                    </div>
                    {question.options && question.options.length > 0 && (
                      <div className="question-options">
                        <strong>Options:</strong>
                        <ul>
                          {question.options.map((option, optIndex) => (
                            <li key={optIndex}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!testDetails.questions || testDetails.questions.length === 0) && (
            <div className="no-questions">
              <p>No questions found for this test.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDetails;