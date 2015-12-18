Movies = new Mongo.Collection("Movies");

// we allow user to insert, update and remove all document in movies collection
Movies.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    },
});

// Hook : before insert, we join createAt & updateAt fields, with current date
Movies.before.insert(function (userId, doc) {
    doc.createAt = Date.now();
    doc.updateAt = Date.now();
});

// Hook : before update, we update updateAt field, with current date
Movies.before.update(function (userId, doc) {
    doc.updateAt = Date.now();
});

if (Meteor.isServer) {
    // Publish for all movies (1 user per server)
    Meteor.publish('movies', function () {
        return Movies.find({});
    });
    // Publish for 1 unique movie
    Meteor.publish('movie', function (id) {
        return Movies.find(id);
    });
}
