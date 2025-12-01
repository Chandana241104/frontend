export const saveTestProgress = (testId, answers, currentQuestion, timeLeft) => {
  const progress = {
    answers,
    currentQuestion,
    timeLeft,
    timestamp: Date.now()
  };
  localStorage.setItem(`test_${testId}`, JSON.stringify(progress));
};

export const loadTestProgress = (testId) => {
  const saved = localStorage.getItem(`test_${testId}`);
  if (saved) {
    const progress = JSON.parse(saved);
    // Check if progress is less than 1 hour old
    if (Date.now() - progress.timestamp < 60 * 60 * 1000) {
      return progress;
    }
  }
  return null;
};

export const clearTestProgress = (testId) => {
  localStorage.removeItem(`test_${testId}`);
};