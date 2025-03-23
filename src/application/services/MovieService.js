import { fetchMovies, fetchGenres } from '../../domain/useCases/fetchMovies';
import { searchMovies } from '../../domain/useCases/searchMovies';
import tmdbApi from '../../infrastructure/api/tmdbAPI';

export const getTrendingMovies = async () => {
    const response = await tmdbApi.get('/trending/movie/week');
    const genres = await fetchGenres(tmdbApi); // Ambil daftar genre

    // Filter film yang memiliki backdrop_path, overview, dan vote_average > 6
    const filteredMovies = response.data.results
        .filter(movie => 
            movie.backdrop_path && 
            movie.overview && 
            movie.vote_average > 7 // Hanya film dengan rating di atas 6
        )
        .slice(0, 5); // Ambil 5 film pertama

    // Ambil detail setiap film untuk memeriksa apakah memiliki trailer dan genre
    const moviesWithDetails = await Promise.all(
        filteredMovies.map(async (movie) => {
            const details = await getMovieHeroDetails(movie.id);
            if (!details) return null; // Jika tidak ada trailer, kembalikan null

            // Tambahkan genre ke detail film
            const movieGenres = movie.genre_ids
                .map(id => genres.find(g => g.id === id))
                .filter(Boolean); // Filter genre yang valid

            return {
                ...details,
                genres: movieGenres,
            };
        })
    );

    // Filter out null values (film yang tidak memiliki trailer atau genre)
    return moviesWithDetails.filter(movie => movie !== null);
};

export const getMovieHeroDetails = async (id) => {
    const response = await tmdbApi.get(`/movie/${id}`, {
        params: {
            append_to_response: 'videos',
        },
    });

    const trailer = response.data.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    // Validasi agar hanya mengembalikan film yang memiliki semua data penting
    if (!response.data.backdrop_path || !response.data.overview || !response.data.vote_average || !trailer) {
        return null; // Jika data kurang, kembalikan null (bisa di-handle di frontend)
    }

    return {
        id: response.data.id,
        title: response.data.title,
        backdrop_path: response.data.backdrop_path,
        poster_path: response.data.poster_path,
        vote_average: response.data.vote_average,
        release_date: response.data.release_date,
        tagline: response.data.tagline,
        overview: response.data.overview,
        trailer_url: `https://www.youtube.com/watch?v=${trailer.key}`,
    };
};

export const getMovieList = async () => {
    return await fetchMovies(tmdbApi);
};

export const getMovieSearch = async (query) => {
    return await searchMovies(tmdbApi, query);
};

export const getMovieDetails = async (id) => {
    const response = await tmdbApi.get(`/movie/${id}`, {
        params: {
            append_to_response: 'videos,credits',
        },
    });
    return response.data
};

export const getSimilarMovies = async (id) => {
    const response = await tmdbApi.get(`/movie/${id}/similar`);
    const genres = await fetchGenres(tmdbApi); // Ambil daftar genre

    return response.data.results.map(movie => ({
        ...movie,
        genres: movie.genre_ids.map(id => genres.find(g => g.id === id)).filter(Boolean),
    }));
};