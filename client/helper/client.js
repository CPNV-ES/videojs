Template.home.helpers({
  movies : function(){
    return Movies.find({},{sort: {themoviedb:{title:-1}}});
  }
});
