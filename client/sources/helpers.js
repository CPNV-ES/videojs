Template.sources.helpers({
    sources: function () {
        return Sources.find({});
    },
    toggleShowFilename: function () {
        return Session.get('toggleShowFilename');
    },
    sourcesError: function () {
        return Session.get('sourcesError');
    },
    hasSources: function () {
        return (Sources.find({}).count() > 0);
    },
});
