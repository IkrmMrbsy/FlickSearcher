import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/HeroSection.css';

const HeroSection = ({ movies, currentIndex, goToNextSlide, goToPrevSlide, handleIndicatorClick }) => {
  if (!movies || movies.length === 0) {
    return <div className="hero-section-placeholder"></div>;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="hero-carousel">
      <div 
        className="hero-section active"
        style={{
          backgroundImage: `linear-gradient(0deg, var(--primary-color), transparent 70%), 
                            linear-gradient(90deg, var(--primary-color) 0%, transparent 50%),
                            url(${process.env.REACT_APP_BASEIMGURL}${currentMovie.backdrop_path})`
        }}
      >
        <div className="hero-content-container">
          <div className="hero-content">
            <h1 className="hero-title">{currentMovie.title}</h1>
            
            {currentMovie.tagline && (
              <div className="hero-tagline">{currentMovie.tagline}</div>
            )}
            
            <p className="hero-overview">{currentMovie.overview}</p>
            
            <div className="hero-meta">
              {currentMovie.vote_average > 0 && (
                <div className="hero-rating">
                  <span className="star-icon">★</span>
                  <span>{currentMovie.vote_average.toFixed(1)}</span>
                </div>
              )}
              
              {currentMovie.release_date && (
                <div className="hero-year">
                  {new Date(currentMovie.release_date).getFullYear()}
                </div>
              )}
              
              <div className="hero-genres">
                {currentMovie.genres && currentMovie.genres.slice(0, 3).map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            </div>
            
            <div className="hero-buttons">
              <Link to={`/movie/${currentMovie.id}`} className="hero-button details-button">
                <FaInfoCircle /> Details
              </Link>
              
              {currentMovie.trailer_url && (
                <a 
                  href={currentMovie.trailer_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hero-button trailer-button"
                >
                  <FaPlay className="play-icon" /> Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-controls">
        <button 
          className="hero-control prev-button" 
          onClick={goToPrevSlide}
          aria-label="Previous movie"
        >
          <FaChevronLeft />
        </button>
        
        <div className="hero-indicators">
          {movies.map((_, index) => (
            <button 
              key={index}
              className={`hero-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          className="hero-control next-button" 
          onClick={goToNextSlide}
          aria-label="Next movie"
        >
          <FaChevronRight />
        </button>
      </div>
      
      <div className="hero-bottom-gradient" />
    </div>
  );
};

export default HeroSection;
