var moviedb = Npm.require('moviedb')(Meteor.settings.themoviedb.api_key || null);
var ptn = Npm.require('parse-torrent-name');
var path = Npm.require('path');

var Themoviedb = function(){};

/**
* Analyse le nom d'un fichier pour retirer les données
* @param filename Nom du fichier
* @dependences : parse-torrent-name
* @return : tableau retourné par le module parse-torrent-name avec quelques modifications
**/
Themoviedb.prototype.resolve = function(filename){
  // Remove extension of filename
  filename = path.basename(filename,path.extname(filename));
  // Get Information
  var info = ptn(filename);

  // 1. If title exist, replace . by space, and trim it.
  if(info.title) info.title = info.title.replace(/\./g,' ').trim();

  return info;
};

Themoviedb.prototype.NoResultException = function(){};
Themoviedb.prototype.ItIsNotMovieException = function(){};
Themoviedb.prototype.NoTitleFoundException = function(){};
Themoviedb.prototype.NoInternetException = function(){};
Themoviedb.prototype.InvalidApiKeyException = function(){};

Themoviedb.prototype.status = {
  INVALID_APIKEY : 401,
  SERVICE_OFFLINE : 503,
  SUSPENDED_APIKEY : 401,
  REQUEST_TIMEOUT : 504,
  QUOTA_ERROR : 429
};

Themoviedb.prototype.MoviedbCatch = function(e){
  switch(e.status){
    case this.status.QUOTA_ERROR:
      break;
    case this.status.INVALID_APIKEY:
    case this.status.SUSPENDED_APIKEY:
      throw new this.InvalidApiKeyException();
    case this.status.SERVICE_OFFLINE:
    case this.status.REQUEST_TIMEOUT:
      throw new NoInternetException();
    default:
      throw e;
  }
};

/**
* Wrap les méthodes asyncrone du module moviedb
**/
Themoviedb.prototype.moviedb = Async.wrap(moviedb,['searchMovie','movieInfo','configuration','requestToken']);

/**
* Recherche un film par rapport à un nom de fichier
* @param filename nom du fichier
* @return null ou themoviedb[] tableau d'information du film
**/
Themoviedb.prototype.info = function(filename){
  // Analyse le nom du fichier
  var info = this.resolve(filename);

  // Si c'est une série on arrête là
  if(info.season || info.episode) throw new this.ItIsNotMovieException();
  // Si il n'y a pas de title, on ne peut pas faire de recherche, on arrête
  if(!info.title) throw new this.NoTitleFoundException();

  // Construit la request de recherche
  var searchRequest = {
    query: info.title,
    language: Meteor.settings.themoviedb.language || 'fr'
  };
  if(info.year) searchRequest.year = info.year;

  // Effectue la recherche
  var searchResult;
  while(true){
    try{
      searchResult = this.moviedb.searchMovie(searchRequest);
      break;
    }catch(e){
      this.MoviedbCatch(e);
    }
  }

  // If 1 result no less no more, find more information about it
  if(searchResult.total_results<1) throw new this.NoResultException();

  // On prend le premier
  var movieId = searchResult.results[0].id;

  // Create request
  var infoRequest = {
    id: movieId,
    language: Meteor.settings.themoviedb.language || 'fr',
    append_to_response: 'trailers,images,keywords,credits'
  };

var movieInfo;
  while(true){
    try{
      movieInfo = this.moviedb.movieInfo(infoRequest);
      break;
    }catch(e){
      this.MoviedbCatch(e);
    }
  }

  // get movie info
  return movieInfo;
};

themoviedb = new Themoviedb();
