Template.home.helpers({
  movies : function(){
    return Movies.find({},{sort: {themoviedb:{title:-1}}});
  }
});

/*Template.movielist.events({
  'mouseenter .list ul li a' : function(event){
    console.log(this);
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
});*/
