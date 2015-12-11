Template.home.helpers({
  movies : function(){
    return Movies.find({},{$sort:{themoviedb:{title:-1}}});
  }
});


Template.movieTemplate.helpers({
  movie : function(){
    return Movies.find(this._id);
  }
});
