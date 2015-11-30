filemonitor.on('create',function(file){

  // Ajout du torrentname
  file.torrent = torrentname(file.filename);

  // Création de l'entrée dans la collection
  Movies.insert(file);
});
filemonitor.on('delete',function(file){
  // Supression de l'entrée dans la collection
  Movies.remove(file);
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
