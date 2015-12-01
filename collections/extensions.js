Extensions = new Mongo.Collection("Extensions");

Extensions.allow({
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

Extensions.before.insert(function(userId,doc){
  doc.createAt = Date.now();
  doc.updateAt = Date.now();
});

Extensions.before.update(function(userId,doc,fieldNames,modifier,options){
  doc.updateAt = Date.now();
});
