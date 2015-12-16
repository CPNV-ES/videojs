Template.tmdbBind.helpers({
  rendered: function () {
  },
  results: function () {
    return Session.get('tmdbBindResults');
  },
  isLoading: function () {
    return Session.get('tmdbBindLoading');
  },
  hasId: function () {
    return Session.get('tmdbBindId');
  }
});
