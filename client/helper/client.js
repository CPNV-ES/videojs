Template.home.helpers({
  movies : function(){
    return Movies.find({},{sort: {themoviedb:{title:-1}}});
  }
});

Template.home.events({
  'mouseenter .movielist ul li a' : function(event, template){
    var id = this._id;
    var $all = $('.movielist ul li a');
    var $this = $(event.currentTarget);
    var $movies = $('.movies');
    var $allmovieinfo = $('.movieinfo');
    var $movieinfo = $('.movieinfo[data-movie-id="'+id+'"]');

    // Remove class and add class to current .active item
    $all.removeClass('active');
    $this.addClass('active');

    // Hide All, show good one
    $allmovieinfo.hide();
    $movieinfo.show();

    // Set Background
    var bg = $movieinfo.attr('data-movie-background');
    $movies.css('background-image','url('+bg+')');
    console.log(this);
  }
});


Template.movieinfo.helpers({
  moviebackground : function(){
    if(this.themoviedb.backdrop_path)
    return {
      'data-movie-background' : 'http://image.tmdb.org/t/p/original'+this.themoviedb.backdrop_path
    };
  }
});