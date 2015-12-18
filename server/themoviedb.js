/**
 * Trigger when new movie insert in database
 * Observe all movies who don't have themoviedb object or don't have _nosearch tag
 * When new movie spawn, we start search in themoviedb api for get movie.
 **/
Movies
    .find({
        themoviedb: {$exists: false},
        _nosearch: {$exists: false}
    })
    .observe({
        added: function (item) {

            // Say to clients, we're searching movie
            ServerSession.set('loading.themoviedb', (ServerSession.get('loading.themoviedb') || 0) + 1);

            try {
                // Try get info about this movie
                var info = themoviedb.algo(item.filename);
                // If we get info without error, update in database
                Movies.update(item._id, {$set: {themoviedb: info}});

            } catch (e) {

                // If We can't find movie for natural reason, add _nosearch at item in collection
                if (e instanceof themoviedb.NoResultException || e instanceof themoviedb.ItIsNotMovieException || e instanceof themoviedb.NoTitleFoundException) {
                    Movies.update(item._id, {$set: {_nosearch: true}});
                }

            } finally {
                // Say to clients, we finish to search movie
                ServerSession.set('loading.themoviedb', (ServerSession.get('loading.themoviedb') || 1) - 1);
            }
        }
    });

Meteor.methods({

    /**
     * Search movies with TheMovieDb API
     * @param query : name of movie
     * @param requestCallback
     * @example
     * Meteor.call('tmdbSearch','Avatar',function(err,result){
   *  // err is isset when exception throwed
   *  // result = { page: 1, results: [...], total_results: 1, total_pages: 1 }
   * });
     **/
    tmdbSearch: function (query) {
        return themoviedb.search(query);
    },

    /**
     * Bind themoviedb info to movie in our database
     * @param _id : id of document
     * @param tmdb_id : id of movie in themoviedb api
     * @example
     * Meteor.call('tmdbBind','6dENH46Dq53bREJda',5643,function(err,result){
   *  // err isn't isset if all is ok
   * });
     **/
    tmdbBind: function (_id, tmdb_id) {
        var movieInfo = themoviedb.find(tmdb_id);
        if (movieInfo) {
            Movies.update(_id, {
                $set: {
                    themoviedb: movieInfo
                },
            });
        }
    },

    /**
     * Unbind themoviedb info in a movie document
     * @param _id : if of document
     * @example
     * Meteor.call('tmdbUnBind','6dENH46Dq53bREJda',function(err,result){
   *  // err isn't isset if all is ok
   * });
     **/
    tmdbUnBind: function (_id) {
        Movies.update(_id, {
            $unset: {
                themoviedb: null
            },
            $set: {
                _nosearch: true
            }
        });
    },
});
