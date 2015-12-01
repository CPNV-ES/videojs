// Création de l'entrée dans la collection Movies
filemonitor.on('create',function(file){
  Movies.insert(file);
});
// Supression de l'entrée dans la collection Movies
filemonitor.on('delete',function(file){
  Movies.remove(file);
});
