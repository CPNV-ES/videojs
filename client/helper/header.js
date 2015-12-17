// By default :
// We show movie without themoviedb data
Session.setDefault('toggleShowFilename', true);
// We hide sources interface
Session.setDefault('toggleSources', false);
// Use for query title
Session.setDefault('querytitle', '');
// Use for query crew (Search one realisator)
Session.setDefault('querycrew', '');
// Use for query one cast (Actor)
Session.setDefault('querycast', '');
// Use for query Categories
// This session need an array of categories -> ["Action", "Adventure"]
Session.setDefault('queryGenre', '');
// Use for query the outside date
Session.setDefault('querydatestart', '');
Session.setDefault('querydateend', '');



Template.header.helpers({
    // return all movie title for the autocompletion
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
    // return all file name for the autocompletion
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
    // List all categories and return an array like : ["Action","Adventure"]
    uniqueGenre: function () {
        var list = Movies.find({"themoviedb.genres": {$ne: null}}).fetch();
        var uniqueGenres = _.chain(list)
            .pluck('themoviedb')
            .flatten()
            .pluck('genres')
            .flatten()
            .pluck('name')
            .flatten()
            .unique()
            .value();
        return uniqueGenres;
    },
    isLoading: function () {
        var themoviedb = ServerSession.get('loading.themoviebd') || 0;
        return (themoviebd > 0);
    },
    toggleShowFilename: function () {
      return Session.get('toggleShowFilename');
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
        // save the current search query in a session variable, this is use for the name cast person
        return Session.set('querycast', $('#querycast').val());
    },
    'keyup #queryfilename': function () {
        // save the current search query in a session variable, this is use for the file name
        return Session.set('queryfilename', $('#queryfilename').val());
    },
    'keyup #querydatestart': function () {
        // save the current search query in a session variable, this is use for the beggin date
        return Session.set('querydatestart', $('#querydatestart').val());
    },
    'keyup #querydateend': function () {
        // save the current search query in a session variable, this is use for the ending date
        return Session.set('querydateend', $('#querydateend').val());
    },
    // remove all search
    'click #queryclear': function () {
        resetVarForm();
        updateList(true);
        document.getElementById("form").reset();
    },
    // Hidde or unhidde the movies not found
    'click .onoffswitch-checkbox': function(){
        return Session.set('toggleShowFilename',!Session.get('toggleShowFilename'));
    }
});

/**
 * Reset all query session variable
 */
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
    $('#queryGenre').selectize({
        plugins: ['remove_button'],
        persist: false,
        createOnBlur: true,
        create: true
    }).on('change', function(){
        Session.set('queryGenre', $("#queryGenre").val().split(','));
    });
    updateList(true);
    resetVarForm();
};

/**
 * Use for update the genre list,
 * there refresh all new tags.
 * @param needClear [boolean] remove all user selection tags
 */
var updateList = function(needClear){
    var $select = $('#queryGenre').selectize();
    if($select !== null && $select !== undefined){
        var control = $select[0].selectize;
        control.refreshOptions();
        if(needClear) control.clear();
    }
};
