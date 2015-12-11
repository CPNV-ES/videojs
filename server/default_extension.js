Meteor.startup(function(){
  var nbExtensions = Extensions.find({}).count();
  var dEConfig = Meteor.settings.extensions || [];
  if(nbExtensions<=0){
    dEConfig.forEach(function(extension){
      Extensions.insert({
        extension : extension
      });
    });
  }
});
