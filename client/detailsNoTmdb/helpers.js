Template.detailsNoTmdb.helpers({
  // Return the value of the session parameters toggleTmdbBind
  // this is used for hide the popin
  toggleTmdbBind: function(){
    return Session.get('toggleTmdbBind');
  },
});
