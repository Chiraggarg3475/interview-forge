import React, { useEffect, useState } from 'react';
import { formatTime } from '../utils/helpers';
import PropTypes from 'prop-types';

const Timer = ({ initialTime, onTimeout, isPaused, difficulty }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, onTimeout]);

  const isWarning = timeLeft <= 5;

  return (
    <div className={`timer-display ${isWarning ? 'warning' : ''}`}>
      <div style={{ fontSize: 12, opacity: 0.7, textTransform: 'uppercase', marginBottom: 4 }}>
        Time Remaining ({difficulty})
      </div>
      <div className={`timer-text ${isWarning ? 'warning' : ''}`}>
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

Timer.propTypes = {
  initialTime: PropTypes.number.isRequired,
  onTimeout: PropTypes.func.isRequired,
  isPaused: PropTypes.bool,
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']).isRequired
};

Timer.defaultProps = {
  isPaused: false
};

export default Timer;
