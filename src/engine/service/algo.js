// Require
var parsetorrent = require('parse-torrent-name');
var path = require('path');

/**
 * Search and find the good movie info
 * @class
 */
var Algo = function () {
};

// TODO : Doc this
// Callback functions
Algo.prototype.when = {
    is: {
        /**
         * Call when an movie is finded
         * @param {Integer} [cid] cid of database movie
         * @param {Integer} [theMovidbId] id of themoviedb movie
         */
        finded: function (cid, theMovidbId) {
        }
    },
    need: {
        /**
         * Call for search a movie
         * @param {String} movie title
         * @param {Function} callback When the movie is finded
         * @param {Array|Object} callback give the info
         *
         */
        searchMovie: function () {
        }
    }
};

/**
 * Search the movie, use the file name for finded.
 *
 * @param {Movie} [movie] Movie
 */
Algo.prototype.resolve = function (movie) {
    var t = this;

    if (movie.cid === null || movie.cid === undefined) {
        throw new Error("Algo : movie cid is empty or null", 010);
    }
    if (movie.file === null || movie.file === undefined) {
        throw new Error("Algo : movie file is empty or null", 010);
    }

    var parseResult = this.parseFileName(movie.file);

    if (parseResult.title) {
        t.when.need.searchMovie(parseResult.title, function (movieInfoList) {
            if (movieInfoList.results.total_results <= 0) return false;
            movieInfoList.results.forEach(function (movieInfo) {
                var release_year = new Date(movieInfo.release_date).getFullYear();
                if (release_year == parseResult.year){
                    console.log("finded movie : ", movieInfo.name);
                    //if(movieInfo.originalTitle.match(parseResult.title)){
                    if(parseResult.title.match(movieInfo.originalTitle)){
                        console.log("match movie : ", movieInfo.originalTitle + " for ", parseResult.title);
                    }
                    t.when.is.finded(movie.cid, movieInfo.id);
                }
            });
            if (movieInfoList.results.length == 1) t.when.is.finded(movie.cid, movieInfoList.results[0].id);
        });
    }
};

/**
 * Parse file name for extract data.
 * @param {String} [title] file name
 * @return {Object} Contains movie title, date ...
 */
Algo.prototype.parseFileName = function (title) {
    if (title === null || title === undefined) {
        throw new Error("Algo : file name is empty or null ", 011);
    }
    var titleWithoutExtension = path.basename(title, path.extname(title));
    return parsetorrent(titleWithoutExtension);
};

// Export
module.exports = function () {
    return new Algo();
};