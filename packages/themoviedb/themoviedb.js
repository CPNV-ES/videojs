var moviedb = Npm.require('moviedb')(Meteor.settings.themoviedb.api_key || null);
var ptn = Npm.require('parse-torrent-name');
var path = Npm.require('path');

var Themoviedb = function () {
};

/**
 * Use parse-torrent-name (npm module) for analyze name of movie file
 * @param filename : filename
 * @return : parse-torrent-name array (https://github.com/jzjzjzj/parse-torrent-name#usage)
 **/
Themoviedb.prototype._resolve = function (filename) {

    // Remove extension of filename
    filename = path.basename(filename, path.extname(filename));

    // Get Information
    var info = ptn(filename);

    // 1. If title exist, replace . by space, and trim it.
    if (info.title) info.title = info.title.replace(/\./g, ' ').trim();

    return info;
};

/**
 * Do query to themoviedb API
 * if themoviedb return QUOTA_ERROR, execute again request.
 * else throw Exception
 * TODO : Change while(true) by better loop
 **/
Themoviedb.prototype._tmdbQuery = function (method, request) {
    while (true) {
        try {
            var movieInfo;
            movieInfo = this.moviedb[method](request);
            return movieInfo;
        } catch (e) {
            if (e.status == this.status.QUOTA_ERROR) break;
            else if (e.status == this.status.INVALID_APIKEY) throw new this.InvalidApiKeyException('INVALID_APIKEY');
            else if (e.status == this.status.SUSPENDED_APIKEY) throw new this.InvalidApiKeyException('SUSPENDED_APIKEY');
            else if (e.status == this.status.SERVICE_OFFLINE) throw new this.NoInternetException('SERVICE_OFFLINE');
            else if (e.status == this.status.REQUEST_TIMEOUT) throw new this.NoInternetException('REQUEST_TIMEOUT');
            else throw e;
        }
    }
};

// NoResultException : We don't find result for this movie
Themoviedb.prototype.NoResultException = function (message) {
    this.name = 'NoResultException';
    this.message = message || '';
    this.prototype = Error.prototype;
};

// ItIsNotMovieException : file is series or other, but not movie
Themoviedb.prototype.ItIsNotMovieException = function (message) {
    this.name = 'ItIsNotMovieException';
    this.message = message || '';
    this.prototype = Error.prototype;
};

// NotTitleFoundException : filename is horrible, can't find title
Themoviedb.prototype.NoTitleFoundException = function (message) {
    this.name = 'NoTitleFoundException';
    this.message = message || '';
    this.prototype = Error.prototype;
};

// NoInternetException : We don't have internet
Themoviedb.prototype.NoInternetException = function (message) {
    this.name = 'NoInternetException';
    this.message = message || '';
    this.prototype = Error.prototype;
};

// InvalidApiKeyException : ApiKey doesn't accept by themoviedb
Themoviedb.prototype.InvalidApiKeyException = function (message) {
    this.name = 'InvalidApiKeyException';
    this.message = message || '';
    this.prototype = Error.prototype;
};

Themoviedb.prototype.status = {
    INVALID_APIKEY: 401,
    SERVICE_OFFLINE: 503,
    SUSPENDED_APIKEY: 401,
    REQUEST_TIMEOUT: 504,
    QUOTA_ERROR: 429
};

// Wrap les méthodes asyncrone du module moviedb
Themoviedb.prototype.moviedb = Async.wrap(moviedb, ['searchMovie', 'movieInfo', 'configuration', 'requestToken']);

/**
 * Search movie in Themoviedb API
 * @param query
 * @return json
 **/
Themoviedb.prototype.search = function (query) {
    // Construct Request
    var searchRequest = {
        language: Meteor.settings.themoviedb.language || 'fr',
    };

    if (typeof query == 'object') {
        // If query is object, it's parse-torrent-name array.
        searchRequest.query = query.title;
        if (query.year) searchRequest.year = query.year;
    } else {
        // It it's not, is directly a query.
        searchRequest.query = query;
    }

    // Do Search
    return this._tmdbQuery('searchMovie', searchRequest);
};

Themoviedb.prototype.find = function (id) {
    // Construct Request
    var findRequest = {
        id: id,
        language: Meteor.settings.themoviedb.language || 'fr',
        append_to_response: 'trailers,images,keywords,credits',
        include_image_language: 'null',
    };

    // Do Find
    return this._tmdbQuery('movieInfo', findRequest);
};

/**
 * Recherche un film par rapport à un nom de fichier
 * @param filename nom du fichier
 * @return null ou themoviedb[] tableau d'information du film
 **/
Themoviedb.prototype.algo = function (filename) {
    // Analyse le nom du fichier
    var info = this._resolve(filename);

    // Si c'est une série on arrête là
    if (info.season || info.episode) throw new this.ItIsNotMovieException();

    // Si il n'y a pas de title, on ne peut pas faire de recherche, on arrête
    if (!info.title) throw new this.NoTitleFoundException();

    // Search movies
    var searchResult = this.search(info);

    // If 1 or many results ind more information about it
    if (!searchResult.total_results) throw new this.NoResultException();

    // On prend le premier
    var movieId = searchResult.results[0].id;

    // Get Good movie
    var movieInfo = this.find(movieId);

    // get movie info
    return movieInfo;
};

themoviedb = new Themoviedb();
