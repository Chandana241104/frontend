import React from 'react';
import '../../styles/components/admin-dashboard.css';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Tests',
      value: stats.totalTests,
      icon: '📊',
      color: 'var(--accent-primary)'
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: '📝',
      color: 'var(--success)'
    },
    {
      title: 'Graded',
      value: stats.gradedSubmissions,
      icon: '✅',
      color: 'var(--success)'
    },
    {
      title: 'Pending',
      value: stats.pendingSubmissions,
      icon: '⏳',
      color: 'var(--warning)'
    },
    {
      title: 'Member Submissions',
      value: stats.memberSubmissions,
      icon: '👥',
      color: 'var(--accent-primary)'
    },
    {
      title: 'Mentor Submissions',
      value: stats.mentorSubmissions,
      icon: '🎓',
      color: 'var(--accent-secondary)'
    }
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="stat-content">
            <h3>{card.value}</h3>
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;