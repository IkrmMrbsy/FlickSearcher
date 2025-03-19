// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getMovieList, getMovieSearch } from './api';
import { Search, Star, Calendar, Menu, X } from 'lucide-react';
import MovieDetail from './MovieDetail';
import MaintenancePage from './MaintenancePage';
import './App.css';

const Home = () => {
  const [movieList, setMovieList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMaintenance = true; 

  useEffect(() => {
    if (isMaintenance) {
      return; // Jika mode maintenance aktif, hentikan proses fetch data
    }

    const fetchData = async () => {
      try {
        const movies = await getMovieList();
        setMovieList(movies);
      } catch (error) {
        setError('Error fetching movie list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isMaintenance]);

  if (isMaintenance) {
    return <MaintenancePage />; // Jika mode maintenance aktif, tampilkan halaman Maintenance
  }
  

  const search = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const results = await getMovieSearch(query);
      setSearchResults(results);
    } catch (error) {
      setError('Error fetching search results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Navbar */}
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
                onChange={({target}) => search(target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => search('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="navbar-menu-desktop">
            <Link to="/" className="menu-item active">Home</Link>
            <Link to="/popular" className="menu-item">Popular</Link>
            <Link to="/top-rated" className="menu-item">Top Rated</Link>
            <Link to="/coming-soon" className="menu-item">Coming Soon</Link>
          </div>
          
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-menu-item active">Home</Link>
            <Link to="/popular" className="mobile-menu-item">Popular</Link>
            <Link to="/top-rated" className="mobile-menu-item">Top Rated</Link>
            <Link to="/coming-soon" className="mobile-menu-item">Coming Soon</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <h2 className="content-title">
            {searchResults.length > 0 ? 'Search Results' : 'Popular Movies'}
          </h2>
          
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing movies for you...</p>
            </div>
          )}
          
          {error && (
            <div className="error-container">
              <p>{error}</p>
            </div>
          )}
          
          {!loading && !error && (
            <div className="movie-grid">
              {(searchResults.length > 0 ? searchResults : movieList).map((movie) => (
                (movie.poster_path && movie.title) && (
                  <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                    <div className="movie-poster">
                      <img 
                        src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`} 
                        alt={movie.title}
                      />
                      <div className="movie-rating">
                        <Star size={14} className="star-icon" />
                        <span>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <div className="release-date">
                          <Calendar size={14} className="calendar-icon" />
                          <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                        </div>
                        <div className="movie-genres">
                          {movie.genres && movie.genres.length > 0 
                            ? movie.genres.slice(0, 2).map(genre => (
                                <span key={genre.id} className="genre-tag">{genre.name}</span>
                              ))
                            : <span className="genre-tag">Unknown</span>
                          }
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          )}
          
          {searchResults.length === 0 && movieList.length === 0 && !loading && !error && (
            <div className="no-results">
              <p>No movies found</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
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
              {/*<div className="footer-links-column">
                <h3>Legal</h3>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/cookies">Cookie Policy</Link>
              </div>*/}
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
    </>
  );
};


const App = () => {
  return (
    <Router basename="/FlickSearcher">
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;