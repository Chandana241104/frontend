import React from 'react';
// import './Timer.css';

const Timer = ({ timeLeft, totalTime, isRunning }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const getTimerColor = () => {
    if (percentage > 50) return 'var(--success)';
    if (percentage > 25) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span className="timer-time">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
        <span className={`timer-status ${isRunning ? 'running' : 'paused'}`}>
          {isRunning ? 'Running' : 'Paused'}
        </span>
      </div>
      <div className="timer-progress">
        <div 
          className="timer-progress-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: getTimerColor()
          }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;