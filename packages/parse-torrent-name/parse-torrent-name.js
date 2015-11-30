var ptn = Npm.require('parse-torrent-name');

torrentname = function(filename){
  var info = ptn(filename);
  if(info.title){
    info.title = info.title.replace(/\./g,' ').trim();
  }
  return info;
};
