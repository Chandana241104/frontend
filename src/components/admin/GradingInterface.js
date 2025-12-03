import React, { useState, useEffect } from 'react';

const GradingInterface = ({ submission, onClose, onGraded }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [questionScores, setQuestionScores] = useState({});
  const [totalManualScore, setTotalManualScore] = useState(0);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    extractQuestionsAndAnswers();
  }, [submission]);

  const extractQuestionsAndAnswers = () => {
    try {
      let foundQuestions = [];
      let foundAnswers = {};

      // Extract questions
      if (submission.test?.questions?.length > 0) {
        foundQuestions = submission.test.questions;
      } else if (submission.questions?.length > 0) {
        foundQuestions = submission.questions;
      } else if (submission.Test?.Questions?.length > 0) {
        foundQuestions = submission.Test.Questions;
      }

      // Extract answers
      if (submission.answers && Object.keys(submission.answers).length > 0) {
        foundAnswers = submission.answers;
      } else if (submission.Answers?.length > 0) {
        submission.Answers.forEach((answer) => {
          let parsedAnswer = answer.answer;
          if (typeof answer.answer === 'string') {
            try {
              parsedAnswer = JSON.parse(answer.answer);
            } catch (e) {
              // Keep as string if not JSON
            }
          }
          const key = answer.question_id;
          if (key) {
            foundAnswers[key] = parsedAnswer;
            foundAnswers[String(key)] = parsedAnswer;
          }
        });
      }

      setQuestions(foundQuestions);
      setAnswers(foundAnswers);

      // Initialize states
      const initialScores = {};
      const initialExpanded = {};
      
      foundQuestions.forEach((question) => {
        const questionId = question.question_id || question.id;
        initialScores[questionId] = 0;
        initialExpanded[questionId] = true;
      });

      setQuestionScores(initialScores);
      setExpandedQuestions(initialExpanded);
      setLoading(false);

    } catch (error) {
      console.error('Error extracting questions and answers:', error);
      setError('Failed to load submission data');
      setLoading(false);
    }
  };

  useEffect(() => {
    const total = Object.values(questionScores).reduce((sum, score) => sum + (parseInt(score) || 0), 0);
    setTotalManualScore(total);
  }, [questionScores]);

  const handleQuestionScoreChange = (questionId, score) => {
    const question = questions.find(q => (q.question_id || q.id) === questionId);
    const maxMarks = question ? question.marks : 4;
    
    let normalizedScore = parseInt(score) || 0;
    if (normalizedScore < 0) normalizedScore = 0;
    if (normalizedScore > maxMarks) normalizedScore = maxMarks;

    setQuestionScores(prev => ({
      ...prev,
      [questionId]: normalizedScore
    }));
  };

  const testAllPossibleEndpoints = async () => {
    const submissionId = submission.id;
   
    const API_BASE = process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_API_URL 
      : 'http://localhost:5000/api';
    
    const payload = {
      manualScore: totalManualScore,
      questionScores: questionScores
    };

    const endpoint = `${API_BASE}/submissions/${submissionId}/grade`;
    
    console.log(`🔍 Attempting to grade at: ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ SUCCESS:', result);
        return { success: true, endpoint: endpoint, result };
      } else {
        const errText = await response.text();
        console.error(`❌ Server Error (${response.status}):`, errText);
        throw new Error(`Server returned ${response.status}: ${errText}`);
      }
    } catch (err) {
      console.error('❌ Connection Error:', err);
      return { success: false, endpoint: endpoint, error: err.message };
    }
  };

  const handleSubmitGrade = async () => {
    try {
      setGrading(true);
      setError('Testing all possible endpoints...');

      console.log('🔍 Starting comprehensive endpoint test...');
      const testResult = await testAllPossibleEndpoints();

      if (testResult.success) {
        console.log('🎉 Found working endpoint:', testResult.endpoint);
        setSuccess(true);
        setTimeout(() => {
          if (onGraded) {
            onGraded(testResult.result.data);
          }
        }, 1500);
      } else {
        setError('No working endpoint found. The grade submission route may not be properly configured.');
      }
    } catch (err) {
      console.error('Error in handleSubmitGrade:', err);
      setError('Error testing endpoints: ' + err.message);
    } finally {
      setGrading(false);
    }
  };

  const checkRouteConfiguration = () => {
    console.log('🔧 Checking route configuration...');
    console.log('Current URL:', window.location.href);
    console.log('Base URL:', window.location.origin);
    console.log('Admin Token exists:', !!localStorage.getItem('adminToken'));
    console.log('Submission ID:', submission.id);
  };

  const toggleQuestionExpansion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getQuestionTypeLabel = (type) => {
    const typeMap = {
      'short': 'Short Answer',
      'mcq': 'Multiple Choice',
      'multi': 'Multiple Select',
      'tf': 'True/False'
    };
    return typeMap[type] || type;
  };

  const formatAnswer = (answer) => {
    if (answer === null || answer === undefined || answer === '') {
      return <span className="no-answer">No answer provided</span>;
    }
    if (typeof answer === 'string') return answer;
    if (Array.isArray(answer)) return answer.join(', ');
    return String(answer);
  };

  const getAnswerForQuestion = (question) => {
    const questionId = question.question_id || question.id;
    const possibleKeys = [questionId, String(questionId), parseInt(questionId)];
    
    for (const key of possibleKeys) {
      if (answers[key] !== undefined) {
        return answers[key];
      }
    }
    return undefined;
  };

  const getTestTitle = () => {
    return (submission.test && submission.test.title) || 
           (submission.Test && submission.Test.title) || 
           'Unknown Test';
  };

  const calculateMaxPossibleScore = () => {
    return questions.reduce((total, q) => total + (q.marks || 4), 0);
  };

  const maxPossibleScore = calculateMaxPossibleScore();

  if (loading) {
    return (
      <div className="grading-interface">
        <div className="loading-state">Loading questions and answers...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="grading-success">
        <div className="success-icon">✅</div>
        <h3>Grades Submitted Successfully!</h3>
        <p>Total manual score: {totalManualScore}/{maxPossibleScore}</p>
        <button onClick={onClose} className="btn-primary">Close</button>
      </div>
    );
  }

  return (
    <div className="grading-interface">
      <div className="grading-header">
        <div className="submission-info">
          <h3>Grading Submission #{submission.id}</h3>
          <p><strong>Test:</strong> {getTestTitle()}</p>
          <p><strong>Taker:</strong> {submission.taker_name} ({submission.taker_email})</p>
          <p><strong>Questions:</strong> {questions.length}</p>
          <p><strong>Answers:</strong> {Object.keys(answers).length}</p>
        </div>
        <div className="grading-summary">
          <div className="summary-card">
            <h4>Grading Summary</h4>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Questions:</span>
                <span className="stat-value">{questions.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Manual Score:</span>
                <span className="stat-value">{totalManualScore}/{maxPossibleScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="debug-section" style={{ background: '#e8f4fd', border: '1px solid #b3d9ff', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
        <h4>🔧 ROUTE DEBUGGING</h4>
        <p>The grade submission endpoint is returning 404. This could be due to:</p>
        <ul style={{ textAlign: 'left', margin: '10px 0' }}>
          <li>❌ Not logged in as admin</li>
          <li>❌ Incorrect route path</li>
          <li>❌ Routes not properly mounted</li>
          <li>❌ Missing authentication token</li>
        </ul>
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={checkRouteConfiguration} 
            className="btn-secondary"
            style={{ marginRight: '10px' }}
          >
            Check Configuration
          </button>
          <button 
            onClick={handleSubmitGrade} 
            className="btn-primary"
            disabled={grading}
          >
            {grading ? 'Testing All Endpoints...' : 'Test All Endpoints'}
          </button>
        </div>
      </div>

      <div className="questions-grading-section">
        <h3>Questions & Answers ({questions.length})</h3>
        {questions.length === 0 ? 
          <div className="no-questions">
            <p>No questions available for grading.</p>
          </div> :
          <div className="questions-list">
            {questions.map((question, index) => {
              const questionId = question.question_id || question.id;
              const answer = getAnswerForQuestion(question);
              const questionScore = questionScores[questionId] || 0;
              const maxMarks = question.marks || 4;
              const isExpanded = expandedQuestions[questionId];
              
              return (
                <div key={questionId} className={`question-grading-item ${isExpanded ? 'expanded' : ''}`}>
                  <div 
                    className="question-header" 
                    onClick={() => toggleQuestionExpansion(questionId)}
                  >
                    <div className="question-meta">
                      <span className="question-number">Q{index + 1}</span>
                      <span className="question-type">{getQuestionTypeLabel(question.type)}</span>
                      <span className="question-marks">{maxMarks} marks</span>
                    </div>
                    <div className="question-score-indicator">
                      <span className="current-score">{questionScore}/{maxMarks}</span>
                      <span className="expand-icon">{isExpanded ? '▼' : '►'}</span>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="question-content">
                      <div className="question-text">
                        <strong>Question:</strong>
                        <div className="question-text-content">{question.text || 'No question text available'}</div>
                      </div>
                      <div className="answer-section">
                        <div className="answer-text">
                          <strong>Student's Answer:</strong>
                          <div className="answer-content">{formatAnswer(answer)}</div>
                        </div>
                      </div>
                      <div className="grading-control">
                        <label htmlFor={`score-${questionId}`}>
                          <strong>Assign Score:</strong> (0 - {maxMarks} marks)
                        </label>
                        <div className="score-input-group">
                          <input
                            type="number"
                            id={`score-${questionId}`}
                            value={questionScore}
                            onChange={(e) => handleQuestionScoreChange(questionId, e.target.value)}
                            min="0"
                            max={maxMarks}
                            className="score-input"
                          />
                          <span className="score-range">/ {maxMarks}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        }
      </div>

      <div className="grading-actions">
        <div className="actions-summary">
          <strong>Total Manual Score: {totalManualScore}/{maxPossibleScore}</strong>
        </div>
        <div className="action-buttons">
          <button onClick={onClose} className="btn-secondary" disabled={grading}>Cancel</button>
          <button 
            onClick={handleSubmitGrade} 
            className="btn-primary" 
            disabled={grading || questions.length === 0}
          >
            {grading ? 'Testing Endpoints...' : `Submit Grades (${totalManualScore}/${maxPossibleScore})`}
          </button>
        </div>
      </div>
    </div>
  );
};

// This is the key fix - use default export
export default GradingInterface;
