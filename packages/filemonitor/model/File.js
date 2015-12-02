var fs = Npm.require('fs');
var path = Npm.require('path');

File = function(filename){
  this.path = '';
  this.filename = '';
  if(typeof filename == 'object'){ // From database
    this.path = filename.path;
    this.filename = filename.filename;
  }else if(typeof filename == 'string'){ // Direct pathname
    this.path = filename;
    this.filename = path.basename(this.path,path.extname(this.path));
  }

};
