// Module name : movies
// Description : interface entre l'application et la base de donnée

// Require
var Locallydb = require('locallydb'); // Database
var config = require('../class/config.js'); // Application Configuration
var Movie = require('../model/movie.js'); // Movie Model

/**
 * Create, update, delete Movie object in the database.
 * @class
 */
var Movies = function(){
	this.db = new Locallydb(config.get('database.path'));
	this.movies = this.db.collection('movies');
};

Movies.prototype.when = {
	is : {
		created : function(){},
		updated : function(){},
		deleted : function(){}
	}
};  

/**
 * Get all movies from the database.
 * @return {Movie[]} [] Movie list.
 */
Movies.prototype.all = function(){
	if(this.movies === null || this.movies === undefined){
		throw new Error("Movies : movies list is null or undefinded", 200);
	}
	var moviesList = [];
	this.movies.items.forEach(function(moviedata){
		moviesList.push(Movie(moviedata));
	});
	return moviesList;
};

/**
 * Get one movies with the cid id.
 * @param {String} [cid] Primmary key of the database
 * @returns {null|Movie} return null if no movie found or return one movie.
 */
Movies.prototype.get = function(cid){
	if(cid === null || cid === undefined || cid < 0){
		throw new Error("Movies : invalid cid ", cid);
	}
	// Get movie :
	var moviedata = this.movies.get(cid);
    
    // No movies found
	if(!moviedata){
		return null;
	}else{
		return Movie(moviedata);
	}
};

/**
 * Insert to the database an valide movie object.
 * @param  {Movie} [movie] Movie object
 * @returns {Movie}
 */
// TODO: Check for return object or boolean ...
Movies.prototype.create = function(movie){
    
	movie = this.moviesObjectTransformer(movie);

	// Check the validity of the movie object.
	if(!movie.isValid()){
		var msg = "Movies : Invalid movie object : ";
		console.error(msg, movie);
		throw new Error(msg, movie);
	}

	// Insert and get cid
	var cid = this.movies.insert(movie.toJson());

	var newMovie = this.get(cid);
  
	// Call callback for created movie
	this.when.is.created(newMovie);

	return newMovie;
};

/**
 * Update the movie object
 * @param movie
 * @return {boolean} true if success
 */
Movies.prototype.update = function(movie){

	movie = this.moviesObjectTransformer(movie);

	if(!this.movies.update(movie.cid,movie.toJson())){
		console.error("Movies : can't update your movie ", movie);
		return false;
	}
    
	// Call callback for updated movie
	this.when.is.updated(this.get(movie));

	return true;
};

/**
 * Search movie with multiples conditions
 * @param {Movie[]} Searched Movie model or json array
 * @return {Movie[]} Movie list or empty array if no result
 */
Movies.prototype.where = function(where){
    var where = (typeof where == Movie)? where.toJson() : where;    
    var moviesdata = this.movies.where(where);
    for(var i = moviesdata.length-1;i==0;i--){
        moviesdata[i] = this.moviesObjectTransformer(moviesdata[i]);
    }
    return moviesdata;    
};

/**
 * Search one movie with multiples conditions
 * @param {Movie} Searched Movie model or json array
 * @return {Movie | null}
 */
Movies.prototype.whereFirst = function(where){
    var movies = this.where(where);
    if(movies.length>0) return Movie(movies[0]);
    else null;
};

/**
 * Remove the movie object from the database
 * @param movie : Use the cid for remove them.
 * @returns {boolean} true if success
 */
Movies.prototype.delete = function(movie){

	movie = this.moviesObjectTransformer(movie);

	// Remove movie / return false if no movie deleted
	if(!this.movies.remove(movie.cid)){
		return false;
	}
	// Call when.is.detele
	this.when.is.deleted(movie.cid);

	return true;
};

/**
 * Give some object (from json ...) and transform to movie object
 * @param movie
 * @return Movie object
 */
Movies.prototype.moviesObjectTransformer = function(movie){
	if(movie === null || movie === undefined){
		throw new Error("Movies : the movie object is empty or undefined");
	}
    return (typeof movie == Movie)? movie : Movie(movie);
};

module.exports = function(){
    return new Movies();
};