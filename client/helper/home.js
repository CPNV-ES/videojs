Template.home.helpers({
  openSources: function(){
    var hasSources = Sources.find({}).count() <= 0;
    var toggleSources = Session.get('toggleSources');

    return hasSources || toggleSources;
  }
});
