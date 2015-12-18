Package.describe({
  name: 'nolanrigo:filemonitor',
  version: '0.1.0',
  summary: '',
  git: '',
  documentation: 'README.md'
});

/**
 * Dependencies to npm modules
 * fsmonitor : watch filesystem
**/
Npm.depends({
  'fsmonitor': '0.2.4'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.addFiles('model/File.js',['server']);
  api.addFiles('filemonitor.js',['server']);
  api.export('filemonitor',['server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('nolanrigo:filemonitor');
  api.addFiles('filemonitor-tests.js',['server']);
});
