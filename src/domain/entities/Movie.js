export default class Movie {
    constructor({id, title, poster_path, vote_average, release_date, genres, overview}) {
        this.id = id;
        this.title = title;
        this.poster_path = poster_path;
        this.vote_average = vote_average;
        this.release_date = release_date;
        this.genres = genres;
        this.overview = overview;
    }
}