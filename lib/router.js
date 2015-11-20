Router.configure({
  layoutTemplate: 'template',
  notFoundTemplate: '404Template',
  loadingTemplate: 'loadingTemplate',
  yieldRegions:{
    'myAside': {to: 'aside'},
    'myHeader': {to: 'header'},
    'myFooter': {to: 'footer'}
  }
});

Router.route('/',{
  name: 'home'
});

Router.route('/film/:id',{
  name: 'movie',
  date : function(){
    return {
      id : this.params._id
    };
  }
});
