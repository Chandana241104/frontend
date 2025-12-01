import React from 'react';
import TestList from '../components/tests/TestList';
import '../styles/pages/portal.css';

const MentorPortal = () => {
  return (
    <div className="portal-page mentor-portal-page">
      <div className="container">
        <div className="portal-header">
          <div className="portal-hero">
            <h1>Mentor Portal</h1>
            <p className="portal-subtitle">
              Welcome to the mentor assessment area. Demonstrate your technical expertise 
              and mentorship capabilities through comprehensive evaluations of your 
              knowledge, leadership, and teaching abilities.
            </p>
            <div className="portal-info">
              <div className="info-card">
                <div className="info-icon">⏱️</div>
                <div className="info-content">
                  <h4>60-Minute Tests</h4>
                  <p>Technical and mentorship assessments</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">💾</div>
                <div className="info-content">
                  <h4>Auto-Save</h4>
                  <p>Never lose your progress</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">🎯</div>
                <div className="info-content">
                  <h4>Comprehensive Evaluation</h4>
                  <p>Technical skills and mentorship approach</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="portal-content">
          <TestList role="mentor" />
        </div>
      </div>
    </div>
  );
};

export default MentorPortal;