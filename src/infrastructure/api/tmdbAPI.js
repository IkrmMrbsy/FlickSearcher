import axios from "axios";

const tmdbApi = axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
    params: { 
        api_key: process.env.REACT_APP_APIKEY,
    },
});

export default tmdbApi;