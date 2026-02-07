import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
}

