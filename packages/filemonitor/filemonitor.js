var fm = Npm.require('fsmonitor');
var fs = Npm.require('fs');
var path = Npm.require('path');

Filemonitor = function(){
  // Currents sources
  this._sources = [];
  // Currents extensions
  this._extensions = [];
  // Watchers who watchs current sources
  this._watchers = [];
  // all callbacks
  this._subscribers = {
    create : [],
    update : [],
    delete : [],
  };
};

// Reload Sources and resync application with filesystem
Filemonitor.prototype.sources = function () {
  this.reloadSources();
  this.sync();
};

// Reload Extensions and resync application with filesystem
Filemonitor.prototype.extensions = function () {
  this.reloadExtensions();
  this.sync();
};

// Reload Sources&Extensions and resync application with filesystem
Filemonitor.prototype.both = function () {
  this.reloadSources();
  this.reloadExtensions();
  this.sync();
};

// Stop older sync, and start new one
Filemonitor.prototype.sync = function () {
  this.stop();
  this.start();
};

// Reload sources
Filemonitor.prototype.reloadSources = function(){
  var self = this;
  this._sources = [];
  Sources.find().fetch().forEach(function(source){
    if (source.source) self._sources.push(source.source);
  });
};

// Reload Extensions
Filemonitor.prototype.reloadExtensions = function(){
  var self = this;
  this._extensions = [];
  Extensions.find().fetch().forEach(function(extension){
    if (extension.extension) self._extensions.push(extension.extension.toLowerCase());
  });
};

// Start Syncronisation
Filemonitor.prototype.start = function () {
  var self = this;

  // Get current movie documents
  var movies = [];
  Movies
    .find({})
    .fetch()
    .forEach(function(movie){
      movies.push(new File(movie));
    });

  // Get current files
  var files = [];
  this._sources
    .forEach(function(source){
      if (fs.existsSync(source)) files = files.concat(self.list(source));
    });

  // fire create for each new movies
  files
    .filter(function(file){
      var already = false;
      movies.forEach(function(movie){
        if(file.path==movie.path) already = true;
      });
      return !already;
    })
    .forEach(function(newMovie){
      self.fire('create',newMovie);
    });

  // fire delete for each removed movies
  movies
    .filter(function(movie){
      var always = false;
      files.forEach(function(file){
        if(movie.path==file.path) always = true;
      });
      return !always;
    })
    .forEach(function(oldMovie){
      self.fire('delete',oldMovie);
    });



  // Watch sources
  this._sources
    .forEach(function(source){
      self.watch(source);
    });
};
Filemonitor.prototype.stop = function () {
  var self = this;

  // Unwatch all sources
  Object.keys(this._watchers)
    .forEach(function(watcherid){
      self.unwatch(watcherid);
    });
};

/**
 * Watch folder and fire create/update/delete when file is create/modified/removed
 * @param folder path of folder
**/
Filemonitor.prototype.watch = function(folder){
  var self = this;

  // Frist, unwatch it
  this.unwatch(folder);

  // Create watcher
  this._watchers[folder] = fm.watch(folder,{
    matches : function(relPath){
      var ext = path.extname(relPath).toLowerCase();
      return self._extensions.indexOf(ext) >= 0;
    },
    excludes : function(relPath){
      return false;
    }
  });

  // Bind watcher event, to filemonitor callbacks
  this._watchers[folder].on('change',Meteor.bindEnvironment(function(changes){

    // Added Files
    changes.addedFiles.forEach(function(file){
      self.fire('create',new File(path.join(folder,file)));
    });

    // Updated Files
    changes.modifiedFiles.forEach(function(file){
      self.fire('update',new File(path.join(folder,file)));
    });

    // Deleted Files
    changes.removedFiles.forEach(function(file){
      self.fire('delete',new File(path.join(folder,file)));
    });
  }));

};

// Unwatch folder
Filemonitor.prototype.unwatch = function(folder){
  if(this._watchers[folder]) this._watchers[folder].close();
};

/**
 * Return list of movies in folder (recursive)
 * @param folder : path of folder
 * @return array list of Model File
**/
Filemonitor.prototype.list = function(folder){
  var self = this;
  var files = [];
  var reader = fs.readdirSync(folder);
  reader.forEach(function(file){
    var realpath = path.join(folder,file);
    var info = fs.statSync(realpath);
    var extension = path.extname(file).toLowerCase();
    if(info.isDirectory()) files = files.concat(self.list(realpath));
    else if(info.isFile()){
      if(self._extensions.indexOf(extension)<0) return false;
      files.push(new File(realpath));
    }
  });
  return files;
};

/**
 * Can save function for callback her when file is create, update or delete
 * @param type : create / update / delete
 * @param fn : callback
 * @param context : scope of function
**/
Filemonitor.prototype.on = function(type,fn,context){
  if(typeof this._subscribers[type] == 'undefined') throw new Error(type+' is not real type');
  fn = typeof fn === 'function' ? fn : context[fn];
  this._subscribers[type].push({fn: fn, context: context || this});
};
/**
 * Call all callback when file is create, update or delete
 * @param type of callback
 * @param file : Model File
**/
Filemonitor.prototype.fire = function(type,file){
  if(typeof this._subscribers[type] == 'undefined') throw new Error(type+' is not real type');
  var i,max,subscribers;
  subscribers = this._subscribers[type];
  max = subscribers ? subscribers.length : 0;
  for(i=0;i<max;i++){
    subscribers[i].fn.call(subscribers[i].context,file);
  }
};

filemonitor = new Filemonitor();
