Template.home.helpers({
    movies: function () {
        var movies = null;
        var andQuerry = [];
        var title = Session.get("querytitle");
        var crew = Session.get("querycrew");
        var cast = Session.get("querycast");
        var genre = Session.get("queryGenre");

        if (title !== null && title !== undefined && title.length > 0) {
            andQuerry.push({'themoviedb.title': {$regex: title, $options: 'gi'}});
        }
        if (crew !== null && crew !== undefined && crew.length > 0) {
            andQuerry.push({'themoviedb.credits.crew.name': {$regex: crew, $options: 'gi'}});
        }
        if (cast !== null && cast !== undefined && cast.length > 0) {
            andQuerry.push({'themoviedb.credits.cast.name': {$regex: cast, $options: 'gi'}});
        }
        if (genre !== null && genre !== undefined && genre.length > 0) {
            genre.forEach(function (element) {
                andQuerry.push({'themoviedb.genres.name': element});
            });
        }
        if (andQuerry.length > 0) {
            movies = Movies.find({$and: andQuerry}, {sort: {themoviedb: {title: -1}}});
        } else {
            movies = Movies.find({}, {sort: {themoviedb: {title: -1}}});
        }

        return movies;
    },
    openSources: function () {
        var hasSources = Sources.find({}).count() <= 0;
        var toggleSources = Session.get('toggleSources');
    }
});