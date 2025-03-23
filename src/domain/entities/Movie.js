export default class Movie {
    constructor({ id, title, poster_path, backdrop_path, vote_average, release_date, genres, overview, tagline, actors, production_companies }) {
        this.id = id;
        this.title = title;
        this.poster_path = poster_path;
        this.backdrop_path = backdrop_path;
        this.vote_average = vote_average;
        this.release_date = release_date;
        this.genres = genres;
        this.overview = overview;
        this.tagline = tagline;
        this.actors = actors || [];
        this.production_companies = production_companies || [];
    }
}
