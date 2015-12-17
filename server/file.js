/**
 * Manage all create update delete file from the client folder.
 * @namespace server/themovidb
 *
 */
/**
 * Create new file in the database
 * @param {String} [file] File path
 * @memberof server/themovidb
 * @method create
 * @public
 */
 filemonitor.on('create',function(file){
  Movies.insert(file);
});
// Supression de l'entrée dans la collection Movies

filemonitor.on('delete',function(file){
  Movies.remove(file);
});

// When sources (just new sources) is created, start sync.
Sources.find({
  updateAt: {
    $gt: Date.now()
  }
}).observe({
  added: function(){ filemonitor.sources(); },
});
// When sources is deleted or updated, start sync.
Sources.find({}).observe({
  removed: function(){ filemonitor.sources(); },
  changed: function(){ filemonitor.sources(); },
});

// When extensions (just new extensions) is created, start sync.
Extensions.find({
  updateAt: {
    $gt: Date.now()
  }
}).observe({
  added: function(){ filemonitor.extensions(); },
});
// When extensions is deleted or updated, start sync.
Extensions.find({}).observe({
  removed: function(){ filemonitor.extensions(); },
  changed: function(){ filemonitor.extensions(); },
});

// When Meteor start synchronise filemonitor with filesystem
Meteor.startup(function(){
  filemonitor.both();
});

/**
* Verifiy if path is a folder in server filesystem
* @param path : path of folder
* @return : true if it's folder, false if it's not
*/
Meteor.methods({
  folderIsValid: function (path) {
      try {
        var realPath = fs.realpathSync(path);
        var info = fs.statSync(realPath);
        return info.isDirectory();
      } catch (e) {
        return false;
      }
  }
});
