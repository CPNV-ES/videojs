const CHECK_YEAR = '^[0-9]{4}$';

Template.home.helpers({
    movies: function () {
        var movies = null;
        var andQuerry = [];
        var title = Session.get("querytitle");
        var fileName = Session.get("queryfilename");
        var crew = Session.get("querycrew");
        var cast = Session.get("querycast");
        var genre = Session.get("queryGenre");
        var anneeDebut = Session.get("querydatestart");
        var anneeFin = Session.get("querydateend");
        var showFilename = Session.get('toggleShowFilename');

        if(!showFilename){
          andQuerry.push({themoviedb:{$exists:true,$not:null}});
        }

        if (isValidInput(title)) {
            andQuerry.push({'themoviedb.title': {$regex: title, $options: 'gi'}});
        }
        if (isValidInput(fileName)) {
            andQuerry.push({'filename': {$regex: fileName, $options: 'gi'}});
        }
        if (isValidInput(crew)) {
            andQuerry.push({'themoviedb.credits.crew.name': {$regex: crew, $options: 'gi'}});
        }
        if (isValidInput(cast)) {
            andQuerry.push({'themoviedb.credits.cast.name': {$regex: cast, $options: 'gi'}});
        }
        if (isValidInput(genre)) {
            genre.forEach(function (element) {
                andQuerry.push({'themoviedb.genres.name': element});
            });
        }
        // Between date
        if(isValidInput(anneeDebut) && isValidInput(anneeFin)){
            if(anneeDebut.match(CHECK_YEAR) && anneeFin.match(CHECK_YEAR)){
                andQuerry.push({'themoviedb.release_date':{
                    $lt: anneeFin + '-12-31', // a 2015-12-31
                    $gte:  anneeDebut + '-01-01' // de 2003-01-01
                }});
            }
        }else if (isValidInput(anneeDebut)) {
            console.log("jdjd", moment().format("YYYY-MM-DD"));
            if (anneeDebut.match(CHECK_YEAR)) {
                andQuerry.push({
                    'themoviedb.release_date': {
                        $lt: moment().format("YYYY-MM-DD"),
                        $gte: anneeDebut + '-01-01'
                    }
                });
            }
        }else if (isValidInput(anneeFin)){
            if(anneeFin.match(CHECK_YEAR)){
                andQuerry.push({'themoviedb.release_date':{
                    $lt: anneeFin + '-12-31',
                    $gte:  '0000-01-01'
                }});
            }
        }


        if (andQuerry.length > 0) {
            movies = Movies.find({$and: andQuerry}, {sort: {themoviedb: {title: -1}}});
        } else {
            movies = Movies.find({}, {sort: {themoviedb: {title: -1}}});
        }

        return movies;
    },
    toggleSources: function () {
        var hasSources = Sources.find({}).count() <= 0;
        var toggleSources = Session.get('toggleSources');
        return (hasSources || toggleSources);
    }
});

var isValidInput = function(toTest){
    return (toTest !== null && toTest !== undefined && toTest.length > 0);
};
