/**
 * Default configuration of iron:router
 * layoutTemplate : global template of all other template (notFound and loading include)
 * notFoundTemplate : this template's called when meteor don't find ressource
 * loadingTemplate : this template's called when meteor's loading
 **/
Router.configure({
    layoutTemplate: 'app',
    notFoundTemplate: '404',
    loadingTemplate: 'loading',
});

/**
 * Default route
 * URI : /
 * template : home
 * waitOn movies & sources collections
 **/
Router.route('home', {
    path: '/',
    template: 'home',
    waitOn: function () {
        return [
            Meteor.subscribe('movies'),
            Meteor.subscribe('sources'),
        ];
    }
});

/**
 * Movie Details route
 * template : details
 * URI : /film/:id
 * data : movie
 * waitOn : this movie
 * beforeAction : check if movie exist
 **/
Router.route('details', {
    path: '/film/:id',
    template: 'details',
    data: function () {
        return Movies.findOne(this.params.id, {});
    },
    waitOn: function () {
        return Meteor.subscribe('movie', this.params.id);
    },
    onBeforeAction: function () {
        var data = this.data();

        if (!data) {
            this.redirect('/');
        } else {
            // If Movies has themoviedb array, get view with details
            if (data.themoviedb) this.render('details');
            // If Movies hasn't themoviedb array, get view without details
            else this.render('detailsNoTmdb');
        }
    }
});
