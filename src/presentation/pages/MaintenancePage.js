import React from 'react';
import { RefreshCw } from 'lucide-react';
import '../../styles/Maintenance.css';

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
            <p className="main-text">
              FlickSearcher is currently being updated to improve your experience.
            </p>
            <p className="estimated-time">
              Estimated completion: <span className="span-text">Don't know hehe</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="maintenance-footer">
        <p>&copy; {new Date().getFullYear()} FlickSearcher</p>
      </footer>
    </div>
  );
};

export default MaintenancePage;