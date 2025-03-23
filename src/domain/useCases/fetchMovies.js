import Movie from "../entities/Movie";

let genreList = [];

export const fetchGenres = async (api) => {
    if (genreList.length === 0) {
        const response = await api.get('/genre/movie/list');
        genreList = response.data.genres;
    }
    return genreList;
};

export const fetchTrendingMovies = async (api) => {
    const response = await api.get('/trending/movie/week');
    const genres = await fetchGenres(api);

    return response.data.results
        .filter(movie => 
            movie.backdrop_path && 
            movie.overview && 
            movie.vote_average
        )
        .map(movie => {
            const movieGenres = movie.genre_ids.map(id => genres.find(genre => genre.id === id)).filter(Boolean);
            return new Movie({ ...movie, genres: movieGenres });
        });
};

export const fetchMovies = async (api) => {
    const response = await api.get('/movie/popular');
    const genres = await fetchGenres(api);

    return response.data.results
        .filter(movie => movie.poster_path) 
        .map(movie => {
            const movieGenres = movie.genre_ids.map(id => 
                genres.find(genre => genre.id === id)
            ).filter(Boolean); 

            return new Movie({ ...movie, genres: movieGenres });
        });
};
