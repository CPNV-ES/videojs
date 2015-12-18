Template.tmdbBind.events({
    'submit form': function (e) {
        e.preventDefault();

        // Get Value of search input
        var search = e.target.search.value;

        // If value is null, stop
        if (!search) return false;

        // Say at interface we're loading data
        Session.set('tmdbBindLoading', true);

        Meteor.call('tmdbSearch', search, function (err, result) {
            if (err) return false;
            // Save results for search
            Session.set('tmdbBindResults', _.values(result.results));
            // Say at interface we've finish to load data
            Session.set('tmdbBindLoading', false);
        });
    },
    'click ul li a': function (e) {
        e.preventDefault();
        // We want bind this movie
        Session.set('tmdbBindId', this.id);
    },
    'click .bind': function (e) {
        // Id of movie in themoviedb API
        var tmdb_id = Session.get('tmdbBindId');
        // Id of document
        var movie_id = this._id;

        // IF we don't have id of themoviedb, stop
        if (!tmdb_id) return false;

        // bind themoviedb information to document.
        Meteor.call('tmdbBind', movie_id, tmdb_id, function (err, result) {
            if (err) return false;
            // We want close bind interface, clear all var
            Session.set('tmdbBindResults', []);
            Session.set('tmdbBindLoading', false);
            Session.set('toggleTmdbBind', false);
            Session.set('tmdbBindId', null);
        });
    },
    'click .close': function (e) {
        e.preventDefault();
        // We want close bind interface, clear all var
        Session.set('tmdbBindResults', []);
        Session.set('tmdbBindLoading', false);
        Session.set('toggleTmdbBind', false);
        Session.set('tmdbBindId', null);
    },
});
