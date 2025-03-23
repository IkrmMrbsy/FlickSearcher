import React, { useState, useEffect, useCallback } from 'react';
import { getMovieList, getMovieSearch, getMovieHeroDetails, getTrendingMovies } from '../../application/services/MovieService';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import '../../styles/App.css';

const Home = () => {
  const [movieList, setMovieList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  // ✅ Fungsi untuk ke slide berikutnya
  const goToNextSlide = useCallback(() => {
    if (isTransitioning || trendingMovies.length === 0) return;
  
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === trendingMovies.length - 1 ? 0 : prevIndex + 1
    );
  
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning, trendingMovies.length]);

  // ✅ Auto-slide setiap 8 detik
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 10000);

    return () => clearInterval(interval);
  }, [goToNextSlide]); 

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning || trendingMovies.length === 0) return;

  setIsTransitioning(true);
  setCurrentIndex((prevIndex) => 
    prevIndex === 0 ? trendingMovies.length - 1 : prevIndex - 1
  );

  setTimeout(() => {
    setIsTransitioning(false);
  }, 600);
}, [isTransitioning, trendingMovies.length]);

  // ✅ Fungsi untuk klik indikator slider
  const handleIndicatorClick = useCallback((index) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getTrendingMovies();
        setTrendingMovies(trending);

        const movies = await getMovieList();
        setMovieList(movies);

        if (trending.length > 0) {
          const hero = await getMovieHeroDetails(movies[0].id);
          setHeroMovie(hero);
        }
      } catch (error) {
        setError('Error fetching movie list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Fungsi pencarian
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
         {/* HeroSection dengan Slider */}
      {movieList.length > 0 && (
        <HeroSection
          heroMovie={heroMovie}
          movies={trendingMovies}
          currentIndex={currentIndex}
          goToNextSlide={goToNextSlide}
          goToPrevSlide={goToPrevSlide}
          handleIndicatorClick={handleIndicatorClick}
        />
      )}
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