// By default :
// We show movie without themoviedb data
Session.setDefault('toggleShowFilename', true);
// We hide sources interface
Session.setDefault('toggleSources', false);




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
        return Session.set('querycast', $('#querycast').val());
    },
    'keyup #queryfilename': function () {
        return Session.set('queryfilename', $('#queryfilename').val());
    },
    'keyup #querydatestart': function () {
        return Session.set('querydatestart', $('#querydatestart').val());
    },
    'keyup #querydateend': function () {
        return Session.set('querydateend', $('#querydateend').val());
    },
    'click #queryclear': function () {
        resetVarForm();
        updateList(true);
        document.getElementById("form").reset();
    },
    'click .onoffswitch-checkbox': function(){
        return Session.set('toggleShowFilename',!Session.get('toggleShowFilename'));
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
    $('#queryGenre').selectize({
        plugins: ['remove_button'],
        persist: false,
        createOnBlur: true,
        create: true
    }).on('change', function(){
        Session.set('queryGenre', $("#queryGenre").val().split(','));
    });
    updateList(true);
};

var updateList = function(needClear){
    var $select = $('#queryGenre').selectize();
    if($select !== null && $select !== undefined){
        var control = $select[0].selectize;
        control.refreshOptions();
        if(needClear) control.clear();
    }
};
