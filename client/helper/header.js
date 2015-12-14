Template.header.helpers({
    settingsFileName: function() {
        return {
            rules: [
                {
                    collection: Movies,
                    field: 'themoviedb.title',
                    matchAll: true,
                    template: Template.fileNameAutoComplete,
                    selector: function (match){
                        regex = new RegExp(match, 'i');
                        return {$or: [{'filename': regex}, {'themoviedb.title': regex}]};
                    }
                }
            ]
        };
    }
});

Template.header.events({
    'keyup #querytitle': function() {
        // save the current search query in a session variable as the user types
        return Session.set('querytitle', $('#querytitle').val());
    },
    'keyup #querycrew': function() {
        // save the current search query in a session variable as the user types
        return Session.set('querycrew', $('#querycrew').val());
    },
    'keyup #querycast': function(){
        return Session.set('querycast', $('#querycast').val())
    },
    'click #queryclear': function(){
        Session.set('querytitle', '');
        Session.set('querycrew', '');
        Session.set('querycast', '');
        document.getElementById("form").reset();
    }
});