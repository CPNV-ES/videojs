Template.details.helpers({
    isNotNull : function(value){
        return value != null;
    },
    starcalcul: function(){
        return this.themoviedb.vote_average*100/10;
    },
    startotal: function(){
        return this.themoviedb.vote_average/2;
    },
    toggleTmdbBind: function(){
      return Session.get('toggleTmdbBind');
    }
});

Template.details.events({
  'click .toggleTmdbBind': function(e){
    Session.set('toggleTmdbBind',!Session.get('toggleTmdbBind'));
  },
  'click .unbind': function(e){
    e.preventDefault();
    var movie_id = this._id;
    Meteor.call('tmdbUnBind',movie_id,function(err,result){
      if(err) console.error("unbind error");
    });
  },
});
