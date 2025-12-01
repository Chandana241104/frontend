import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/pages/submission-success.css';

const SubmissionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // Get submission data from location state or use defaults
  const submissionData = location.state || {
    submissionId: 'N/A',
    testTitle: 'Your Test',
    takerName: 'Test Taker',
    timestamp: new Date().toISOString()
  };

  useEffect(() => {
    // Countdown timer for automatic redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="submission-success-page">
      <div className="container">
        <div className="success-container">
          {/* Animated Checkmark */}
          <div className="success-animation">
            <div className="checkmark-container">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="success-content">
            <h1>Test Submitted Successfully! 🎉</h1>
            <p className="success-message">
              Thank you for completing the test. Your answers have been submitted and are being processed.
            </p>

            {/* Submission Details */}
            <div className="submission-details">
              <div className="detail-card">
                <h3>Submission Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Submission ID:</span>
                    <span className="detail-value">#{submissionData.submissionId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Test:</span>
                    <span className="detail-value">{submissionData.testTitle}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Submitted by:</span>
                    <span className="detail-value">{submissionData.takerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Submitted at:</span>
                    <span className="detail-value">{formatDate(submissionData.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="next-steps">
              <h3>What happens next?</h3>
              <div className="steps-grid">
                <div className="step-item">
                  <div className="step-icon">📊</div>
                  <div className="step-content">
                    <h4>Auto-Grading</h4>
                    <p>Multiple choice questions will be automatically graded</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-icon">👨‍🏫</div>
                  <div className="step-content">
                    <h4>Manual Review</h4>
                    <p>Short answer questions will be reviewed by our team</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-icon">📧</div>
                  <div className="step-content">
                    <h4>Results Notification</h4>
                    <p>You'll receive results via email when ready</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to="/" className="btn-primary">
                Return to Home
              </Link>
              <Link to="/member" className="btn-secondary">
                Member Portal
              </Link>
              <Link to="/mentor" className="btn-secondary">
                Mentor Portal
              </Link>
            </div>

            {/* Countdown */}
            <div className="countdown-message">
              <p>Redirecting to home page in <strong>{countdown}</strong> seconds...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;