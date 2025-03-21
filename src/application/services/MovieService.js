import { fetchMovies } from '../../domain/useCases/fetchMovies';
import { searchMovies } from '../../domain/useCases/searchMovies';
import tmdbApi from '../../infrastructure/api/tmdbAPI';

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
    return response.data.results;
};