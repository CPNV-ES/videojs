Router.configure({
  layoutTemplate: 'app',
  notFoundTemplate: '404',
  loadingTemplate: 'loading',
});

Router.route('home',{
  path: '/',
  template: 'home',
  waitOn: function(){
    return Meteor.subscribe('movies');
  }
});

Router.route('details',{
  path: '/film/:id',
  data: function(){
    return Movies.findOne(this.params.id,{});
  },
  waitOn: function(){
    return Meteor.subscribe('movies');
  },
  onBeforeAction: function(){
    // If Movies has themoviedb array, get view with details
    if(this.data().themoviedb) this.render('details');
    // If Movies hasn't themoviedb array, get view without details
    else this.render('details_notmdb');
  }
});
