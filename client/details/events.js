Template.details.events({
    'click .toggleTmdbBind': function(e){
    Session.set('toggleTmdbBind',!Session.get('toggleTmdbBind'));
  },
    'click .unbind': function(e){
    e.preventDefault();
    if(!confirm('Etes-vous sûr ?')) return false;
    var movie_id = this._id;
    Meteor.call('tmdbUnBind',movie_id,function(err,result){
      if(err) console.error("unbind error");
    });
  } ,
});
