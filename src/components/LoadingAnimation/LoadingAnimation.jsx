import React, { useEffect, useState } from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 1000); // Wait for fade out animation
    }, 2500); // Total animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="artifact-symbol">க</div>
        <h1 className="loading-title">Kalanjiyam</h1>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p className="loading-text">Unveiling History</p>
      </div>
    </div>
  );
};

export default LoadingAnimation; 