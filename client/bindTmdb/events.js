Template.tmdbBind.events({

  'submit form': function(e){
    e.preventDefault();
    var search = e.target.search.value;
    if(!search) return false;

    Session.set('tmdbBindLoading',true);

    Meteor.call('tmdbSearch',search,function(err,result){
      if(err) return false;
      Session.set('tmdbBindResults',_.values(result.results));
      Session.set('tmdbBindLoading',false);
    });
  },

  'click ul li a': function(e){
    e.preventDefault();
    Session.set('tmdbBindId',this.id);
  },


  'click .bind': function(e){
    var tmdb_id = Session.get('tmdbBindId');
    var movie_id = this._id;

    if(!tmdb_id) return false;

    Meteor.call('tmdbBind',movie_id,tmdb_id,function(err,result){
      if(err) return false;
      Session.set('tmdbBindResults',[]);
      Session.set('tmdbBindLoading',false);
      Session.set('toggleTmdbBind',false);
      Session.set('tmdbBindId',null);
    });
  },

  'click .close': function(e){
    e.preventDefault();
    Session.set('tmdbBindResults',[]);
    Session.set('tmdbBindLoading',false);
    Session.set('toggleTmdbBind',false);
    Session.set('tmdbBindId',null);
  }
});
