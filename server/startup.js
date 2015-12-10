Meteor.startup(function(){

  // Get Sources
  var sources = [

       ];
  Sources.find().fetch().forEach(function(source){
    sources.push(source.source);
  });

  // Get Extensions
  var extensions = [];
  Extensions.find().fetch().forEach(function(extension){
    extensions.push(extension.extension);
  });

  // Start sync of files
  filemonitor.both(sources,extensions);
  
});
