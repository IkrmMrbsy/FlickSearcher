import React, { useState, useEffect } from 'react';
import { getMovieList } from '../../application/services/MovieService';
import { getMovieSearch } from '../../application/services/MovieService';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../styles/App.css'

const Home = () => {
  const [movieList, setMovieList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <>
      <Navbar searchQuery={searchQuery} onSearch={search} />
      <main className="main-content">
        <div className="content-container">
          <h2 className="content-title">
            {searchResults.length > 0 ? 'Search Results' : 'Popular Movies'}
          </h2>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          <div className="movie-grid">
            {(searchResults.length > 0 ? searchResults : movieList).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;