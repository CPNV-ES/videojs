/**
* This object represents a movie
* @property {Integer} [cid] Database primary key
* @property {String} [file] Filename of movie
* @property {String} [path] Filepath
* @property {Integer} [size] Size of movie file
* @property {Json} [info] TheMovieDb Informations
* @class
*/
var Movie = function(data){
	
	this.cid;
	this.file = '';
	this.path = '';
	this.size = 0;
	this.info = [];
    
	if(data.cid>=0) this.cid = data.cid;
	if(data.file) this.file = data.file;
	if(data.path) this.path = data.path;
	if(data.size) this.size = data.size;
	if(data.info) this.info = data.info;
};

/**
 * Convert Movie model to json array
 * @return {json}
 */
Movie.prototype.toJson = function(){
	var json = {};
	if(this.cid) json.cid = this.cid;
	if(this.file) json.file = this.file;
	if(this.path) json.path = this.path;
	if(this.size) json.size = this.size;
	if(this.info) json.info = this.info;
	return json;
};

/**
 * Check if the model is valid.
 * @return {boolean}
 */
Movie.prototype.isValid = function(){
	var isValid = true;
	if(!this.file) isValid=false;
	if(!this.path) isValid=false;
	return isValid;
};

module.exports = function(data){
	return new Movie(data);
};