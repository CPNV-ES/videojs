// When movies added in collection without themoviedb information (and with no _nosearch tag), research
Movies
.find({
  themoviedb: {$exists:false},
  _nosearch: {$exists:false}
})
.observe({
  added : function(item){
    try{
      var info = themoviedb.info(item.filename);
      Movies.update(item._id,{$set : {themoviedb : info}});
    }catch(e){
      if(e instanceof themoviedb.NoResultException || e instanceof themoviedb.ItIsNotMovieException || e instanceof themoviedb.NoTitleFoundException){
        Movies.update(item._id,{$set:{_nosearch:true}});
      }
    }
  }
});
