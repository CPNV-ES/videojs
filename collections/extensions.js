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
