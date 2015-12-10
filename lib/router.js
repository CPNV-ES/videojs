Router.configure({
  layoutTemplate: 'template',
  notFoundTemplate: '404Template',
  loadingTemplate: 'loadingTemplate',
});

Router.route('/',{
  name: 'home'
});

Router.route('/film/:id',{
  name: 'movieDescriptionTemplate',
  data : function(){
    console.log(this.params);
    return {
      id : this.params._id
    };
  }
});
