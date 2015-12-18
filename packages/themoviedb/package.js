Package.describe({
  name: 'nolanrigo:themoviedb',
  version: '0.1.0',
  summary: 'Packages for do request api to themoviedb',
  git: '',
  documentation: 'README.md'
});

/**
 * Dependencies to npm modules
 * moviedb : do request to themoviedb API
 * parse-torrent-name : parse name of movie file
**/
Npm.depends({
  'moviedb': '0.2.2',
  'parse-torrent-name': '0.5.4'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('meteorhacks:async',['server']);
  api.addFiles('themoviedb.js',['server']);
  api.export('themoviedb',['server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('nolanrigo:themoviedb');
  api.addFiles('themoviedb-tests.js',['server']);
});
