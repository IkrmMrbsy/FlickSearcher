// App.js
import React, { useState, useEffect } from 'react';
import { getMovieList, getMovieSearch } from './api';
import './App.css';

const App = () => {
  const [movieList, setMovieList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  const search = async (query) => {
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

  return (
    <div className="App">
      <nav className="Navbar">
        <h1>FlickSearcher.</h1>
      </nav>
      <header className="App-header">
        <input 
          placeholder="Search for a Movie" 
          className="Movie-search"
          onChange={({target}) => search(target.value)}
        />
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="Movie-container">
          {(searchResults.length > 0 ? searchResults : movieList).map((movie) => (
            (movie.poster_path && movie.title && movie.release_date && movie.vote_average) && (
              <div key={movie.id} className="Movie-card">
                <img className="Movie-image" src={`${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`} alt={movie.title}/>
                <div className="Movie-details">
                  <h2 className="Movie-title">{movie.title}</h2>
                  <p className="Movie-date">Release Date: {movie.release_date}</p>
                  <p className="Movie-rate">Rating: {movie.vote_average}</p>
                  {movie.genres && (
          <p className="Movie-genres">Genres: {movie.genres.map((genre) => genre.name).join(', ')}</p>
        )}
                  {/* Add other details as needed */}
                </div>
              </div>
            )
          ))}
          {searchResults.length === 0 && movieList.length === 0 && !loading && !error && (
            <p>No movies found</p>
          )}
        </div>
      </header>
    </div>
  );
};

export default App;
