import React from 'react';
import { Star, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, isUpcoming }) => {
  // Calculate days until release for upcoming movies
  const getDaysUntil = (releaseDate) => {
    if (!releaseDate) return null;
    const today = new Date();
    const release = new Date(releaseDate);
    const diffTime = release - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  // Format the full release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'TBA';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const daysUntil = movie.release_date ? getDaysUntil(movie.release_date) : null;

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        <img 
          src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`} 
          alt={movie.title}
        />

        {/* Bagian Poster: Upcoming vs Non-Upcoming */}
        {isUpcoming ? (
          // Tampilkan "Coming Soon" untuk film yang akan tayang
          <div className="coming-soon-label">
            Coming Soon
          </div>
        ) : (
          // Tampilkan rating bintang untuk film biasa
          <div className="movie-rating">
            <Star size={14} className="star-icon" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">

          {/* Bagian Release Date: Upcoming vs Non-Upcoming */}
          <div className="release-date">
            <Calendar size={14} className="calendar-icon" />
            {isUpcoming ? (
              // Tampilkan tanggal rilis lengkap untuk film yang akan tayang
              <span>{formatReleaseDate(movie.release_date)}</span>
            ) : (
              // Tampilkan tahun rilis untuk film biasa
              <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
            )}
          </div>

          {/* Bagian Genre: Sama untuk Upcoming dan Non-Upcoming */}
          <div className="movie-genres">
            {movie.genres && movie.genres.length > 0 
              ? movie.genres.slice(0, 2).map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))
              : <span className="genre-tag">Unknown</span>
            }
          </div>

          {/* Bagian Days Until Release: Hanya untuk Upcoming */}
          {isUpcoming && daysUntil && (
            <div className="days-until">
              <Clock size={14} className="calendar-icon" />
              <span>{daysUntil} days left</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;