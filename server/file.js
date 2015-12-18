/**
 * Trigger when new file is detected on filesystem
 * Insert file in movies collection
 **/
filemonitor.on('create', function (file) {
    Movies.insert(file);
});

/**
 * Trigger when file is removed on filesystem
 * Removed movie in movies collection
 **/
filemonitor.on('delete', function (file) {
    Movies.remove(file);
});

// Observe new sources (just new one), each times source is created, restart sync of filesystem
Sources
    .find({
        updateAt: {$gt: Date.now()}
    })
    .observe({
        added: function () {
            filemonitor.sources();
        },
    });

// Observe sources, each times source is updated or removed, restart sync of filesystem
Sources
    .find({})
    .observe({
        removed: function () {
            filemonitor.sources();
        },
        changed: function () {
            filemonitor.sources();
        },
    });

// Observe new extensions (just new one), each times extension is created, restart sync of filesystem
Extensions
    .find({
        updateAt: {$gt: Date.now()}
    })
    .observe({
        added: function () {
            filemonitor.extensions();
        },
    });

// Observe extensions, each times extension is updated or removed, restart sync of filesystem
Extensions.find({}).observe({
    removed: function () {
        filemonitor.extensions();
    },
    changed: function () {
        filemonitor.extensions();
    },
});

// start sync of filesystem when Meteor startup
Meteor.startup(function () {
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
    },
});
