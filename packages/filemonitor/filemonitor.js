var fm = Npm.require('filemonitor');

Filemonitor = function(){
  console.log('salut');
};

Filemonitor.prototype.watch = function(path){

};
Filemonitor.prototype.unwatch = function(path){

};

filemonitor = new Filemonitor();

console.log(filemonitor);
