Template.detailsNoTmdb.events({
  'click .toggleTmdbBind': function(e){
    Session.set('toggleTmdbBind',!Session.get('toggleTmdbBind'));
  },
});
