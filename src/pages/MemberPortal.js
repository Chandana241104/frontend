import React from 'react';
import TestList from '../components/tests/TestList';
import '../styles/pages/portal.css';

const MemberPortal = () => {
  return (
    <div className="portal-page member-portal-page">
      <div className="container">
        <div className="portal-header">
          <div className="portal-hero">
            <h1>Member Portal</h1>
            <p className="portal-subtitle">
              Welcome to the member testing area. Here you can take behavioral and 
              problem-solving assessments designed to evaluate your critical thinking, 
              teamwork abilities, and learning mindset.
            </p>
            <div className="portal-info">
              <div className="info-card">
                <div className="info-icon">⏱️</div>
                <div className="info-content">
                  <h4>60-Minute Tests</h4>
                  <p>Complete assessments within the time limit</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">💾</div>
                <div className="info-content">
                  <h4>Progress Saved</h4>
                  <p>Your answers are automatically saved</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📝</div>
                <div className="info-content">
                  <h4>Short Answer Format</h4>
                  <p>Express your thoughts in detail</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="portal-content">
          <TestList role="member" />
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;