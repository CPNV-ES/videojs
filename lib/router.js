Router.configure({
  layoutTemplate: 'template',
  notFoundTemplate: '404Template',
  loadingTemplate: 'loadingTemplate',
});

Router.route('/',{
  name: 'home',
  waitOn : function(){
    return Meteor.subscribe('movies');
  }
});

Router.route('/film/:id',{
  name: 'movie',
  data : function(){
    return {
      id : this.params.id
    };
  },
  waitOn : function(){
    return Meteor.subscribe('movie',this.params.id);
  }
});
