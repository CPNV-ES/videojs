try{
  var moviedb = Npm.require('moviedb')(Meteor.settings.themoviedb.api_key);
}catch(e){
  console.error(e);
}
var ptn = Npm.require('parse-torrent-name');

var Themoviedb = function(){
};

Themoviedb.prototype.resolve = function(filename){
  var info = ptn(filename);
  if(info.title)
    info.title = info.title.replace(/\./g,' ').trim();
  return info;
};

Themoviedb.prototype.moviedb = Async.wrap(moviedb,['searchMovie','movieInfo','configuration','requestToken']);

Themoviedb.prototype.info = function(filename){
  var info = this.resolve(filename);

  // Search
  var searchResult = this.moviedb.searchMovie({
      query: info.title,
      language: Meteor.settings.themoviedb.api_key || 'fr'
  });

  // If 1 result no less no more, find more information about it
  if(searchResult.total_results<1) return null;

  var movieId = searchResult.results[0].id;

  var movieInfo = this.moviedb.movieInfo({
    id: movieId,
    language: Meteor.settings.themoviedb.api_key || 'fr',
    append_to_response: 'trailers,images,keywords,credits'
  });

  // get movie info
  return movieInfo;
};

themoviedb = new Themoviedb();
