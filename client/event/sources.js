Template.sources.events({
  "submit .source-create": function(e){
    e.preventDefault();
    var form = e.target;
    var source = form.source.value;

    if(source !== ''){
      Sources.insert({source});
    }
  }
});
