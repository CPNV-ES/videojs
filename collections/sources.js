Sources = new Mongo.Collection("Sources");

// We allow user to insert, update and remove all document in extensions collection
Sources.allow({
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

// Hook : before insert, we join createAt & updateAt fileds, with current date
Sources.before.insert(function (userId, doc) {
    doc.createAt = Date.now();
    doc.updateAt = Date.now();
});

// Hook : before update, we update updateAt field, with current date
Sources.before.update(function (userId, doc) {
    doc.updateAt = Date.now();
});

if (Meteor.isServer) {
    // Publish for all sources (1 user per server)
    Meteor.publish('sources', function () {
        return Sources.find({});
    });
}
