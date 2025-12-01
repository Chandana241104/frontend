import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // 1. Import useLocation
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import MemberPortal from './pages/MemberPortal';
import MentorPortal from './pages/MentorPortal';
import AdminPortal from './pages/AdminPortal';
import TestPage from './pages/TestPage';
import TestDetails from './pages/TestDetails';
import SubmissionSuccess from './pages/SubmissionSuccess';
import TestAuth from './components/auth/TestAuth';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const location = useLocation(); // 2. Get current location

  // 3. Define paths where the footer should be hidden
  // This currently hides it on the Test Runner (/test/...) and Test Auth (/test-auth/...)
  const hideFooterRoutes = ['/test', '/test-auth', '/member', '/mentor'];

  // Check if current path starts with any of the hidden paths
  const shouldShowFooter = !hideFooterRoutes.some(path => location.pathname.startsWith(path));

  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/member" element={<MemberPortal />} />
            <Route path="/mentor" element={<MentorPortal />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/tests/:testId" element={<TestDetails />} />
            
            {/* These are the pages where footer will be hidden */}
            <Route path="/test/:testId" element={<TestPage />} />
            <Route path="/test-auth/:testId" element={<TestAuth />} />
            
            <Route path="/submission-success" element={<SubmissionSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* 4. Conditionally render Footer */}
        {shouldShowFooter && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;