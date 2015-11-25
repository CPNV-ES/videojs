var fm = Npm.require('fsmonitor');
var fs = Npm.require('fs');
var path = Npm.require('path');

Filemonitor = function(){
  this.sources = [];
  this.extensions = [];
  this.watchers = [];
  this.subscribers = {
    create : [],
    update : [],
    delete : [],
  };
};

Filemonitor.prototype.sources = function (sources) {
  this.both(sources,this.extensions);
};
Filemonitor.prototype.extensions = function (extensions) {
  this.both(this.sources,this.extensions);
};
Filemonitor.prototype.both = function(sources,extensions){
  this.stop();
  this.sources = sources;
  this.sources.forEach(function(source){
    source = fs.realpathSync(source);
  });
  this.extensions = extensions;
  this.start();
};

Filemonitor.prototype.start = function () {
  var self = this;

  // Lister les fichiers,
  // Faire la différences avec ceux existents dans la base de donnée
  // Créer, Supprimer, Modifier les fichiers
  // Lancer le watch sur les dossiers
  this.sources.forEach(function(source){
    self.watch(source);
  });
};
Filemonitor.prototype.stop = function () {
  Object.keys(this.watchers).forEach(function(watcherid){
    this.unwatch(watcherid);
  });
};

Filemonitor.prototype.watch = function(folder){
  var self = this;
  this.unwatch(folder);

  this.watchers[folder] = fm.watch(folder,{
    matches : function(relPath){
      var ext = path.extname(relPath);
      return self.extensions.indexOf(ext) >= 0;
    },
    excludes : function(relPath){
      return false;
    }

  },function(changes){

    // Added Files
    changes.addedFiles.forEach(function(file){
      self.fire('create',path.join(folder,file));
    });

    // Updated Files
    changes.modifiedFiles.forEach(function(file){
      self.fire('update',path.join(folder,file));
    });

    // Deleted Files
    changes.removedFiles.forEach(function(file){
      self.fire('delete',path.join(folder,file));
    });

  });
};
Filemonitor.prototype.unwatch = function(folder){
  if(this.watchers[folder]) this.watchers[folder].close();
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
      if(self.extensions.indexOf(extension)<0) return false;
      files.push(realpath);
      self.fire('create',file);
    }
  });
  return files;
};

Filemonitor.prototype.on = function(type,fn,context){
  if(typeof this.subscribers[type] == 'undefined') throw new Error(type+' is not real type');
  fn = typeof fn === 'function' ? fn : context[fn];
  this.subscribers[type].push({fn: fn, context: context || this});
};
Filemonitor.prototype.fire = function(type,File){
  if(typeof this.subscribers[type] == 'undefined') throw new Error(type+' is not real type');
  var i,max,subscribers;
  subscribers = this.subscribers[type];
  max = subscribers ? subscribers.length : 0;
  for(i=0;i<max;i++){
    subscribers[i].fn.call(subscribers[i].context,File);
  }
};

filemonitor = new Filemonitor();