import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="brand">INNOVIII</span>
              </h1>
              <p className="hero-subtitle">
                Community Testing Platform for Members and Mentors
              </p>
              <p className="hero-description">
                Join our community of innovators and take your skills to the next level. 
                Whether you're a member looking to grow or a mentor ready to guide, 
                our assessment platform helps you showcase your abilities.
              </p>
            </div>
            <div className="hero-visual">
              <div className="floating-card member-card">
                <div className="card-icon">👥</div>
                <h3>Members</h3>
                <p>Behavioral & Problem-solving Tests</p>
              </div>
              <div className="floating-card mentor-card">
                <div className="card-icon">🎓</div>
                <h3>Mentors</h3>
                <p>Technical & Mentorship Assessments</p>
              </div>
              <div className="floating-card admin-card">
                <div className="card-icon">⚡</div>
                <h3>Admins</h3>
                <p>Platform Management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="portals-section">
        <div className="container">
          <h2 className="section-title">Choose Your Portal</h2>
          <div className="portals-grid">
            {/* Member Portal Card */}
            <div className="portal-card member-portal">
              <div className="portal-icon">👥</div>
              <h3>Member Portal</h3>
              <p className="portal-description">
                Access behavioral and problem-solving tests designed to evaluate 
                your critical thinking, teamwork, and learning capabilities.
              </p>
              <div className="portal-features">
                <span className="feature">• 60-minute assessments</span>
                <span className="feature">• Behavioral questions</span>
                <span className="feature">• Problem-solving scenarios</span>
              </div>
              <Link to="/member" className="portal-btn member-btn">
                Enter Member Portal
              </Link>
            </div>

            {/* Mentor Portal Card */}
            <div className="portal-card mentor-portal">
              <div className="portal-icon">🎓</div>
              <h3>Mentor Portal</h3>
              <p className="portal-description">
                Take technical and mentorship assessments to demonstrate your 
                expertise and ability to guide others in their learning journey.
              </p>
              <div className="portal-features">
                <span className="feature">• Technical questions</span>
                <span className="feature">• Mentorship scenarios</span>
                <span className="feature">• Leadership evaluation</span>
              </div>
              <Link to="/mentor" className="portal-btn mentor-btn">
                Enter Mentor Portal
              </Link>
            </div>

            {/* Admin Portal Card */}
            <div className="portal-card admin-portal">
              <div className="portal-icon">⚡</div>
              <h3>Admin Portal</h3>
              <p className="portal-description">
                Manage tests, review submissions, and oversee the platform. 
                Access detailed analytics and grading tools.
              </p>
              <div className="portal-features">
                <span className="feature">• Submission management</span>
                <span className="feature">• Manual grading</span>
                <span className="feature">• Analytics dashboard</span>
              </div>
              <Link to="/admin" className="portal-btn admin-btn">
                Enter Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Platform Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⏱️</div>
              <h4>Timed Assessments</h4>
              <p>60-minute tests with automatic timer and progress saving</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Auto & Manual Grading</h4>
              <p>Combination of automated scoring and expert manual evaluation</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💾</div>
              <h4>Progress Saving</h4>
              <p>Your progress is automatically saved as you work</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h4>Responsive Design</h4>
              <p>Works perfectly on desktop, tablet, and mobile devices</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h4>Secure Platform</h4>
              <p>JWT authentication and secure data handling</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <h4>Detailed Analytics</h4>
              <p>Comprehensive dashboard with submission statistics</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;