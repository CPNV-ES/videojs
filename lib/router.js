// Router Configuration
Router.configure({
  layoutTemplate: 'app',
  notFoundTemplate: 'e404',
  loadingTemplate: 'loading',
});

// Home : list all movies
Router.route('/',{
  name: 'home',
  waitOn: function(){
    return Meteor.subscribe('movies');
  }
});

// Details : details on 1 movie
Router.route('/film/:id',{
  name: 'movie',
  data: function(){
    return {
      id: this.params.id
    };
  },
  waitOn: function(){
    return Meteor.subscribe('movie',this.params.id);
  }
});
