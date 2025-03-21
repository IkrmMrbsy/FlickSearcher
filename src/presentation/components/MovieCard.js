import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => (
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

);

export default MovieCard;