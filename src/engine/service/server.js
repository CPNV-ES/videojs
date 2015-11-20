var socket = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var config = require('../class/config.js');

var Server;
Server = function(){
  var t = this;
  
  this.ip = config.get('server.ip','127.0.0.1');
  this.port = config.get('server.port','1337');
  this.www = config.get('server.www');
  
  // Init server
  this.express = express();
  this.http = http.Server(this.express);
  this.socket = socket(this.http);
  
  // Express Server
  this.express.use(express.static(fs.realpathSync(this.www)));
  
  // Socket Server
  this.socket.on('connection',function(socket){
    console.log('new connection socket');
    
    // Emit all movies
    t.when.need.eachMovies(function(movie){
      socket.emit('movie',movie.toJson());
    });
    
    // Emit configuration
    t.when.need.tmdbConfiguration(function(configuration){
      socket.emit('configuration',configuration);
    });   
    
  });
  
  // Run Server
  this.http.listen(this.port,this.ip,function(){
    t.when.is.loaded(t.ip,t.port);
  });
  
};

Server.prototype.when = {
  is : {
    loaded : function(ip,port){}
  },
  need : {
    tmdbConfiguration : function(){},
    eachMovies : function(callback){}
  }
};

module.exports = function(){
  return new Server();
};