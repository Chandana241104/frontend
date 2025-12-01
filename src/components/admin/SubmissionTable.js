import React, { useState, useEffect } from 'react';
import { submissionAPI, adminAPI } from '../../utils/api';
import GradingInterface from './GradingInterface';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import '../../styles/components/admin-dashboard.css';

const SubmissionTable = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [filters]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await submissionAPI.getSubmissions(filters);
      setSubmissions(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleGradeClick = async (submission) => {
  try {
    console.log('🎯 Loading submission details for ID:', submission.id);
    
    const response = await submissionAPI.getSubmissionDetails(submission.id);
    console.log('📦 Full API response:', response.data);
    
    if (response.data && response.data.data) {
      const submissionData = response.data.data;
      console.log('🔍 Submission data structure:', {
        hasTest: !!submissionData.test,
        hasTestWithQuestions: !!(submissionData.test && submissionData.test.questions),
        hasQuestions: !!submissionData.questions,
        hasAnswers: !!submissionData.answers,
        testTitle: submissionData.test?.title || submissionData.Test?.title
      });
      
      setSelectedSubmission(submissionData);
      setShowGradingModal(true);
    } else {
      setError('Invalid submission data received from API');
    }
  } catch (err) {
    console.error('❌ Error fetching submission details:', err);
    setError('Failed to load submission details: ' + (err.response?.data?.message || err.message));
  }
};

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await adminAPI.exportSubmissions({
        role: filters.role,
        status: filters.status
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'submissions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export submissions');
      console.error('Error exporting:', err);
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending' },
      partially_graded: { class: 'status-partial', text: 'Partially Graded' },
      graded: { class: 'status-graded', text: 'Graded' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getRoleBadge = (role) => {
    return (
      <span className={`role-badge ${role}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="submission-table-container">
      <div className="table-header">
        <h2>Submissions</h2>
        <div className="table-actions">
          <button 
            onClick={handleExport} 
            disabled={exporting}
            className="export-btn"
          >
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="table-filters">
        <select 
          value={filters.role} 
          onChange={(e) => handleFilterChange('role', e.target.value)}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="member">Member</option>
          <option value="mentor">Mentor</option>
        </select>
        
        <select 
          value={filters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="partially_graded">Partially Graded</option>
          <option value="graded">Graded</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading submissions..." />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Test</th>
                  <th>Role</th>
                  <th>Taker</th>
                  <th>Email</th>
                  <th>Scores</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>#{submission.id}</td>
                    <td className="test-title">{submission.Test?.title}</td>
                    <td>{getRoleBadge(submission.role)}</td>
                    <td>{submission.taker_name}</td>
                    <td>{submission.taker_email}</td>
                    <td className="scores">
                      <div>Auto: {submission.auto_score}</div>
                      <div>Manual: {submission.manual_score}</div>
                      <div>Total: {submission.total_score}</div>
                    </td>
                    <td>{getStatusBadge(submission.status)}</td>
                    <td>
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleGradeClick(submission)}
                        className="grade-btn"
                      >
                        Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="page-btn"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {filters.page} of {pagination.total}
              </span>
              
              <button 
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.total}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}

          {submissions.length === 0 && (
            <div className="no-data">
              <p>No submissions found</p>
            </div>
          )}
        </>
      )}

      {/* Grading Modal */}
      <Modal 
        isOpen={showGradingModal}
        onClose={() => setShowGradingModal(false)}
        title="Grade Submission"
        size="large"
      >
        {selectedSubmission && (
          <GradingInterface
            submission={selectedSubmission}
            onClose={() => setShowGradingModal(false)}
            onGraded={() => {
              setShowGradingModal(false);
              fetchSubmissions(); // Refresh the table
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default SubmissionTable;