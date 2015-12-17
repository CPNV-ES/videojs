const CHECK_YEAR = '^[0-9]{4}$';

Template.home.helpers({
    //Load all movies if there is no research on the part of the user.
    // If a user wanted to search for a film, the query request is generated.
    movies: function () {
        var movies = null;
        var andQuerry = [];
        var title = Session.get("querytitle");
        var fileName = Session.get("queryfilename");
        var crew = Session.get("querycrew");
        var cast = Session.get("querycast");
        var genre = Session.get("queryGenre");
        var startDate = Session.get("querydatestart");
        var endDate = Session.get("querydateend");
        var showFilename = Session.get('toggleShowFilename');

        if(!showFilename){
          andQuerry.push({themoviedb:{$exists:true,$not:null}});
        }

        // Condition if the user is looking for a title
        if (isValidInput(title)) {
            andQuerry.push({'themoviedb.title': {$regex: title, $options: 'gi'}});
        }
        // Condition if the user is looking for a file name
        if (isValidInput(fileName)) {
            andQuerry.push({'filename': {$regex: fileName, $options: 'gi'}});
        }
        // Condition if the user is looking for a crew
        if (isValidInput(crew)) {
            andQuerry.push({'themoviedb.credits.crew.name': {$regex: crew, $options: 'gi'}});
        }
        // Condition if the user is looking for a cast
        if (isValidInput(cast)) {
            andQuerry.push({'themoviedb.credits.cast.name': {$regex: cast, $options: 'gi'}});
        }

        // Condition if the user is looking for one or more categories
        if (isValidInput(genre)) {
            genre.forEach(function (element) {
                if(element.length > 0)
                    andQuerry.push({'themoviedb.genres.name': element});
            });
        }

        // Between date logic
        if(isValidInput(startDate) && isValidInput(endDate)){
            if(startDate.match(CHECK_YEAR) && endDate.match(CHECK_YEAR)){
                andQuerry.push({'themoviedb.release_date':{
                    $lt: endDate + '-12-31', // a 2015-12-31
                    $gte:  startDate + '-01-01' // de 2003-01-01
                }});
            }
        }else if (isValidInput(startDate)) { // Logic if the user put only the startDate : between  startDate to today
            if (startDate.match(CHECK_YEAR)) {
                andQuerry.push({
                    'themoviedb.release_date': {
                        $lt: moment().format("YYYY-MM-DD"),
                        $gte: startDate + '-01-01'
                    }
                });
            }
        }else if (isValidInput(endDate)){ // Logic if the user put only the endDate ... between 0000-01-01 to endDate
            if(endDate.match(CHECK_YEAR)){
                andQuerry.push({'themoviedb.release_date':{
                    $lt: endDate + '-12-31',
                    $gte:  '0000-01-01'
                }});
            }
        }
        // If there are not conditions we use the second query (list all movies).
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

/**
 * Test if the input is valid (not null & undefined & length)
 * @param toTest
 * @returns {boolean} true if the input is filled
 */
var isValidInput = function(toTest){
    return (toTest !== null && toTest !== undefined && toTest.length > 0);
};
