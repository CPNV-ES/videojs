Template.sources.events({
    // Update the source list
    "submit form": function (e) {
        e.preventDefault();
        var source = e.target.source;

        if (!source.value) return false;

        Meteor.call('folderIsValid', source.value, function (err, isFolder) {
            if (isFolder) {
                Sources.insert({
                    source: source.value
                });
                Session.set('sourcesError', null);
                source.value = '';
            } else {
                Session.set('sourcesError', 'Ce n\'est pas un répertoire valide, veuillez réessayer');
            }
        });
    },
    // remove source file path
    'click ul li .delete': function (e) {
        e.preventDefault();
        Sources.remove(this._id);
    },
    'click .close': function (e) {
        e.preventDefault();
        Session.set('toggleSources', false);
    },
    // Hide the movie not found
    'change #toggleShowFilename': function (e) {
        var toggle = e.target.checked;
        Session.set('toggleShowFilename', toggle);
    },
});
