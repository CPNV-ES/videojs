Router.configure({
  layoutTemplate: 'template',
  notFoundTemplate: '404Template',
  loadingTemplate: 'loadingTemplate',
});

Router.route('home',{
  path: '/',
  template: 'home'
});

Router.route('description',{
  path: '/film/:id',
  template: 'detailsTemplate',
  data: function(){
    return Movies.findOne({_id : this.params.id},{});
  }
});
