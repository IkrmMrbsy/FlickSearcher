import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar = ({ searchQuery, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <h1>FlickSearcher.</h1>
          </Link>
        </div>
        <div className="navbar-search">
          <div className="search-input-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search for movies..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => onSearch('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-menu-item">
            Home
          </Link>
          <Link to="/popular" className="mobile-menu-item">
            Popular
          </Link>
          <Link to="/top-rated" className="mobile-menu-item">
            Top Rated
          </Link>
          <Link to="/coming-soon" className="mobile-menu-item">
            Coming Soon
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;