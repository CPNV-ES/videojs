var fsmonitor = require('fsmonitor');
var fs = require('fs');
var path = require('path');
var config = require('../class/config.js');
var Movie = require('../model/movie.js');

/**
*
*
*/
var Files;
Files = function(){
  this.sources = config.get('sources');
  this.extensions = config.get('extensions');
  
  this.configwatch;
  this.moviesmonitor = [];
}

// Callback
Files.prototype.when = {
	is : {
		created : function(movie){},
		deleted : function(movie){}
	}
};

// Recursive list of Movie, in directory
Files.prototype.recursiveListOfMovie = function(directory){
  var t = this;
  var files = [];
  
  // Get realPath of directory
  directory = fs.realpathSync(directory);
  
  // Read Directory
  var rDirectory = fs.readdirSync(directory);
  
  // Each file in this directory
  rDirectory.forEach(function(file){
    var fileInfo = fs.statSync(path.join(directory,file));
    var fileExtension = path.extname(file);
    if(fileInfo.isDirectory()) files = files.concat(t.recursiveListOfMovie(path.join(directory,file)));
    if(fileInfo.isFile()){
      if(t.extensions.indexOf(fileExtension)<0) return false;
      
      var newMovie = Movie({
        file : file,
        path : directory,
        size : fileInfo.size
      });
      
      files.push(newMovie);
    }
  });
  return files;
};

// Add source
Files.prototype.sourceAdd = function(source){
  var t = this; // This
  var realSource = fs.realpathSync(source); // Realpath of source
  
  if(this.moviesmonitor[source]) return false;
  
  var movies = t.recursiveListOfMovie(realSource);
  
  movies.forEach(function(movie){
    t.when.is.created(movie);
  });
  
  console.log('[SOURCE] '+source+' is added ('+movies.length+' movie(s) imported)');
  
  // Watch folder
  t.sourceWatch(source);  
};

// Remove source
Files.prototype.sourceRemove = function(source){
  var t = this; // This
  var realSource = fs.realpathSync(source); // Realpath of source
  
  if(!this.moviesmonitor[source]) return false;
  
  var movies = this.recursiveListOfMovie(realSource);
  
  movies.forEach(function(movie){
    t.when.is.deleted(movie);
  });
  
  console.log('[SOURCE] '+source+' is removed ('+movies.length+' movie(s) removed)');
  
  // Un Watch source
  this.sourceUnwatch(source);  
};

// Watch source
Files.prototype.sourceWatch = function(source){
  var t = this; // This
  var realSource = fs.realpathSync(source); // Source
  
  // If Already exist, stop
  if(this.moviesmonitor[source]) return false;
  
  // Start watch of source
  this.moviesmonitor[source] = fsmonitor.watch(realSource,{
    matches : function(relpath) {
      var ext = path.extname(relpath);
      return t.extensions.indexOf(ext)>=0;
    },
    excludes : function(relpath) {
      return false; 
    }    
  });
  
  // Event, when files created or deleted
  this.moviesmonitor[source].on('change',function(changes){
    
    changes.addedFiles.forEach(function(filename){
      var fullPath = path.join(realSource,filename);
      var info = fs.statSync(fullPath);
      var movie = Movie({
        file : path.basename(fullPath),
        path : path.dirname(fullPath),
        size : info.size
      });
      t.when.is.created(movie);
    });
    
    changes.removedFiles.forEach(function(filename){
      var fullPath = path.join(realSource,filename);
      var movie = Movie({
        file : path.basename(fullPath),
        path : path.dirname(fullPath)
      });
      t.when.is.deleted(movie);
    });
    
  });
  
  console.log('[SOURCE] '+source+' is watched');  
};

// Unwatch source
Files.prototype.sourceUnwatch = function(source){
  var t = this; // This
  
  // If source's watcher doesn't exist, stop
  if(!this.moviesmonitor[source]) return false;
  
  // Unwatch fsmonitor
  this.moviesmonitor[source].close();
  // Delete item of array
  delete this.moviesmonitor[source];
  
  console.log('[SOURCE] '+source+' is unwatched');  
};
// Sync source
Files.prototype.sourceSync = function(movies){
  var t = this; // This;
  var files = []; // Files;
  
  // Get all files from all soures
  t.sources.forEach(function(source){
    source = fs.realpathSync(source);
    files = files.concat(t.recursiveListOfMovie(source));
  });
  
  // Add new files
  files
  .filter(function(fmovie){
    var already = false;
    movies.forEach(function(dmovie){
      if(fmovie.file == dmovie.file && fmovie.path == dmovie.path) already = true;
    });
    return !already;
  })
  .forEach(function(movie){
    t.when.is.created(movie);
  });
  
  // Remove old files
  movies
  .filter(function(dmovie){
    var always = false;
    files.forEach(function(fmovie){
      if(dmovie.file == fmovie.file && dmovie.path == fmovie.path) always = true;
    });
    return !always;
  })
  .forEach(function(movie){
    t.when.is.deleted(movie);
  });
  
  console.log('[SOURCE] source are syncronised');  
};

Files.prototype.start = function(movies){
  var t = this; // This
  
  this.sources = config.get('sources'); // Sources
  this.extensions = config.get('extensions'); // Extensions
  
  // Sync each source
  this.sourceSync(movies);
  
  // Watch all current source
  this.sources.forEach(function(source){
      t.sourceWatch(source);
  });
  
  // Watch config file
  this.configwatch = fs.watchFile(fs.realpathSync(config.file),function(curr,prev){
    var newSources = config.get('sources'); // Get new source
    var newExtensions = config.get('extensions'); // Get new extenwsion

    // Remove old Source
    t.sources.filter(function(source){
      return newSources.indexOf(source)<0;
    }).forEach(function(source){
      t.sourceRemove(source);
    });
    
    // add new Source
    newSources.filter(function(source){
      return t.sources.indexOf(source)<0;
    }).forEach(function(source){
      t.sourceAdd(source);
    });

   

    // Asign new value to sources and extensions
    t.sources = newSources;
    t.extensions = newExtensions;
  });
  
}

module.exports = function(movies){
	return new Files(movies);
}