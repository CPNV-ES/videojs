// Création de l'entrée dans la collection Movies
filemonitor.on('create',function(file){
  Movies.insert(file);
});
// Supression de l'entrée dans la collection Movies
filemonitor.on('delete',function(file){
  Movies.remove(file);
});

// When source added, removed or changed -> reload filemonitor
Sources.find({
  updateAt: {
    $gt: Date.now()
  }
}).observe({
  added: function(){ filemonitor.sources(); },
  removed: function(){ filemonitor.sources(); },
  changed: function(){ filemonitor.sources(); }
});

// When extension added, removed or changed -> reload filemonitor
Extensions.find({
  updateAt: {
    $gt: Date.now()
  }
}).observe({
  added: function(){ filemonitor.extensions(); },
  removed: function(){ filemonitor.extensions(); },
  changed: function(){ filemonitor.extensions(); }
});

// When Meteor start synchronise filemonitor with filesystem
Meteor.startup(function(){
  filemonitor.both();
});
