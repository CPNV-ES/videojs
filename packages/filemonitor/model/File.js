var fs = Npm.require('fs');
var path = Npm.require('path');

File = function(filename){
  this.path = '';
  this.filename = '';
  this.folder = '';

  // From database
  if(typeof filename == 'object'){
    this.filename = filename.filename;
    this.folder = filename.folder;
    this.path = path.join(this.folder,this.filename);
  }

  if(typeof filename == 'string'){

  }
};


File.prototype.toJson = function(){

};
