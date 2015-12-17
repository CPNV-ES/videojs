Movies
.find({
  themoviedb: {$exists:false},
  _nosearch: {$exists:false}
})
.observe({
  added : function(item){

    // Say to clients, we're searching movie
    ServerSession.set('loading.themoviedb',(ServerSession.get('loading.themoviedb') || 0)+1);

    try {
      // Try get info
      var info = themoviedb.algo(item.filename);
      // If we get info without error, update in database
      Movies.update(item._id,{$set : {themoviedb : info}});

    } catch (e) {

      // If We can't find movie for natural reason, add _nosearch at item in collection
      if(e instanceof themoviedb.NoResultException || e instanceof themoviedb.ItIsNotMovieException || e instanceof themoviedb.NoTitleFoundException){
        Movies.update(item._id,{$set:{_nosearch:true}});
      }

    } finally {
      // Say to clients, we finish to search movie
      ServerSession.set('loading.themoviedb',(ServerSession.get('loading.themoviedb') || 1)-1);
    }
  }
});



Meteor.methods({
  // Method for search by interface
  tmdbSearch: function (query) {
    return themoviedb.search(query);
  },
  // Method for bind themoviedb at our movie
  tmdbBind: function (_id, tmdb_id) {
    var movieInfo = themoviedb.find(tmdb_id);
    if(movieInfo){
      Movies.update(_id,{
        $set: {
          themoviedb: movieInfo
        },
      });
    }
  },
  tmdbUnBind: function (_id) {
    Movies.update(_id,{
      $unset: {
        themoviedb : null
      },
      $set : {
        _nosearch : true
      }
    });
  },
});
