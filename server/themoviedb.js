// When movies added in collection without themoviedb information (and with no _nosearch tag), research
Movies
.find({
  themoviedb: {$exists:false},
  _nosearch: {$exists:false}
})
.observe({
  added : function(item){
    try{
      var info = themoviedb.algo(item.filename);
      Movies.update(item._id,{$set : {themoviedb : info}});
    }catch(e){
      if(e instanceof themoviedb.NoResultException || e instanceof themoviedb.ItIsNotMovieException || e instanceof themoviedb.NoTitleFoundException){
        Movies.update(item._id,{$set:{_nosearch:true}});
      }
    }
  }
});



Meteor.methods({
  // Method for search
  tmdbSearch: function (query) {
    return themoviedb.search(query);
  },
  tmdbBind: function (_id, tmdb_id) {
    var movieInfo = themoviedb.find(tmdb_id);
    if(movieInfo){
      Movies.update(_id,{
        $set: {
          themoviedb: movieInfo
        },
      });
    }
  }
});
