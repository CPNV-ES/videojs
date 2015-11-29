var fs = Npm.require('fs');
var path = Npm.require('path');

File = function(filename){
  this.path = '';
  this.filename = '';
  this.folder = '';


  if(typeof filename == 'object'){ // From database
    this.filename = filename.filename;
    this.folder = filename.folder;
    this.path = filename.path;
  }else if(typeof filename == 'string'){ // Direct pathname
    this.path = filename;
    this.folder = path.dirname(this.path);
    this.filename = path.basename(this.path);
  }
};
