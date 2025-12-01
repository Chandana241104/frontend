import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/components/test-auth.css';

const TestAuth = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    confirmEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Please enter your full name';
    }
    if (!formData.email.trim()) {
      return 'Please enter your email address';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (formData.email !== formData.confirmEmail) {
      return 'Email addresses do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Save user credentials to localStorage for the test session
      const testSession = {
        testId,
        user: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim()
        },
        timestamp: Date.now()
      };
      
      localStorage.setItem(`test_session_${testId}`, JSON.stringify(testSession));
      
      // Navigate to the test
      navigate(`/test/${testId}`);
    } catch (err) {
      setError('Failed to start test. Please try again.');
      console.error('Test auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1>Test Authentication</h1>
          <p className="auth-subtitle">
            Please enter your credentials to start the test
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmEmail">Confirm Email *</label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              placeholder="Confirm your email address"
              required
              disabled={loading}
            />
          </div>

          <div className="auth-info">
            <h4>Important Information:</h4>
            <ul>
              <li>Your name and email will be recorded with your submission</li>
              <li>You cannot change these details after starting the test</li>
              <li>Make sure you have stable internet connection</li>
              <li>Test progress is saved automatically</li>
            </ul>
          </div>

          <div className="auth-actions">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Starting Test...' : 'Start Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestAuth;