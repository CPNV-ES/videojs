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
    // return the value for the toggle bind.
    // if the value is true, he display de popin.
    toggleTmdbBind: function(){
      return Session.get('toggleTmdbBind');
    }
});
