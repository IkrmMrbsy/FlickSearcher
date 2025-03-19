import React from 'react';
import { RefreshCw } from 'lucide-react';
import './Maintenance.css';

const MaintenancePage = () => {
  return (
    <div className="maintenance-container">
      <main className="maintenance-content">
        <div className="maintenance-card">
        <div className="maintenance-icon-container">
          <RefreshCw size={48} className="maintenance-icon pulse-glow" />
        </div>

          <h1>We're Making Improvements</h1>
          
          <div className="maintenance-message">
            <p className="main-text">FlickSearcher is currently being updated to improve your experience.</p>
            <p className="estimated-time">
              Estimated completion : <span className="span-text">Don't know hehe</span>
            </p>
          </div>



          {/*<div className="maintenance-actions">
            <button className="refresh-button" onClick={() => window.location.reload()}>
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
            
            <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>
          </div>*/}
        </div>
      </main>

      <footer className="maintenance-footer">
        <p>&copy; {new Date().getFullYear()} FlickSearcher</p>
      </footer>
    </div>
  );
};

export default MaintenancePage;