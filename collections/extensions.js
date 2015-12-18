Extensions = new Mongo.Collection("Extensions");

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

/**
 * Read properties file
 * @return {Object} Json parse object
 * @private
 */
Extensions.before.insert(function (userId, doc) {
    doc.createAt = Date.now();
    doc.updateAt = Date.now();
});

Extensions.before.update(function (userId, doc, fieldNames, modifier, options) {
    doc.updateAt = Date.now();
});

if (Meteor.isServer) {
    // Publish for all extensions (1 user per server)
    Meteor.publish('extensions', function () {
        return Extensions.find({});
    });
}
