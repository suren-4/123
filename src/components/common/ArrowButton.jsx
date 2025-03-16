import React from 'react';
import './ArrowButton.css';

const ArrowButton = ({ onClick, className }) => {
  return (
    <div className={`arrow-button-wrapper ${className || ''}`} onClick={onClick}>
      <div className="arrow">
        <div className="arrow-top"></div>
        <div className="arrow-bottom"></div>
      </div>
    </div>
  );
}

export default ArrowButton; 