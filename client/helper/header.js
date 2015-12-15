Template.header.helpers({
    settingsFileName: function () {
        return {
            rules: [
                {
                    collection: Movies,
                    field: 'themoviedb.title',
                    matchAll: true,
                    template: Template.fileNameAutoComplete,
                    selector: function (match){
                        regex = new RegExp(match, 'i');
                        return {$or: [{'filename': regex}, {'themoviedb.title': regex}]};
                    }
                }
            ]
        };
    },
    isLoading: function () {
      var themoviedb = ServerSession.get('loading.themoviebd') || 0;
      console.log('themoviedb.loading',themoviebd);
      return (themoviebd > 0);
    },
});
