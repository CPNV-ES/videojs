Template.tmdbBind.helpers({
  rendered: function () {
  },
  results: function () {
    return Session.get('tmdbBindResults');
  },
  search: function () {
    return Session.get('tmdbBindSearch');
  },
  isLoading: function () {
    return Session.get('tmdbBindLoading');
  },
  hasId: function () {
    return Session.get('tmdbBindId');
  }
});
