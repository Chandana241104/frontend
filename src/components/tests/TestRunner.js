import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testAPI, submissionAPI } from '../../utils/api';
import { useTimer } from '../../hooks/useTimer';
import { saveTestProgress, loadTestProgress, clearTestProgress } from '../../utils/localStorage';
import QuestionCard from './QuestionCard';
import QuestionNavigation from './QuestionNavigation';
import Timer from '../common/Timer';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { TEST_DURATION } from '../../utils/constants';
import '../../styles/components/test-runner.css';

const TestRunner = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const {
    timeLeft,
    isRunning,
    start,
    pause,
    reset
  } = useTimer(TEST_DURATION, handleTimeUp);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuthentication = () => {
      console.log('🔐 Checking authentication for test:', testId);
      const testSession = localStorage.getItem(`test_session_${testId}`);
      
      if (!testSession) {
        console.log('❌ No test session found, redirecting to authentication');
        navigate(`/test-auth/${testId}`);
        return;
      }
      
      try {
        const session = JSON.parse(testSession);
        // Check if session is still valid (less than 24 hours old)
        if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
          console.log('❌ Test session expired');
          localStorage.removeItem(`test_session_${testId}`);
          navigate(`/test-auth/${testId}`);
          return;
        }
        
        console.log('✅ User authenticated:', session.user);
        setUser(session.user);
        setAuthChecked(true);
      } catch (err) {
        console.error('❌ Error parsing test session:', err);
        localStorage.removeItem(`test_session_${testId}`);
        navigate(`/test-auth/${testId}`);
      }
    };

    checkAuthentication();
  }, [testId, navigate]);

  useEffect(() => {
    if (user && authChecked) {
      console.log('🚀 Starting test for user:', user);
      fetchTest();
    }
  }, [user, authChecked]);

  useEffect(() => {
    if (test && user) {
      // Load saved progress
      const savedProgress = loadTestProgress(testId);
      if (savedProgress) {
        console.log('📂 Loading saved progress');
        setAnswers(savedProgress.answers || {});
        setCurrentQuestionIndex(savedProgress.currentQuestion || 0);
        
        // Use saved time if available, otherwise start fresh
        if (savedProgress.timeLeft && savedProgress.timeLeft > 0) {
          reset(savedProgress.timeLeft);
        }
        start();
      } else {
        console.log('🆕 Starting new test');
        start();
      }
    }
  }, [test, user]);

  useEffect(() => {
    // Save progress periodically
    if (test && isRunning && user) {
      const progressData = {
        answers,
        currentQuestion: currentQuestionIndex,
        timeLeft,
        timestamp: Date.now(),
        user: user
      };
      saveTestProgress(testId, progressData);
    }
  }, [answers, currentQuestionIndex, timeLeft, testId, isRunning, test, user]);

  async function handleTimeUp() {
    console.log('⏰ Time up! Auto-submitting...');
    if (user) {
      await handleAutoSubmit();
    }
  }

  const handleAutoSubmit = async () => {
    try {
      setSubmitting(true);
      console.log('🤖 Auto-submitting test for user:', user);
      
      const response = await submissionAPI.submitTest(testId, {
        takerName: user.fullName,
        takerEmail: user.email,
        answers
      });
      
      console.log('✅ Auto-submission successful:', response.data);
      
      // Clean up
      clearTestProgress(testId);
      localStorage.removeItem(`test_session_${testId}`);
      
      // Navigate to success page
      navigate('/submission-success', {
        state: {
          submissionId: response.data.submissionId,
          testTitle: test.title,
          takerName: user.fullName,
          takerEmail: user.email,
          timestamp: new Date().toISOString(),
          autoSubmitted: true
        }
      });
    } catch (err) {
      console.error('❌ Auto-submission failed:', err);
      setError('Auto-submission failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const fetchTest = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching test with ID:', testId);
      
      const response = await testAPI.getTestById(testId);
      console.log('✅ Test data received:', response.data);
      
      if (response.data && response.data.data) {
        setTest(response.data.data);
      } else {
        throw new Error('Invalid test data structure received');
      }
    } catch (err) {
      console.error('❌ Error fetching test:', err);
      setError('Failed to load test: ' + (err.response?.data?.message || err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setSidebarOpen(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitClick = () => {
    console.log('🎯 Submit button clicked');
    setShowSubmitModal(true);
    pause();
  };

  const submitTest = async () => {
    if (!user) {
      setError('User authentication required');
      return;
    }

    try {
      setSubmitting(true);
      console.log('📤 Submitting test for user:', user);
      
      const response = await submissionAPI.submitTest(testId, {
        takerName: user.fullName,
        takerEmail: user.email,
        answers
      });

      console.log('✅ Submission successful:', response.data);
      
      // Clean up storage
      clearTestProgress(testId);
      localStorage.removeItem(`test_session_${testId}`);
      
      // Navigate to success page
      navigate('/submission-success', {
        state: {
          submissionId: response.data.submissionId,
          testTitle: test.title,
          takerName: user.fullName,
          takerEmail: user.email,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('❌ Submission failed:', err);
      setError('Failed to submit test: ' + (err.response?.data?.message || err.message || 'Please try again.'));
      setSubmitting(false);
      setShowSubmitModal(false);
      start(); // Resume timer if submission fails
    }
  };

  const handleExit = () => {
    pause();
    setShowExitModal(true);
  };

  const handleContinue = () => {
    start();
    setShowExitModal(false);
  };

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="test-runner-loading">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="test-runner-loading">
        <LoadingSpinner text="Preparing your test..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-runner-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Test Loading Failed</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={fetchTest} className="btn-primary">
              Try Again
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="test-runner-error">
        <div className="error-container">
          <h2>Test Not Found</h2>
          <p>The test you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = test.questions.length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  // Submit Modal Component
  const SubmitModal = ({ isOpen, onClose, submitting, answeredQuestions, totalQuestions }) => {
    const handleSubmit = () => {
      submitTest();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Submit Test" size="medium">
        <div className="submit-modal">
          <div className="submit-icon">📝</div>
          <div className="submit-stats">
            <h3>Ready to Submit?</h3>
            <p>You've completed {answeredQuestions} out of {totalQuestions} questions.</p>
            {user && (
              <div className="user-info">
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            )}
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{answeredQuestions}</span>
                <span className="stat-label">Answered</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{totalQuestions - answeredQuestions}</span>
                <span className="stat-label">Remaining</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{Math.round((answeredQuestions / totalQuestions) * 100)}%</span>
                <span className="stat-label">Complete</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary" disabled={submitting}>
              Continue Test
            </button>
            <button onClick={handleSubmit} className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="spinner-small"></div>
                  Submitting...
                </>
              ) : (
                'Submit Test'
              )}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Exit Modal Component
  const ExitModal = ({ isOpen, onClose, onConfirm }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Exit Test" size="small">
        <div className="exit-modal">
          <div className="exit-icon">⚠️</div>
          <h3>Are you sure you want to exit?</h3>
          <p>Your progress will be saved automatically. You can return to complete the test later.</p>
          <div className="modal-actions">
            <button onClick={onClose} className="btn-secondary">
              Continue Test
            </button>
            <button onClick={onConfirm} className="btn-primary">
              Exit Test
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="test-runner">
      {/* Header */}
      <header className="test-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="test-title">
            <h1>{test.title}</h1>
            <p className="test-description">{test.description}</p>
            {user && (
              <div className="user-badge">
                <span className="user-name">👤 {user.fullName}</span>
                <span className="user-email">{user.email}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="header-center">
          <div className="progress-indicator">
            <div className="progress-text">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="timer-section">
            <Timer 
              timeLeft={timeLeft} 
              totalTime={TEST_DURATION}
              isRunning={isRunning}
            />
          </div>
          <div className="header-actions">
            <button 
              className="exit-btn"
              onClick={handleExit}
              disabled={submitting}
            >
              Exit
            </button>
            <button 
              className="submit-test-btn"
              onClick={handleSubmitClick}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner-small"></div>
                  Submitting...
                </>
              ) : (
                'Submit Test'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="test-content">
        {/* Sidebar Navigation */}
        <aside className={`question-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Questions</h3>
            <button 
              className="close-sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>
          <QuestionNavigation
            questions={test.questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={handleQuestionSelect}
          />
          <div className="sidebar-footer">
            <div className="completion-stats">
              <div className="stat">
                <span className="stat-number">{answeredQuestions}</span>
                <span className="stat-label">Answered</span>
              </div>
              <div className="stat">
                <span className="stat-number">{totalQuestions - answeredQuestions}</span>
                <span className="stat-label">Remaining</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Question Area */}
        <main className="question-area">
          <div className="question-container">
            <QuestionCard
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswerChange={handleAnswerChange}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />
            
            {/* Navigation Buttons */}
            <div className="question-navigation">
              <button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || submitting}
                className="nav-btn prev-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
                Previous
              </button>
              
              <div className="nav-info">
                <span className="current-question">{currentQuestionIndex + 1}</span>
                <span className="nav-separator">of</span>
                <span className="total-questions">{totalQuestions}</span>
              </div>
              
              <button 
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1 || submitting}
                className="nav-btn next-btn"
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Footer */}
      <footer className="mobile-footer">
        <button 
          className="mobile-nav-btn"
          onClick={() => setSidebarOpen(true)}
          disabled={submitting}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
          Questions
        </button>
        <div className="mobile-progress">
          <div className="progress-circle">
            <svg width="40" height="40" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" fill="none" stroke="#e6e6e6" strokeWidth="3"/>
              <circle cx="22" cy="22" r="20" fill="none" stroke="#007bff" strokeWidth="3" 
                strokeDasharray="125.6" 
                strokeDashoffset={125.6 - (progressPercentage / 100) * 125.6}
                transform="rotate(-90 22 22)"
              />
            </svg>
            <span className="progress-percent">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
        <button 
          className="mobile-submit-btn"
          onClick={handleSubmitClick}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </footer>

      {/* Modals */}
      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => {
          setShowSubmitModal(false);
          start();
        }}
        submitting={submitting}
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
      />

      <ExitModal
        isOpen={showExitModal}
        onClose={handleContinue}
        onConfirm={() => navigate('/')}
      />
    </div>
  );
};

export default TestRunner;