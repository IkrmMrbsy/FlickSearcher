import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, ArrowLeft, PlayCircle } from 'lucide-react';
import { getMovieDetails, getSimilarMovies } from '../../application/services/MovieService';
import '../../styles/MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const movieDetails = await getMovieDetails(id);
        setMovie(movieDetails);

        const similar = await getSimilarMovies(id);
        setSimilarMovies(similar);

      } catch (error) {
        setError('Error loading movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTrailerKey = () => {
    if (!movie || !movie.videos || !movie.videos.results) return null;
    const trailer = movie.videos.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? trailer.key : null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      {movie && (
        <>
          <div
            className="movie-backdrop"
            style={{
              backgroundImage: movie.backdrop_path
                ? `url(${process.env.REACT_APP_BASEIMGURL}${movie.backdrop_path})`
                : 'none',
            }}
          >
            <div className="backdrop-overlay">
              <div className="back-navigation">
                <button className="back-button" onClick={() => navigate(-1)}>
                  <ArrowLeft size={20} />
                  Back
                </button>
              </div>
            </div>
          </div>

          <div className="movie-detail-content">
            <div className="movie-detail-main">
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
                  {movie.title} <span className="movie-year">({movie.release_date?.split('-')[0]})</span>
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
                  {movie.genres?.map((genre) => (
                    <span key={genre.id} className="genre-tag-detail">
                      {genre.name}
                    </span>
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
              </div>
            </div>

            {similarMovies.length > 0 && (
              <div className="similar-movies-section">
                <h3 className="section-title">More like this</h3>
                <div className="similar-movies-container">
                  {similarMovies.map((similarMovie) => (
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
                        <div className="movie-genres">
  {similarMovie.genres && similarMovie.genres.length > 0 ? (
    similarMovie.genres.slice(0, 2).map((genre, index) => (
      <span key={index} className="genre-tag">
        {genre.name} {/* Sekarang langsung pakai genre.name */}
      </span>
    ))
  ) : (
    <span className="genre-tag">Unknown</span>
  )}
</div>

                      </div>
                    </Link>
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