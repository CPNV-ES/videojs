filemonitor.on('create',function(file){
  console.log('create',file);
});
filemonitor.on('update',function(file){
  console.log('update',file);
});
filemonitor.on('delete',function(file){
  console.log('delete',file);
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
