var fm = Npm.require('fsmonitor');
var fs = Npm.require('fs');
var path = Npm.require('path');

Filemonitor = function(){
  this._sources = [];
  this._extensions = [];
  this._watchers = [];
  this._subscribers = {
    create : [],
    update : [],
    delete : [],
  };
};

Filemonitor.prototype.sources = function () {
  this.reloadSources();
  this.sync();
};

Filemonitor.prototype.extensions = function () {
  this.reloadExtensions();
  this.sync();
};
Filemonitor.prototype.both = function(sources,extensions){
  this.reloadSources();
  this.reloadExtensions();
  this.sync();
};

Filemonitor.prototype.sync = function(){
  this.stop();
  this.start();
};

Filemonitor.prototype.reloadSources = function(){
  var self = this;
  this._sources = [];
  Sources.find().fetch().forEach(function(source){
    if (source.source) self._sources.push(source.source);
  });
};
Filemonitor.prototype.reloadExtensions = function(){
  var self = this;
  this._extensions = [];
  Extensions.find().fetch().forEach(function(extension){
    if(extension.extension) self._extensions.push(extension.extension);
  });
};

Filemonitor.prototype.start = function () {
  var self = this;

  var movies = [];
  Movies.find({}).fetch().forEach(function(movie){
    movies.push(new File(movie));
  });

  var files = [];
  this._sources.forEach(function(source){
    files = files.concat(self.list(source));
  });

  // New One
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

  // Old One
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



  // Watch
  this._sources.forEach(function(source){
    self.watch(source);
  });
};
Filemonitor.prototype.stop = function () {
  var self = this;
  Object.keys(this._watchers).forEach(function(watcherid){
    self.unwatch(watcherid);
  });
};

Filemonitor.prototype.watch = function(folder){
  var self = this;
  this.unwatch(folder);

  this._watchers[folder] = fm.watch(folder,{
    matches : function(relPath){
      var ext = path.extname(relPath);
      return self._extensions.indexOf(ext) >= 0;
    },
    excludes : function(relPath){
      return false;
    }

  });

  this._watchers[folder].on('change',Meteor.bindEnvironment(function(changes){
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
Filemonitor.prototype.unwatch = function(folder){
  if(this._watchers[folder]) this._watchers[folder].close();
};

Filemonitor.prototype.list = function(folder){
  var self = this;
  var files = [];
  var reader = fs.readdirSync(folder);
  reader.forEach(function(file){
    var realpath = path.join(folder,file);
    var info = fs.statSync(realpath);
    var extension = path.extname(file);
    if(info.isDirectory()) files = files.concat(self.list(realpath));
    else if(info.isFile()){
      if(self._extensions.indexOf(extension)<0) return false;
      files.push(new File(realpath));
    }
  });
  return files;
};

Filemonitor.prototype.on = function(type,fn,context){
  if(typeof this._subscribers[type] == 'undefined') throw new Error(type+' is not real type');
  fn = typeof fn === 'function' ? fn : context[fn];
  this._subscribers[type].push({fn: fn, context: context || this});
};
Filemonitor.prototype.fire = function(type,File){
  if(typeof this._subscribers[type] == 'undefined') throw new Error(type+' is not real type');
  var i,max,subscribers;
  subscribers = this._subscribers[type];
  max = subscribers ? subscribers.length : 0;
  for(i=0;i<max;i++){
    subscribers[i].fn.call(subscribers[i].context,File);
  }
};

filemonitor = new Filemonitor();
