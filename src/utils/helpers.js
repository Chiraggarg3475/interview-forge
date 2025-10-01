/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get time limit based on difficulty
 * @param {string} difficulty - Question difficulty
 * @returns {number} Time in seconds
 */
export function getTimeForDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 20;
    case 'medium':
      return 60;
    case 'hard':
      return 120;
    default:
      return 60;
  }
}

/**
 * Calculate score color class based on score value
 * @param {number} score - Score value (0-100)
 * @returns {string} CSS class name
 */
export function getScoreClass(score) {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-average';
  return 'score-poor';
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @returns {boolean} True if valid
 */
export function isValidFileType(file) {
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return validTypes.includes(file.type);
}

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
