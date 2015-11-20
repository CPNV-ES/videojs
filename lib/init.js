// Init TheMovieDb.api_key
if(!Meteor.settings.themoviedb.api_key) throw new Error('No api_key setted in settings.themoviedb.api_key');
themoviedb.api_key = Meteor.settings.themoviedb.api_key;

// Files
