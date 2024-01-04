// api.js
import axios from "axios";

export const getMovieList = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASEURL}/movie/popular`, {
      params: {
        api_key: process.env.REACT_APP_APIKEY,
      },
    });

    const movieList = response.data.results;
    console.log({ movielist: movieList });
    return movieList;
  } catch (error) {
    console.error('Error fetching movie list:', error);
    throw error;
  }
};

export const getMovieSearch = async (query) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASEURL}/search/movie`, {
      params: {
        api_key: process.env.REACT_APP_APIKEY,
        query: query,
      },
    });

    const searchResults = response.data.results.map(async (movie) => {
      const detailsResponse = await axios.get(`${process.env.REACT_APP_BASEURL}/movie/${movie.id}`, {
        params: {
          api_key: process.env.REACT_APP_APIKEY,
          append_to_response: "genres", // Include genres in the response
        },
      });

      const movieDetails = detailsResponse.data;
      return { ...movie, ...movieDetails };
    });

    const resultsWithDetails = await Promise.all(searchResults);

    console.log({ searchResults: resultsWithDetails });
    return resultsWithDetails;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};
