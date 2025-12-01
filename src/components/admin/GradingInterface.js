const React = require('react');
const { useState, useEffect } = require('react');

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

  // Comprehensive endpoint testing
  // Corrected endpoint testing
  // Corrected endpoint testing with explicit Port 5000
  const testAllPossibleEndpoints = async () => {
    const submissionId = submission.id;
    
    // FIX: Explicitly point to the backend URL (Port 5000)
    const API_BASE = 'http://localhost:5000/api'; 
    
    const payload = {
      manualScore: totalManualScore,
      questionScores: questionScores
    };

    // The correct route defined in backend/submissions.js
    const endpoint = `${API_BASE}/submissions/${submissionId}/grade`;
    
    console.log(`🔍 Attempting to grade at: ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // FIX: Include the admin token for authentication
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
      // Return details to help debugging
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

  // Check if the main app file mounts the routes correctly
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
      return React.createElement('span', { className: 'no-answer' }, 'No answer provided');
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
    return React.createElement('div', { className: 'grading-interface' },
      React.createElement('div', { className: 'loading-state' }, 'Loading questions and answers...')
    );
  }

  if (success) {
    return React.createElement('div', { className: 'grading-success' },
      React.createElement('div', { className: 'success-icon' }, '✅'),
      React.createElement('h3', null, 'Grades Submitted Successfully!'),
      React.createElement('p', null, `Total manual score: ${totalManualScore}/${maxPossibleScore}`),
      React.createElement('button', { onClick: onClose, className: 'btn-primary' }, 'Close')
    );
  }

  return React.createElement('div', { className: 'grading-interface' },
    React.createElement('div', { className: 'grading-header' },
      React.createElement('div', { className: 'submission-info' },
        React.createElement('h3', null, `Grading Submission #${submission.id}`),
        React.createElement('p', null, React.createElement('strong', null, 'Test:'), ' ', getTestTitle()),
        React.createElement('p', null, React.createElement('strong', null, 'Taker:'), ' ', `${submission.taker_name} (${submission.taker_email})`),
        React.createElement('p', null, React.createElement('strong', null, 'Questions:'), ' ', questions.length),
        React.createElement('p', null, React.createElement('strong', null, 'Answers:'), ' ', Object.keys(answers).length)
      ),
      React.createElement('div', { className: 'grading-summary' },
        React.createElement('div', { className: 'summary-card' },
          React.createElement('h4', null, 'Grading Summary'),
          React.createElement('div', { className: 'summary-stats' },
            React.createElement('div', { className: 'stat' },
              React.createElement('span', { className: 'stat-label' }, 'Questions:'),
              React.createElement('span', { className: 'stat-value' }, questions.length)
            ),
            React.createElement('div', { className: 'stat' },
              React.createElement('span', { className: 'stat-label' }, 'Manual Score:'),
              React.createElement('span', { className: 'stat-value' }, `${totalManualScore}/${maxPossibleScore}`)
            )
          )
        )
      )
    ),

    error && React.createElement('div', { className: 'error-message' },
      React.createElement('strong', null, 'Error:'), ' ', error
    ),

    React.createElement('div', { className: 'debug-section', style: { background: '#e8f4fd', border: '1px solid #b3d9ff', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' } },
      React.createElement('h4', null, '🔧 ROUTE DEBUGGING'),
      React.createElement('p', null, 'The grade submission endpoint is returning 404. This could be due to:'),
      React.createElement('ul', { style: { textAlign: 'left', margin: '10px 0' } },
        React.createElement('li', null, '❌ Not logged in as admin'),
        React.createElement('li', null, '❌ Incorrect route path'),
        React.createElement('li', null, '❌ Routes not properly mounted'),
        React.createElement('li', null, '❌ Missing authentication token')
      ),
      React.createElement('div', { style: { marginTop: '1rem' } },
        React.createElement('button', { 
          onClick: checkRouteConfiguration, 
          className: 'btn-secondary',
          style: { marginRight: '10px' }
        }, 'Check Configuration'),
        React.createElement('button', { 
          onClick: handleSubmitGrade, 
          className: 'btn-primary',
          disabled: grading
        }, grading ? 'Testing All Endpoints...' : 'Test All Endpoints')
      )
    ),

    React.createElement('div', { className: 'questions-grading-section' },
      React.createElement('h3', null, `Questions & Answers (${questions.length})`),
      questions.length === 0 ? 
        React.createElement('div', { className: 'no-questions' },
          React.createElement('p', null, 'No questions available for grading.')
        ) :
        React.createElement('div', { className: 'questions-list' },
          questions.map((question, index) => {
            const questionId = question.question_id || question.id;
            const answer = getAnswerForQuestion(question);
            const questionScore = questionScores[questionId] || 0;
            const maxMarks = question.marks || 4;
            const isExpanded = expandedQuestions[questionId];
            
            const questionHeader = React.createElement('div', { 
              className: 'question-header', 
              onClick: () => toggleQuestionExpansion(questionId)
            },
              React.createElement('div', { className: 'question-meta' },
                React.createElement('span', { className: 'question-number' }, `Q${index + 1}`),
                React.createElement('span', { className: 'question-type' }, getQuestionTypeLabel(question.type)),
                React.createElement('span', { className: 'question-marks' }, `${maxMarks} marks`)
              ),
              React.createElement('div', { className: 'question-score-indicator' },
                React.createElement('span', { className: 'current-score' }, `${questionScore}/${maxMarks}`),
                React.createElement('span', { className: 'expand-icon' }, isExpanded ? '▼' : '►')
              )
            );

            const questionContent = isExpanded && React.createElement('div', { className: 'question-content' },
              React.createElement('div', { className: 'question-text' },
                React.createElement('strong', null, 'Question:'),
                React.createElement('div', { className: 'question-text-content' }, question.text || 'No question text available')
              ),
              React.createElement('div', { className: 'answer-section' },
                React.createElement('div', { className: 'answer-text' },
                  React.createElement('strong', null, 'Student\'s Answer:'),
                  React.createElement('div', { className: 'answer-content' }, formatAnswer(answer))
                )
              ),
              React.createElement('div', { className: 'grading-control' },
                React.createElement('label', { htmlFor: `score-${questionId}` },
                  React.createElement('strong', null, 'Assign Score:'), ` (0 - ${maxMarks} marks)`
                ),
                React.createElement('div', { className: 'score-input-group' },
                  React.createElement('input', {
                    type: 'number',
                    id: `score-${questionId}`,
                    value: questionScore,
                    onChange: (e) => handleQuestionScoreChange(questionId, e.target.value),
                    min: '0',
                    max: maxMarks,
                    className: 'score-input'
                  }),
                  React.createElement('span', { className: 'score-range' }, `/ ${maxMarks}`)
                )
              )
            );

            return React.createElement('div', { 
              key: questionId, 
              className: `question-grading-item ${isExpanded ? 'expanded' : ''}`
            }, questionHeader, questionContent);
          })
        )
    ),

    React.createElement('div', { className: 'grading-actions' },
      React.createElement('div', { className: 'actions-summary' },
        React.createElement('strong', null, `Total Manual Score: ${totalManualScore}/${maxPossibleScore}`)
      ),
      React.createElement('div', { className: 'action-buttons' },
        React.createElement('button', { onClick: onClose, className: 'btn-secondary', disabled: grading }, 'Cancel'),
        React.createElement('button', { 
          onClick: handleSubmitGrade, 
          className: 'btn-primary', 
          disabled: grading || questions.length === 0
        }, grading ? 'Testing Endpoints...' : `Submit Grades (${totalManualScore}/${maxPossibleScore})`)
      )
    )
  );
};

module.exports = GradingInterface;