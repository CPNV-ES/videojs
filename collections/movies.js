Movies = new Mongo.Collection("Movies");

Movies.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

Movies.before.insert(function(userId,doc){
  doc.createAt = Date.now();
  doc.updateAt = Date.now();
});

Movies.before.update(function(userId,doc,fieldNames,modifier,options){
  doc.updateAt = Date.now();
});
