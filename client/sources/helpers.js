Template.sources.helpers({
  sources: function () {
    return Sources.find({});
  },
  toggleShowFilename: function () {
      return Session.get('toggleShowFilename');
  },
});
