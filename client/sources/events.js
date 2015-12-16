Template.sources.events({
  "submit form": function (e) {
    e.preventDefault();
    var source = e.target.source;
    if(!source.value) return false;

    Sources.insert({
      source: source.value
    });

    source.value = '';
  },
  'click ul li .delete': function (e) {
    e.preventDefault();
    Sources.remove(this._id);
  },
  'click .close': function (e) {
    e.preventDefault();
    Session.set('toggleSources',false);
  },
});
