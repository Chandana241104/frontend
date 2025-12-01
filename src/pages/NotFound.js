import React from 'react';
import { Link } from 'react-router-dom';
// import '../styles/pages/notfound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="action-buttons">
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
            <Link to="/member" className="btn-secondary">
              Member Portal
            </Link>
            <Link to="/mentor" className="btn-secondary">
              Mentor Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;