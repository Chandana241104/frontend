import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAdminToken, setAdminToken, removeAdminToken, getAdminData } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      const adminData = getAdminData();
      setAdmin(adminData);
    }
    setLoading(false);
  }, []);

  const login = (token, adminData) => {
    setAdminToken(token, adminData);
    setAdmin(adminData);
  };

  const logout = () => {
    removeAdminToken();
    setAdmin(null);
  };

  const value = {
    admin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};