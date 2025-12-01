import React from 'react';
import '../../styles/components/question-navigation.css';

const QuestionNavigation = ({ questions, currentIndex, answers, onQuestionSelect }) => {
  const getQuestionStatus = (question, index) => {
    if (index === currentIndex) return 'current';
    if (answers[question.id]) return 'answered';
    return 'unanswered';
  };

  const getCompletionStats = () => {
    const answered = questions.filter(q => answers[q.id]).length;
    const total = questions.length;
    return { answered, total, percentage: Math.round((answered / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="question-navigation-enhanced">
      {/* Header */}
      <div className="nav-header">
        <h3>Test Navigation</h3>
        <div className="completion-badge">
          <span className="completion-text">Completion</span>
          <span className="completion-percent">{stats.percentage}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-stats">
          <span className="progress-text">
            {stats.answered}/{stats.total} questions
          </span>
          <span className="progress-percent">{stats.percentage}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="questions-grid">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          const isCurrent = index === currentIndex;
          const isAnswered = answers[question.id];
          
          return (
            <button
              key={question.id}
              className={`question-bubble ${status} ${isCurrent ? 'pulse' : ''}`}
              onClick={() => onQuestionSelect(index)}
              title={`Question ${index + 1}: ${question.text.substring(0, 50)}...`}
            >
              <div className="bubble-content">
                <span className="question-number">{index + 1}</span>
                {isAnswered && (
                  <div className="answer-indicator">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Status Tooltip */}
              <div className="status-tooltip">
                Q{index + 1}: {status.replace('_', ' ')}
                {isAnswered && ' ✓'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="navigation-legend">
        <div className="legend-title">Status Legend:</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-bubble current"></div>
            <span>Current</span>
          </div>
          <div className="legend-item">
            <div className="legend-bubble answered"></div>
            <span>Answered</span>
          </div>
          <div className="legend-item">
            <div className="legend-bubble unanswered"></div>
            <span>Unanswered</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-btn first-unanswered"
          onClick={() => {
            const firstUnanswered = questions.findIndex(q => !answers[q.id]);
            if (firstUnanswered !== -1) onQuestionSelect(firstUnanswered);
          }}
        >
          First Unanswered
        </button>
        <button 
          className="action-btn review-flagged"
          onClick={() => {
            // You can add flag functionality later
            const firstQuestion = 0;
            onQuestionSelect(firstQuestion);
          }}
        >
          Go to Start
        </button>
      </div>
    </div>
  );
};

export default QuestionNavigation;