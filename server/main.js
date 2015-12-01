filemonitor.on('create',function(file){
  // Création de l'entrée dans la collection
  Movies.insert(file);
});
filemonitor.on('delete',function(file){
  // Supression de l'entrée dans la collection
  Movies.remove(file);
});

Movies
.find({
  updateAt: {$gt : Date.now()}
})
.observe({
  added : function(item){
    // Il n'y a pas de themoviedb on lance la recherche
    if(!item.themoviedb){
      var info = themoviedb.info(item.filename);
      if(info){
        Movies.update(item._id,{
          $set : {
            themoviedb : info
          }
        });
      }
    }
  }
});

Meteor.startup(function(){
  var sources = [];
  Sources.find().fetch().forEach(function(source){
    sources.push(source.source);
  });
  var extensions = [];
  Extensions.find().fetch().forEach(function(extension){
    extensions.push(extension.extension);
  });
  filemonitor.both(sources,extensions);
});
