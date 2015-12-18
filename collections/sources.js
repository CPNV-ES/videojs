Sources = new Mongo.Collection("Sources");

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

Sources.before.insert(function (userId, doc) {
    doc.createAt = Date.now();
    doc.updateAt = Date.now();
});

Sources.before.update(function (userId, doc, fieldNames, modifier, options) {
    doc.updateAt = Date.now();
});

if (Meteor.isServer) {
    // Publish for all sources (1 user per server)
    Meteor.publish('sources', function () {
        return Sources.find({});
    });
}
