var Movie = require('./model/movie.js');
var Algo = require('./service/algo.js');
var TheMovieDb = require('./service/themoviedb.js');
var Movies = require('./service/movies.js');
var Files = require('./service/files.js');
var Server = require('./service/server.js');

// TODO : DOC THIS
/**
 * Start the server and socket ...
 * @class
 */
var Engine = function(){
  var t = this;
  
  
  
/* ***************************************
** TheMovieDb
** ************************************ */
  this.themoviedb = TheMovieDb();
  
/* ***************************************
** Algo
** ************************************ */
  this.algo = Algo();	
  this.algo.when.need.searchMovie = function(title, callback){
    t.themoviedb.search(title,function(data){
      callback(data);
    });
  };
  this.algo.when.is.finded = function(cid, themoviedb_id) {
    var movie;
    console.log("movies search : ", cid);
    t.themoviedb.find(themoviedb_id,function(info) {
      movie = Movie({
        cid : cid,
        info : info
      });
      t.movies.update(movie);
    });
  };
  
/* ***************************************
** MOVIES
** ************************************ */
  this.movies = Movies();
  this.movies.when.is.created = function(movie){
    // Socket send
    t.server.socket.emit('movie',movie);
    // Search Algo movies
    t.algo.resolve(movie);
  };
  this.movies.when.is.updated = function(movie){
    // Socket send
    t.server.socket.emit('movie',movie);
  };
  this.movies.when.is.deleted = function(cid){
    // Socket send
    t.server.socket.emit('movie/delete',cid);
  };
  
/* ***************************************
** SERVER
** ************************************ */
  this.server = Server();
  this.server.when.is.loaded = function(ip,port){
    console.log('[SERVER] start on http://'+ip+':'+port);    
  };
  this.server.when.need.tmdbConfiguration = function(callback){
    t.themoviedb.configuration(function(configuration){
      callback(configuration);
    });
  };
  this.server.when.need.eachMovies = function(callback){
    t.movies.all().forEach(function(movie){
      callback(movie);
    });
  }
  
  
/* ***************************************
** FILES
** ************************************ */
  this.files = Files();
  this.files.when.is.created = function(movie){
    t.movies.create(movie);
  };
  this.files.when.is.deleted = function(movie){
    if(movie.cid<0){
      movie = t.movies.whereFirst(Movie({
        file : movie.file,
        path : movie.path
      }));
    }    
    t.movies.delete(movie);
  };
  // Start sync with actual database movies
  this.files.start(this.movies.all());
  
  
};
  
 
  


module.exports = function(){
	return new Engine();
};