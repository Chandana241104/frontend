import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ answered, total, timeLeft, totalTime }) => {
  const progressPercentage = (answered / total) * 100;
  const timePercentage = (timeLeft / totalTime) * 100;

  return (
    <div className="progress-container">
      <div className="progress-section">
        <div className="progress-label">
          Questions: {answered}/{total}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill questions"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="progress-section">
        <div className="progress-label">
          Time: {Math.floor(timeLeft / 60000)}:{(timeLeft % 60000 / 1000).toFixed(0).padStart(2, '0')}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill time"
            style={{ width: `${timePercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;