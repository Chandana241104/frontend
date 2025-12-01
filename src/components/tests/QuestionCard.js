import React from 'react';
import '../../styles/components/test-runner.css';

const QuestionCard = ({ question, answer, onAnswerChange, questionNumber, totalQuestions }) => {
  const handleShortAnswerChange = (value) => {
    onAnswerChange(question.id, value);
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'short':
        return (
          <div className="short-answer">
            <textarea
              value={answer || ''}
              onChange={(e) => handleShortAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="short-answer-input"
            />
            <div className="answer-length">
              {answer?.length || 0} characters
            </div>
          </div>
        );
      
      case 'mcq':
        return (
          <div className="mcq-options">
            {question.options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={answer === index}
                  onChange={() => onAnswerChange(question.id, index)}
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'multi':
        return (
          <div className="multi-options">
            {question.options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="checkbox"
                  checked={answer?.includes(index) || false}
                  onChange={(e) => {
                    const currentAnswers = answer || [];
                    if (e.target.checked) {
                      onAnswerChange(question.id, [...currentAnswers, index]);
                    } else {
                      onAnswerChange(question.id, currentAnswers.filter(a => a !== index));
                    }
                  }}
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'tf':
        return (
          <div className="tf-options">
            <label className="option-label">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="true"
                checked={answer === 'true'}
                onChange={() => onAnswerChange(question.id, 'true')}
              />
              <span className="option-text">True</span>
            </label>
            <label className="option-label">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="false"
                checked={answer === 'false'}
                onChange={() => onAnswerChange(question.id, 'false')}
              />
              <span className="option-text">False</span>
            </label>
          </div>
        );
      
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-meta">
          <span className="question-number">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="question-marks">
            {question.marks} marks
          </span>
        </div>
        <div className="question-type">
          {question.type.toUpperCase()}
        </div>
      </div>
      
      <div className="question-text">
        {question.text}
      </div>
      
      <div className="question-answer">
        {renderQuestionContent()}
      </div>
      
      <div className="question-instructions">
        {question.type === 'short' && (
          <p>Please provide a detailed answer. Your response will be manually graded.</p>
        )}
        {question.type === 'mcq' && (
          <p>Select the single best answer.</p>
        )}
        {question.type === 'multi' && (
          <p>Select all that apply.</p>
        )}
        {question.type === 'tf' && (
          <p>Select True or False.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;