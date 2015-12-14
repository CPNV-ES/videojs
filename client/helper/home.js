Template.home.helpers({
  movies: function(){
    return Movies.find({});
  },
  openSources: function(){
    var hasSources = Sources.find({}).count() <= 0;
    var toggleSources = Session.get('toggleSources');

    return hasSources || toggleSources;
  }
});
