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
    console.log("hello !");
    Session.set('toggleTmdbBind',!Session.get('toggleTmdbBind'));
  }
});
