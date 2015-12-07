var config = require('../class/config.js');
var moviedb = require('moviedb');

const QUOTA_ERROR = 429;
const TIMEOUT_DURATION = 10000;

/**
 * Access to TheMovieDb.org API for search movie(s)
 * @class
 */
var TheMovieDb = function() {
    this.moviedb = moviedb(config.get('themoviedb.apikey'));
}

/**
 * Search movie information with TheMoviedb.org API
 * @param {string} [query]
 * @param {function} [callback] call when 1 or many movie's finded
 */
TheMovieDb.prototype.search = function(query, callback) {
    var t = this;
    console.log(t.moviedb);
    console.log("Search for querry : ", query);
    t.moviedb.searchMovie(
      {
        query: query,
        language: config.get('themoviedb.language','fr')
      },
      function(err,data){
        if(!err){
            callback(data);            
        }else{
            if(err.status==QUOTA_ERROR){
                setTimeout(function(){
                    t.search(query,callback);
                },TIMEOUT_DURATION);
            }            
        }        
      }
    );
};

/**
 * Find information about specifique movie
 * @param {integer} [id] Id of movie in TheMovieDb.org database
 * @param {function} [callback] call when 1 movie's finded                            
 */
TheMovieDb.prototype.find = function(id, callback) {
    var t = this;
    console.log("find for movie : ", id);
    t.moviedb.movieInfo(
      {
        id: id,
        language: config.get('themoviedb.language','fr'),
        append_to_response:'trailers,images,keywords'
      },
      function(err,data) {
        if(!err){
            callback(data);
        }else{
            if(err.status==QUOTA_ERROR){
                setTimeout(function(){
                    t.find(id,callback);
                },TIMEOUT_DURATION);
            }
        }
      }
    );   
};


TheMovieDb.prototype.configuration = function(callback){
    var t = this;
  t.moviedb.configuration(null,function(err,data){
    if(!err){
      callback(data);
    }else{
      if(err.status==QUOTA_ERROR){
        setTimeout(function(){
          t.configuration(callback);
        });
      }
    }
  });
};

module.exports = function() {
  return new TheMovieDb();
};