Template.detailsNoTmdb.events({
  // Displays the bind window if return true.
  'click .toggleTmdbBind': function(e){
    Session.set('toggleTmdbBind',!Session.get('toggleTmdbBind'));
  },
});
