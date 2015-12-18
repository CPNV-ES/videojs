Template.tmdbBind.helpers({
    // Results of search
    results: function () {
        return Session.get('tmdbBindResults');
    },
    // Are we searching info ?
    isLoading: function () {
        return Session.get('tmdbBindLoading');
    },
    // have we select movie for binding ?
    hasId: function () {
        return Session.get('tmdbBindId');
    },
});
