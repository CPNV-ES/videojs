Meteor.startup(function(){

  /**
   * Each times Meteor start, check if it has extensions
   * If it doesn't have get extensions in extensions settings and insert there in database
  **/
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
