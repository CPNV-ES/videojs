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

Router.route('description',{
  path: '/film/:id',
  template: 'details',
  data: function(){
    return Movies.findOne({_id : this.params.id},{});
  },
  waitOn: function(){
    return Meteor.subscribe('movie',this.params.id);
  }
});
