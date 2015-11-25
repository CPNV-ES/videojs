filemonitor.on('create',function(file){
  console.log('create',file);
});
filemonitor.on('update',function(file){
  console.log('update',file);
});
filemonitor.on('delete',function(file){
  console.log('delete',file);
});

// Get Sources
var sources = [];
Sources.find().fetch().forEach(function(source){
  sources.push(source.source);
});

var extensions = [];
Extensions.find().fetch().forEach(function(extension){
  extensions.push(extension.extension);
});

// Start
filemonitor.both(sources,extensions);

// watch
Sources.find().observeChanges({
  added: function(){
    console.log('added');
  },
  removed: function(){
    console.log('removed');
  }
});
