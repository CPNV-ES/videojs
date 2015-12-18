Extensions = new Mongo.Collection("Extensions");

// We allow user to insert, update and remove all document in extensions collection
Extensions.allow({
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
Extensions.before.insert(function (userId, doc) {
    doc.createAt = Date.now();
    doc.updateAt = Date.now();
});

// Hook : before update, we update updateAt field, with current date
Extensions.before.update(function (userId, doc) {
    doc.updateAt = Date.now();
});

if (Meteor.isServer) {
    // Publish for all extensions (1 user per server)
    Meteor.publish('extensions', function () {
        return Extensions.find({});
    });
}
