import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>FlickSearcher.</h2>
            <p>Your ultimate movie discovery platform</p>
          </div>
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Navigation</h3>
              <Link to="/">Home</Link>
              <Link to="/popular">Popular</Link>
              <Link to="/top-rated">Top Rated</Link>
              <Link to="/coming-soon">Coming Soon</Link>
            </div>
            <div className="footer-links-column">
              <h3>Connect</h3>
              <Link to="/contact">Contact Us</Link>
              <Link to="/about">About</Link>
              <Link to="/faq">FAQ</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FlickSearcher. All rights reserved.</p>
          <p>Powered by TMDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;