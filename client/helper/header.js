Template.header.helpers({
    settingsMovieTitleName: function () {
        return {
            rules: [
                {
                    collection: Movies,
                    field: 'themoviedb.title',
                    matchAll: true,
                    template: Template.movieTitleAutoCompletes
                }
            ]
        };
    },
    settingsFileName: function () {
        return {
            rules: [
                {
                    collection: Movies,
                    field: 'filename',
                    matchAll: true,
                    template: Template.fileNameAutoCompletes
                }
            ]
        };
    },
    uniqueGenre: function () {
        var list = Movies.find({"themoviedb.genres": {$ne: null}}).fetch();
        console.log(list);
        var uniqueGenres = _.chain(list)
            .pluck('themoviedb')
            .flatten()
            .pluck('genres')
            .flatten()
            .pluck('name')
            .flatten()
            .unique()
            .value();
        console.log(uniqueGenres);
        return uniqueGenres;
    },
    isLoading: function () {
        var themoviedb = ServerSession.get('loading.themoviebd') || 0;
        console.log('themoviedb.loading', themoviebd);
        return (themoviebd > 0);
    }
});

Template.header.events({
    'keyup #querytitle': function () {
        // save the current search query in a session variable as the user types
        return Session.set('querytitle', $('#querytitle').val());
    },
    'keyup #querycrew': function () {
        // save the current search query in a session variable as the user types
        return Session.set('querycrew', $('#querycrew').val());
    },
    'keyup #querycast': function () {
        return Session.set('querycast', $('#querycast').val());
    },
    'keyup #queryfilename': function () {
        return Session.set('queryfilename', $('#queryfilename').val())
    },
    'keyup #querydatestart': function () {
        return Session.set('querydatestart', $('#querydatestart').val())
    },
    'keyup #querydateend': function () {
        return Session.set('querydateend', $('#querydateend').val())
    },
    'click #queryclear': function () {
        resetVarForm();
        $("#queryGenre").select2('val', 'All');
        document.getElementById("form").reset();
    }
});

var resetVarForm = function () {
    Session.set('querytitle', '');
    Session.set('querycrew', '');
    Session.set('querycast', '');
    Session.set('queryGenre', '');
    Session.set('querydatestart', '');
    Session.set('querydateend', '');
};


/**
 * TODO: refactor this crap !
 */
Template.header.rendered = function () {
    $("#queryGenre").select2({
        tags: true,
        tokenSeparators: [',', ' ']
    }).on('change', function () {
        Session.set('queryGenre', $("#queryGenre").val());
    });
    $('#input-tags').selectize({
        persist: false,
        createOnBlur: true,
        create: true,

    });
};
