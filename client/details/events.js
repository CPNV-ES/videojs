Template.details.events({
    // Displays the bind window if return true.
    'click .toggleTmdbBind': function () {
        Session.set('toggleTmdbBind', !Session.get('toggleTmdbBind'));
    },
    // unbind the movie
    'click .unbind': function (e) {
        e.preventDefault();
        if (!confirm('Etes-vous sûr ?')) return false;
        var movie_id = this._id;
        // Call server function for unbind the movie
        Meteor.call('tmdbUnBind', movie_id, function (err, result) {
            if (err) console.error("unbind error");
        });
    },
});
