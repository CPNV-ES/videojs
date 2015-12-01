Movies
  .find({
    updateAt: {$gt : Date.now()}
  })
  .observe({
    added : function(item){
      // Il n'y a pas de themoviedb on lance la recherche
      if(!item.themoviedb){
        var info = themoviedb.info(item.filename);
        if(info) Movies.update(item._id,{$set : {themoviedb : info}});
      }
    }
  });
