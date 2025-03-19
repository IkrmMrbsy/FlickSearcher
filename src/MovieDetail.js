import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';
import { Star, Calendar, Clock, ArrowLeft, PlayCircle } from 'lucide-react';
import './MovieDetail.css';

const MovieDetail = () => {
  const castContainerRef = useRef(null);
  const similarContainerRef = useRef(null);

  const navigate = useNavigate();

  const scroll = (containerRef, direction) => {
    const container = containerRef.current;
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  const scrollLeft = () => scroll(castContainerRef, 'left');
  const scrollRight = () => scroll(castContainerRef, 'right');
  const scrollSimilarLeft = () => scroll(similarContainerRef, 'left');
  const scrollSimilarRight = () => scroll(similarContainerRef, 'right');

  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [genres, setGenres] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch movie details
        const movieResponse = await axios.get(`${process.env.REACT_APP_BASEURL}/movie/${id}`, {
          params: {
            api_key: process.env.REACT_APP_APIKEY,
            append_to_response: 'videos,credits',
          },
        });

        setMovie(movieResponse.data);
        
        // Extract cast information
        if (movieResponse.data.credits && movieResponse.data.credits.cast) {
          setCast(movieResponse.data.credits.cast.slice(0, 6)); // Limit to 6 cast members
        }

        // Fetch similar movies
        const similarResponse = await axios.get(`${process.env.REACT_APP_BASEURL}/movie/${id}/recommendations`, {
          params: {
            api_key: process.env.REACT_APP_APIKEY,
            language: 'en-US',
            region: 'US', // Tambahkan region untuk rekomendasi lokal
            page: 1,
            sort_by: 'vote_count.desc' // Prioritaskan yang lebih populer
          },
        });

        if (similarResponse.data && similarResponse.data.results) {
          const filtered = similarResponse.data.results.filter(movie => 
            movie.poster_path && // Hanya yang punya poster
            movie.vote_average > 5 && // Minimum rating 5
            movie.genre_ids.length > 0 // Pastikan punya genre
          );
          setSimilarMovies(filtered.slice(0, 8)); // Ambil 8 terbaik
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Error loading movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASEURL}/genre/movie/list`, {
          params: {
            api_key: process.env.REACT_APP_APIKEY,
            language: 'en-US'
          }
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
  
    if (id) {
      fetchMovieDetails();
      fetchGenres();
    }
  
    window.scrollTo(0, 0);
  }, [id]);

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return num.toLocaleString('en-US');
  };

  // Get year from release date
  const getYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  // Get trailer key if available
  const getTrailerKey = () => {
    if (!movie || !movie.videos || !movie.videos.results) return null;
    
    const trailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer ? trailer.key : null;
  };

  return (
    <div className="movie-detail-container">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movie details...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p>{error}</p>
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      )}

      {!loading && !error && movie && (
        <>
          {/* Hero Section with Backdrop */}
          <div 
            className="movie-backdrop" 
            style={{ 
              backgroundImage: movie.backdrop_path 
                ? `url(${process.env.REACT_APP_BASEIMGURL}${movie.backdrop_path})` 
                : 'none' 
            }}
          >
            <div className="backdrop-overlay">
              <div className="back-navigation">
              <Link to="#" className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                Back
              </Link>
              </div>
            </div>
          </div>

          <div className="movie-detail-content">
            <div className="movie-detail-main">
              {/* Poster and Basic Info */}
              <div className="movie-poster-container">
                {movie.poster_path ? (
                  <img 
                    src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`} 
                    alt={movie.title} 
                    className="movie-detail-poster" 
                  />
                ) : (
                  <div className="poster-placeholder">
                    <p>No Poster Available</p>
                  </div>
                )}
              </div>

              <div className="movie-detail-info">
                <h1 className="movie-detail-title">
                  {movie.title} 
                  <span className="movie-year">({getYear(movie.release_date)})</span>
                </h1>

                <div className="movie-meta-info">
                  <div className="movie-rating-large">
                    <Star size={20} className="star-icon" />
                    <span>{movie.vote_average?.toFixed(1)}</span>
                  </div>

                  <div className="movie-meta-divider"></div>

                  <div className="movie-meta-item">
                    <Calendar size={16} className="meta-icon" />
                    <span>{movie.release_date || 'N/A'}</span>
                  </div>

                  <div className="movie-meta-divider"></div>

                  <div className="movie-meta-item">
                    <Clock size={16} className="meta-icon" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                </div>

                <div className="movie-genres-container">
                  {movie.genres?.map(genre => (
                    <span key={genre.id} className="genre-tag-detail">{genre.name}</span>
                  ))}
                </div>

                <div className="movie-action-buttons">
                  {getTrailerKey() && (
                    <a 
                      href={`https://www.youtube.com/watch?v=${getTrailerKey()}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="watch-trailer-button"
                    >
                      <PlayCircle size={18} />
                      Watch Trailer
                    </a>
                  )}
                </div>

                <div className="movie-overview">
                  <h3>Overview</h3>
                  <p>{movie.overview || 'No overview available.'}</p>
                </div>

                <div className="movie-additional-info">
                  {movie.tagline && (
                    <div className="movie-tagline">
                      <em>"{movie.tagline}"</em>
                    </div>
                  )}

                  <div className="movie-stats">
                    <div className="stat-item">
                      <h4>Status</h4>
                      <p>{movie.status || 'N/A'}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Budget</h4>
                      <p>{movie.budget ? `$${formatNumber(movie.budget)}` : 'N/A'}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Revenue</h4>
                      <p>{movie.revenue ? `$${formatNumber(movie.revenue)}` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cast Section */}
            {cast.length > 0 && (
              <div className="movie-cast-section">
              <h3 className="section-title">Top Cast</h3>
              <button className="section-nav prev" onClick={scrollLeft}>
                &lt;
              </button>
              <div className="cast-container" ref={castContainerRef}>
                  {cast.map(person => (
                    <div key={person.id} className="cast-card">
                      <div className="cast-image">
                        {person.profile_path ? (
                          <img 
                            src={`${process.env.REACT_APP_BASEIMGURL}${person.profile_path}`} 
                            alt={person.name} 
                          />
                        ) : (
                          <div className="cast-placeholder">
                            <span>{person.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="cast-info">
                        <h4>{person.name}</h4>
                        <p>{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="section-nav next" onClick={scrollRight}>
                    &gt;
                </button>
              </div>
            )}

            {/* Similar Movies Section */}
            {similarMovies.length > 0 && (
              <div className="similar-movies-section">
              <h3 className="section-title">More like this</h3>
              <button className="section-nav prev" onClick={scrollSimilarLeft}>
                &lt;
              </button>
              <div className="similar-movies-container" ref={similarContainerRef}>
                {similarMovies.map(similarMovie => (
                  <Link 
                    to={`/movie/${similarMovie.id}`} 
                    key={similarMovie.id} 
                    className="similar-movie-card"
                  >
                      <div className="similar-movie-poster">
                        {similarMovie.poster_path ? (
                          <img 
                            src={`${process.env.REACT_APP_BASEIMGURL}${similarMovie.poster_path}`} 
                            alt={similarMovie.title} 
                          />
                        ) : (
                          <div className="similar-movie-placeholder">
                            <span>{similarMovie.title.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="similar-movie-info">
                        <h4 className="similar-movie-title">{similarMovie.title}</h4>
                        <div className="similar-movie-rating">
                          <Star size={14} className="star-icon" />
                          <span>{similarMovie.vote_average?.toFixed(1)}</span>
                        </div>
                        <div className="movie-meta">
                          <div className="release-date">
                            <Calendar size={14} className="calendar-icon" />
                            <span>{similarMovie.release_date ? getYear(similarMovie.release_date) : 'N/A'}</span>
                          </div>
                          <div className="movie-genres">
                            {similarMovie.genre_ids?.slice(0, 2).map((genreId) => {
                              const genre = genres.find(g => g.id === genreId);
                              return (
                                <span key={genreId} className="genre-tag">
                                  {genre ? genre.name : 'Unknown'}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <button className="section-nav next" onClick={scrollSimilarRight}>
                  &gt;
                </button>
              </div>
            )}

            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="production-section">
                <h3 className="section-title">Production</h3>
                <div className="production-companies">
                  {movie.production_companies.map(company => (
                    <div key={company.id} className="company-item">
                      {company.logo_path ? (
                        <img 
                          src={`${process.env.REACT_APP_BASEIMGURL}${company.logo_path}`} 
                          alt={company.name} 
                          className="company-logo"
                        />
                      ) : (
                        <div className="company-name-only">{company.name}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetail;