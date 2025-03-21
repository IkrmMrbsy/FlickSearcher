import Movie from "../entities/Movie";

export const searchMovies = async (api, query) => {
    const response = await api.get('/search/movie', { params: {query} });
    return response.data.results.map(movie => new Movie(movie));
};