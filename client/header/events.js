Template.header.events({
    'keyup #querytitle': function () {
        // save the current search query in a session variable as the user types
        return Session.set('querytitle', $('#querytitle').val());
    },
    'keyup #querycrew': function () {
        // save the current search query in a session variable, this is used to search the team example : the Producer
        return Session.set('querycrew', $('#querycrew').val());
    },
    'keyup #querycast': function () {
        // save the current search query in a session variable, this is used to search actors
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
    },
    // Hidde or unhidde the source ( file path ) config.
    'click #toggleSources': function (e) {
        Session.set('toggleSources', true);
    }
});