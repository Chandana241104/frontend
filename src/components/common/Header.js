import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/header.css';

const Header = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="innoviii-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🚀</span>
            INNOVIII
          </Link>
          
          <nav className="nav-links">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
            <Link 
              to="/member" 
              className={location.pathname === '/member' ? 'active' : ''}
            >
              Member
            </Link>
            <Link 
              to="/mentor" 
              className={location.pathname === '/mentor' ? 'active' : ''}
            >
              Mentor
            </Link>
            <Link 
              to="/admin" 
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Admin
            </Link>
          </nav>

          <div className="header-actions">
            {admin ? (
              <div className="admin-info">
                <span>Welcome, {admin.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin" className="admin-login-btn">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;