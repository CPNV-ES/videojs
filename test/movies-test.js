/**
 * Created by Christophe on 10.09.2015.
 */
describe('movies-test', function() {

    var movies = require('../src/engine/service/movies.js');
    var Movie = require('../src/engine/model/movie.js');
    var movie = null;
    var cid = null;

    beforeEach(function(){
        movie = new Movie({
            file:'test-mocha-movie.mkv',
            path:'toto/test.mkv',
            size:458,
            info:[{title:'test'}]
        });
    });

    it('should create movie object ', function(){
        var newMovie = movies.create(movie);
        cid = newMovie.cid;
    });


    it('should get the created movie object ', function(){
            if(cid === null || cid === undefined){
                throw new Error("Mocha test error : cid null");
            }
            var obj = movies.get(cid);

            // Test movie object
            if(obj === movie){
                throw new Error("The movie object can't get properly");
            }
            movie = obj;
        });

    it('should update the created movie object ', function(){

    });

    it('should remove the created movie object',function(){

    });

});